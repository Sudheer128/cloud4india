import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { parsePrice, DURATION_TO_MONTHLY as DURATION_MAP } from '../utils/priceUtils';

const initialState = { items: [], isCartOpen: false };

const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM', REMOVE_ITEM: 'REMOVE_ITEM', REMOVE_BY_ITEM_ID: 'REMOVE_BY_ITEM_ID',
  UPDATE_ITEM: 'UPDATE_ITEM', UPDATE_QUANTITY: 'UPDATE_QUANTITY', UPDATE_DURATION: 'UPDATE_DURATION',
  CLEAR_CART: 'CLEAR_CART', LOAD_CART: 'LOAD_CART', TOGGLE_CART: 'TOGGLE_CART'
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const existingIndex = state.items.findIndex(
        item => item.item_id === action.payload.item_id && item.item_type === action.payload.item_type && item.duration === action.payload.duration
      );
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + (action.payload.quantity || 1) };
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, { id: `${action.payload.item_type}-${action.payload.item_id}-${Date.now()}`, ...action.payload, quantity: action.payload.quantity || 1, added_at: new Date().toISOString() }] };
    }
    case ACTIONS.REMOVE_ITEM: return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
    case ACTIONS.REMOVE_BY_ITEM_ID: return { ...state, items: state.items.filter(item => item.item_id !== action.payload.item_id) };
    case ACTIONS.UPDATE_ITEM: return { ...state, items: state.items.map(item => item.id === action.payload.id ? { ...item, ...action.payload.updates } : item) };
    case ACTIONS.UPDATE_QUANTITY: return { ...state, items: state.items.map(item => item.id === action.payload.id ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item) };
    case ACTIONS.UPDATE_DURATION: return { ...state, items: state.items.map(item => item.id === action.payload.id ? { ...item, duration: action.payload.duration, unit_price: action.payload.unit_price } : item) };
    case ACTIONS.CLEAR_CART: return { ...state, items: [] };
    case ACTIONS.LOAD_CART: return { ...state, items: action.payload.items || [] };
    case ACTIONS.TOGGLE_CART: return { ...state, isCartOpen: action.payload ?? !state.isCartOpen };
    default: return state;
  }
}

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'cloud4india_cart';

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (parsed.items && Array.isArray(parsed.items)) dispatch({ type: ACTIONS.LOAD_CART, payload: { items: parsed.items } });
      }
    } catch (error) { console.error('Error loading cart:', error); }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: state.items })); }
    catch (error) { console.error('Error saving cart:', error); }
  }, [state.items]);

  const addItem = useCallback((item) => dispatch({ type: ACTIONS.ADD_ITEM, payload: item }), []);
  const removeItem = useCallback((id) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { id } }), []);
  const removeItemByItemId = useCallback((item_id) => dispatch({ type: ACTIONS.REMOVE_BY_ITEM_ID, payload: { item_id } }), []);
  const updateItem = useCallback((id, updates) => dispatch({ type: ACTIONS.UPDATE_ITEM, payload: { id, updates } }), []);
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } }), []);
  const updateDuration = useCallback((id, duration, unit_price) => dispatch({ type: ACTIONS.UPDATE_DURATION, payload: { id, duration, unit_price } }), []);
  const clearCart = useCallback(() => dispatch({ type: ACTIONS.CLEAR_CART }), []);
  const toggleCart = useCallback((isOpen) => dispatch({ type: ACTIONS.TOGGLE_CART, payload: isOpen }), []);

  const DURATION_TO_MONTHLY = DURATION_MAP;

  // Helper: get the monthly equivalent for a single cart item
  const getMonthlyPrice = (item) => {
    const price = parsePrice(item.unit_price);
    const multiplier = DURATION_TO_MONTHLY[item.duration] || 1;
    return price * item.quantity * multiplier;
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + (parsePrice(item.unit_price) * item.quantity), 0);
  const monthlySubtotal = state.items.reduce((sum, item) => sum + getMonthlyPrice(item), 0);
  const subtotalByCategory = state.items.reduce((acc, item) => {
    acc[item.item_type] = (acc[item.item_type] || 0) + getMonthlyPrice(item);
    return acc;
  }, {});
  const itemsByCategory = state.items.reduce((acc, item) => { if (!acc[item.item_type]) acc[item.item_type] = []; acc[item.item_type].push(item); return acc; }, {});

  return (
    <CartContext.Provider value={{ items: state.items, isCartOpen: state.isCartOpen, addItem, removeItem, removeItemByItemId, updateItem, updateQuantity, updateDuration, clearCart, toggleCart, itemCount, subtotal, monthlySubtotal, DURATION_TO_MONTHLY, getMonthlyPrice, subtotalByCategory, itemsByCategory, parsePrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export { CartContext };
