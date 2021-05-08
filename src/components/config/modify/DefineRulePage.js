import { Select, Tooltip, Table, Input, InputNumber, Popconfirm, Form, Button, Icon, Modal } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import {asyncGetGradeStandard, asyncGetGradeRatio, asyncAddGradeRatio, asyncModifyGradeRatio} from '../../../action/ModifyAction';
const data = [];
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    return <Input />;
  };
  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      key,
      title,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}
class EditableTable extends React.Component {
  componentWillMount(){
    this.props.dispatch(asyncGetGradeStandard());
    this.props.dispatch(asyncGetGradeRatio());
  }
  constructor(){
      super();
      this.state = {
        count: 0,
        columns:[],
        data: [],
        levels: {}
      };
  }
  componentDidMount(){
    let columnTemp = this.props.modify.ruleTitle;
    console.log(columnTemp[1]);
    console.log(columnTemp[2]);
    columnTemp[1].render = (value, index, record) => this.showLevel(value, index, record);
    columnTemp[2].render = (value, index, record) => this.showStrategy(value, index, record);
    columnTemp[4].render = (text, record) => {
      const { editingKey } = this.state;
      const editable = this.isEditing(record);
      return editable ? (
        <span>
          <EditableContext.Consumer>
            {form => (
              <a onClick={() => this.save(form, record.key)} style={{ marginRight: 8 }} >保存</a>
            )}
          </EditableContext.Consumer>
            <a onClick={() => this.cancel(record.key)}>退出</a>
        </span>
      ) : (
        <span>
            <Icon style={{ marginRight: 12 }} onClick={() => this.edit(record.key)} type="edit" />
            <a style={{ marginRight: 12 }} onClick={() => this.delete(record.key)} >删除</a>
          </span>
      );
    }
    this.setState({columns: columnTemp, data: this.props.modify.ruleData});
  }

  componentWillReceiveProps(nextProps){
    if(this.props.modify.ruleData !== nextProps.modify.ruleData){
    	if(nextProps.modify.ruleData != undefined){
    		const _obj = JSON.stringify(nextProps.modify.ruleData);
	        const initData = JSON.parse(_obj);
	        this.setState({data: nextProps.modify.ruleData, initData: initData});
    	}
    }
    if(this.props.modify.levelData !== nextProps.modify.levelData){
      if(nextProps.modify.levelData != undefined){
        let _obj = JSON.stringify(nextProps.modify.levelData);
        _obj = JSON.parse(_obj);
        let temp = {};
        _obj.forEach((item) => {
          temp[item.DCBZMC] = item.DCBZID;
        });
        this.setState({levels: temp});
      }
    }
  }
  showLevel = (value, index, record) => {
      const obj = {
        children: {}
      };
      obj.children = <Select defaultValue={index.DCBZMC !== "" ? index.DCBZMC : null} key={index.DCBZMC} style={{ 'width': 120 }} onChange={(text) => this.selectLevel(text, record, index)}>
        {Object.keys(this.state.levels).map((item, iindex) => {
          return(<Select.Option key={this.state.levels[iindex]} value={item}>{item}</Select.Option>);
        })}
      </Select>;
      return obj;
  };
  showStrategy = (value, index, record) => {
      const obj = {
        children: {}
      };
      obj.children = <Select defaultValue={index.STRATEGY !== "" ? this.props.modify.strategy[index.STRATEGY] : null} key={index.STRATEGY} style={{ 'width': 120 }} onChange={(text) => this.selectStrategy(text, record, index)}>
        {Object.values(this.props.modify.strategy).map((item, iindex) => {
          return(<Select.Option key={item} value={item}>{item}</Select.Option>);
        })}
      </Select>;
      return obj;

  }
  selectLevel = (text, record, index) => {
    let temp = this.state.data;
    temp[record].XGLX = "modify";
    temp[record].DCBZMC = text;
    this.props.modify.levelData.forEach((item) => {
      if(item.DCBZMC === text){
        temp[record].DCBZID = item.DCBZID;
      }
    });
    this.setState({data: temp});
  }
  selectStrategy = (text, record, index) => {
    let temp = this.state.data;
    temp[record].XGLX = "modify";
    Object.keys(this.props.modify.strategy).forEach((item) => {
      if(this.props.modify.strategy[item] === text){
        temp[record].STRATEGY = item;
      }
    })
    this.setState({data: temp});
  }
  edit = (key) => {
    this.setState({ editingKey: key });
  };
  delete = (key) => {
    const dataSource = [...this.state.data];
    const index = dataSource.findIndex(item => key === item.key);
    console.log(dataSource[index]);
    if(index > -1 &&　dataSource[index].JFXZID != undefined){
    	let temp = [];
    	temp.push(dataSource[index]);
    	temp[0].XGLX = "delete";
    	if(temp[0].PERCENTAGE != undefined) temp[0].PERCENTAGE = parseFloat(temp[0].PERCENTAGE);
    	this.props.dispatch(asyncModifyGradeRatio(temp));
    } else {
    	this.setState({ data: dataSource.filter(item => item.key !== key) });
    }
    
  };
  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        newData[index].PERCENTAGE = parseFloat(newData[index].PERCENTAGE);
        newData[index].XGLX = "modify";
        this.setState({ data: newData, editingKey: '' });
      } else {
      	row.PERCENTAGE = parseFloat(row.PERCENTAGE);
        row.XGLX = "modify";
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }
  handleAdd = () => {
    const { count, data } = this.state;
    console.log(data);    
    const newData = {
      key: 'new' +　count,
    };
    this.setState({
      data: [...data, newData],
      count: count + 1,
    });
  };
  submit = () => {
    let newItem = [];
    let modifyItem = [];
    this.state.data.forEach((item) => {
      if(item.JFZID === undefined){
        item.JFZID = "1";
        this.props.modify.levelData.forEach((iitem) => {
          if(iitem.DCBZMC === item.DCBZMC){
            item.DCBZID = iitem.DCBZID;
          }
        });
        newItem.push(item);
      } else{
        if(item.XGLX !== undefined){
          modifyItem.push(item);
        }
      }
    });
    if(modifyItem.length > 0){
      this.props.dispatch(asyncModifyGradeRatio(modifyItem));
    }
    if(newItem.length > 0){
      this.props.dispatch(asyncAddGradeRatio(newItem));
    }
    
  }
  render(){
    const components = {
      body: {
        cell: EditableCell,
      }
    };
    let columns = [];
    if(this.state.columns !== undefined){
      columns = this.state.columns.map(col => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            dataIndex: col.dataIndex,
            key: record.key,
            title: col.title,
            editing: this.isEditing(record),
          }),
        };
      });
      columns['width'] = '20%';
    }
    return(
      <div>
        <Button style={{marginBottom: '10px'}} type="primary" onClick={this.handleAdd}>新增一个</Button>
        <br />
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            pagination={true}
          />
        </EditableContext.Provider>
        <Button style={{marginTop: '10px'}} type="primary" onClick={this.submit}>提交</Button>
      </div>
    );

  }

}

const DefineRulePage = Form.create()(EditableTable);

{/*ReactDOM.render(<EditableFormTable />, mountNode);*/}
function mapStateToProps(state) {
  return {
    modify: state.modify // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(DefineRulePage)