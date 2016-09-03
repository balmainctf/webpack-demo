const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');

exports.devServer = function (options) {

    return {
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        devServer: {
            // Enable history API fallback so HTML5 History API based
            // routing works. This is good default that will come in
            // handy in more complicated setups
            historyApiFallback: true,

            // Unlike the cli flag, this doesn't set HotModuleReplacementPlugin!
            hot: true,
            inline: true,

            // Display only errors to reduce the amount of output.
            stats: 'errors-only',

            host: options.host,     // default to `localhost`
            port: options.port      // default to '8080'
        },
        plugins: [
            // Enable multi-pass complilation for enhanced performance
            // in larger projects. Good default;
            new webpack.HotModuleReplacementPlugin({
                multiStep: true
            })
        ]
    };
}

exports.genHtml = function() {
    return {
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Webpack demo',
                template: './app/index.ejs'
            })
        ]
    }
}

exports.extractStyle = function(paths) {
    return {
        module: {
            loaders: [
                {
                    test: /\.s?css$/,
                    loader: ExtractTextPlugin.extract('style', 'css!sass'),
                    include: paths
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('[name].[chunkhash].css')
        ]
    };
}

exports.purifyStyle = function(paths) {
    return {
        plugins: [
            new PurifyCSSPlugin({
                basePath: process.cwd(),
                paths: paths
            })
        ]
    }
}


exports.uglify = function() {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                comments: false,
                compress: {
                    warnings: false,
                    drop_console: true
                }
            })
        ]
    }
}

exports.setFreeVariable = function(key, value) {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env)
        ]
    }
}

exports.extractBundle = function(options) {
    const entry = {};
    entry[options.name] = options.entries;

    return {
        // Define an entry point needed for splitting.
        entry: entry,
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                names: [options.name, 'manifest']
            })
        ]
    }
}

exports.clean = function(path) {
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                root: process.cwd()
            })
        ]
    }
}

exports.literReact = function() {
    return {
        resolve: {
            alias: {
                'react': 'react-lite',
                'react-dom': 'react-lite'
            }
        }
    }
}

exports.setupStyle = function(paths) {
    return {
        module: {
            loaders: [
                {
                    test: /\.s?css$/,
                    // the loaders are evaluated from right to left
                    loaders: ['style', 'css', 'sass'],
                    include: paths
                }
            ]
        }
    };
}

exports.setupJSX = function(paths) {
    return {
        module: {
            loaders: [
                {
                    test: /\.js[x]?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['react', 'react']
                    },
                    include: paths
                },
            ]
        }
    }
}

