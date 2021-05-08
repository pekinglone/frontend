import {Table, Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import {setMatchProcess, bindDepProgram} from '../../action/ConfigAction';

class SelectDep extends React.Component {
  constructor() {
      super();
      this.state = {
        depList: [],
        allDepTitle: [],
        selectedDep:{}
      };
  }
  componentDidMount(){
    let dataTemp = this.props.config.allDepTitle;
    this.setState({allDepTitle: dataTemp});
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.config.depList !== this.props.config.depList){
      this.setState({depList: nextProps.config.depList});
      return true;
    }
  }
  submitDepObject = () => {
      this.props.dispatch(bindDepProgram(this.state.selectedDep));
      this.props.dispatch(setMatchProcess(1));
  }
  rowRadioSelection={
    type:'radio',
    columnTitle:"选择",
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({selectedDep: selectedRows[0]});
    }
  }
  render() {
    return(
      <div style={{marginTop:'3%'}}>
        <Table columns={this.state.allDepTitle} rowKey={record => record.DEPID} dataSource={this.props.config.depList} rowSelection={this.rowRadioSelection} pagination={true}/>
        {Object.keys(this.state.selectedDep).length > 0 ?
          <Button onClick={this.submitDepObject} type="primary" size="large" style={{marginLeft:'1.5%', width: '200px'}}>提交</Button> : null}
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(SelectDep)          
