import { AI_API_KEY, AI_API_URL, AI_MODEL } from '../utils/config';

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 3000; // 3 seconds between requests for free tier
let requestQueue = [];
let isProcessingQueue = false;

// Queue-based request handler to prevent rate limiting
const processRequestQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const { resolve, reject, requestData } = requestQueue.shift();
    
    try {
      // Ensure minimum time between requests
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
        console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      const result = await makeActualRequest(requestData);
      lastRequestTime = Date.now();
      resolve(result);
      
      // Add a small delay between queue items
      if (requestQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      // If it's a rate limit error, wait longer and retry once
      if (error.message.includes('rate limit') && !requestData.isRetry) {
        console.log('Rate limit hit, waiting 10 seconds before retry...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        // Retry once
        requestData.isRetry = true;
        requestQueue.unshift({ resolve, reject, requestData });
        continue;
      }
      
      reject(error);
    }
  }
  
  isProcessingQueue = false;
};

// Actual API request function
const makeActualRequest = async ({ title, currentDescription, context }) => {
  try {
    // Validate API key format for OpenAI
    if (!AI_API_KEY || !AI_API_KEY.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format. Key should start with "sk-"');
    }

    const requestBody = {
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a professional content writer. Your job is to rewrite text to be more professional, engaging, and compelling. You must respond with ONLY the rewritten text - no explanations, no thinking process, no commentary, no XML tags, no prefixes like 'Here's the rewritten version:' or similar. Just return the enhanced text directly."
        },
        {
          role: "user",
          content: `Rewrite this text to be more professional, engaging, and compelling:

"${currentDescription}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    };
    
    console.log('OpenAI API Request:', {
      url: AI_API_URL,
      model: AI_MODEL,
      messageLength: currentDescription.length
    });
    
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    // Log response status
    console.log('OpenAI Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
      
      console.error('OpenAI API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        url: AI_API_URL,
        model: AI_MODEL
      });
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid or expired OpenAI API key. Please check your API key at https://platform.openai.com/api-keys');
      } else if (response.status === 404) {
        throw new Error(`Model "${AI_MODEL}" not found. Please verify the model name is correct for OpenAI API.`);
      } else if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again in a few moments.');
      } else if (response.status === 402) {
        throw new Error('Insufficient credits. Please add credits to your OpenAI account at https://platform.openai.com/billing');
      } else if (response.status === 500 || response.status === 502 || response.status === 503) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`OpenAI API error (${response.status}): ${errorMessage}`);
      }
    }

    const data = await response.json();
    
    console.log('OpenAI API Response:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      finishReason: data.choices?.[0]?.finish_reason,
      usage: data.usage
    });
    
    // Handle OpenAI response format
    let generatedText = '';
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const message = data.choices[0].message;
      
      // Check if content was filtered or truncated
      if (data.choices[0].finish_reason === 'content_filter') {
        throw new Error('Content was filtered by safety systems. Try rephrasing your input with different wording.');
      } else if (data.choices[0].finish_reason === 'length') {
        console.warn('Response was truncated due to token limit. Trying to extract partial content...');
      }
      
      // Extract the content from the message
      if (message.content) {
        generatedText = message.content;
      } else if (message.text) {
        generatedText = message.text;
      }
    } else if (data.text) {
      generatedText = data.text;
    } else if (data.content) {
      generatedText = data.content;
    }
    
    if (!generatedText) {
      console.error('Unexpected OpenAI API response structure:', data);
      console.error('Available properties in response:', Object.keys(data));
      throw new Error('No text content found in OpenAI API response. The model may not be available. Check console for details.');
    }

    // Clean up the response - remove any thinking tags or extra markup
    generatedText = generatedText.trim();
    
    // Remove <think> tags and their content if present
    generatedText = generatedText.replace(/<think>[\s\S]*?<\/think>/gi, '');
    
    // Remove any remaining XML-style tags
    generatedText = generatedText.replace(/<[^>]+>/g, '');
    
    // Clean up extra whitespace
    generatedText = generatedText.replace(/\n\s*\n/g, '\n').trim();

    return generatedText;
  } catch (error) {
    console.log('Error enhancing description with OpenAI:', error);
    
    // If it's already our custom error, re-throw it
    if (error.message.includes('OpenAI') || 
        error.message.includes('Invalid') || 
        error.message.includes('rate limit') || 
        error.message.includes('Model') ||
        error.message.includes('credits')) {
      throw error;
    }
    
    // For network or other errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to OpenAI. Please check your internet connection.');
    }
    
    throw new Error('Failed to connect to OpenAI service. Please check your internet connection and try again.');
  }
};

// Main export function that uses the queue for AI content enhancement
export const enhanceDescription = async (title, currentDescription, context = 'general') => {
  return new Promise((resolve, reject) => {
    // Add request to queue
    requestQueue.push({
      resolve,
      reject,
      requestData: { title, currentDescription, context }
    });
    
    // Start processing queue
    processRequestQueue();
  });
};

// Fallback function for when OpenAI service is not available
export const generateFallbackDescription = (title, currentDescription, context) => {
  const templates = {
    'why_item': `${title}: ${currentDescription} Our cloud platform delivers enterprise-grade reliability, security, and performance to help your business scale efficiently.`,
    'product': `${title}: ${currentDescription} This powerful cloud solution provides advanced capabilities and seamless integration to accelerate your digital transformation.`,
    'hero': `${title}: ${currentDescription} Experience the future of cloud computing with our innovative platform designed for modern businesses.`,
    'general': `${title}: ${currentDescription} Discover how our cloud solutions can transform your business operations and drive growth.`
  };
  
  return templates[context] || templates['general'];
};