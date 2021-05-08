import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon, Modal } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import {asyncGetAllTemplateType, setModifyProcess, asyncModifyTemplateType, asyncGetUnbindmblx} from '../../../action/ModifyAction';
import {setMainProcess, setSubProcess, setCurrentMblxmc, setCurrentMblx, setCurrentMblxId, setCurrentFaId} from '../../../action/ConfigAction';
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
    this.props.dispatch(asyncGetAllTemplateType(sessionStorage.getItem("currentProgramId")));
  }
  constructor(){
      super();
    this.state = {
      data, 
      showModal: false,
      mbmc: '',
      editingKey: '',
      count: 0,
      showEditTable: false,
      showAdd: false,
      initData: [],
      columns: [{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
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
              <a disabled={editingKey !== ''} style={{ marginRight: 8 }} onClick={() => this.edit(record.key)}>编辑行</a>
              <a disabled={editingKey !== ''} style={{ marginRight: 8 }} onClick={() => this.handleDelete(record.key)}>删除行</a>
              <a disabled={editingKey !== ''} style={{ marginRight: 8 }} onClick={() => this.look(record, record.key)}>查看内容</a>
              <a disabled={editingKey !== ''} onClick={() => this.unbind(record.key)}>与考核方案解绑</a>
            </span>
          );
        },
      }]
    }
  }
  componentDidMount(){

    let temp = this.state.columns;
    for(let j = this.props.modify.allTemplateTypeTitle.length - 1; j >= 0; j--) {
      temp.unshift(this.props.modify.allTemplateTypeTitle[j]);
    }
    this.setState({columns: temp});
  }
  componentWillReceiveProps(nextProps){
    if(this.props.modify.templateTypeList !== nextProps.modify.templateTypeList){
      const _obj = JSON.stringify(nextProps.modify.templateTypeList);
      const initData = JSON.parse(_obj);
      nextProps.modify.templateTypeList.forEach((item) => {
        item.key = item.MBLXID;
      });
      this.setState({data: nextProps.modify.templateTypeList, initData: initData});
      return true;
    }
  }
  handleDelete = key => {
    const dataSource = [...this.state.data];
    const index = dataSource.findIndex(item => key === item.key);
    let temp = [];
    dataSource[index].XGLX = "delete";
    temp.push(dataSource[index]);
    this.props.dispatch(asyncModifyTemplateType(sessionStorage.getItem("currentProgramId"), temp));
    this.setState({ data: dataSource.filter(item => item.key !== key) });
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
        this.props.dispatch(asyncModifyTemplateType(sessionStorage.getItem("currentProgramId"), temp));
        this.setState({ data: newData, editingKey: '' });

      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit = (key) => {
    this.setState({ editingKey: key });
  };
  look = (record, id) => {
    this.props.dispatch(setCurrentMblxmc(record.MBLXMC));
    this.props.dispatch(setCurrentMblx(record.MBTYPE));
    this.props.dispatch(setCurrentMblxId(record.MBLXID));
    this.props.dispatch(setCurrentFaId(sessionStorage.getItem("currentProgramId")));
    sessionStorage.setItem("currentTemplateTypeId", id);
    this.props.dispatch(setModifyProcess(2));
  };
  unbind = key => {
    const dataSource = [...this.state.data];
    const index = dataSource.findIndex(item => key === item.key);
    let temp = [];
    dataSource[index].XGLX = "unbind";
    temp.push(dataSource[index]);
    this.props.dispatch(asyncModifyTemplateType(sessionStorage.getItem("currentProgramId"), temp));
    this.setState({ data: dataSource.filter(item => item.key !== key) });
  };
  back = () => {
    this.props.dispatch(setModifyProcess(0));
  };
  showMore = () =>{
    this.props.dispatch(asyncGetUnbindmblx());
    this.setState({showModal: true});
  };
  handleCancel = e => {
    this.setState({showModal: false});
  };
  handleOk = () => {
    console.log(this.state.selectedRows);
    let temp = this.state.selectedRows;
    temp.forEach((item) => {
      item.XGLX = 'bind';
    });
    this.props.dispatch(asyncModifyTemplateType(sessionStorage.getItem("currentProgramId"), temp));
    this.setState({showModal: false});
  };
  addNew = () => {
    this.props.dispatch(setCurrentFaId(sessionStorage.getItem("currentProgramId")));
    this.props.dispatch(setMainProcess(0));
    this.props.dispatch(setSubProcess(2));
    // const { count, data } = this.state;
    // const newData = {
    //   key: 'new' +　count,
    // };
    // this.setState({
    //   data: [...data, newData],
    //   count: count + 1,
    // });
  }
  render(){
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRows });
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
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
      <div className="editTale">
        <Button onClick={this.showMore} type="primary" style={{marginBottom: '20px'}}>绑定更多模板类型</Button>
        <Button onClick={this.addNew} type="primary" style={{marginLeft: '30px', marginBottom: '20px'}}>新增一个</Button>
        <div>
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
        <Modal
          title="消息提示"
          visible={this.state.showModal}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        >
          <Table rowSelection={rowSelection} columns={this.props.modify.allTemplateTypeTitle} dataSource={this.props.modify.unbindMblxList} />
          
        </Modal>
      </div>
    );

  }

}

const TemplateTypeList = Form.create()(EditableTable);

{/*ReactDOM.render(<EditableFormTable />, mountNode);*/}
function mapStateToProps(state) {
  return {
    modify: state.modify,
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(TemplateTypeList)