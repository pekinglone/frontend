import { Tag, Table, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import './Config.css';
import {asyncGetAllPrograms, setMatchProcess, bindProgram, bindDepProgram, bindObjectProgram} from '../../action/ConfigAction';

class SelectProgram extends React.Component {
  componentWillMount(){
    this.props.dispatch(asyncGetAllPrograms());
  }
  constructor(){
      super();
      this.state = {
        allProgram:[],
        selectedUsers:{},
        selectedProgram:{},
      };
  }
  componentDidMount(){
     let dataTemp = this.props.config.programList;
     this.setState({allProgram: dataTemp});
  }

  submitProgram = () => {
    this.props.dispatch(bindProgram(this.state.selectedProgram));
    this.props.dispatch(setMatchProcess(2));
  }
  rowRadioSelection={
    type:'radio',
    columnTitle:"选择",
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({selectedProgram: selectedRows[0]});
    }
  }
  back = () => {
    this.props.dispatch(bindProgram({}));
    this.props.dispatch(bindDepProgram({}));
    this.props.dispatch(bindObjectProgram({}));
    this.props.dispatch(setMatchProcess(0));
  }
  render(){
    return(
      <div>
        {Object.keys(this.props.config.depbindprogram).length > 0 ? <Tag key={this.props.config.depbindprogram}>{this.props.config.depbindprogram.DEPNAME}</Tag>:<Tag key={this.props.config.objectbindprogram}>{this.props.config.objectbindprogram.USERNAME}</Tag>}
        <Table dataSource={this.props.config.programList} rowKey={record => record.KHFAID} columns={this.props.config.allProgramTitle} rowSelection={this.rowRadioSelection} pagination={true}/>
        {Object.keys(this.state.selectedProgram).length > 0 ?
          <Button onClick={this.submitProgram} type="primary" size="large" style={{marginLeft:'1.5%', width: '200px'}}>提交</Button> : null}
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

export default connect(mapStateToProps)(SelectProgram)