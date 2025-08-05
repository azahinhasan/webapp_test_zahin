export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,

  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT, 10) || 4307,
    username: process.env.DATABASE_USERNAME || "docker",
    password: process.env.DATABASE_PASSWORD || "docker",
    name: process.env.DATABASE_NAME || "test",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "test-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  },
  csrfSecret: process.env.CSRF_SECRET || "test-secret",
});
