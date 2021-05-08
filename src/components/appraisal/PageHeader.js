import React from 'react';
import { connect } from 'react-redux';
import { PageHeader, Avatar } from 'antd';

class HeaderPage extends React.Component {
	render() {
    	return (
    		<PageHeader
			    style={{
			      border: '1px solid rgb(235, 237, 240)',
			    }}
			    title="油田部干部考核管理系统"
			    extra={[
			    	<Avatar key="user" size="large" icon="user" />,
			    	<span key="username" style={{'fontSize': '18px'}}>{this.props.appraisal.currentuser}</span> 
			    ]}
			  />
    	);
	}
}
function mapStateToProps(state) {
  return {
    appraisal: state.appraisal // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(HeaderPage)