import { Steps, Popover, Radio, Tag, Select, Option, Table, Checkbox, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { showJudgeList, asyncGetAllDeps, getAllJudges, setMainProcess, setJudgeList } from '../../action/ConfigAction';
class SelectKHDX extends React.Component {
  componentWillMount(){
    if(this.props.type === "judge"){
      this.props.dispatch(asyncGetAllDeps());
      this.props.dispatch(getAllJudges());
    }
    
  }
  constructor() {
      super();
      this.state = {
        object: 0,
        userList: [],
        userListTitle: [],
        selectedUsers:{},
        selectedRowKeys: [],
        selectedRows: []
      };
  }
  componentDidMount(){
    let dataTemp = this.props.config.allUserTitle;
    this.setState({userListTitle: dataTemp});
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.config.allJudgeList !== this.props.config.allJudgeList){
      let tempData = nextProps.config.allJudgeList;
      tempData.forEach((item, index) => {
        item.key = item.USERID + "-" + item.USERNAME;
      });
      this.setState({allJudgeList: tempData});
      return true;
    }
    if(nextProps.config.alldepList !== this.props.config.alldepList){
      let tempData = this.state.userListTitle;
      let filterList = [];
      let depSet = nextProps.config.alldepList.map((item) =>{
        let temp = {};
        temp.text = item.DEPNAME;
        temp.value = item.DEPNAME;
        filterList.push(temp);
      });

      tempData.forEach((item) => {
        if(item.key === "DEPNAME"){
          item['filters'] = filterList;
          item['onFilter'] = (value, record) => record.DEPNAME === value
        }
      })
      this.setState({userListTitle: tempData});
      return true;
    }
  }
  submitUserObject = () => {
    // 被选中的人员列表： this.state.selectedUsers
    if(this.props.type === "judge"){
      let judgeUserList = [];
      this.state.selectedRowKeys.forEach((item) => {
          let temp = {};
          let data = item.split("-");
          temp.PWMC = data[1];
          temp.PWID = data[0];
          judgeUserList.push(temp);
      });
      this.props.dispatch(setJudgeList(judgeUserList));
      this.props.dispatch(showJudgeList());
    } else {

    }    
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return(
      <div style={{marginTop:'3%'}}>
        <h4>您选择的对象有：</h4>
        {this.state.selectedRowKeys.map((item, index) => {
          const name = item.split("-")[1];
          return (
            <Tag key={index}>{name}</Tag>
          );
        })}
        {this.state.selectedRowKeys.length > 0 ?
          <Button onClick={this.submitUserObject} type="primary" size="large" style={{marginLeft:'1.5%', width: '200px'}}>提交</Button> : null}
        <Table rowSelection={rowSelection} columns={this.state.userListTitle} dataSource={this.props.type === "judge" ? this.state.allJudgeList : null}/>
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