import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon, Modal } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import {asyncGetAllTemplate, setModifyProcess, asyncGetItems, asyncModifyTemplatexx} from '../../../action/ModifyAction';
import {setMainProcess, setSubProcess, setCurrentFaId, showCreateTemplate, hiddenAddTemplate, hiddenEditTemplate} from '../../../action/ConfigAction';
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
    const khfaid = sessionStorage.getItem("currentProgramId");
    const mblxid = sessionStorage.getItem("currentTemplateTypeId");
    this.props.dispatch(asyncGetAllTemplate(khfaid, mblxid));
  }
  constructor(){
      super();
      this.state = {
        count: 0,
        columns:[]
      };
  }
  componentDidMount(){
    let columnTemp = this.props.modify.allTemplateTitle;
    columnTemp[2].render = (text, record) => {
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
            <a style={{ marginRight: 12 }} onClick={() => this.look(record.key)}>查看内容</a>
            <a style={{ marginRight: 12 }} onClick={() => this.editObject(record.key)}>编辑考核对象</a>
            <a onClick={() => this.editJudge(record.key)}>编辑评委</a>
          </span>
      );
    }
    this.setState({columns: columnTemp});
  }

  componentWillReceiveProps(nextProps){
    if(this.props.modify.templateList !== nextProps.modify.templateList){
      const _obj = JSON.stringify(nextProps.modify.templateList);
      const initData = JSON.parse(_obj);
      this.setState({data: nextProps.modify.templateList, initData: initData});
      return true;
    }
  }
  edit = (key) => {
    this.setState({ editingKey: key });
  };
  delete = (key) => {
    const dataSource = [...this.state.data];
    const index = dataSource.findIndex(item => key === item.key);
    let temp = [];
    dataSource[index].XGLX = "delete";
    temp.push(dataSource[index]);
    const khfaid = sessionStorage.getItem("currentProgramId");
    const khmblx = sessionStorage.getItem("currentTemplateTypeId");
    this.props.dispatch(asyncModifyTemplatexx(khfaid, khmblx, temp));
  };
  look = (id) => {
    sessionStorage.setItem("currentTemplateId", id);
    this.props.dispatch(setModifyProcess(3));
  };
  editObject = (id) => {
    sessionStorage.setItem("currentTemplateId", id);
    this.props.dispatch(setModifyProcess(4));
  };
  editJudge = (id) => {
    sessionStorage.setItem("currentTemplateId", id);
    this.props.dispatch(setModifyProcess(5));
  };
  back = () => {
    this.props.dispatch(setModifyProcess(1));
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
        if(key[0] === 'n'){
          newData[index].XGLX = "new";
        } else {
          newData[index].XGLX = "modify";
        }
        let temp = [];
        temp.push(newData[index]);
        const khfaid = sessionStorage.getItem("currentProgramId");
        const khmblx = sessionStorage.getItem("currentTemplateTypeId");
        this.props.dispatch(asyncModifyTemplatexx(khfaid, khmblx, temp));
        this.setState({ editingKey: '' });

      } else {
        // newData.push(row);
        // this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    console.log(this.state.data);
    this.setState({ editingKey: key });
  }
  addNew = () => {
    this.props.dispatch(showCreateTemplate());
    this.props.dispatch(hiddenAddTemplate());
    this.props.dispatch(hiddenEditTemplate());
    this.props.dispatch(setMainProcess(0));
    this.props.dispatch(setSubProcess(4));
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
        <Button style={{marginBottom: '10px'}} type="primary" onClick={this.addNew}>新增一个</Button>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            pagination={true}
          />
        </EditableContext.Provider>
        <Button onClick={this.back}>返回上一级</Button>
      </div>
    );

  }

}

const TemplateList = Form.create()(EditableTable);

{/*ReactDOM.render(<EditableFormTable />, mountNode);*/}
function mapStateToProps(state) {
  return {
    modify: state.modify,
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(TemplateList)