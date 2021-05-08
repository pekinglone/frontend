import {Table, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import {setMatchProcess, bindObjectProgram} from '../../action/ConfigAction';

class SelectKHDX extends React.Component {
  constructor() {
      super();
      this.state = {
        userList: [],
        allObjectTitle: [],
        selectedUser:{}
      };
  }
  componentDidMount(){
    let dataTemp = this.props.config.allObjectTitle;
    this.setState({allObjectTitle: dataTemp});
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.config.userList !== this.props.config.userList){
      this.setState({userList: nextProps.config.userList});
      return true;
    }
  }
  submitUserObject = () => {
    this.props.dispatch(bindObjectProgram(this.state.selectedUser));
    this.props.dispatch(setMatchProcess(1));
  }
  rowRadioSelection={
          type:'radio',
          columnTitle:"选择",
          onChange: (selectedRowKeys, selectedRows) => {
            this.setState({selectedUser: selectedRows[0]});
  }
}
  render() {
    return(
      <div style={{marginTop:'3%'}}>
        <Table columns={this.state.allObjectTitle} rowKey={record => record.USERID} dataSource={this.props.config.userList} rowSelection={this.rowRadioSelection} pagination={true}/>
        {Object.keys(this.state.selectedUser).length > 0 ?
          <Button onClick={this.submitUserObject} type="primary" size="large" style={{marginLeft:'1.5%', width: '200px'}}>提交</Button> : null}
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(SelectKHDX)          