import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';
import './Appraisal.css';asyncGetTemplateAndObject
import { asyncGetProgramAndTemplateType, setCurrentProgramId, setCurrentTemplateTypeId, serCurrentMbType } from '../../action/AppraisalNewAction';
import { asyncGetTemplateAndObject } from '../../action/AppraisalNewAction';
const { SubMenu } = Menu;

class MenuPageNew extends React.Component {
  constructor() {
      super();
      this.state = {};
  }
  componentDidMount(){
  	// 获取方案list和模板类型list
    this.props.dispatch(asyncGetProgramAndTemplateType(sessionStorage.getItem("currentJudge")));
  }
  handleClick = e => {

    let selectedKeys = [];
    selectedKeys.push("0");
    this.setState({selectedKeys});
    const programId = e.key.split('-')[0];
    const templateTypeId = e.key.split('-')[1];
    // 设置当前方案及模板类型id，获取模板
  	sessionStorage.setItem("currentProgramId", programId);
  	sessionStorage.setItem("currentTemplateTypeId", templateTypeId);
  	// 获取模板type
  	let mbType = "-1";
  	if(this.props.appraisal.programAndTemplateType.length > 0){
  		this.props.appraisal.programAndTemplateType.forEach((program) => {
  			if(program && program.MBLXS.length > 0) {
  				program.MBLXS.forEach((item) => {
  					if(item.MBLXID === templateTypeId){
  						mbType = item.MBTYPE;
  					}
  				});
  			}
  		});
  	}
  	if(mbType !== "-1"){
  		sessionStorage.setItem("currentMbType", mbType);
  	    this.props.dispatch(serCurrentMbType(mbType));
  	}
    this.props.dispatch(setCurrentProgramId(programId));
    this.props.dispatch(setCurrentTemplateTypeId(templateTypeId));
    this.props.dispatch(asyncGetTemplateAndObject(sessionStorage.getItem("currentJudge"), programId, templateTypeId));
  };
  render() {
    return (
      <div className="main-menu">
          <Menu
        	onClick={this.handleClick}
            style={{ 'width': '100%' }}
            mode="inline"
          >
          {this.props.appraisal.programAndTemplateType ? this.props.appraisal.programAndTemplateType.map((item) => {
          	return(
          		<SubMenu
		          key={item.KHFAID}
		          title={
		            <span>
		              <Icon type="appstore" />
		              <span>{item.KHFAMC}</span>
		            </span>
		          }
		        >
		        {item.MBLXS ? item.MBLXS.map((menuItem) => {
		        	return(
		        		<Menu.Item key={item.KHFAID + '-' + menuItem.MBLXID}>{menuItem.MBLXMC}</Menu.Item>
		        	);
		        }) : null}
		        </SubMenu>
          	);
          }) : null}
        </Menu>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appraisal: state.appraisal // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(MenuPageNew)