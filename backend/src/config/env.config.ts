export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),

  mongo: {
    uri: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB_NAME,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
});
