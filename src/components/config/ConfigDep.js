import {Tag, Select, Option, Table, Checkbox, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { asyncGetAllDeps, asyncConfigCS } from '../../action/ConfigAction';
class ConfigDep extends React.Component {
  componentWillMount(){
    this.props.dispatch(asyncGetAllDeps());
  }
  constructor() {
      super();
      this.state = {
        object: 0,
        depList: [],
        depListTitle: [],
        selectedDeps:{},
        selectedRowKeys: []
      };
  }
  componentDidMount(){
    let dataTemp = this.props.config.allCSTitle;
    dataTemp.forEach((item) => {
      if(item.dataIndex === 'op'){
        {item['render'] = (value, index, record) => <Checkbox key value={index.DEPID} onChange={(e) => this.selectDep(e, index)}></Checkbox>}
      }
    });
    this.setState({depListTitle: dataTemp});
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.config.alldepList !== this.props.config.alldepList){
      this.setState({depList: nextProps.config.alldepList});
      return true;
    }
  }
  selectDep = (e, index) =>{
    let temp = this.state.selectedDeps;
    if(temp[index.DEPID] !== undefined){
      temp[index.DEPID].checked = e.target.checked;
    } else {
      let tempData = {};
      tempData['DEPNAME'] = index.DEPNAME;
      tempData['checked'] = e.target.checked;
      temp[index.DEPID] = tempData;
    }
    this.setState({selectedDeps: temp});
  }
  submitCSObject = () => {
   let tmp=[];
   Object.keys(this.state.selectedDeps).forEach((key)=>
    {
      if(this.state.selectedDeps[key].checked==true){
        let tmpItem={};
        tmpItem.KHCSID=key;
        tmp.push(tmpItem);
      }
    }
    );
   this.props.dispatch(asyncConfigCS(tmp));
  }
  render() {
    return(
      <div style={{marginTop:'3%'}}>
        {Object.keys(this.state.selectedDeps).map((index) => {
          if(this.state.selectedDeps[index].checked){
            return (
              <Tag key={index}>{this.state.selectedDeps[index].DEPNAME}</Tag>
            );
          }
        })}
        {Object.keys(this.state.selectedDeps).length > 0 ?
          <Button onClick={this.submitCSObject} type="primary" size="large" style={{marginLeft:'1.5%', width: '200px'}}>提交</Button> : null}
        <Table columns={this.state.depListTitle} rowKey={record => record.DEPID} dataSource={this.state.depList}/>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(ConfigDep)          