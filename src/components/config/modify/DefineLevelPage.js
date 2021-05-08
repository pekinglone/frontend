import { Tooltip, Table, Input, InputNumber, Popconfirm, Form, Button, Icon, Modal } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import {asyncGetGradeStandard, asyncAddGradeStandard, asyncModifyGradeStandard} from '../../../action/ModifyAction';
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
  }
  constructor(){
      super();
      this.state = {
        count: 0,
        columns:[],
        data: []
      };
  }
  componentDidMount(){
    let columnTemp = this.props.modify.levelTitle;
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
    this.setState({columns: columnTemp, data: this.props.modify.levelData});
  }

  componentWillReceiveProps(nextProps){
    if(this.props.modify.levelData !== nextProps.modify.levelData){
    	if(nextProps.modify.levelData != undefined){
    		const _obj = JSON.stringify(nextProps.modify.levelData);
	        const initData = JSON.parse(_obj);
	        this.setState({data: nextProps.modify.levelData, initData: initData});
    	}
    }
  }
  edit = (key) => {
    this.setState({ editingKey: key });
  };
  delete = (key) => {
    const dataSource = [...this.state.data];
    const index = dataSource.findIndex(item => key === item.key);
    if(index > -1 &&　dataSource[index].DCBZID != undefined){
    	let temp = [];
    	temp.push(dataSource[index]);
    	temp[0].XGLX = "delete";
    	if(temp[0].MAXGRADE != undefined) temp[0].MAXGRADE = parseInt(temp[0].MAXGRADE);
    	if(temp[0].MINGRADE != undefined) temp[0].MINGRADE = parseInt(temp[0].MINGRADE);
    	this.props.dispatch(asyncModifyGradeStandard(temp));
    } else {
    	this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
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
        if(newData[index].DCBZID == undefined){
        	let temp = [];
        	temp.push(newData[index]);
	    	if(temp[0].MAXGRADE != undefined) temp[0].MAXGRADE = parseInt(temp[0].MAXGRADE);
	    	if(temp[0].MINGRADE != undefined) temp[0].MINGRADE = parseInt(temp[0].MINGRADE);
        	this.props.dispatch(asyncAddGradeStandard(temp));
        } else {
        	let temp = [];
        	temp.push(newData[index]);
        	temp[0].XGLX = "modify";
	    	if(temp[0].MAXGRADE != undefined) temp[0].MAXGRADE = parseInt(temp[0].MAXGRADE);
	    	if(temp[0].MINGRADE != undefined) temp[0].MINGRADE = parseInt(temp[0].MINGRADE);
        	this.props.dispatch(asyncModifyGradeStandard(temp));	
        }
        this.setState({ data: newData, editingKey: '' });
      } else {
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
        <Tooltip className="tips">
            <span>最大分值和最小分值都是包含关系</span>
        </Tooltip>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            pagination={true}
          />
        </EditableContext.Provider>
      </div>
    );

  }

}

const DefineLevelPage = Form.create()(EditableTable);

{/*ReactDOM.render(<EditableFormTable />, mountNode);*/}
function mapStateToProps(state) {
  return {
    modify: state.modify // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(DefineLevelPage)