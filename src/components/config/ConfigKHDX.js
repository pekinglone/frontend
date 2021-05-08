import {Tag, Select, Option, Table, Checkbox, Button } from 'antd';
import React from 'react';
import InfoModal from '../appraisal/InfoModal';
import { connect } from 'react-redux';
import {asyncGetAllUsers, asyncConfigKHDX } from '../../action/ConfigAction';
class ConfigKHDX extends React.Component {
  componentWillMount(){
    this.props.dispatch(asyncGetAllUsers());
  }
  constructor() {
      super();
      this.state = {
        object: 0,
        userList: [],
        userListTitle: [],
        selectedUsers:{},
        selectedRowKeys: []
      };
  }
  componentDidMount(){
    let dataTemp = this.props.config.allUserTitle;
    dataTemp.forEach((item) => {
      if(item.dataIndex === 'op'){
        {item['render'] = (value, index, record) => <Checkbox key value={index.USERID} onChange={(e) => this.selectUser(e, index)}></Checkbox>}
      }
    });
    this.setState({userListTitle: dataTemp});
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.config.alluserList !== this.props.config.alluserList){
      this.setState({userList: nextProps.config.alluserList});
      return true;
    }
  }
  selectUser = (e, index) =>{
    let temp = this.state.selectedUsers;
    if(temp[index.USERID] !== undefined){
      temp[index.USERID].checked = e.target.checked;
    } else {
      let tempData = {};
      tempData['USERNAME'] = index.USERNAME;
      tempData['checked'] = e.target.checked;
      temp[index.USERID] = tempData;
    }
    this.setState({selectedUsers: temp});
  }
  submitUserObject = () => {
   let tmp=[];
   Object.keys(this.state.selectedUsers).forEach((key)=>
   {
      if(this.state.selectedUsers[key].checked==true){
          let tmpItem={};
          tmpItem.KHDXID=key;
          tmp.push(tmpItem);
      }
     
   });
   this.props.dispatch(asyncConfigKHDX(tmp));

  }
  render() {
    return(
      <div style={{marginTop:'3%'}}>
        {Object.keys(this.state.selectedUsers).map((index) => {
          if(this.state.selectedUsers[index].checked){
            return (
              <Tag key={index}>{this.state.selectedUsers[index].USERNAME}</Tag>
            );
          }
        })}
        <InfoModal />
        {Object.keys(this.state.selectedUsers).length > 0 ?
          <Button onClick={this.submitUserObject} type="primary" size="large" style={{marginLeft:'1.5%', width: '200px'}}>提交</Button> : null}
        <Table columns={this.state.userListTitle} rowKey={record => record.USERID} dataSource={this.state.userList}/>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(ConfigKHDX)          