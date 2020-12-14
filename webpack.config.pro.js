const path = require('path');
//自动根据模版打包index.html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//清理打包后的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
      // 配置哪些css文件不能为全局使用 
      exclude: [
        path.resolve(__dirname, 'src/components/')
      ]
    },
    {
      test: /\.css$/,
      // use: ['style-loader', {
      use: [MiniCssExtractPlugin.loader, {
        // 设置css为模块化使用
        loader: 'css-loader',
        options: {
          modules: {
            // 让css语意化 如果不设置则为随机乱码
            localIdentName: '[path][name]__[local]--[hash:base64:5]',
          }
        }
      }],
      // 设置为局部组件使用
      include: [
        path.resolve(__dirname, 'src/components/')
      ]
    }, {
      test: /\.(eot|woff2|woff|ttf|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: 'iconfont'
        }
      }]
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
    //1.执行方法
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin()
  ],
  //设置为开发模式
  mode: "production"
}