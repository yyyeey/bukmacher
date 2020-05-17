require('@babel/register')({
    presets: [
        '@babel/preset-env',
        {'plugins': ['@babel/plugin-proposal-class-properties']}
    ]
});
require('@babel/polyfill');
require('@babel/plugin-proposal-class-properties');

process.env.NODE_ENV = 'development';

module.exports = require('./server.js');