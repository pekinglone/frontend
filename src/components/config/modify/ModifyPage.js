import { Icon, Table } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import ProgramList from './ProgramList';
import TemplateTypeList from './TemplateTypeList';
import TemplateList from './TemplateList';
import TemplateDetail from './TemplateDetail';
import JudgeGroup from './JudgeGroup';
import Judge from './Judge';
import ModifyObject from './ModifyObject';
import RulesPage from'./RulesPage';
class ModifyPage extends React.Component {
  render(){
    return(
      <div>
        {this.props.modify.modifyProcess === 0 ? <ProgramList /> : null}
        {this.props.modify.modifyProcess === 1 ? <TemplateTypeList /> : null}
        {this.props.modify.modifyProcess === 2 ? <TemplateList /> : null}
        {this.props.modify.modifyProcess === 3 ? <TemplateDetail /> : null}
        {this.props.modify.modifyProcess === 4 ? <ModifyObject /> : null}
        {this.props.modify.modifyProcess === 5 ? <JudgeGroup /> : null}
        {this.props.modify.modifyProcess === 6 ? <Judge /> : null}
        {this.props.modify.modifyProcess === 7 ? <RulesPage /> : null}
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

export default connect(mapStateToProps)(ModifyPage)