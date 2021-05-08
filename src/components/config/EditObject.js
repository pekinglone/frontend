import { Steps, Popover, Radio, Tag, Select, Option, Table, Checkbox, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import SelectKHDX from './SelectKHDX';
import { asyncGetAllDeps, asyncGetAllUsers, setMainProcess, setMatchProcess } from '../../action/ConfigAction';
class EditObject extends React.Component {
  componentWillMount(){
    this.props.dispatch(asyncGetAllDeps());
  }
  constructor() {
      super();
      this.state = {
        object: 0,
        depList: [],
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
    if(nextProps.config.userList !== this.props.config.userList){
      this.setState({userList: nextProps.config.userList});
      return true;
    }
    if(nextProps.config.depList !== this.props.config.depList){
      let tempData = [];
      nextProps.config.depList.map((item) => {
        let temp = {};
        temp['text'] = item.DEPNAME;
        temp['value'] = item.DEPNAME;
        tempData.push(temp);
      });
      let dataTemp = this.props.config.allUserTitle;
      dataTemp.forEach((item) => {
        if(item.dataIndex === 'op'){
          item['render'] = (value, index, record) => <Checkbox key={index.USERID} value={index.USERID} onChange={(e) => this.selectUser(e, index)}></Checkbox>
        } else if(item.dataIndex === 'DEPNAME'){
          item['filters'] = tempData;
          item['onFilter'] = (value, record) => record.DEPNAME === value;
        }
      });
      this.setState({userListTitle: dataTemp});
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
  onChange = (e) => {
    if(e.target.value === 1){
      this.props.dispatch(asyncGetAllDeps());
    }
    this.setState({object: e.target.value});
  }
  handleChange = (value) => {
    this.setState({depList: value});
  }
  submitCSObject = () => {
    // 被选中的处室列表： this.state.depList
    this.props.dispatch(setMatchProcess(0));
    this.props.dispatch(setMainProcess(2));
  }
  submitUserObject = () => {
    // 被选中的人员列表： this.state.selectedUsers
    this.props.dispatch(setMatchProcess(0));
    this.props.dispatch(setMainProcess(2));
  }
  render() {
    return(
      <div style={{marginTop:'3%'}}>
        <h4>您要考核的对象是：</h4>
        <br />
        <Radio.Group onChange={this.onChange}>
          <Radio value={1}>处室</Radio>
          <Radio value={2}>个人</Radio>
        </Radio.Group>
        
        {this.state.object === 1 ?
          <div>
          <Select
          mode="tags"
          size="default"
          placeholder="Please select"
          onChange={this.handleChange}
          style={{ width: '100%', marginTop:'3%' }}
        >
        {this.props.config.depList ? this.props.config.depList.map((item, index) => {
          return (<Select.Option key={index + "group"} value={item.DEPID} label={item.DEPNAME}>{item.DEPNAME + "(" + item.DEPID + ")  "}</Select.Option>)}): null}
        </Select>
        <Button onClick={this.submitCSObject} type="primary" size="large" style={{float: 'right', marginTop:'3%', width: '200px'}}>提交</Button>
        </div>
        : this.state.object === 2 ? <SelectKHDX /> : null}
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(EditObject)          