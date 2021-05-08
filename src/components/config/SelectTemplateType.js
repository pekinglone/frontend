import {Tag, Table, Button, Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import './Config.css';
import {asyncGetAllTemplateType, setMatchProcess, setTemplateTypeList, bindTemplateType, bindProgram} from '../../action/ConfigAction';

class SelectTemplateType extends React.Component {
  componentWillMount(){
    this.props.dispatch(asyncGetAllTemplateType(this.props.config.programbind.KHFAID));
  }
  constructor() {
      super();
      this.state = {
         tmpType:[],
         selectedTem:[],
      };
  }

componentWillReceiveProps(nextProps){
    if(nextProps.config.submatchProcess !== this.props.config.submatchProcess){
      let dataTemp = this.props.config.tmpTypeList;
      dataTemp.forEach((item) => {
        if(item.data['MBLXID'] === this.props.config.bindTemplateList.MBLXID &&  item.dataIndex === 'op'){
          item['render'] = (value, index, record) => <Icon type="check-circle" theme="twoTone" />;
        }
      });
    }
}

  rowRadioSelection={
      type:'radio',
      columnTitle:"选择",
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectedTem: selectedRows[0]});
      }
}
  submitTemplateType = () => {
    this.props.dispatch(bindTemplateType(this.state.selectedTem));
    this.props.dispatch(setMatchProcess(3));
}
  back = () => {
    this.props.dispatch(bindProgram({}));
    this.props.dispatch(bindTemplateType([]));
    this.props.dispatch(setMatchProcess(1));
  }

  render() {
    return(
      <div>
          {Object.keys(this.props.config.depbindprogram).length > 0 ? <Tag key={this.props.config.depbindprogram}>{this.props.config.depbindprogram.DEPNAME}</Tag>:<Tag key={this.props.config.objectbindprogram}>{this.props.config.objectbindprogram.USERNAME}</Tag>}
        <Tag key={this.props.config.programbind.KHFAID}>{this.props.config.programbind.KHFAMC}</Tag>
        <Table dataSource={this.props.config.tmpTypeList} rowKey={record => record.MBLXID} columns={this.props.config.tmpTypeTitle} rowSelection={this.rowRadioSelection} pagination={true}/>
        {Object.keys(this.state.selectedTem).length > 0 ?
          <Button onClick={this.submitTemplateType} type="primary" size="large" style={{marginLeft:'1.5%', width: '200px'}}>提交</Button> : null}
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

export default connect(mapStateToProps)(SelectTemplateType)