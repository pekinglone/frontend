import React from 'react';
import { connect } from 'react-redux';
import { Modal, Input, Button } from 'antd';
import { setUserInfo } from '../../action/AppraisalNewAction';
import HeaderPage from './PageHeader';
import { createHashHistory } from 'history';

const history = createHashHistory({
  hashType: 'slash'
});
class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: ''
    };
  }
  componentDidMount () {
    this.input.focus();
  }
  setUserId = (e) => { this.setState({ userId: e.target.value }); }
  login = (userId) => {
    if(userId === "admin"){
      history.push('/config');
    } else {
      sessionStorage.setItem("currentJudge", userId);
      this.props.dispatch(setUserInfo(userId));
      history.push('/index');
    }
  }
  render(){
    return (
      <div>
        <HeaderPage />
        <div className="container">
          <div className="dialog">
            <label htmlFor="name">用户名：</label>
            <Input id="name" ref={(input) => this.input = input} className="input" size="large" placeholder="id" onChange={this.setUserId} />
            <br />
            <label htmlFor="password">密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
            <Input id="password" className="input" size="large" type="password" placeholder="密码" onPressEnter={() => {this.login(this.state.userId)}}/>
            <br />
            <Button className="login" type="primary" onClick={() => {this.login(this.state.userId)}}>登&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    appraisal: state.appraisal
  }
}

export default connect(mapStateToProps)(Login)