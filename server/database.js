const path = require('path')
const NeDB = require('nedb')

// UserDB設定
const userDB = new NeDB({
  filename: path.join(__dirname, 'user.db'),
  autoload: true
})

// TimelineDB設定
const timelineDB = new NeDB({
  filename: path.join(__dirname, 'timeline.db'),
  autoload: true
})

// ハッシュ値取得(sha512)
function getHash(pw) {
  const salt = '::EVuCMQQQsfI42Krpr'
  const crypto = require('crypto')
  const hashsum = crypto.createHash('sha512')
  hashsum.update(pw + salt)
  return hashsum.digest('hex')
}

// 認証用トークン生成
function getAuthToken(userid) {
  const time = (new Date()).getTime()
  return getHash(`${userid}:${time}`)
}

/// functions

// ユーザー検索
function getUser(userid, callback) {
  userDB.findOne({ userid }, (err, user) => {
    if(err || user === null) return callback(null)
    callback(user)
  })
}

// ユーザー新規登録
function addUser(userid, passwd, callback) {
  const hash = getHash(passwd)
  const token = getAuthToken(userid)
  const regDoc = { userid, hash, token, friends: {} }
  userDB.insert(regDoc, (err, newdoc) => {
    if(err) return callback(null)
    callback(token)
  })
}

// ログイン試行
function login(userid, passwd, callback) {
  const hash = getHash(passwd)
  const token = getAuthToken(userid)
  // ユーザー情報を取得
  getUser(userid, (user) => {
    if(!user || user.hash !== hash) {
      return callback(new Error('認証エラー'), null)
    }
    // 認証トークン更新
    user.token = token
    updateUser(user, (err) => {
      if(err) return callback(err, null)
      callback(null, token)
    })
  })
}

// 認証トークンの確認
function checkToken(userid, token, callback) {
  //ユーザー情報を取得
  getUser(userid, (user) => {
    if(!user || user.token !== token) {
      return callback(new Error('認証に失敗'), null)
    }
    callback(null, user)
  })
}

// ユーザー情報更新
function udateUser(user, callback) {
  userDB.update({ userid: user.userid }, user, {}, (err, n) => {
    if(err) return callback(err, null)
    callback(null)
  })
}

// 友達のタイムライン取得
function getFriendsTimeline(userid, token, callback) {
  // TODO : 処理の実装
}