import { Steps, Step } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import EditObject from './EditObject';
import SelectProgram from './SelectProgram';
import ListTemplateType from './ListTemplateType';
import './Config.css';

class ConfigObjectTemplate extends React.Component {
  constructor(){
      super();
      this.state = {
        
      };
  }

  render(){
  	return(
  		 	<div>
  		 		<div style={{marginBottom:'3%'}}>
  		 			<Steps current={this.props.config.matchProcess}>
      					<Steps.Step title="选择考核对象" description="请选择一个考核对象" />
      					<Steps.Step title="选择考核方案" description="请选择一个考核方案" />
      					<Steps.Step title="查看考核模板类型" description="所有考核模板类型" />
            			<Steps.Step title="选择考核模板" description="请在每项考核组中，选择一个考核模板" />
  	        			<Steps.Step title="完成" description="再坚持一下，离成功只有一步！" />
  	        			
  	        		</Steps>

  	        	</div>
  	        	<div>
  	        	
  	        		{this.props.config.matchProcess===0?<EditObject type="match"/>:null}
  	        		{this.props.config.matchProcess===1 ? <SelectProgram /> : null}
  	        		{this.props.config.matchProcess===2 ? <ListTemplateType  /> : null}
  	        		{this.props.config.matchProcess===3 ? null : null}
  	        		{this.props.config.matchProcess===4 ? null : null}
  	        	</div>




      		</div>
  		);
  	}

}

function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(ConfigObjectTemplate)