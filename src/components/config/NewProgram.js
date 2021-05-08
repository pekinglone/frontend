import { Input, Icon,Button } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import './Config.css';
import {showModal} from '../../action/AppraisalAction.js';
import {asyncSaveFaxx} from '../../action/ConfigAction.js';
import InfoModal from '../appraisal/InfoModal.js';

class NewProgram extends React.Component {
  componentWillMount(){
    let temp=this.state.faxx;
    let faxxindex=Object.keys(this.state.faxx).length;
    temp[faxxindex]='';
    this.setState({faxx:temp});
  }
  constructor(){
    super();
    this.state = {
      //number:1,
      faxx:{},
      isComplete:false,
      content:''
    };
  }
  plus = () => {
    let temp=this.state.faxx;
    let newIndex=Object.keys(this.state.faxx).length;
    temp[newIndex]='';
    this.setState({faxx:temp});
  }
  minus = (index) => {
    let temp=this.state.faxx;
    delete temp[index];
    let tempObject = {};
    Object.keys(temp).forEach((item, index) => {
      tempObject[index] = temp[item];
    });
    this.setState({faxx:tempObject});
  }
  bindFaxx=(text,index)=>{
    let info=this.state.faxx;
    info[index]=text;
    this.setState({faxx:info});
  }
  submitTable=()=>{
    let flag=true
    Object.keys(this.state.faxx).forEach((key) => {
        if(this.state.faxx[key] === ""){
            this.props.dispatch(showModal('有未填写项，请重新核对!'));
            flag=false;
        }        
    })
    if(flag){
      let req=Object.values(this.state.faxx).join(",");
      this.props.dispatch(asyncSaveFaxx(req));
    }
  }
  render() {
    return (
      <div>
          {Object.keys(this.state.faxx).map( (index) => {
            return (
            <span key={"span" + index}><br/><Input className="inputGroup" addonBefore="方案名称：" style={{ width: '40%' }} key={"input"+index} value={this.state.faxx[index]} onChange={(e) => this.bindFaxx(e.target.value, index)}/>
            <Icon className="inputGroup" key={"del"+index} type="minus" onClick={() => {this.minus(index)}} ></Icon> 
            </span> )
          } )
        }
        <Icon className="inputGroup" type="plus" onClick={this.plus}/>
        <InfoModal content={this.state.content}/>
        <br/><Button className="submit" type="primary" size="large" style={{marginTop: '20px'}} onClick={this.submitTable}>提&nbsp;&nbsp;交</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(NewProgram)