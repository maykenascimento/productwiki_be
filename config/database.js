require('dotenv').config();

var database = process.env.MONGODB_URI;
var secret = process.env.JWT_SECRET;

if (!database) {
  throw new Error('MONGODB_URI environment variable is required.');
}

if (!secret) {
  throw new Error('JWT_SECRET environment variable is required.');
}

module.exports = {
  database: database,
  secret: secret
};
