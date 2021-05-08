import { Result, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux'; 
import { createHashHistory } from 'history';
import {asyncGenerateJudgeTable} from '../../action/ConfigAction';
const history = createHashHistory({
  hashType: 'slash'
});
class TemplateComplete extends React.Component {
  constructor() {
      super();
      this.state = {
        mblx: ""
      };
  }
  componentDidMount(){
    this.props.dispatch(asyncGenerateJudgeTable(sessionStorage.getItem("currentProgramId")));
  }
  back = () => {
    history.push('/');
  }
  render() {
    return(
      <div>
        <Result
          status="success"
          title="您已经完成了考核模板类型的配置，请继续其他步骤"
          extra={[
            <Button type="primary" onClick={this.back}>
              点我结束
            </Button>
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

export default connect(mapStateToProps)(TemplateComplete)