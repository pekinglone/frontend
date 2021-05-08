import {Table, Input, InputNumber, Popconfirm, Form, Button, Icon, Modal } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import {setModifyProcess, getJudgesByJudgeTeamId, asyncModifyJudges} from '../../../action/ModifyAction';
import {getAllJudges, asyncGenerateJudgeTable} from '../../../action/ConfigAction';
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
// function deepCopy(obj){
//     if(typeof obj != 'object'){
//         return obj;
//     }
//     var newobj = {};
//     for ( var attr in obj) {
//         newobj[attr] = deepCopy(obj[attr]);
//     }
//     return newobj;
// }
class EditJudge extends React.Component {
  componentWillMount(){
    const khfaid = sessionStorage.getItem("currentProgramId");
    const khmbid = sessionStorage.getItem("currentTemplateId");
    const pwzid = sessionStorage.getItem("currentJudgeTeamId");
    this.props.dispatch(getJudgesByJudgeTeamId(khfaid, khmbid, pwzid));
  }
  constructor(){
      super();
      this.state = {
        data:[], 
        editingKey: '',
        columns:[{
          title: '评委名称',
          dataIndex: 'PWMC',
          key: 'PWMC'
        },{
          title: '评委权重',
          dataIndex: 'PWQZ',
          key: 'PWQZ',
          editable: true,
        },{
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
              </span>
            );
          },
        }],
        initData: [],
        addWindow: false,
        judgeColumns: [{
          title: '评委',
          key: 'USERNAME',
          dataIndex: 'USERNAME'
        },{
          title: '评委ID',
          key: 'USERID',
          dataIndex: 'USERID'
        },{
          title: '职称',
          key: 'POSMC',
          dataIndex: 'POSMC'
        },{
          title: '处室',
          key: 'DEPNAME',
          dataIndex: 'DEPNAME'
        }],
        selectedRowKeys: []
      };
  }
  componentWillReceiveProps(nextProps){
    if(this.props.modify.judge !== nextProps.modify.judge){
      // const initData = deepCopy();
      const _obj = JSON.stringify(nextProps.modify.judge);
      const initData = JSON.parse(_obj);
      nextProps.modify.judge.forEach((item) => {
        item.key = item.PWID;
      });
      this.setState({data: nextProps.modify.judge, initData: initData});
      return true;
    }
    if(nextProps.config.allJudgeList !== this.props.config.allJudgeList){
      nextProps.config.allJudgeList.forEach((item, index) => {
        item.key = item.USERID;
      });
      this.setState({allJudgeList: nextProps.config.allJudgeList});
      return true;
    }
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  handleDelete = key => {
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.key !== key) });
  };

  isEditing = record => record.key === this.state.editingKey;
  isExist = record => {
    let flag = false;
    this.state.data((item) => {
      flag = flag & (item.key === record.key)
    });
    return flag;
  }
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
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }
  edit = (key) => {
    this.setState({ editingKey: key });
  }
  back = () => {
    this.props.dispatch(setModifyProcess(5));
  }
  showAdd =() => {
    this.props.dispatch(getAllJudges());
    this.setState({addWindow: true});
  }
  hiddenAdd =() => {
    this.setState({addWindow: false});
  }
  add =() => {
    let val = this.state.data;
    console.log(val);
    this.state.selectedRows.forEach((item) => {
      let temp = {};
      temp.PWMC = item.USERNAME;
      // temp.PWQZ = 0;
      temp.PWID = item.USERID;
      temp.key = item.USERID;
      val.push(temp);
    });
     this.setState({data: val,selectedRowKeys:[],selectedRows:[], addWindow: false});
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRows: selectedRows, selectedRowKeys: selectedRowKeys});
  }
  submit = () => {
    console.log(this.state.data);
    console.log(this.state.initData);
    let res = [];
    let weightSum = 0;
    let weightUndefined = false;
    this.state.initData.forEach((oldData) => {
      let isExisted = false;
      this.state.data.forEach((newData) => {
        if(newData.PWID === oldData.PWID){
          isExisted = true;
          newData.XGLX = "modify";
          res.push(newData);
          if(newData.PWQZ === undefined){
            weightUndefined = true;
          } else {
            weightSum = weightSum + parseFloat(newData.PWQZ);
          }
        }
      });
      if(!isExisted){
        oldData.XGLX = "delete";
        res.push(oldData);
      }
    });
    this.state.data.forEach((newData) => {
      let isExisted = true;
      this.state.initData.forEach((oldData) => {
        if(newData.PWID === oldData.PWID){
          isExisted = false;
        }
      });
      if (isExisted) {
        newData.XGLX = "add";
        res.push(newData);
        if(newData.PWQZ === undefined){
          weightUndefined = true;
        } else {
          weightSum = weightSum + parseFloat(newData.PWQZ);
        }
      }
    });
    if(weightUndefined){
      alert("有评委未设置权重，请检查");
    } else if(weightSum !== 1){
      alert("权重总和不为1， 请重新调整权重之后再提交");
    } else{
      const khfaid = sessionStorage.getItem("currentProgramId");
      const khmbid = sessionStorage.getItem("currentTemplateId");
      const pwzid = sessionStorage.getItem("currentJudgeTeamId");
      this.props.dispatch(asyncModifyJudges(khfaid, khmbid, pwzid, res));
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
    const currentJudges = [];
    this.state.data.forEach((item) => {
      currentJudges.push(item.PWID);
    });
    const rowSelection = {
      getCheckboxProps: record => ({
        disabled: currentJudges.indexOf(record.key) > -1, // Column configuration not to be checked
        USERID: record.USERID,
      }),
      onChange: this.onSelectChange,
    };
    return(
      <div>
        <Button type="primary" onClick={this.showAdd} style={{marginBottom: '10px'}}>增加评委</Button>
        <EditableContext.Provider value={this.props.form}>
          <Table components={components} dataSource={this.state.data} columns={columns} bordered pagination={true}/>
        </EditableContext.Provider>
        <Button type="primary" style={{marginRight: '30px'}} onClick={this.submit}>提交</Button>
        <Button onClick={this.back}>返回上一级</Button>
        <Modal
          title="选择要添加的评委"
          visible={this.state.addWindow}
          onCancel={this.hiddenAdd}
          footer={null}
        >
          <Table rowSelection={rowSelection} columns={this.state.judgeColumns} dataSource={this.state.allJudgeList} />
          <Button onClick={this.add}>选好了</Button>
        </Modal>
      </div>
    );

  }
  

}

const Judge = Form.create()(EditJudge);
function mapStateToProps(state) {
  return {
    modify: state.modify,
    config: state.config
  }
}

export default connect(mapStateToProps)(Judge)