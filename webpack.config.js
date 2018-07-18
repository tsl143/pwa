
/*var CompressionPlugin = require('compression-webpack-plugin');

new CompressionPlugin({
          asset: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8
        })

        */

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    devtool: 'inline-source-map',
     devServer: {
       inline: true,
       contentBase: './',
       port : 8080
     },
    entry: './src/settings.js',  //'./src/permissionIndex.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    // "resolve": {
    //   "alias": {
    //     "react": "preact-compat",
    //     "react-dom": "preact-compat"
    //   }
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['es2015', 'react'] }
                    }
                ]
            },
            {
                test: /(\.scss|\.css)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]_[local]_[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress : {
              dead_code: true,
              // drop_console: true,
              unused: true
            }
          }
        }),
        new webpack.DefinePlugin({
          FIREBASE_APIKEY : JSON.stringify('AIzaSyC7x3DyDMBX3MMYAhQe0qs7PLRGoBSjHFE'),
          FIREBASE_AUTHDOMAIN : JSON.stringify('web-ng-test.firebaseapp.com'),
          FIREBASE_DATABASE_URL : JSON.stringify('https://web-ng-test.firebaseio.com'),
          FIREBASE_PROJECT_ID : JSON.stringify('web-ng-test'),
          FIREBASE_MESSAGING_ID : JSON.stringify('846127550552'),
          FIREBASE_STORAGE_BUCKET : JSON.stringify('web-ng-test.appspot.com'),
          API: JSON.stringify('https://mytest.neargroup.me/ng/'),  //JSON.stringify('https://4d44c241.ngrok.io/NG/'),
          AVTAR: JSON.stringify('avtar.svg'),
          'process.env': {
              NODE_ENV: JSON.stringify('production')
          },
          BOT_API: JSON.stringify('https://test.neargroup.me/ng2/rht'),  //JSON.stringify('https://10ba3dac.ngrok.io/NG/rht'),
        })
      ]
};

/**
 "libphonenumber-js": "^1.2.15",
 "preact": "^8.2.9",
 "preact-compat": "^3.18.0",
 "react-geosuggest": "^2.8.0",
 "screenfull": "^3.3.2"

 devDependencies:

 "babel-jest": "^21.2.0",
 "compression-webpack-plugin": "^1.1.3",
 "compression-webpack-plugin": "^1.1.3",
 "enzyme": "^3.1.0",
 "enzyme-adapter-react-16": "^1.0.2",
 "eslint-config-airbnb": "^16.1.0",
 "eslint-plugin-import": "^2.8.0",
 "eslint-plugin-jsx-a11y": "^6.0.3",
 "eslint-plugin-react": "^7.5.1",
 "redux-mock-store": "^1.3.0",
 */
