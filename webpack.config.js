var webpack = require('webpack');
module.exports = {
    entry: [
        // 'babel-polyfill',
        // 'webpack/hot/only-dev-server',
        './src/app.js'
        // main: ["./src/app.js"],
        // vendor: ["react-dom", "react", "react-router", "babel-polyfill"]
    ],
    output: {
        path: __dirname + '/build',
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /(\.jsx|\.js)/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                plugins: ['transform-runtime'],
                presets: ['es2015', 'react', 'stage-2']
            }
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        },{
            test: /\.less$/,
            use: [{
                loader: 'style-loader',
            }, {
                loader: 'css-loader', // translates CSS into CommonJS
            }, {
                loader: 'less-loader', // compiles Less to CSS
                options: {
                    modifyVars: {
                        'primary-color': '#1DA57A',
                        'link-color': '#1DA57A',
                        'border-radius-base': '2px',
                        // or
                        // 'hack': `true; @import "your-less-file-path.less";`, // Override with less file
                    },
                    javascriptEnabled: true
                }
            }]
        },{
        test: /\.(jpeg|jpg|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      }]

    }
};
