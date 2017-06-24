var path = require('path')
var webpack = require('webpack')
    //分离css和js
var ExtractTextPlugin = require('extract-text-webpack-plugin')
    //生成html
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // bundle入口
    entry: [
        './node_modules/webpack-dev-server/client?http://localhost:8080',
        './node_modules/webpack/hot/dev-server',
        './node_modules/babel-polyfill',
        './src/webpack',
        './src/index'
    ],
    // bundle输出
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js' //可重命名
    },
    //插件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        //分离css和js
        new ExtractTextPlugin("styles.css"),
        //生成html页面
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        //热加载
        new webpack.HotModuleReplacementPlugin()
    ],
    //组件loader
    module: {
        loaders: [
            // css转换
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            // sass转换 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            //css背景图片转换
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[ext]'
            },
            //读取html，打包src图片
            {
                test: /\.html$/,
                loader: "html-withimg-loader"
            },
            //编译es6，转化为es5
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader', 
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        hot: true
    }
}
