const strapi = require('@strapi/strapi');

const app = strapi({
  distDir: './dist',
  appDir: __dirname,
});

app.start();
