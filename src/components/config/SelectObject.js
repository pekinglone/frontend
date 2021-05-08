import { Radio} from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import SelectSingleKHDX from './SelectSingleKHDX';
import SelectDep from './SelectDep';
import { asyncGetAllKhcs, asyncGetAllKhdx} from '../../action/ConfigAction';
class EditObject extends React.Component {
  constructor() {
      super();
      this.state = {
        object: 0,
      };
  }
  onChange = (e) => {
    if(e.target.value === 1){
      this.props.dispatch(asyncGetAllKhcs());
    }else{
      this.props.dispatch(asyncGetAllKhdx());
    }
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
        {this.state.object === 1 ? <SelectDep />
        : this.state.object === 2 ? <SelectSingleKHDX /> : null}
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