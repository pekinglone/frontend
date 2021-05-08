import React from 'react';
import { connect } from 'react-redux';
import ResultTemplate from './ResultTemplate';
import './Config.css';
import {Select, Option} from 'antd';
import {asyncGetAllDeps, asyncGetObject, asyncCalculateDepScore} from '../../action/ConfigAction';
class ResultShow extends React.Component{
  componentWillMount(){
    this.props.dispatch(asyncGetAllDeps([]));
    this.props.dispatch(asyncCalculateDepScore());
  }
  constructor() {
      super();
      this.state = {
      };
  }
	selectGroup = (value) => {
    this.props.dispatch(asyncGetObject(value));
  }
render(){
	return(
		<div>
  		<div className="config-container">
              <div style={{ 'marginBottom': 16 }}>
                <Select defaultValue="请选择处室" style={{ 'width': 200 }} onChange={this.selectGroup}>
                <Select.Option key="0group" value="0" label="全部处室">全部处室</Select.Option>
                {this.props.config.alldepList.map((item, index) => {
                  return (<Select.Option key={index + "group"} value={item.DEPID} label={item.DEPNAME}>{item.DEPNAME + "(" + item.DEPID + ")  "}</Select.Option>)})}
                </Select>
              <div>
              {this.props.config.objectStatus === 1 ? <ResultTemplate /> : null}
              </div>
              </div>
            </div> 
      </div>
)
}
}
function mapStateToProps(state) {
return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(ResultShow)