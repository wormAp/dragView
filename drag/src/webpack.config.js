/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
const path = require('path');

const config = {
    mode:"development",
    entry: './load.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ytDataView.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        //  plugins: [require('@babel/plugin-transform-object-rest-spread')]
                    }
                }
            }
        ]
    }
};

module.exports = config;