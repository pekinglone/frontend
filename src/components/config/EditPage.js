import { Steps, Popover, Radio, Tag, Select, Option, Table, Menu } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import HeaderPage from '../appraisal/PageHeader';
import EditObject from './EditObject';
import EditTemplate from './EditTemplate';
import { setSubProcess, setMatchProcess, setMainProcess, setAgain, bindDepProgram, bindObjectProgram } from '../../action/ConfigAction';
import { setModifyProcess } from '../../action/ModifyAction';
import SelectObject from './SelectObject';
import SelectProgram from './SelectProgram';
import SelectTemplateType from './SelectTemplateType';
import BindTemplate from './BindTemplate';
import ResultBind from './ResultBind';
import SelectComplete from './SelectComplete';
import SelectRepeat from './SelectRepeat';
import ConfigObject from './ConfigObject';
import ResultShow from './ResultShow';
import ModifyPage from './modify/ModifyPage';
import DefineLevelPage from './modify/DefineLevelPage';
import DefineRulePage from './modify/DefineRulePage';
import './Config.css';
class EditPage extends React.Component {
  componentWillMount(){
    this.props.dispatch(setSubProcess(0));
  }
  constructor() {
      super();
      this.state = {
        object: 0,
        groupList:["xinke", "kaifa","shengchan","renli"]
      };
  }
  configKH = () => {
    this.props.dispatch(setAgain([]));
    this.props.dispatch(bindDepProgram([]));
    this.props.dispatch(bindObjectProgram([]));

    this.props.dispatch(setMainProcess(2));
    this.props.dispatch(setMatchProcess(0));
  }
  configDX = () => {
    this.props.dispatch(setMainProcess(1));
  }
  showResult = () => {
    this.props.dispatch(setMainProcess(3));
  }
  createProject = () => {
    this.props.dispatch(setSubProcess(0));
    this.props.dispatch(setMainProcess(0));
  }
  modify = () => {
    this.props.dispatch(setModifyProcess(0));
    this.props.dispatch(setMainProcess(4));
  }
  addLevel = () => {
    this.props.dispatch(setMainProcess(5));
  }
  addRules = () => {
    this.props.dispatch(setMainProcess(6));
  }
  render() {
    return (
      <div>
        <HeaderPage />
        <div className="config-container">
          <Menu
            style={{width:'15%'}}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <Menu.Item key="newFA" value="newFA" style={{'fontSize': '20px', 'marginTop':'5%'}} onClick={this.createProject}>
              创建考核方案
            </Menu.Item>
            <Menu.Item key="matchObject" value="addobject" style={{'fontSize': '20px', 'marginTop':'5%'}}  onClick={this.configDX.bind(this)}>
              添加考核对象
            </Menu.Item>
            <Menu.Item key="matchMenu" value="configKH" style={{'fontSize': '20px', 'marginTop':'5%'}} onClick={this.configKH.bind(this)}>
              配置考核
            </Menu.Item>
            <Menu.Item key="lookupMenu" value="lookup" style={{'fontSize': '20px', 'marginTop':'5%'}} onClick={this.showResult.bind(this)}>
              查看考核结果
            </Menu.Item>
            <Menu.Item key="modifyMenu" value="modify" style={{'fontSize': '20px', 'marginTop':'5%'}} onClick={this.modify.bind(this)}>
              修改配置
            </Menu.Item>
            <Menu.Item key="addLevel" value="addLevel" style={{'fontSize': '20px', 'marginTop':'5%'}} onClick={this.addLevel.bind(this)}>
              配置考核等级
            </Menu.Item>
            <Menu.Item key="addRules" value="addRules" style={{'fontSize': '20px', 'marginTop':'5%'}} onClick={this.addRules.bind(this)}>
              配置考核规则
            </Menu.Item>
          </Menu>
          <div className="context">
            {this.props.config.mainProcess === 0 ? <EditTemplate /> : null}
            {this.props.config.mainProcess===1 ? <ConfigObject/>:null}
            {this.props.config.mainProcess===2 ? 
            <div>
              <div style={{marginBottom:'3%'}}>
                <Steps current={this.props.config.matchProcess}>
                    <Steps.Step title="选择考核对象" description="" />
                    <Steps.Step title="选择考核方案" description="" />
                    <Steps.Step title="选择模板类型" description="" />
                    <Steps.Step title="选择考核模板" description="" />
                    <Steps.Step title="生成考核模板" description="" />
                    <Steps.Step title="完成" description="" />
                </Steps>
              </div>
              <div>
                  {this.props.config.matchProcess===0?<SelectObject type="match"/>:null}
                  {this.props.config.matchProcess===1? <SelectProgram type="selectFA"/> : null}
                  {this.props.config.matchProcess===2? <SelectTemplateType  /> : null}
                  {this.props.config.matchProcess===3 ? <BindTemplate /> : null}
                  {this.props.config.matchProcess===4 ? <ResultBind /> : null}
                  {this.props.config.matchProcess===5 ? <SelectComplete />: null}
                  {this.props.config.matchProcess===6 ? <SelectRepeat />: null}
              </div>
            </div> :null}
            {this.props.config.mainProcess===3 ? <ResultShow />:null}
            {this.props.config.mainProcess===4 ? <ModifyPage />:null}
            {this.props.config.mainProcess===5 ? <DefineLevelPage />:null}
            {this.props.config.mainProcess===6 ? <DefineRulePage />:null}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(EditPage)