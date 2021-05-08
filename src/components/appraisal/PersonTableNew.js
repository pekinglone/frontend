import React from 'react';
import { connect } from 'react-redux';
import { Input, Row, Col, Table, Select, Button, Tooltip } from 'antd';
import notFoundImage from '../../img/404.png';
import InfoModal from './InfoModal';
import { asyncGetCurrentStatus, setDataSource, asyncGetUncompletedTemplate, asyncSaveScore, showModal, asyncPersonGetDetail, asyncGetItems, asyncGetTemplateAndObject } from '../../action/AppraisalNewAction';
// import { showModal, asyncGetItems, asyncPersonGetDetail, asyncSaveScore, asyncGetUncompletedTemplate, setDataSource } from '../../action/AppraisalAction';
import { asyncGetGradeStandard } from '../../action/ModifyAction';
class PersonTableNew extends React.Component {
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
      dataSource:[],
      res: {},
      sumScore: 0
    }
	}
  componentDidMount(){
    if(this.props.appraisal.personTitleList !== undefined && this.props.appraisal.personTitleList !== []){
      this.setTableTitle(this.props.appraisal.personTitleList);
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.appraisal.dataSource !== this.props.appraisal.dataSource){
      if(nextProps.appraisal.personTitleList !== undefined && nextProps.appraisal.personTitleList !== []){
        this.setTableTitle(nextProps.appraisal.personTitleList);
      }
      let dataSource = [];
      nextProps.appraisal.dataSource.forEach((item) => {
        let score = 0;
        Object.keys(item.FS).forEach((zb) => {
          score = score +　(item.FS[zb] === "" ? 0 : item.FS[zb]) * item.KHZBQZ[zb]
        });
        item.predictedScore = score;
        dataSource.push(item);
      });
      this.setState({dataSource});
    }


    return true;
  }
  setTableTitle(titleData){
    const tempValue = titleData;
    tempValue.forEach((item, index) => {
      item['dataIndex'] = item.KHZBID;
      item['key'] = item.KHZBID;
      item['title'] = item.KHZBMC;
      item['KHZBID'] = item.KHZBID;
      const col = index;
      if("dropDown" === item.type){
        item['render'] = (value, index, record) => this.selectOptions(value, index, record, col);
      } else {
        item['dataIndex'] = "KHDXMC";
        item['key'] = "KHDXMC";
      }
    });
    tempValue.push({ dataIndex: 'predictedScore', key: 'predictedScore', title: '总分' });
    this.setState({column: tempValue});
  }
  selectOptions = (value, index, record, col) => {
    const FSIndex = Object.keys(index.FS);
    const fs = FSIndex[col - 1];
      const obj = {
        children: {}
      };
      obj.children = <Select defaultValue={index.FS[fs] !== "" ? index.FS[fs] : null} key={index.FS[fs]} style={{ 'width': 120 }} onChange={(text) => this.selectScore(text, record, index, col)}>
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
  selectScore = (value, record, _index, col, item) => {
    if(this.props.appraisal.dataSource !== undefined){
      let res = this.state.res;
      let item_index = 0;
      let dataIndex = '';
      const zbid = this.state.column[col].KHZBID;
      let resTemp = res[_index.KHDXID];
      if(resTemp === undefined){
        let temp = {};
        temp[zbid] = value;
        res[_index.KHDXID] = temp;
      } else{
        resTemp[zbid]= value;
        res[_index.KHDXID] = resTemp;
      }
      this.setState({res: res});
      let dataSource = [];
      this.props.appraisal.dataSource.forEach((item) => {
        let score = 0;
        if(item.KHDXID === _index.KHDXID){
          Object.keys(item.FS).forEach((zb) => {
            if(zbid == zb){
              score = score +　(parseFloat(value) * parseFloat(item.KHZBQZ[zb]));
              item.FS[zb] = value;
              console.log(value + " " + item.KHZBQZ[zb] + " " + zb);
            } else {
              score = score +　(item.FS[zb] === "" ? 0 : parseFloat(item.FS[zb])) * parseFloat(item.KHZBQZ[zb]);
              console.log(item.FS[zb] + " " + item.KHZBQZ[zb] + " " + zb);
            }
          });
          item.predictedScore = score;
        }
        dataSource.push(item);
      });
      this.setState({dataSource});
    }
  }
  submitTable = () => {
    let flag = true;
    let middleRes = {};
    let result = [];
    this.props.appraisal.dataSource.forEach((item) => {
      Object.keys(item.FS).forEach((key) => {
        if(item.FS[key] !== ""){
          flag = false;
          if(middleRes[item.KHDXID] === undefined || middleRes[item.KHDXID] === {}){
            let middleResValue = {};
            middleResValue[key] = item.FS[key];
            middleRes[item.KHDXID] = middleResValue;
          } else {
            let middleResValue = middleRes[item.KHDXID];
            middleResValue[key] = item.FS[key];
            middleRes[item.KHDXID] = middleResValue;
          }
        }
      });
    });
    if(flag){

      let datalen = this.props.appraisal.dataSource.length;
      let columnLen = this.state.column.length - 1;
      let num = 0;
      Object.keys(this.state.res).forEach((id) => {
        num = num + Object.keys(this.state.res[id]).length;
      });
      if(num === datalen*columnLen){
        Object.keys(this.state.res).forEach((id) => {
          Object.keys(this.state.res[id]).forEach((key) => {
            if(middleRes[id] !== undefined && middleRes[id] !== {}){
              let resultTemp = middleRes[id];
              const midTemp = this.state.res[id];
              resultTemp[key] = midTemp[key];
              middleRes[id] = resultTemp;
            } else {
              let resultTemp = {};
              const midTemp = this.state.res[id];
              resultTemp[key] = midTemp[key];
              middleRes[id] = resultTemp;
            }
          });
        });
      } else {
        flag = false;
        this.props.dispatch(showModal('有未打分选项，请重新核对后打分!'));
      }
    } else {
      Object.keys(this.state.res).forEach((id) => {
        Object.keys(this.state.res[id]).forEach((key) => {
          if(middleRes[id] !== undefined && middleRes[id] !== {}){
            let resultTemp = middleRes[id];
            const midTemp = this.state.res[id];
            resultTemp[key] = midTemp[key];
            middleRes[id] = resultTemp;
          } else {
            let resultTemp = {};
            const midTemp = this.state.res[id];
            resultTemp[key] = midTemp[key];
            middleRes[id] = resultTemp;
          }
        });
      });
      flag = true;
    }
    if(flag){
      console.log(this.props.appraisal.dataSource);
      let collection = {};
      
      // let levelid = -1;
      // let levelname = "";
      // let MINGRADE = 0;
      // let MAXGRADE = 0;
      let could = true;
      // let store = {};
      if(this.props.modify.levelData !== undefined &&　this.props.appraisal.currentLevelStatus !== undefined && this.props.appraisal.currentLevelStatus.length > 0){
        this.props.appraisal.dataSource.forEach((score) => {
          this.props.modify.levelData.forEach((item) => {
            if(score.predictedScore >= item.MINGRADE && score.predictedScore <= item.MAXGRADE){
              if(collection[item.DCBZID] == undefined){
                collection[item.DCBZID] = 1;
              } else {
                collection[item.DCBZID] = 1 + collection[item.DCBZID];
              }
            }
          });
        });
        this.props.appraisal.currentLevelStatus.forEach((item) => {
          if(collection[item.DCBZID] === null || item.jfxzrs < collection[item.DCBZID]){
            could = false;
            this.props.modify.levelData.forEach((level) => {
              if(level.DCBZID === item.DCBZID){
                this.props.dispatch(showModal('在当前打分项目中，您给' +
                collection[item.DCBZID] + '人打了' + item.DCBZMC + '，我们认为的' + item.DCBZMC + '的范围的最小值是' + 
                level.MINGRADE + '，最大值是' + level.MAXGRADE + ', 按照规则，您只能给' + item.jfxzrs + '人打' + item.DCBZMC + ', 请您修改当前打分或修改之前的打分之后再来该页面打分，感谢配合！'));
              return;
              }
            });
            
          }
        });
      }
      if(could){
        Object.keys(middleRes).forEach((id) => {
          let zblist = [];
          let resTemp = middleRes[id];
          Object.keys(resTemp).forEach((key) => {
            let zbTemp = {};
            zbTemp["khzbid"] = key;
            zbTemp["values"] = resTemp[key];
            zblist.push(zbTemp);
          });
          let resultTemp = {};
          resultTemp["khdxid"] = id;
          resultTemp["values"] = zblist;
          result.push(resultTemp);
        });
        const pwid = sessionStorage.getItem("currentJudge");
        const programId = sessionStorage.getItem("currentProgramId");
        const templateTypeId = sessionStorage.getItem("currentTemplateTypeId");
        const templateId = sessionStorage.getItem("currentTemplateId");
        this.props.dispatch(asyncSaveScore(pwid, programId, templateTypeId, templateId, result));
        this.props.dispatch(asyncGetUncompletedTemplate(pwid, programId, templateTypeId));
        this.props.dispatch(showModal('打分成功!'));
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
  	return (
      <div>
      {this.props.appraisal.uncompletedTemplate !== undefined && this.props.appraisal.uncompletedTemplate.length > 0 && this.props.appraisal.uncompletedTemplate[0].KHDXMC !== undefined ?  
          <Tooltip className="tips">
            <span>以下条目还未打分，请评委打分：</span>
            <ul>
            {this.props.appraisal.uncompletedTemplate.map((item,index) => {
              return(
                <li key={index + "uncompleted"}>{item.KHDXMC}</li>
                );
            })}
            </ul>
          </Tooltip> : null}
        {this.props.appraisal.dataSource && this.props.appraisal.dataSource.length > 0　&& this.state.column　&& this.state.column.length > 0 ? <div>
        <Table columns={this.state.column} rowKey={record => record.KHDXID} dataSource={this.props.appraisal.dataSource} pagination={false} size={"middle"}/>
        <Button type="primary" size="large" onClick={this.submitTable}>提交打分表</Button>
        </div>　:　null}
        <InfoModal/>
    </div>
  	);
	}
  componentWillUnmount(){
    this.props.dispatch(setDataSource([]));
  }
}
function mapStateToProps(state) {
  return {
    appraisal: state.appraisal, // gives our component access to state through props.toDoApp
    modify: state.modify
  }
}

export default connect(mapStateToProps)(PersonTableNew)