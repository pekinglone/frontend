import {Table, Input, InputNumber, Popconfirm, Form, Button, Icon, Modal } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import {setModifyProcess, getJudgesByJudgeTeamId, asyncModifyJudges, asyncGetObjects, asyncModifyObjects} from '../../../action/ModifyAction';
import {asyncGetAllUsers, asyncGetAllDeps} from '../../../action/ConfigAction';
// import ShowJudge from './ShowJudge';
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
class EditObject extends React.Component {
  componentWillMount(){
    const khfaid = sessionStorage.getItem("currentProgramId");
    const khmbid = sessionStorage.getItem("currentTemplateId");
    const mblxid = sessionStorage.getItem("currentTemplateTypeId");
    this.props.dispatch(asyncGetObjects(khfaid, mblxid, khmbid));
  }
  constructor(){
      super();
      this.state = {
        data:[], 
        editingKey: '',
        columns:[{
          title: '对象名称',
          dataIndex: 'KHDXMC',
          key: 'KHDXMC'
        },{
          title: '对象ID',
          dataIndex: 'KHDXID',
          key: 'KHDXID',
        },{
          title: '删除',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, record) => {
            return(<span>
              <a onClick={() => this.handleDelete(record.key)}>删除</a>
              </span>);
          },
        }],
        csColumns:[{
          title: '处室名称',
          dataIndex: 'KHCSMC',
          key: 'KHCSMC'
        },{
          title: '处室ID',
          dataIndex: 'KHCSID',
          key: 'KHCSID',
        },{
          title: '删除',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, record) => {
            console.log(record);
            return(<span>
              <a onClick={() => this.handleDelete(record.key)}>删除</a>
              </span>);
          },
        }],
        initData: [],
        addWindow: false,
        selectedRowKeys: []
      };
  }
  handleDelete = key => {
    const dataSource = this.props.modify.objectList;
    const index = dataSource.findIndex(item => key === item.key);
    console.log(key);
    let temp = [];
    dataSource[index].XGLX = "delete";
    temp.push(dataSource[index]);

    const khfaid = sessionStorage.getItem("currentProgramId");
    const khmbid = sessionStorage.getItem("currentTemplateId");
    const mblxid = sessionStorage.getItem("currentTemplateTypeId");
    this.setState({selectedRows: [], selectedRowKeys: []});
    this.props.dispatch(asyncModifyObjects(khfaid, mblxid, khmbid, temp));
  };
  showAdd =() => {
    if(this.props.modify.objectType === "1"){
      this.props.dispatch(asyncGetAllDeps());
    } else {
      this.props.dispatch(asyncGetAllUsers());
    }
    this.setState({addWindow: true, selectedRows: [], selectedRowKeys: []});
  }
  hiddenAdd =() => {
    this.setState({addWindow: false});
  };
  handleOk =() => {
    let temp = this.state.selectedRows;
    if(this.props.modify.objectType === "1"){
      temp.forEach((item) => {
        item.KHCSMC = item.DEPNAME;
        item.KHCSID = item.DEPID;
        item.XGLX = "add";
      });
    } else {
      temp.forEach((item) => {
        item.KHDXMC = item.USERNAME;
        item.KHDXID = item.USERID;
        item.XGLX = "add";
      });
    }
    
    const khfaid = sessionStorage.getItem("currentProgramId");
    const khmbid = sessionStorage.getItem("currentTemplateId");
    const mblxid = sessionStorage.getItem("currentTemplateTypeId");
    this.props.dispatch(asyncModifyObjects(khfaid, mblxid, khmbid, temp));
    this.setState({addWindow: false, selectedRows: [], selectedRowKeys: []});
  };
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRows: selectedRows, selectedRowKeys: selectedRowKeys});
  };
  back = () => {
    this.props.dispatch(setModifyProcess(2));
  };
  render(){
    const { selectedRowKeys } = this.state;
    const column = [];
    if (this.props.modify.objectType === "1") {
      column.push({title: '处室名称', dataIndex: 'DEPNAME',key: 'DEPNAME'});
      column.push({title: '处室ID', dataIndex: 'DEPID', key: 'DEPID'});
    } else {
      column.push({title: '对象ID', dataIndex: 'USERID',key: 'USERID'});
      column.push({title: '对象名称', dataIndex: 'USERNAME', key: 'USERNAME'});
      column.push({title: '对象职称', dataIndex: 'POSMC', key: 'POSMC'});
      column.push({title: '对象处室', dataIndex: 'DEPNAME', key: 'DEPNAME'});
    }
    let indexList = [];
    this.props.modify.objectList.forEach((item) => {
      indexList.push(item.key);
    });
    const rowSelection = {
      selectedRowKeys,
      getCheckboxProps: record => ({
       disabled: indexList.indexOf(record.key) > -1, // Column configuration not to be checked
      }),
      onChange: this.onSelectChange,
    };
    return(
      <div>
        <Button type="primary" onClick={this.showAdd} style={{marginBottom: '10px'}}>增加对象</Button>
        <Table dataSource={this.props.modify.objectList} columns={this.props.modify.objectType === "1" ?　this.state.csColumns : this.state.columns} bordered pagination={true}/>
        <Modal
          title="选择要添加的考核对象"
          visible={this.state.addWindow}
          onCancel={this.hiddenAdd}
          onOk={this.handleOk}
        >
          <Table rowSelection={rowSelection} columns={column} dataSource={this.props.modify.objectType === "1" ?　this.props.config.alldepList : this.props.config.alluserList} />
        </Modal>
        <Button onClick={this.back}>返回上一级</Button>
      </div>
    );

  }
  

}

const ModifyObject = Form.create()(EditObject);
function mapStateToProps(state) {
  return {
    modify: state.modify,
    config: state.config
  }
}

export default connect(mapStateToProps)(ModifyObject)