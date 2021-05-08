import React from 'react';
import { connect } from 'react-redux';
import { Menu, Br, Select } from 'antd';
import GroupTableNew from './GroupTableNew';
import PersonTableNew from './PersonTableNew';
import PersonKpiTableNew from './PersonKpiTableNew';
import { setSelectedKeys, asyncGetUncompletedTemplate, asyncGetTemplateAndObject, asyncGetItems, asyncGetGroupTemplate, asyncPersonGetDetail } from '../../action/AppraisalNewAction';
class ContentPageNew extends React.Component {
	constructor() {
    	super();
      this.state = {
        selectedKeys: ["0"]
      };
	}
  componentDidMount(){
    const programId = sessionStorage.getItem("currentProgramId");
    const templateTypeId = sessionStorage.getItem("currentTemplateTypeId");
    if(programId !== undefined && templateTypeId !== undefined){
      this.props.dispatch(asyncGetTemplateAndObject(sessionStorage.getItem("currentJudge"), programId, templateTypeId));
    }
  }
	selectContainer = (e) => {
    const templateId = e.key;
    const pwid = sessionStorage.getItem("currentJudge");
    const programId = sessionStorage.getItem("currentProgramId");
    const templateTypeId = sessionStorage.getItem("currentTemplateTypeId");
    const mbtype = sessionStorage.getItem("currentMbType");
    sessionStorage.setItem("currentTemplateId", templateId);
    this.props.dispatch(asyncGetUncompletedTemplate(pwid, programId, templateTypeId));
    this.props.dispatch(asyncGetItems(pwid, programId, templateTypeId, templateId, mbtype));
    if(mbtype === '1'){
      let KHCSID = -1;
      this.props.appraisal.templateAndObject.map((item) => {
        if(item.KHMBID === templateId){
          KHCSID = item.KHOBJECT[0].KHCSID;
        }
      })
      this.props.dispatch(asyncGetGroupTemplate(pwid, programId, templateTypeId, KHCSID));
    }
    if(mbtype === '2'){
      this.props.dispatch(asyncPersonGetDetail(pwid, programId, templateTypeId, templateId));
    }
    if(mbtype === '3'){
      this.props.dispatch(asyncGetTemplateAndObject(pwid, programId, templateTypeId));
    }
    let selectedKeys = [];
    selectedKeys.push(e.key);
    this.props.dispatch(setSelectedKeys(selectedKeys));
	}
  getMBLXbyId(id){
    let mblx = 0;
    this.props.appraisal.templateList.forEach((item) => {
      if(item.KHMBID === (id + "")){
        mblx = item.KHMBLX;
      }
    });
    return mblx;
  }
	render() {
		return (
  		<div className="main-content" style={{'fontSize': '20px'}}>
        <div>
          <Menu key="module" mode="horizontal" onClick={this.selectContainer} selectedKeys={this.props.appraisal.selectedKeys} style={{'width': '100%'}}>
          {this.props.appraisal.templateAndObject.map((item)=> {
            return(
              <Menu.Item key={item.KHMBID + ""}>{item.KHMBMC}</Menu.Item>);
            })}
          </Menu>
        </div>
        <div>
         {sessionStorage.getItem("currentMbType") === '1' ? <GroupTableNew /> : null}
         {sessionStorage.getItem("currentMbType") === '2' ? <PersonTableNew /> : null}
         {sessionStorage.getItem("currentMbType") === '3' ? <PersonKpiTableNew /> : null}
         </div>
      </div>
  	);
	}
}
function mapStateToProps(state) {
  return {
    appraisal: state.appraisal
  }
}

export default connect(mapStateToProps)(ContentPageNew)