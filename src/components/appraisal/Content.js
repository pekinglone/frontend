import React from 'react';
import { connect } from 'react-redux';
import { Menu, Br, Select } from 'antd';
import GroupTable from './GroupTable';
import PersonTable from './PersonTable';
import PersonKpiTable from './PersonKpiTable';
import { setTemplateType, asyncGetProject, setTemplateTypeStatus, asyncGetUncompletedTemplate, asyncPersonGetDetail, setDataSource } from '../../action/AppraisalAction';

class ContentPage extends React.Component {
	constructor() {
    	super();
      this.state = {
        selectedKeys: ["0"]
      };
	}
  componentDidMount(){
    if(this.props.appraisal.templateStatus){
      Object.keys(this.props.appraisal.templateStatus).forEach((key) => {
        if(this.props.appraisal.templateStatus[key] === true){
          let temp = [];
          temp.push(key);
          this.setState({selectedKeys: temp});
        }
      });
    }    
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.appraisal.templateStatus){
      Object.keys(nextProps.appraisal.templateStatus).forEach((key) => {
        if(nextProps.appraisal.templateStatus[key] === true){
          let temp = [];
          temp.push(key);
          this.setState({selectedKeys: temp});
        }
      });
    }
    return true;
  }
	selectContainer = (e) => {
    let res = {};
    Object.keys(this.props.appraisal.templateStatus).forEach((key) => {
      if(key === e.key){
        res[key] = true;
      } else {
        res[key] = false;
      }
    });
    let menu = 0;
    Object.keys(this.props.appraisal.menuStatus).forEach((key) => {
      if(this.props.appraisal.menuStatus[key] === true){
        menu = key;
      }
    });
    const mblx = this.getMBLXbyId(e.key);
    this.props.dispatch(asyncGetUncompletedTemplate(this.props.appraisal.currentuser, menu, mblx));
    // if(mblx === "2" || mblx === "5"){
    //   this.props.dispatch(asyncPersonGetDetail(this.props.appraisal.currentuser, menu, mblx, e.key));
    // } else if((mblx === "1"){//pwid, khfaid, khmblx, khcsid, groupSet
    //   this.props.dispatch(asyncGetDetail());
    // } else if((mblx === "3"){
    //   this.props.dispatch(asyncPeopleKpiDetail());
    // }
    this.props.dispatch(setTemplateTypeStatus(res));
    this.props.dispatch(setTemplateType(mblx));
    let temp = [];
    temp.push(e.key);
    this.setState({selectedKeys: temp});
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
        <Menu key="module" mode="horizontal" selectedKeys={this.state.selectedKeys} style={{'width': '100%'}}>
        {this.props.appraisal.templateList.map((item)=> {
          return(
            <Menu.Item key={item.KHMBID + ""} onClick={this.selectContainer}>{item.MBLXMC}</Menu.Item>);
          })}
          </Menu>
	    		
        </div>
        <TemplateList />
      </div>
  	);
	}
}
function mapStateToProps(state) {
  return {
    appraisal: state.appraisal
  }
}

export default connect(mapStateToProps)(ContentPage)