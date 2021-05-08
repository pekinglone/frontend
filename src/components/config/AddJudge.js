import { Input, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import SelectKHDX from './SelectKHDX';
import { asyncAddJudge } from '../../action/ConfigAction';
class AddJudge extends React.Component {
  constructor() {
      super();
      this.state = {
        weight:{}
      };
  }
  setPwWeight = (e, pwid) => {
  	// if(this.state.weight[pwid] === undefined){
  	// 	let temp = {};
  	// 	temp[pwid] = e.target.value;
  	// 	this.setState({weight: temp});
  	// } else {
	let temp = this.state.weight;
	temp[pwid] = e.target.value;
	this.setState({weight: temp});
  	// }
  }
  submit = () => {
  	let result = [], weightSum = 0, flag = true;
  	this.props.config.judgeList.forEach((item) => {
  		let resTemp = {};
  		resTemp.PWID = item.PWID;
  		if(this.state.weight[item.PWID] === undefined){
  			flag = false;
  		} else {
  			resTemp.PWQZ = this.state.weight[item.PWID];
        // if((parseFloat(this.state.weight[item.PWID]) >= 0) && (parseFloat(this.state.weight[item.PWID]) <= 1)){
        weightSum = weightSum + parseFloat(this.state.weight[item.PWID]);
        // } else {
          // alert(item.PWMC + "的权重填写有误，请仔细检查！");
          // return;
        // }
  		}
  		result.push(resTemp);
  	});
  	if(!flag || weightSum !== 1){
  		alert("有未填写的权重值或权重值的和不为1，请您仔细检查后提交，不检查也没用，就不让你提交，(￣┰￣*)");
  	} else {
  		this.props.dispatch(asyncAddJudge(this.props.config.currentPwzId, result));
  	}
  }
  render() {
    return(
      <div>
      <span>您正在编辑的评委组是：
      {this.props.config.judgeTeamList.map((item) => {
      	if(item.PWZID === this.props.config.currentPwzId){
      		return (<b>{item.PWZMC}</b>);
      	}})}
      </span>
      {this.props.config.showJudgeList ? this.props.config.judgeList.map((item) => {
      	return (
      		<div>
	      		<Input.Group compact>
	        		<Button style={{ width: '20%' }}>{item.PWMC}</Button>
	        		<Button style={{ width: '20%' }}>{item.PWID}</Button>
	        		<Input addonBefore="权重：" style={{ width: '20%' }} value={this.state.weight[item.PWID]} placeholder="权重值，小于1，如0.5" onChange={(e) => this.setPwWeight(e, item.PWID)} />
	       		</Input.Group>
	       	</div>
      		);
      }) : <SelectKHDX type="judge"/>}
      {this.props.config.showJudgeList ? <Button onClick={this.submit}>提交</Button> : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(AddJudge)