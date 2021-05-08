import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { hiddenModal } from '../../action/AppraisalNewAction';
class InfoModal extends React.Component {
	constructor() {
		super();
	}
	handleCancel = () => {
		this.props.dispatch(hiddenModal());
	}
	render() {
  		return (
			<Modal
				title="消息提示"
				visible={this.props.appraisal.modal.visible}
				onCancel={this.handleCancel}
				footer={null}
			>
				<p>{this.props.appraisal.modal.content}</p>
			</Modal>);
	}
}
function mapStateToProps(state) {
  return {
    appraisal: state.appraisal // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(InfoModal)