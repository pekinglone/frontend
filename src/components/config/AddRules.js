import { Button, Checkbox, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { asyncGetGradeRatio, asyncBindJudgeTeamGrade } from '../../action/ModifyAction';
class AddRules extends React.Component {
  componentWillMount(){
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
  onChange = e => {
    let temp = this.state.status;
    temp[e.target.value] = !temp[e.target.value];
    this.setState({
      status: temp
    });
  };
  submit = () => {
    const pwzid = this.props.config.currentPwzId;
    let res = [];
    Object.keys(this.state.status).forEach((item) => {
      if(this.state.status[item] && item !== "no"){
        let temp = {};
        temp.JFXZID = item;
        res.push(temp);
      }
    });
    if(res.length > 0){
      this.props.dispatch(asyncBindJudgeTeamGrade(pwzid, res, this.props.modify.strategy, 1));
    }
    
  }
  render(){
    console.log(this.state.rules);
    return(
      <div>
        {this.state.rules &&　this.state.rules.length > 0 ? 
          this.state.rules.map((item) => {
            return (<div><Checkbox checked={this.state.status[item.key]} key={item.key} value={item.key} onChange={this.onChange}>
              {item.DCBZMC + " " + item.rule + (item.PERCENTAGE * 100) + "%"}
            </Checkbox></div>);
          }): null}
        <div><Checkbox checked={this.state.status["no"]} key={"no"} value={"no"} onChange={this.onChange}>
              无规则
            </Checkbox></div>
        <Button onClick={this.submit}>提交</Button>
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

export default connect(mapStateToProps)(AddRules)