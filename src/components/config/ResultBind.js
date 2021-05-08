import {Table, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import './Config.css';
import {setMatchProcess, setResult, setSubMatch, asyncSaveConfigCS, asyncSaveConfigDX, bindTemplate} from '../../action/ConfigAction';

class ResultBind extends React.Component {
  componentWillMount(){
  }
  constructor(){
      super();
      this.state = {
        tempbind:{},
      };
  }
  componentDidMount(){
  	let khdxmctemp = 0;
  	let khdxidtemp = 0;
  	if(Object.keys(this.props.config.depbindprogram).length > 0){
  		khdxmctemp = this.props.config.depbindprogram.DEPNAME;
  	    khdxidtemp = this.props.config.depbindprogram.DEPID;
  	}else{
		khdxmctemp = this.props.config.objectbindprogram.USERNAME;
		khdxidtemp = this.props.config.objectbindprogram.USERID;
  	}
    let khfaidtemp = this.props.config.programbind.KHFAID;
    let khfamctemp = this.props.config.programbind.KHFAMC;
    let khmblxidtemp = this.props.config.bindTemplateList.MBLXID;
    let khmblxmctemp = this.props.config.bindTemplateList.MBLXMC;
    let khmbidtemp = this.props.config.templatebind.KHMBID;
    let khmbmctemp = this.props.config.templatebind.KHMBMC;
    let resTemp = {};
    resTemp['KHDXMC'] = khdxmctemp;
    resTemp['KHDXID'] = khdxidtemp;
    resTemp['KHFAID'] = khfaidtemp;
    resTemp['KHFAMC'] = khfamctemp;
    resTemp['KHMBLXMC'] = khmblxmctemp;
    resTemp['KHMBLXID'] = khmblxidtemp;
    resTemp['KHMBID'] = khmbidtemp;
    resTemp['KHMBMC'] = khmbmctemp;
    this.setState({tempbind: resTemp});
    this.props.dispatch(setResult(this.props.config.templatebind.KHMBID, resTemp));
  }

  submitresult = () => {
  	if (Object.keys(this.props.config.depbindprogram).length > 0) {
  		this.props.dispatch(asyncSaveConfigCS(this.props.config.depbindprogram.DEPID, Object.values(this.props.config.finalbind)));
  	}else{
  		this.props.dispatch(asyncSaveConfigDX(this.props.config.objectbindprogram.USERID, Object.values(this.props.config.finalbind)));
  	}
  }

  edit = () => {
    this.props.dispatch(setMatchProcess(2));
    this.props.dispatch(setSubMatch(this.props.config.submatchProcess + 1));
  }
  back = () => {
    this.props.dispatch(bindTemplate([]));
    this.props.dispatch(setMatchProcess(3));
  }

  render(){
    return(
      <div>
        <Table dataSource={Object.values(this.props.config.finalbind)} columns={this.props.config.resultTitle} pagination={false}/>
        {Object.keys(this.props.config.finalbind).length > 0 ? 
        	Object.keys(this.props.config.finalbind).length == Object.keys(this.props.config.tmpTypeList).length ? 
        		<Button onClick={this.submitresult} type="primary" size="large" style={{marginLeft:'1.5%', width: '200px'}}>提交</Button> 
        		: <Button onClick={this.edit} type="primary" size="large" style={{marginLeft:'1.5%', width: '200px'}}>继续选择模板类型</Button>
        	:null
        }
        <Button onClick={this.back} size="large" style={{marginLeft:'1.5%', width: '200px'}}>返回上一级</Button>
      </div>
    );

  }

}

function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(ResultBind)