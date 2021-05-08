import React from 'react';
import { connect } from 'react-redux';
import { Input, Row, Col, Table, Select, Button, Tooltip } from 'antd';
import InfoModal from './InfoModal';
import { showModal, asyncGetItems, asyncPersonGetDetail, asyncSaveScore, asyncGetUncompletedTemplate, setDataSource } from '../../action/AppraisalAction';

class PersonTable extends React.Component {
	constructor() {
  	super();
  	this.state = {
      group: '',
      isSaved: false,
      dataSource:[],
      res: {}
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
      
    }
    if(nextProps.appraisal.personTitleList !== this.props.appraisal.personTitleList){
      let menu = 0;
      Object.keys(nextProps.appraisal.menuStatus).forEach((key) => {
        if(this.props.appraisal.menuStatus[key] === true){
          menu = key;
        }
      });
      let template = 0;
      Object.keys(nextProps.appraisal.templateStatus).forEach((key) => {
        if(this.props.appraisal.templateStatus[key] === true){
          template = key;
        }
      });
      if(menu !== 0 && template !== 0){
        const mblx = this.getMBLXbyId(template);
        this.props.dispatch(asyncPersonGetDetail.bind(this)(this.props.appraisal.currentuser, menu, mblx, template));
      }
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
    this.setState({column: tempValue});
  }
  selectOptions = (value, index, record, col) => {
      const obj = {
        children: {}
      };
      obj.children = <Select defaultValue={index.FS[col] !== "" ? index.FS[col] : null} key={index.FS[col]} style={{ 'width': 120 }} onChange={(text) => this.selectScore(text, record, index, col)}>
        {["95", "90", "85", "80", "75"].map((item, iindex) => {
          return(<Select.Option key={col} value={item}>{item}</Select.Option>);
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
      this.props.dispatch(asyncSaveScore(this.props.appraisal.currentuser, menu, this.getMBLXbyId(template), template, result));
      this.props.dispatch(asyncGetUncompletedTemplate(this.props.appraisal.currentuser, menu, this.getMBLXbyId(template)));
      this.props.dispatch(showModal('打分成功!'));
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
  		{this.state.column !== [] || this.state.column !== undefined ? <div className="maintable">
        <Table columns={this.state.column} rowKey="personTable" dataSource={this.props.appraisal.dataSource} pagination={false} size={"middle"}/>
        <Button type="primary" size="large" onClick={this.submitTable}>提交打分表</Button>
        <InfoModal/>
		</div> : null}
    </div>
  	);
	}
  componentWillUnmount(){
    this.props.dispatch(setDataSource([]));
  }
}
function mapStateToProps(state) {
  return {
    appraisal: state.appraisal // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(PersonTable)