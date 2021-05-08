import { Steps, Step } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import NewProgram from './NewProgram';
import ListProgram from './ListProgram';
import EditTemplateType from './EditTemplateType';
import ListTemplateType from './ListTemplateType';
import EditableFormTable from './EditableFormTable';
import TemplateComplete from './TemplateComplete';  
import CreateJudgeTeam from './CreateJudgeTeam';
import AddJudge from './AddJudge';
import AddRules from './AddRules';
class EditTemplate extends React.Component {
  constructor() {
      super();
      this.state = {
        
      };
  }
  render() {
    return(
      <div>
      	<div style={{marginBottom:'3%'}}>
  	      <Steps progressDot current={this.props.config.subProcess}>
  	        <Steps.Step title="新建考核方案" description="为模板类型起一个响亮的名称" />
            <Steps.Step title="编辑考核方案" description="" />
            <Steps.Step title="新建考核模板类型" description="" />
  	        <Steps.Step title="编辑考核模板类型" description="" />
            <Steps.Step title="编辑考核模板" description="" />
            <Steps.Step title="创建评委组" description="" />
            <Steps.Step title="添加规则" description="" />
            <Steps.Step title="添加评委" description="" />
            <Steps.Step title="完成" description="请继续" />
  	      </Steps>
  	    </div>
  	    {this.props.config.subProcess === 0 ? <NewProgram /> : null}
        {this.props.config.subProcess === 1 ? <ListProgram /> : null}
  	    {this.props.config.subProcess === 2 ? <EditTemplateType faid={this.props.config.currentFaid} /> : null}
        {this.props.config.subProcess === 3 ? <ListTemplateType faid={this.props.config.currentFaid} /> : null}
  	    {this.props.config.subProcess === 4 ? <EditableFormTable faid={this.props.config.currentFaid} mblx={this.props.config.currentMblx} /> : null}
  	    {this.props.config.subProcess === 5 ? <CreateJudgeTeam /> : null}
        {this.props.config.subProcess === 6 ? <AddRules /> : null}
        {this.props.config.subProcess === 7 ? <AddJudge /> : null}
        {this.props.config.subProcess === 8 ? <TemplateComplete /> : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(EditTemplate)