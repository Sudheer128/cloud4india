export default {
  config: {
    // Database configuration
    database: {
      client: 'sqlite',
      connection: {
        filename: './tmp/data.db',
      },
      useNullAsDefault: true,
    },
    
    // Server configuration
    server: {
      host: '0.0.0.0',
      port: 1337,
    },
    
    // Admin configuration
    admin: {
      auth: {
        secret: 'cloud4india-cms-secret-key-2024',
      },
    },
    
    // API configuration
    api: {
      rest: {
        defaultLimit: 25,
        maxLimit: 100,
      },
    },
  },
};
