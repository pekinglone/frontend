import React from 'react';
import { connect } from 'react-redux';
import { Table, Select, Button, Col, Row, Tooltip } from 'antd';
import InfoModal from './InfoModal';
import { setPeopleKpiDetail, asyncPeopleKpiDetail, asyncGetPersonList, showModal, asyncGetItems, asyncGetDetail,asyncSaveScore, asyncGetUncompletedTemplate, setCurGroup } from '../../action/AppraisalAction';

class PersonKpiTableNew extends React.Component {
  componentWillMount(){
    let menu = 0;
    Object.keys(this.props.appraisal.menuStatus).forEach((key) => {
      if(this.props.appraisal.menuStatus[key] === true){
        menu = key;
      }
    });
    let templateType = 0;
    Object.keys(this.props.appraisal.templateStatus).forEach((key) => {
      if(this.props.appraisal.templateStatus[key] === true){
        templateType = key;
      }
    });
    this.props.dispatch(asyncGetTemplate(this.props.appraisal.currentuser, menu, templateType));
  }

	constructor() {
  	super();
  	this.state = {
      content: '',
      dataSource: [],
      res: {},
      curPeople: '',
      curPeopleKey: ''
    }
	}
  componentDidMount(){
    // 根据列名渲染控件
    if(this.props.appraisal.kpiTitleList !== undefined && this.props.appraisal.kpiTitleList !== []){
      this.setTableTitle(this.props.appraisal.kpiTitleList);
      // tempValue.forEach((item, index) => {
      //   item['dataIndex'] = item.EnglishName;
      //   item['key'] = item.EnglishName;
      //   item['title'] = item.KHZBMC;
      //   const col = index;
      //   if("dropDown" === item.type){
      //       item['dataIndex'] = "KHMBJFZID";
      //       item['key'] = "KHMBJFZID";
      //       item['render'] = (value, index, record) => this.selectOptions(value, index, record, col);
      //     }
      // });
      // this.setState({column: tempValue});
    }
  }
  componentWillReceiveProps(nextProps){
    this.setTableTitle(nextProps.appraisal.kpiTitleList);
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
    obj.children = <Select defaultValue={index.FS !== "" ? index.FS : " "} style={{ 'width': 120 }} onChange={(text) => this.selectScore(text, record, index, col)}>
    {["95", "90", "85", "80", "75"].map((item, iindex) => {
      return(<Select.Option key={item} value={item}>{item}</Select.Option>);
    })}
    </Select>;
    return obj;
  }
  // /**
  //  *@Param value: 得分值，如：80，4
  //  *@Param record: 表格行数，以0开始
  //  *@Param _index: 传入的行数据
  //  *@Param col: 列数，以0开始
  //  */
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
      this.setState({res: res});
    }
    
  }
  submitTable = () => {
    let flag = true;
    let middleRes = {};
    let finalRes = [];
    let resTemp = {};
    this.props.appraisal.kpidetail.forEach((item) => {
      if(item.FS !== undefined && item.FS !== ""){
        flag = false;
        middleRes[item.KHZBID] = item.FS;
      }
    });
    if(flag){
      if(Object.keys(this.state.res).length === this.props.appraisal.kpidetail.length){
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
      let menu = 0;
      Object.keys(this.props.appraisal.menuStatus).forEach((key) => {
        if(this.props.appraisal.menuStatus[key] === true){
          menu = key;
        }
      });
      let template = 0;
      Object.keys(this.props.appraisal.templateStatus).forEach((key) => {
        if(this.props.appraisal.templateStatus[key] === true){
          template = key;
        }
      });
      let valuesTemp = [];
      resTemp["khdxid"] = this.state.curPeopleKey;
      Object.keys(middleRes).forEach((key) => {
        let temp = {};
        temp["values"] = middleRes[key];
        temp["khzbid"] = key;
        valuesTemp.push(temp);
      });
      resTemp["values"] = valuesTemp;
      finalRes.push(resTemp);
      this.props.dispatch(asyncSaveScore(this.props.appraisal.currentuser, menu, this.getMBLXbyId(template), template, finalRes));
      this.props.dispatch(showModal('打分成功!'));
      this.setState({res: {}});
    }
  }
  getMBLXbyId(id){
    let mblx = 0;
    this.props.appraisal.templateList.forEach((item) => {
      if(item.KHMBID === (id + "")){
        mblx = item.KHMBLX;
      }
    });
    return mblx;
  }
  selectGroup = (value, key) => {
    let menu = 0;
    Object.keys(this.props.appraisal.menuStatus).forEach((key) => {
      if(this.props.appraisal.menuStatus[key] === true){
        menu = key;
      }
    });
    let template = 0;
    Object.keys(this.props.appraisal.templateStatus).forEach((key) => {
      if(this.props.appraisal.templateStatus[key] === true){
        template = key;
      }
    });
    let mblx = 0;
    this.props.appraisal.templateList.forEach((item) => {
      if(item.KHMBID === (template + "")){
        mblx = item.KHMBLX;
      }
    });
    this.props.dispatch(asyncPeopleKpiDetail.bind(this)(this.props.appraisal.currentuser, menu, mblx, template, value));
    this.setState({curPeople: value, curPeopleKey: key.key});
  }
	render() {
    return (
  		<div className="maintable">
        <Select defaultValue="default" style={{ 'width': 200 }} onChange={this.selectGroup}>
          {<Select.Option value="default">请选择人员</Select.Option>}
          {this.props.appraisal.peoplegroup.map((item, index) => {
            return(<Select.Option key={item.KHDXID} value={item.KHDXID}>{item.KHDXMC}</Select.Option>);
          })}
        </Select>
        <br />
        {this.props.appraisal.uncompletedTemplate === undefined || this.props.appraisal.uncompletedTemplate.length === 0 ? null : 
          <Tooltip className="tips">
            <span>以下条目还未打分，请评委打分：</span>
            <ul>
            {this.props.appraisal.uncompletedTemplate.map((item,index) => {
              return(
                <li key={index + "uncompleted"}>{item.KHDXMC}</li>
                );
            })}
            </ul>
          </Tooltip>
        }
        <div>
          {this.state.column !== undefined && this.state.curPeople ? <div>
            <Table dataSource={this.props.appraisal.kpidetail} rowKey="groupTable" columns={this.state.column} pagination={false} size={"middle"}/> 
            <Button type="primary" size="large" onClick={this.submitTable}>提交打分表</Button>
          </div> : null}
          <InfoModal content={this.state.content}/>
        </div>
  		</div>
  	);
	}
  componentWillUnmount(){
    this.props.dispatch(setPeopleKpiDetail([]));
  }
}
function mapStateToProps(state) {
  return {
    appraisal: state.appraisal // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(PersonKpiTableNew)