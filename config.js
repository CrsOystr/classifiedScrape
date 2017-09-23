var config = {}

config.url = process.env.SEARCH_URL;
config.minutes = process.env.MINUTES;

config.gateway = process.env.GATEWAY;
config.email = process.env.EMAIL;
config.emailpassword = process.env.EMAILPASSWORD;

module.exports = config;
