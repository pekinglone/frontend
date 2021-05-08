import { Icon, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { setCurrentMblxmc, setSubProcess, setCurrentMblxId, asyncIsProgramCompleted, setCurrentMblx } from '../../action/ConfigAction';
class ListTemplateType extends React.Component {
  componentWillMount(){
    this.props.dispatch(asyncIsProgramCompleted(this.props.faid));
  }
  constructor() {
      super();
      this.state = {
        
      };
  }
  edit = (mblxmc, mblx, mblxid) => {
    sessionStorage.setItem("currentTemplateTypeId", mblxid);
    sessionStorage.setItem("currentProgramType", mblx);
    this.props.dispatch(setCurrentMblxmc(mblxmc));
    this.props.dispatch(setCurrentMblx(mblx));
    this.props.dispatch(setCurrentMblxId(mblxid));
    this.props.dispatch(setSubProcess(4));
  }
  back = () => {
    this.props.dispatch(setSubProcess(1));
  }
  render() {
    const programStatus = this.props.config.programStatus[this.props.faid];
    return(
      <div>
      {this.props.config.newTemplateList.map((item, index) => {
        return (
          <span><br/><label style={{width:'20%'}}>{item.MBLXMC}</label>{programStatus!== undefined && programStatus.detail[item.MBLXID] === "true" ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> : <Icon key={"edit"+index} type="edit" onClick={() => this.edit(item.MBLXMC, item.MBTYPE, item.MBLXID)}/>}</span>
        );
      })}
      {programStatus && programStatus.status ? <Button onClick={this.back}>点我返回</Button> : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(ListTemplateType)