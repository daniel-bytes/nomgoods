const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: './build',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: 'node_modules',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};