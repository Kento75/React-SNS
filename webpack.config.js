const path = require('path');

module.exports = {
  mode: 'development',
  // エントリーポイントの設定
  entry: path.join(__dirname, 'src/index.js'),
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'bundle.js',
    path: path.join(__dirname, 'public')
  },

  // babel設定
  module: {
    rules: [
      {
        test: [/\.js$/, /\.jsx$/],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          }
        ]
      }
    ]
  }
}