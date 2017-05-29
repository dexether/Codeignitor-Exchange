var webpack = require('webpack');
module.exports = {
    context: __dirname,

    devtool: "cheap-inline-module-source-map",
    entry:
            {
                'roomservice': "./public_html/js/room/room.js"
            },

    output: {
        path: __dirname + "/public_html/js/",
        publicPath: '/public_html/js/',
        filename: '[name].js',
        chunkFilename: '[name].js',
        library: '[name]'
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 300
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js", ".json"]
    },
    resolveLoader: {
        modules: ["node_modules"],
        extensions: [".js", ".json"],
        moduleExtensions: ['-loader']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel'

            },
            {test: /\.jade$/, loader: "jade!"},
            {
                include: /\.pug/,
                loader: ['raw-loader', 'pug-html-loader']
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
//        new webpack.optimize.CommonsChunkPlugin({
//            name: "commons"
//        }),
//        new webpack.ProvidePlugin({
//
//            '$': 'jquery/dist/jquery.min.js'
//        })
    ],
    devServer: {
        inline: true,
        port: 3000
    }
};
//-------For prodaction --------------------------------------------------------

//module.exports.plugins.push(
//        new webpack.optimize.UglifyJsPlugin({
//            compress: {
//                warnings: false,
//                drop_console: true
//            }
//        })
//        );
