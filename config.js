var config = {}

config.apiKey = process.env.API_KEY;
config.apiSecret = process.env.API_SECRET;
config.url = process.env.SEARCH_URL;
config.fromNumber = process.env.FROM_NUMBER;
config.toNumber = process.env.TO_NUMBER;

module.exports = config;
