const path = require('path');
//自动根据模版打包index.html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//清理打包后的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  //模块化开发
  //入口
  entry: "./src/main.ts",
  //出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  //配置监听文件变化从而实时更新数据
  devServer: {
    //服务器根路径
    contentBase: '/dist',
    //自动启动服务
    open: true
  },
  resolve: {
    //省略扩展名 优先匹配哪个后缀名
    "extensions": ['.ts', '.js', '.json']
  },
  module: {
    //规则
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(eot|woff2|woff|ttf|svg)$/,
      use: ['file-loader']
    }, {
      test: /\.ts$/,
      use: ['ts-loader'],
      //不变异node_modules中的ts文件
      exclude: /node_modules/
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin()
  ],
  //设置为开发模式
  mode: "development"
}