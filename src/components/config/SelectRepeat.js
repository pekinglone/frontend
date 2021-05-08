import { Button, Result,} from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { setAgain, setMatchProcess, bindDepProgram, bindObjectProgram} from '../../action/ConfigAction';
class SelectRepeat extends React.Component {
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
        status="error"
        title="此对象已存在！"
        extra={[
            <Button onClick={this.selectagain} type="primary" key="console">
                重新选择考核对象
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

export default connect(mapStateToProps)(SelectRepeat)