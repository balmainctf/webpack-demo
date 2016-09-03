const path = require('path');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts');

const PATHS = {
    app: path.resolve(__dirname, 'app'),
    style: [
        path.resolve(__dirname, 'node_modules', 'purecss'),
        path.resolve(__dirname, 'app', 'main.scss')
    ],
    build: path.resolve(__dirname, 'build')
};

const common = {
    entry: {
        app: PATHS.app,
        style: PATHS.style
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    }
}

var config;

switch (process.env.npm_lifecycle_event) {
    case 'build':
        config = merge(
            common,
            {
                devtool: 'source-map',
                output: {
                    path: PATHS.build,
                    filename: '[name].[chunkhash].js',
                    chunkFilename: '[chunkhash].js'
                }
            },
            parts.genHtml(),
            parts.literReact(),
            parts.clean(PATHS.build),
            parts.setFreeVariable('process.env.NODE_ENV', 'production'),
            parts.extractBundle({
                name: 'vendor',
                entries: ['react', 'react-dom']
            }),
            parts.uglify(),
            parts.extractStyle(PATHS.style),
            parts.purifyStyle([PATHS.app]),
            parts.setupJSX(PATHS.app)
        );
        break;
    default:
        config = merge(
            common,
            parts.genHtml(),
            {devtool: 'eval-source-map'},
            parts.devServer({
                // customize host/port here is needed
                host: process.env.HOST,
                port: process.env.PORT
            }),
            parts.setupStyle(PATHS.style),
            parts.setupJSX(PATHS.app)
        );
}

module.exports = validate(config, {
    quiet: true
});
