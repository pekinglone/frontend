import { Button, Checkbox, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { asyncGetGradeRatiobyJudg, asyncGetGradeRatio, asyncBindJudgeTeamGrade, setModifyProcess } from '../../../action/ModifyAction';

class RulesPage extends React.Component {
  componentWillMount(){
    const pwzid = sessionStorage.getItem("currentJudgeTeamId");
    const strategies = this.props.modify.strategy;
    this.props.dispatch(asyncGetGradeRatiobyJudg(pwzid, strategies));
    this.props.dispatch(asyncGetGradeRatio());
  }
  constructor(){
      super();
      this.state = {
        selected:[],
        rules:[],
        status: {}
      };
  }
  componentWillReceiveProps(nextProps){
    if(this.props.modify.selectedRules !== nextProps.modify.selectedRules){
      if(nextProps.modify.selectedRules != undefined){
        const selected = [];
        nextProps.modify.selectedRules.forEach((item) => {
          selected.push(item.key);
        });
        this.setState({selected: selected});
      }
    }
    if(this.props.modify.ruleData !== nextProps.modify.ruleData){
      if(nextProps.modify.ruleData != undefined){
        let status = {};
        nextProps.modify.ruleData.forEach((item) => {
          item.rule = this.props.modify.strategy[item.STRATEGY];
          status[item.key] = false;
        });
        status["no"] = false;
        this.setState({rules: nextProps.modify.ruleData, status: status});
      }
    }
  }
  contains = (obj) => {
    let i = this.state.selected.length;
    while (i--) {
      if (this.state.selected[i] === obj) {
          return true;
      }
    }
    return false;
  }
  onChange = e => {
    let temp = this.state.status;
    temp[e.target.value] = !temp[e.target.value];
    //console.log('checked = ', e.target.checked,'value = ', e.target.value);
    this.setState({
      status: temp
    });
  };//  ? this.state.status["no"] : false
  submit = () => {
    const pwzid = sessionStorage.getItem("currentJudgeTeamId");
    let res = [];
    Object.keys(this.state.status).forEach((item) => {
      if(this.state.status[item] && item !== "no"){
        let temp = {};
        temp.JFXZID = item;
        res.push(temp);
      }
    });
    console.log(this.props.modify.strategy);
    if(res.length > 0){
      this.props.dispatch(asyncBindJudgeTeamGrade(pwzid, res, this.props.modify.strategy, 0));
    }
    
  }
  back = () => {
    this.props.dispatch(setModifyProcess(5));
  }
  render(){
    console.log(this.state.rules);
    return(
      <div>
        {this.props.modify.selectedRules &&　this.props.modify.selectedRules.length > 0 ? <Tooltip className="tips">
          <span>现有规则为：</span>
          <ul>
          {this.props.modify.selectedRules.map((item,index) => {
            return(
              <li key={item.key}>{item.DCBZMC + " " + item.rule + (item.PERCENTAGE * 100) + "%"}</li>
              );
          })}
          </ul>
        </Tooltip> : null}
        <div>
        {this.state.rules &&　this.state.rules.length > 0 ? 
          this.state.rules.map((item) => {
            return (<div><Checkbox checked={this.state.status[item.key]} key={item.key} value={item.key} onChange={this.onChange}>
              {item.DCBZMC + " " + item.rule + (item.PERCENTAGE * 100) + "%"}
            </Checkbox></div>);
          }): null}
        </div> 
        <div><Checkbox checked={this.state.status["no"]} key={"no"} value={"no"} onChange={this.onChange}>
              无规则
            </Checkbox></div>
        <Button onClick={this.submit}>提交</Button>
        <Button onClick={this.back}>返回上一级</Button>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    modify: state.modify, // gives our component access to state through props.toDoApp
    config: state.config
  }
}

export default connect(mapStateToProps)(RulesPage)