import React from 'react';
import { connect } from 'react-redux';
import { Table, Select, Button, Col, Row, Tooltip } from 'antd';
import notFoundImage from '../../img/404.png';
import InfoModal from './InfoModal';
import { asyncGetCurrentStatus, setDataSource, asyncGetUncompletedTemplate, asyncSaveScore, showModal, asyncGetTemplateAndObject, asyncGetItems, asyncGetGroupTemplate } from '../../action/AppraisalNewAction';// asyncSaveScore, asyncGetUncompletedTemplate, setCurGroup, 
import { asyncGetGradeStandard } from '../../action/ModifyAction';
class GroupTableNew extends React.Component {
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
      group: '',
      isSaved: false,
      content: '',
      dataSource: [],
      res: {},
      sumScore: 0
    }
	}
  componentDidMount(){
    if(this.props.appraisal.groupTitleList !== undefined && this.props.appraisal.groupTitleList !== []){
      this.setTableTitle(this.props.appraisal.groupTitleList);
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.appraisal.groupTitleList !== nextProps.appraisal.groupTitleList){
      this.setTableTitle(nextProps.appraisal.groupTitleList);
    }
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
        if("处室名称" === item.KHZBMC){
            item['key'] = "group";
            item['dataIndex'] = "group";
          }
      });
      this.setState({column: tempValue});
  }
  /**
   *@Param value: 得分值，如：80，4
   *@Param record: 表格行数，以0开始
   *@Param _index: 传入的行数据
   *@Param col: 列数，以0开始
   */
  selectOptions = (value, index, record, col) => {
    const obj = {
      children: {}
    };
  	obj.children = <Select defaultValue={index.FS !== "" ? index.FS : " "} key={index.FS} style={{ 'width': 120 }} onChange={(text) => this.selectScore(text, record, index, col)}>
  	    {["95", "90", "85", "80", "75"].map((item, iindex) => {
  	      return(<Select.Option key={item} value={item}>{item}</Select.Option>);
  	    })}
  	</Select>;
    return obj;
  }
  combineColumn = (text, row, index) => {
    const obj = {
      props: {},
    };
    if (index === 0) {
      obj.props.rowSpan = 4;
    } else {
      obj.props.rowSpan = 0;
    }
    return obj;
  }
  /**
   *@Param value: 得分值，如：80，4
   *@Param record: 表格行数，以0开始
   *@Param _index: 传入的行数据
   *@Param col: 列数，以0开始
   */
   // 待完善
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
                MINGRADE + '，最大值是' + MAXGRADE + ', 按照规则，您只能给' + item.jfxzrs + '人打' + levelname + ', 请您修改当前打分或修改之前的打分之后再来该页面打分，感谢配合！'));
              
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
        let KHCSID = -1;
        this.props.appraisal.templateAndObject.map((item) => {
          if(item.KHMBID === templateId){
            KHCSID = item.KHOBJECT[0].KHCSID;
          }
        });
        resTemp["khcsid"] = KHCSID;
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
  getMBLXbyId(id){
    let mblx = 0;
    this.props.appraisal.templateList.forEach((item) => {
      if(item.KHMBID === (id + "")){
        mblx = item.KHMBLX;
      }
    });
    return mblx;
  }
	render() {
    const currentTemplateId = sessionStorage.getItem("currentTemplateId");
    let KHCSMC = "";
  	this.props.appraisal.templateAndObject.map((item) => {
      console.log(item);
  		if(item.KHMBID === currentTemplateId){
  		  	KHCSMC = item.KHOBJECT[0].KHCSMC;
          sessionStorage.setItem("currentObjectId", item.KHOBJECT[0].KHCSID);
  		}
  	});
    return (
  		<div className="maintable">
  		  {this.props.appraisal.dataSource && this.props.appraisal.dataSource.length > 0　&& this.state.column　&& this.state.column.length > 0 ? <span>您正在打分的部门是： {KHCSMC}</span> : null }
        <br />
        {this.props.appraisal.uncompletedTemplate !== undefined && this.props.appraisal.uncompletedTemplate.length > 0 && this.props.appraisal.uncompletedTemplate[0].KHCSMC !== undefined ? <Tooltip className="tips">
            <span>以下处室还未打分，请评委打分：</span>
            <ul>
            {this.props.appraisal.uncompletedTemplate.map((item,index) => {
              return(
                <li key={index + "uncompleted"}>{item.KHCSMC}</li>
                );
            })}
            </ul>
          </Tooltip> : null}
        {this.props.appraisal.dataSource && this.props.appraisal.dataSource.length > 0　&& this.state.column　&& this.state.column.length > 0 ? <div>
            <span>当前得分为：{this.state.sumScore}</span>
            <Table dataSource={this.props.appraisal.dataSource} rowKey="groupTable" columns={this.state.column} pagination={false} size={"middle"}/> 
            <Button type="primary" size="large" onClick={this.submitTable}>提交打分表</Button>
          </div>　:　null}
        <InfoModal content={this.state.content}/>
      {/*<div style={{'textAlign': 'center'}}><img alt="notFound" src={notFoundImage} /><br /><span>拜托拜托，点点上面的标签选择您要打分的项目，(；′⌒`)</span></div>*/}
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

export default connect(mapStateToProps)(GroupTableNew)