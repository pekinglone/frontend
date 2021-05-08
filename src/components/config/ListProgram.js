import { Icon, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { setSubProcess, setCurrentFaId, asyncIsProgramCompleted } from '../../action/ConfigAction';
class ListProgram extends React.Component {
  constructor() {
      super();
      this.state = {
        mblx: ""
      };
  }
  componentDidMount(){
    this.props.config.newProgramList.map((item, index) => {
      this.props.dispatch(asyncIsProgramCompleted(item.KHFAID));
    });
  }
  eidt = (faid) => {
    sessionStorage.setItem("currentProgramId", faid);
    this.props.dispatch(setCurrentFaId(faid));
    this.props.dispatch(setSubProcess(2));
  }
  back = () => {
    this.props.dispatch(setSubProcess(8));
  }
  render() {
    let flag = true;
    this.props.config.newProgramList.forEach((item) => {
      if(this.props.config.programStatus !== undefined && this.props.config.programStatus[item.KHFAID] !== undefined){
        flag = this.props.config.programStatus[item.KHFAID].status && flag;
      }
    });
    return(
      <div>
      {this.props.config.newProgramList.map((item, index) => {
        return (
          <span><br/><label style={{width:'20%'}}>{item.KHFAMC}</label>{this.props.config.programStatus !== undefined && this.props.config.programStatus[item.KHFAID] !== undefined && this.props.config.programStatus[item.KHFAID].status ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> : <Icon key={"edit"+index} type="edit" onClick={() => this.eidt(item.KHFAID)}/>}</span>
        );
      })}
      {flag ? <Button onClick={this.back}>点我返回</Button> : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(ListProgram)