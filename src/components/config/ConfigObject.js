import {Radio} from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import ConfigKHDX from './ConfigKHDX';
import ConfigDep from './ConfigDep';
import InfoModal from '../appraisal/InfoModal.js';
class ConfigObject extends React.Component {
  // componentWillMount(){
  //   this.props.dispatch(asyncGetAllDeps());
  // }
  constructor() {
      super();
      this.state = {
        object: 0,
      };
  }

  onChange = (e) => {
    this.setState({object: e.target.value});
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
        
        {this.state.object === 1 ?<ConfigDep /> 
        : this.state.object === 2 ? <ConfigKHDX /> : null}
        <InfoModal content={this.state.content}/>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(ConfigObject)          