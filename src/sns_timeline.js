import React, { Component } from 'react'
import request from 'superagent'
import styles from './styles'


// タイムライン画面コンポーネント
export default class SNSTimeline extends Component {
  constructor(props) {
    super(props)
    this.state = { timelines: [], comment: '' }
  }
  componentWillMount() {
    this.loadTimelines()
  }

  // タイムライン取得
  loadTimelines() {
    request
      .get('/api/get_friends_timeline')
      .query({
        userid: window.localStorage.sns_id,
        token: window.localStorage.sns_auth_token
      })
      .end((err, res) => {
        if(err) return
        this.setState({ timelines: res.body.timelines })
      })
  }
  // タイムライン投稿
  post() {
    request
      .get('/api/add_timeline')
      .query({
        userid: window.localStorage.sns_id,
        token: window.localStorage.sns_auth_token,
        comment: this.state.comment
      })
      .end((err, res) => {
        if(err) return
        this.setState({ comment: '' })
        this.loadTimelines()
      })
  }

  // TODO: タグの定義記述
  render() {

  }
}