import {Tag, Table, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import './Config.css';
import {asyncGetTemplate, setMatchProcess, bindTemplate, bindTemplateType} from '../../action/ConfigAction';

class BindTemplate extends React.Component {
  componentWillMount(){
   this.props.dispatch(asyncGetTemplate(this.props.config.programbind.KHFAID, this.props.config.bindTemplateList.MBLXID));
  }
  constructor(){
      super();
      this.state = {
        selectedtemplate:[],
        templatelist:[],
      };
  }
  componentDidMount(){
     let dataTemp = this.props.config.templatelist;
     this.setState({templatelist: dataTemp});
  }

  submitTemplate = () => {
    this.props.dispatch(bindTemplate(this.state.selectedtemplate));
    this.props.dispatch(setMatchProcess(4));
  }
  rowRadioSelection={
          type:'radio',
          columnTitle:"选择",
          onChange: (selectedRowKeys, selectedRows) => {
            this.setState({selectedtemplate: selectedRows[0]});
  }
}
  back = () => {
    this.props.dispatch(bindTemplate([]));
    this.props.dispatch(bindTemplateType([]));
    this.props.dispatch(setMatchProcess(2));
  }
  render(){
    return(
      <div>
        {Object.keys(this.props.config.depbindprogram).length > 0 ? <Tag key={"DEP" + this.props.config.depbindprogram.DEPID}>{this.props.config.depbindprogram.DEPNAME}</Tag>:<Tag key={"USER" + this.props.config.objectbindprogram.USERID}>{this.props.config.objectbindprogram.USERNAME}</Tag>}
        <Tag key={"KHFAMC" + this.props.config.programbind.KHFAID}>{this.props.config.programbind.KHFAMC}</Tag>
        <Tag key={"MBLXMC" + this.props.config.bindTemplateList.MBLXID}>{this.props.config.bindTemplateList.MBLXMC}</Tag>
        <Table dataSource={this.props.config.templatelist} rowKey={record => record.KHMBID} columns={this.props.config.templatelistTitle} rowSelection={this.rowRadioSelection} pagination={true}/>
        {Object.keys(this.state.selectedtemplate).length > 0 ?
          <Button onClick={this.submitTemplate} type="primary" size="large" style={{marginLeft:'1.5%', width: '200px'}}>提交</Button> : null}
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

export default connect(mapStateToProps)(BindTemplate)