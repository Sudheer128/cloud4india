export default {
  config: {
    // Server configuration
    host: '0.0.0.0',
    port: 1337,
    
    // CORS configuration for React app
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
    },
  },
};
