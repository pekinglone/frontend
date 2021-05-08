import React from 'react';
import { connect } from 'react-redux';
import { Table, Select, Button, Col, Row, Tooltip } from 'antd';
import notFoundImage from '../../img/404.png';
import InfoModal from './InfoModal';
import { asyncGetCurrentStatus, asyncPeopleKpiDetail, setDataSource, asyncGetUncompletedTemplate, asyncSaveScore, showModal, asyncGetTemplateAndObject, asyncGetItems } from '../../action/AppraisalNewAction';// setPeopleKpiDetail, asyncPeopleKpiDetail, asyncGetPersonList, showModal, asyncGetItems, asyncGetDetail,asyncSaveScore, asyncGetUncompletedTemplate, setCurGroup
import { asyncGetGradeStandard } from '../../action/ModifyAction';
class PersonKpiTableNew extends React.Component {
  componentWillMount(){
    const pwid = sessionStorage.getItem("currentJudge");
    const programId = sessionStorage.getItem("currentProgramId");
    const templateTypeId = sessionStorage.getItem("currentTemplateTypeId");
    const templateId = sessionStorage.getItem("currentTemplateId");
    this.props.dispatch(asyncGetUncompletedTemplate(pwid, programId, templateTypeId));
    this.props.dispatch(asyncGetTemplateAndObject(pwid, programId, templateTypeId));
    this.props.dispatch(asyncGetGradeStandard());
    this.props.dispatch(asyncGetCurrentStatus(pwid, programId, templateId, templateTypeId));
  }

	constructor() {
  	super();
  	this.state = {
      content: '',
      dataSource: [],
      res: {},
      curPeople: '',
      curPeopleKey: '',
      column: [],
      sumScore: 0
    }
	}
  componentDidMount(){
    // 根据列名渲染控件
    // const pwid = sessionStorage.getItem("currentJudge");
    // const programId = sessionStorage.getItem("currentProgramId");
    // const templateTypeId = sessionStorage.getItem("currentTemplateTypeId");
    // const mbtype = sessionStorage.getItem("currentMbType");
    // const templateId = sessionStorage.getItem("currentTemplateId");
    // this.props.dispatch(asyncGetItems(pwid, programId, templateTypeId, templateId, mbtype));
    if(this.props.appraisal.kpiTitleList !== undefined && this.props.appraisal.kpiTitleList !== []){
      this.setTableTitle(this.props.appraisal.kpiTitleList);
    }
  }
  componentWillReceiveProps(nextProps){
    this.setTableTitle(nextProps.appraisal.kpiTitleList);
    if(this.props.appraisal.dataSource !== nextProps.appraisal.dataSource){
      let sumScore = 0;
      nextProps.appraisal.dataSource.map((item) => {
        sumScore = sumScore + (item.FS === "" ? 0 : parseFloat(item.FS) * parseFloat(item.KHZBQZ));
      });
      this.setState({sumScore: sumScore});
    }
    return true;
  }
  setTableTitle(titleData){
    const tempValue = titleData;
    tempValue.forEach((item, index) => {
      item['dataIndex'] = item.EnglishName;
      item['key'] = item.EnglishName;
      item['title'] = item.KHZBMC;
      const col = index;
      if("dropDown" === item.type){
        item['dataIndex'] = "KHMBJFZID";
        item['key'] = "KHMBJFZID";
        item['render'] = (value, index, record) => this.selectOptions(value, index, record, col);
      }
    });
    this.setState({column: tempValue});
  }
  selectOptions = (value, index, record, col) => {
    const obj = {
      children: {}
    };
    obj.children = <Select key={index.FS} defaultValue={index.FS !== "" ? index.FS + "" : ""} style={{ 'width': 120 }} onChange={(text) => this.selectScore(text, record, index, col)}>
    {["95", "90", "85", "80", "75"].map((item, iindex) => {
      return(<Select.Option key={item} value={item}>{item}</Select.Option>);
    })}
    </Select>;
    return obj;
  }
  /**
   *@Param value: 得分值，如：80，4
   *@Param record: 表格行数，以0开始
   *@Param _index: 传入的行数据
   *@Param col: 列数，以0开始
   */
  selectScore = (value, record, _index, col) => {
    if(this.props.appraisal.dataSource !== undefined){
      let res = this.state.res;
      const data = this.props.appraisal.dataSource;
      let item_index = 0;
      let dataIndex = '';
      this.state.column.forEach((item, index) => {
        if(index === col){
          dataIndex = item.dataIndex;
        }
      });
      res[_index.KHZBID] = value;
      let sumScore = 0;
      data.map((item) => {
        sumScore = sumScore + (this.state.res[item.KHZBID] ?  this.state.res[item.KHZBID] * parseFloat(item.KHZBQZ) : (item.FS === "" ? 0 : parseFloat(item.FS)) * parseFloat(item.KHZBQZ));
      });
      this.setState({res: res, sumScore: sumScore});
    }
    
  }
  submitTable = () => {
    let flag = true;
    let middleRes = {};
    let finalRes = [];
    let resTemp = {};
    this.props.appraisal.dataSource.forEach((item) => {
      if(item.FS !== undefined && item.FS !== ""){
        flag = false;
        middleRes[item.KHZBID] = item.FS;
      }
    });
    if(flag){
      if(Object.keys(this.state.res).length === this.props.appraisal.dataSource.length){
        Object.keys(this.state.res).forEach((key) => {
          middleRes[key] = this.state.res[key];
        });
        flag = true;
      } else {
        flag = false;
        this.props.dispatch(showModal('有未打分选项，请重新核对后打分!'));
      }
    } else {
      Object.keys(this.state.res).forEach((key) => {
        middleRes[key] = this.state.res[key];
      });
      flag = true;
    }
    if(flag){
      let levelid = -1;
      let levelname = "";
      let MINGRADE = 0;
      let MAXGRADE = 0;
      let could = true;
      if(this.props.modify.levelData !== undefined &&　this.props.appraisal.currentLevelStatus !== undefined && this.props.appraisal.currentLevelStatus.length > 0){
        this.props.modify.levelData.forEach((item) => {
          if(this.state.sumScore >= item.MINGRADE && this.state.sumScore <= item.MAXGRADE){
            levelname = item.DCBZMC;
            levelid = item.DCBZID;
            MINGRADE = item.MINGRADE;
            MAXGRADE = item.MAXGRADE;
          }
        });
        if(levelid !== -1){
          this.props.appraisal.currentLevelStatus.forEach((item) => {
            if(item.DCBZID === levelid && item.jfxzrs <= item.curNum){
              could = false;
              this.props.dispatch(showModal('在当前打分项目中，您已经给' +
                item.curNum + '人打了' + levelname + '，我们认为的' + levelname + '的范围的最小值是' + 
                MINGRADE + '，最大值是' + MAXGRADE + '请您修改当前打分或修改之前的打分之后再来该页面打分，感谢配合！'));
              return;
            }
          })
        }
      }
      if(could){
        const pwid = sessionStorage.getItem("currentJudge");
        const programId = sessionStorage.getItem("currentProgramId");
        const templateTypeId = sessionStorage.getItem("currentTemplateTypeId");
        const templateId = sessionStorage.getItem("currentTemplateId");
        let valuesTemp = [];
        resTemp["khdxid"] = sessionStorage.getItem("currentObjectId");//this.state.curPeopleKey;
        Object.keys(middleRes).forEach((key) => {
          let temp = {};
          temp["values"] = middleRes[key];
          temp["khzbid"] = key;
          valuesTemp.push(temp);
        });
        resTemp["values"] = valuesTemp;
        finalRes.push(resTemp);
        this.props.dispatch(asyncSaveScore(pwid, programId, templateTypeId, templateId, finalRes));
        this.props.dispatch(asyncGetUncompletedTemplate(pwid, programId, templateTypeId));
        this.props.dispatch(showModal('打分成功!'));
        this.setState({res: {}});
      }
    }
  }
  selectObject = (e) => {
    sessionStorage.setItem("currentObjectId", e);
    const pwid = sessionStorage.getItem("currentJudge");
    const programId = sessionStorage.getItem("currentProgramId");
    const templateTypeId = sessionStorage.getItem("currentTemplateTypeId");
    const templateId = sessionStorage.getItem("currentTemplateId");
    this.props.dispatch(asyncPeopleKpiDetail(pwid, programId, templateTypeId, templateId, e));
  }
	render() {
    let templateIndex = -1;
    this.props.appraisal.templateAndObject.map((item, index) => {
      if(item.KHMBID === sessionStorage.getItem("currentTemplateId")) {
        templateIndex = index;
      }
    });
    return (
  		<div className="maintable">
        {templateIndex !== -1 ? 
          <Select defaultValue="default" key="defaulte" style={{ 'width': '20%' }} onChange={this.selectObject}>
            <Select.Option key="default" value="default">请选择考核对象</Select.Option>
            {this.props.appraisal.templateAndObject[templateIndex].KHOBJECT.map((item) => {
              return(<Select.Option key={item.KHDXID} value={item.KHDXID}>{item.KHDXMC}</Select.Option>);
            })}
          </Select>
         : null}
        <br />
        {this.props.appraisal.uncompletedTemplate !== undefined && this.props.appraisal.uncompletedTemplate.length > 0 && this.props.appraisal.uncompletedTemplate[0].KHDXMC !== undefined ? 
          <Tooltip className="tips">
            <span>以下条目还未打分，请评委打分：</span>
            <ul>
            {this.props.appraisal.uncompletedTemplate.map((item,index) => {
              return(<li key={index + "uncompleted"}>{item.KHDXMC}</li>);
            })}
            </ul>
          </Tooltip> : null}
          {this.props.appraisal.dataSource && this.props.appraisal.dataSource.length > 0　&& this.state.column　&& this.state.column.length > 0 ? <div>
            <span>当前得分为：{this.state.sumScore}</span>
            <Table dataSource={this.props.appraisal.dataSource} rowKey={record => record.KHZBID} columns={this.state.column} pagination={false} size={"middle"}/> 
            <Button type="primary" size="large" onClick={this.submitTable}>提交打分表</Button>
          </div>　:　null}
          <InfoModal content={this.state.content}/>
  		</div>
  	);
	}
  componentWillUnmount(){
    this.props.dispatch(setDataSource([]));
  }
}
function mapStateToProps(state) {
  return {
    appraisal: state.appraisal, // gives our component access to state through props.toDoApp,
    modify: state.modify
  }
}

export default connect(mapStateToProps)(PersonKpiTableNew)