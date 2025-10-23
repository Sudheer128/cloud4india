export default {
  config: {
    // Server configuration
    host: '0.0.0.0',
    port: 1337,
    
    // CORS configuration for React app
    cors: {
      origin: ['http://localhost:4002', 'http://localhost:3001', 'http://localhost:4001', 'http://161.97.155.89:4001', 'http://161.97.155.89:4002'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
    },
  },
};
