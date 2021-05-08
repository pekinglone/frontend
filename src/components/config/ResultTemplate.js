import React from 'react';
import { connect } from 'react-redux';
import './Config.css';
import {Table} from 'antd';
import {asyncGetAllDeps, asyncGetObject} from '../../action/ConfigAction';

class ResultTemplate extends React.Component{
	constructor() {
      super();
      this.state = {
        objectList: []
      }; }
	render(){
		return(
			<div>
			<Table dataSource={this.props.config.objectList} columns={this.props.config.scoreTitle} pagination={false} size={"middle"}/>
			</div>
		);
	}
}
function mapStateToProps(state) {
return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(ResultTemplate)