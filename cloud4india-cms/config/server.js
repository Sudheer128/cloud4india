export default {
  config: {
    // Server configuration
    host: '0.0.0.0',
    port: 1337,
    
    // CORS configuration for React app
    cors: {
      origin: ['http://localhost:4002', 'http://localhost:3001', 'http://localhost:4001', 'http://38.242.248.213:4001', 'http://38.242.248.213:4002'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
    },
  },
};
