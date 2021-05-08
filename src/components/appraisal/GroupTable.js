import React from 'react';
import { connect } from 'react-redux';
import { Table, Select, Button, Col, Row, Tooltip } from 'antd';
// import InfoModal from './InfoModal';
import { showModal, asyncGetItems, asyncGetDetail, asyncSaveScore, asyncGetUncompletedTemplate, setCurGroup, setDataSource } from '../../action/AppraisalAction';

class GroupTable extends React.Component {
  componentWillMount(){
    // let menu = 0;
    // Object.keys(this.props.appraisal.menuStatus).forEach((key) => {
    //   if(this.props.appraisal.menuStatus[key] === true){
    //     menu = key;
    //   }
    // });
    // let template = 0;
    // Object.keys(this.props.appraisal.templateStatus).forEach((key) => {
    //   if(this.props.appraisal.templateStatus[key] === true){
    //     template = key;
    //   }
    // });
    // let mblx = this.getMBLXbyId(template);
    // // 根据列名渲染控件
    // this.props.dispatch(asyncGetItems.bind(this)(this.props.appraisal.currentuser, menu, mblx, template));
    // // this.props.dispatch(asyncGetUncompletedTemplate.bind(this)(this.props.appraisal.currentuser, menu, mblx));
    // this.props.dispatch(asyncGetDetail.bind(this)(this.props.appraisal.currentuser, menu, template, template, this.props.appraisal.group));
  }

	constructor() {
  	super();
  	this.state = {
      group: '信息与科技管理处',
      isSaved: false,
      content: '',
      dataSource: [],
      res: {}
    }
	}
  componentDidMount(){
    if(this.props.appraisal.groupTitleList !== undefined && this.props.appraisal.groupTitleList !== []){
      this.setTableTitle(this.props.appraisal.groupTitleList);
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.appraisal.groupTitleList !== nextProps.appraisal.groupTitleList){
      this.setTableTitle(this.props.appraisal.groupTitleList);
    }

    // let menu = 0;
    // Object.keys(this.props.appraisal.menuStatus).forEach((key) => {
    //   if(this.props.appraisal.menuStatus[key] === true){
    //     menu = key;
    //   }
    // });
    // let template = 0;
    // Object.keys(this.props.appraisal.templateStatus).forEach((key) => {
    //   if(this.props.appraisal.templateStatus[key] === true){
    //     template = key;
    //   }
    // });
    // let mblx = this.getMBLXbyId(template);
    // 根据列名渲染控件   pwid, khfaid, khmblx, khcsid, groupSet
    // this.props.dispatch(asyncGetItems.bind(this)(this.props.appraisal.currentuser, menu, mblx, template));
    // this.props.dispatch(asyncGetUncompletedTemplate.bind(this)(this.props.appraisal.currentuser, menu, mblx));
    // this.props.dispatch(asyncGetDetail.bind(this)(this.props.appraisal.currentuser, menu, mblx, template, this.props.appraisal.group));

    return true;
  }
  setTableTitle(titleData){
    const tempValue = titleData;
    tempValue.forEach((item, index) => {
        item['dataIndex'] = item.EnglishName;
        item['key'] = item.EnglishName;
        item['title'] = item.KHZBMC;
        const col = index;
        if("6" === item.id){
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
    if(index.KHMBJFZID !== undefined){
      obj.children = <Select defaultValue={index.FS !== "" ? index.FS : " "} key={index.FS} style={{ 'width': 120 }} onChange={(text) => this.selectScore(text, record, index, col)}>
        {index.KHMBJFZID.split(",").map((item, iindex) => {
          return(<Select.Option key={item} value={item}>{item}</Select.Option>);
        })}
      </Select>;
    }
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
      this.setState({res: res});
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
      resTemp["khcsid"] = this.props.appraisal.curGroup;
      Object.keys(middleRes).forEach((key) => {
        let temp = {};
        temp["values"] = middleRes[key];
        temp["khzbid"] = key;
        valuesTemp.push(temp);
      });
      resTemp["values"] = valuesTemp;
      finalRes.push(resTemp);
      this.props.dispatch(asyncSaveScore(this.props.appraisal.currentuser, menu, this.getMBLXbyId(template), template, finalRes));
      this.props.dispatch(asyncGetUncompletedTemplate(this.props.appraisal.currentuser, menu, this.getMBLXbyId(template)));
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
  selectGroup = (value) => {
    this.props.dispatch(setDataSource([]));
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
  }
	render() {
    return (
  		<div className="maintable">
        <div style={{ 'marginBottom': 16 }}>
          <Select defaultValue="default" style={{ 'width': 200 }} onChange={this.selectGroup}>
            {<Select.Option value="default">请选择处室</Select.Option>}
            {Object.keys(this.props.appraisal.group).map((item, index) => {
              return(<Select.Option key={this.props.appraisal.group[item]} value={this.props.appraisal.group[item]}>{item}</Select.Option>);
            })}
          </Select>
        </div>
        {this.props.appraisal.uncompletedTemplate === undefined || this.props.appraisal.uncompletedTemplate.length === 0 ? null : 
          <Tooltip className="tips">
            <span>以下条目还未打分，请评委打分：</span>
            <ul>
            {this.props.appraisal.uncompletedTemplate.map((item,index) => {
              return(
                <li key={index + "uncompleted"}>{item.KHCSMC}</li>
                );
            })}
            </ul>
          </Tooltip>
        }
        <div>
          {this.props.appraisal.curGroup !== undefined && this.state.column !== undefined ? <div>
            <Table dataSource={this.props.appraisal.dataSource} rowKey="groupTable" columns={this.state.column} pagination={false} size={"middle"}/> 
            <Button type="primary" size="large" onClick={this.submitTable}>提交打分表</Button>
          </div> : null}
          {/*<InfoModal content={this.state.content}/>*/}
        </div>
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

export default connect(mapStateToProps)(GroupTable)