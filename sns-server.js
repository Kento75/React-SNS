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

// ユーザー追加用API
app.get('/api/adduser', (req, res) => {
  const userid = req.query.userid
  const passwd = req.query.passwd
  
  if(userid === '' || passwd === '') {
    return res.json({
      status: false,
      msg: 'ユーザーIDまたはパスワードが未入力です。',
    })
  }

  // ユーザーチェック
  db.getUser(userid, (user) => {
    // すでに存在する場合
    if(user) {
      return res.json({
        status: false,
        msg: 'すでにユーザーが存在します。',
      })
    }

    // ユーザーが存在しない(新規)の場合
    db.addUser(userid, passwd, (token) => {
      if(!token) {
        res.json({
          status: false,
          msg: 'DBエラー',
        })
        res.json({
          status: true,
          token,
        })
      }
    })
  })
})

// ユーザーログイン用API
app.get('/api/login', (req,res) => {
  const userid = req.query.userid
  const passwd = req.query.passwd

  db.login(userid, passwd, (err, token) => {
    if(err) {
      res.json({
        status: false,
        msg: '認証エラー',
      })
    }

    // ログイン成功時
    res.json({
      status: true,
      token,
    })
  })
})

// 友達追加用API
app.get('/api/add_friend', (req, res) => {
  const userid = req.query.userid
  const token = req.query.token
  const friendid = req.query.friendid

  db.checkToken(userid, token, (err, user) => {
    // 認証エラー
    if(err) {
      res.json({
        status: false,
        msg: '認証エラー',
      })
      return
    }

    // 友達追加
    user.friends[friendid] = true
    db.updateUser(user, (err) => {
      if(err) {
        res.json({
          status: false,
          msg: 'DBエラー',
        })
        return
      }
      res.json({
        status: false,
      })
    })
  })
})

// 発言用API(自分)
app.get('/api/add_timeline', (req, res) => {
  const userid = req.query.userid
  const token = req.query.token
  const comment = req.query.comment
  const time = (new Date()).getTime()

  db.checkToken(userid, token, (err, user) => {
    if(err) {
      res.json({
        status: false,
        msg: '認証エラー',
      })
      return
    }

    // タイムラインに追加
    const item = {
      userid,
      comment,
      time,
    }
    db.timelineDB.insert(item, (err, it) => {
      if(err) {
        res.json({
          status: false,
          msg: 'DBエラー',
        })
        return
      }
      res.json({
        status: true,
        timelineid: it._id,  // DBのインデックス番号
      })
    })
  })
})

// ユーザー一覧取得API
app.get('/api/get_allusers', (req, res) => {
  db.userDB.find({}, (err, docs) => {
    if(err) return res.json({ status: false })
    
    const users = docs.map(e => e.userid)
    res.json({ status: true, users })
  })
})

// ユーザー情報取得API
app.get('/api/get_user', (req, res) => {
  const userid = req.query.userid
  db.getUser(userid, (user) => {
    if(!user) return res.json({ status: false })

    res.json({ status: true, friends: user.friends })
  })
})

// 友達のタイムライン取得API
app.get('/api/get_frinends_timeline', (req, res) => {
  const userid = req.query.userid
  const token = req.query.token
  db.getFriendsTimeline(userid, token, (err, docs) => {
    if(err) {
      res.json({ status: false, msg: err.toString() })
      return
    }
    res.json({ status: true, timelines: docs })
  })
})

// 静的ファイルのルーティング
app.use('/public', express.static('./public'))
app.use('/login', express.static('./public'))
app.use('/users', express.static('./public'))
app.use('/timeline', express.static('./public'))
app.use('/', express.static('./public'))
