///// SNS サーバー /////

// DB接続
const db = require('./server/database')

// webサーバー起動
const express = require('express')
const app = express()
const portNo = 3001

// サーバー起動
app.listen(portNo, () => {
  console.log('Server Started ： ', `http://localhost:${ portNo }`)
})

/// API 定義 ///
// TODO: 各種APIの実装