import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import SNSUsers from './sns_users'
import SNSLogin from './sns_login'

// ルーティングコンポーネント
const SNSApp = () => {
  <Router>
    <div>
      <Switch>
        <Route path='/users' component={ SNSUsers } />
        <Route path='/timeline' component={ SNSTimeline } /> 
        <Route path='/login' component={ SNSLogin } />       
        <Route component={ SNSLogin } />
      </Switch>
    </div>
  </Router>
}

// マウント
ReactDOM.render(
  <SNSApp />,
  document.getElementById('root')
)
