import { Input, Select, Tooltip, Button, Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { setSubProcess, setTemplateType, asyncAddTemplateType } from '../../action/ConfigAction';
import SelectTemplate from './SelectTemplate';
import InfoModal from '../appraisal/InfoModal';
// const InputGroup = Input.Group;
class EditTemplateType extends React.Component {
  componentWillMount(){
    let temp=this.state.res;
    let mbxxindex=Object.keys(this.state.res).length;
    temp[mbxxindex]={};
    this.setState({res:temp});
  }
  constructor() {
      super();
      this.state = {
        mblx: "",
        count: 2,
        res:{},
        mbname: {
          "1": "模板一",
          "2": "模板二",
          "3": "模板三"
        }
        // mbxx: {}
      };
  }
  selectGroup = (value, e) => {
    const item = value.split("-")[2];
    const mblx = value.split("-")[1];
    let tempRes = this.state.res;
    if(tempRes[item] !== undefined){
      tempRes[item].mblx = mblx;
    } else {
      let temp = {};
      temp.mblx = mblx;
      tempRes[item] = temp;
    }
    this.setState({res: tempRes});
  }
  setTemplateName = (e, item) => {
    let tempRes = this.state.res;
    if(tempRes[item] !== undefined){
      tempRes[item].mblxmc = e.target.value;
    } else {
      let temp = {};
      temp.mblxmc = e.target.value;
      tempRes[item] = temp;
    }
    this.setState({res: tempRes});
  }
  setTemplateWeight = (e, item) => {
    let tempRes = this.state.res;
    if(tempRes[item] !== undefined){
      tempRes[item].mblxmcqz = e.target.value;
    } else {
      let temp = {};
      temp.mblxmcqz = e.target.value;
      tempRes[item] = temp;
    }
    this.setState({res: tempRes});
  }
  minus = (index) => {
    let temp=this.state.res;
    delete temp[index];
    let tempObject = {};
    Object.keys(temp).forEach((item, index) => {
      tempObject[index] = temp[item];
    });
    this.setState({res:tempObject});
  }
  addTemplate = () => {
    let temp=this.state.res;
    let newIndex=Object.keys(this.state.res).length;
    temp[newIndex]={};
    this.setState({res:temp});
  }
  submit = () => {
    let flag = true, weightSum = 0;
    Object.keys(this.state.res).forEach((key) => {
      if(this.state.res[key].mblx === undefined ||　this.state.res[key].mblxmc === undefined ||　this.state.res[key].mblxmcqz === undefined){
        flag = false;
      } else {
        // if(parseFloat(this.state.res[key].mblxmcqz) >= 0 && parseFloat(this.state.res[key].mblxmcqz) <= 1){
          weightSum = weightSum +　(this.state.res[key].mblxmcqz === undefined ? 0 : parseFloat(this.state.res[key].mblxmcqz));
        // } else {
          // alert(this.state.res[key].mblxmc + "的权重填写有误，请仔细检查！");
          // return;
        // }
      }
    });
    if(flag){
      // if(weightSum === 1){
        // 异步提交
        const faid = this.props.faid;
        let result = [];
        Object.keys(this.state.res).forEach((item) => {
          let temp = {};
          temp.MBLXMC = this.state.res[item].mblxmc;
          temp.MBLXQZ = this.state.res[item].mblxmcqz;
          temp.MBTYPE = this.state.res[item].mblx;
          temp.MBLXJFZID = "1";
          result.push(temp);
        });
        this.props.dispatch(asyncAddTemplateType(faid, result));
      // } else {
      //   alert("权重总和不为1，请调整权重");
      //}
    } else {
      alert("有信息为空，请核对模板类型是否选择，名称是否填写，权重是否设置");
    }
  }
  render() {
    let array = [];
    for(let i = 0; i < this.state.count; ++i){
      array.push(i);
    }
    return(
      <div>
        <SelectTemplate />
        <Button onClick={this.addTemplate}>添加一个模板类型</Button>
        {Object.keys(this.state.res).map((item) =>{
          const mblx = this.state.res[item].mblx;
          return(
            <div style={{marginTop: '1%'}}>
              <Input.Group compact>
                <Select key={"select" + item} style={{ width: '20%' }} key={this.state.mbname[mblx]} defaultValue={this.state.res[item].mblx === undefined ? "请选择模板类型" : this.state.mbname[mblx]} onChange={(value, e) => {this.selectGroup(value, e)}}>
                  <Select.Option key={"select-1-" + item} value={"select-1-" + item}>模板一</Select.Option>
                  <Select.Option key={"select-2-" + item} value={"select-2-" + item}>模板二</Select.Option>
                  <Select.Option key={"select-3-" + item} value={"select-3-" + item}>模板三</Select.Option>
                </Select>
                <Input style={{ width: '50%' }} placeholder="模板类型名称" value={this.state.res[item].mblxmc} onChange={(e) => this.setTemplateName(e, item)}/>
                <Input addonBefore="权重：" style={{ width: '20%' }} value={this.state.res[item].mblxmcqz} placeholder="权重值，小于1，如0.5" onChange={(e) => this.setTemplateWeight(e, item)} />
                <Icon key={"del"+item} type="minus" onClick={() => {this.minus(item)}} ></Icon>
              </Input.Group>
            </div>
          );
        })}
        <div>
        </div>
        <InfoModal/>
       {/* <Tooltip className="tips">
        {this.state.mblx === "1" ? <span><br />您选择的是模板一，该模板适用于对部门打分，<b>考核部门工作的具体情况</b>，不适用于个人！不适用于个人！！不适用于个人！！！</span> : null}
        {this.state.mblx === "2" ? <span><br />您选择的是模板二，该模板适用于对个人的工作内容进行打分，<b>考核个人工作内容的完成情况</b></span> : null}
        {this.state.mblx === "3" ? <span><br />您选择的是模板二，该模板适用于对<b>个人的综合素质</b>进行打分</span> : null}     
        </Tooltip>*/}
        <br />
        <Button type="primary" size="large" style={{marginTop:'1.5%', width: '200px'}} onClick={this.submit}>我想好了，提交不悔改！！</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(EditTemplateType) 