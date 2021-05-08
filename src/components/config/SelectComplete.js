import { Button, Result,} from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { setAgain, setMatchProcess, bindDepProgram, bindObjectProgram} from '../../action/ConfigAction';
class SelectComplete extends React.Component {
  constructor() {
      super();
      this.state = {
        finalbind:[],
        selectedDep:[],
        selectedUser:[],
      };
  }

  selectagain = () => {
    this.props.dispatch(setMatchProcess(0));
    this.props.dispatch(setAgain(this.state.finalbind));
    this.props.dispatch(bindDepProgram(this.state.selectedDep));
    this.props.dispatch(bindObjectProgram(this.state.selectedUser));
  }

  render() {
    return(
      <div>
      <Result
        status="success"
        title="提交成功！"
        extra={[
            <Button onClick={this.selectagain} type="primary" key="console">
                继续选择考核对象
            </Button>,
              ]}
      />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(SelectComplete)