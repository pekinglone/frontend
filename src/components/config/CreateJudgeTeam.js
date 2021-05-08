import { Input, Button,Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux'; 
// import {asyncGetJudgeTeam} from '../../action/ModifyAction';
import { hiddenCreateTemplate, showAddTemplate, hiddenEditTemplate } from '../../action/ConfigAction';
import { sasyncAddJudgeTeam, setCurrentPwzId, asyncIsTemplateCompleted, asyncAddJudgeTeam, setSubProcess, hiddenJudgeTeamList, hiddenJudgeList } from '../../action/ConfigAction';
class CreateJudgeTeam extends React.Component {
  componentWillMount(){

    const khmbid = sessionStorage.getItem("currentTemplateId");
    // const khfaid = sessionStorage.getItem("currentProgramId");
    // this.props.dispatch(asyncGetJudgeTeam(khfaid, khmbid));
    let temp=this.state.res;
    let mbxxindex=Object.keys(this.state.res).length;
    temp[mbxxindex]={};
    this.setState({res:temp});
    this.props.dispatch(asyncIsTemplateCompleted(khmbid));
  }
  constructor() {
      super();
      this.state = {
        res:{}
      };
  }
  setTemplateName = (e, item) => {
    let tempRes = this.state.res;
    if(tempRes[item] !== undefined){
      tempRes[item].PWZMC = e.target.value;
    } else {
      let temp = {};
      temp.PWZMC = e.target.value;
      tempRes[item] = temp;
    }
    this.setState({res: tempRes});
  }
  setTemplateWeight = (e, item) => {
    let tempRes = this.state.res;
    if(tempRes[item] !== undefined){
      tempRes[item].PWZQZ = e.target.value;
    } else {
      let temp = {};
      temp.PWZQZ = e.target.value;
      tempRes[item] = temp;
    }
    this.setState({res: tempRes});
  }
  minus = (index) => {
    let temp=this.state.res;
    delete temp[index];
    let tempObject = {};
    Object.keys(temp).forEach((item, index) => {
      tempObject[index] = temp[item];
    });
    this.setState({res:tempObject});
  }
  addItem = () => {
    this.props.dispatch(hiddenJudgeTeamList());
    let temp=this.state.res;
    let newIndex=Object.keys(this.state.res).length;
    temp[newIndex]={};
    this.setState({res:temp});
  }
  submitItem =() => {
  	let flag = true, weightSum = 0;
    Object.keys(this.state.res).forEach((key) => {
      if(this.state.res[key].PWZMC === undefined ||　this.state.res[key].PWZQZ === undefined){
        flag = false;
      } else {
        weightSum = weightSum +　(this.state.res[key].PWZQZ === undefined ? 0 : parseFloat(this.state.res[key].PWZQZ));
      }
    });
    if(flag){
      if(weightSum === 1){
        // 异步提交
        const faid = this.props.config.currentFaid;
        const khmbid = this.props.config.currentMB.KHMBID;
        let result = [];
        Object.keys(this.state.res).forEach((item) => {
          let temp = {};
          temp.PWZMC = this.state.res[item].PWZMC;
          temp.PWZQZ = parseFloat(this.state.res[item].PWZQZ);
          result.push(temp);
        });
        if(result.length === 0){
        	alert("您还没有填写内容，请填写之后再提交");
        } else {
        	this.props.dispatch(asyncAddJudgeTeam(faid, khmbid, result));
        }
      } else {
        alert("权重总和不为1，请调整权重");
      }
    } else {
      alert("有信息为空，请核对模板类型是否选择，名称是否填写，权重是否设置");
    }
  }
  eidt = (pwzid) => {
    this.props.dispatch(setCurrentPwzId(pwzid));
    this.props.dispatch(hiddenJudgeList());
    this.props.dispatch(setSubProcess(6));
  }
  back = () => {
    this.props.dispatch(hiddenCreateTemplate());
    this.props.dispatch(showAddTemplate());
    this.props.dispatch(hiddenEditTemplate());
    this.props.dispatch(setSubProcess(4));
  }
  render() {
    let detailOfMbid = this.props.config.templateStatus[this.props.config.currentMB.KHMBID];
    return(
        <div>
          {this.props.config.showJudgeTeamList ? <div style={{marginTop: '1%'}}>
            {this.props.config.judgeTeamList.map((item, index) => {
              const PWZID = item.PWZID;
              return (
                <span><br/><label style={{width:'20%'}}>{item.PWZMC}</label>{detailOfMbid !== undefined && detailOfMbid.detail[PWZID] !== undefined && detailOfMbid.detail[PWZID].status === "true" ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> : <Icon key={"edit"+index} type="edit" onClick={() => this.eidt(item.PWZID)}/>}</span>
              );
          })}
          </div> : <div style={{marginTop: '1%'}}>
            <Button onClick={this.addItem} style={{marginBottom: '20px'}}>添加一个评委组</Button>
            {Object.keys(this.state.res).map((item) =>{
              return(
                <Input.Group compact>
                    <Input addonBefore="评委组名称：" style={{ width: '40%' }} value={this.state.res[item].PWZMC} onChange={(e) => this.setTemplateName(e, item)}/>
                    <Input addonBefore="权重：" style={{ width: '20%' }} value={this.state.res[item].PWZQZ} placeholder="权重值，小于1，如0.5" onChange={(e) => this.setTemplateWeight(e, item)} />
                    <Icon key={"del"+item} type="minus" onClick={() => {this.minus(item)}} ></Icon>
                </Input.Group>);
            })}
            <Button type="primary" style={{marginTop: '20px'}} onClick={this.submitItem}>一键创建</Button>
          </div>}
          {this.props.config.showJudgeTeamList && detailOfMbid !== undefined && detailOfMbid.status ? 
            <div>
            <Button onClick={this.back} style={{marginTop: '20px'}}>点我结束</Button>
            </div> : null
          }
        </div>
      );
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(CreateJudgeTeam)