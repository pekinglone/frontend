import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { resetJudgeTeamList, asyncIsTemplateTypeCompleted, setEditableTableHeader, setSubProcess, asyncNewTemplate, hiddenCreateTemplate, hiddenAddTemplate, showEditTemplate, showCreateTemplate, hiddenEditTemplate } from '../../action/ConfigAction';
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
    // let temp=this.state.mbmc;
    // temp[0]='';
    // this.setState({mbmc: temp});
    const mblxid = sessionStorage.getItem("currentTemplateTypeId");
    const khfaid = sessionStorage.getItem("currentProgramId");
    this.props.dispatch(asyncIsTemplateTypeCompleted(khfaid, mblxid));
  }
  constructor(props) {
    super(props);
    this.state = {
      data, 
      mbmc: '',
      editingKey: '',
      count: 0,
      showEditTable: false,
      showAdd: false,
      columns: [
      {
        title: '操作',
        dataIndex: 'operation',
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
              <a disabled={editingKey !== ''} onClick={() => this.handleDelete(record.key)}>删除行</a>
            </span>
          );
        },
      },
    ]
  }
  }
  componentDidMount(){
    let temp = this.state.columns;
    if(this.props.config.currentMblx === "2"){
      temp.unshift({
        title: '指标描述',
        dataIndex: 'description',
        width: '25%',
        editable: true,
      });
      temp.unshift({
        title: '权重',
        dataIndex: 'weight',
        width: '25%',
        editable: true,
      });
      temp.unshift({
        title: '考核指标项',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      });
    } else {
      if(this.props.config.currentMblx === "1"){
        for(let i = this.props.config.mblx1Title.length - 1; i > -1 ; i--){
          temp.unshift(this.props.config.mblx1Title[i]);
        }
      } else {
        for(let i = this.props.config.mblx3Title.length - 1; i > -1 ; i--){
          temp.unshift(this.props.config.mblx3Title[i]);
        }
      }
    }
    this.setState({columns: temp});
  }
  handleDelete = key => {
    const dataSource = [...this.state.data];
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
    const newData = {
      key: count,
    };
    this.setState({
      data: [...data, newData],
      count: count + 1,
    });
  };
  submit = () => {
    const mblxid = this.props.config.currentMblxId;
    let res = [];
    let weightSum = 0;
    if(this.props.mblx === "2"){
      this.state.data.forEach((item, index) => {
        let temp = {};
        temp['KHZBMC'] = item.name;
        temp['ORDERID'] = index;
        temp['KHZBPJBZ'] = item.description;
        temp['KHZBQZ'] = item.weight;
        // if(parseFloat(item.weight) >= 0 && parseFloat(item.weight) <= 1){
          weightSum = weightSum + parseFloat(item.weight);
        // } else {
          // alert(item.name + "的权重填写有误，请仔细检查！");
          // return;
        // }
        res.push(temp);
      });
    } else if(this.props.mblx === "3"){
      let KHcount = {};
      let KHZBList = [];
      this.state.data.forEach((item, index) => {
        if(KHcount[item.KHZBLXMC] === undefined){
          KHcount[item.KHZBLXMC] = 0;
        } else {
          KHcount[item.KHZBLXMC] = KHcount[item.KHZBLXMC] + 1;
        }
        if(KHZBList.indexOf(item.KHZBLXMC) === -1){
          KHZBList.push(item.KHZBLXMC);
        } 
        let temp = {};
        temp['KHZBMC'] = item.KHZBMC;
        temp['ORDERID'] = KHcount[item.KHZBLXMC];
        temp['KHZBPJBZ'] = item.KHZBPJBZ;
        temp['KHZBQZ'] = item.KHZBQZ;
        temp['KHZBWCQK'] = item.KHZBWCQK;
        temp['KHZBLX'] = KHZBList.indexOf(item.KHZBLXMC);
        temp['KHZBLXMC'] = item.KHZBLXMC;
        // if(parseFloat(item.KHZBQZ) >= 0 && parseFloat(item.KHZBQZ) <= 1){
          weightSum = weightSum + parseFloat(item.KHZBQZ);
        // } else {
          // alert(item.KHZBMC + "的权重填写有误，请仔细检查！");
          // return;
        // }
        res.push(temp);
      });
    } else {
      // {"KHZBMC":"PCS","ORDERID":"1","KHZBPJBZ":"政治坚定等","KHZBQZ":"0.6","KHZBWCQK":"完成80%"}
      this.state.data.forEach((item, index) => {
        let temp = {};
        temp['KHZBMC'] = item.KHZBMC;
        temp['ORDERID'] = index;
        temp['KHZBPJBZ'] = item.KHZBPJBZ;
        temp['KHZBQZ'] = item.KHZBQZ;
        temp['KHZBWCQK'] = item.KHZBWCQK;
        // if(parseFloat(item.KHZBQZ) >= 0 && parseFloat(item.KHZBQZ) <= 1){
          weightSum = weightSum + parseFloat(item.KHZBQZ);
        // } else {
          // alert(item.KHZBMC + "的权重填写有误，请仔细检查！");
          // return;
        // }
        res.push(temp);
      });
    }
    if(weightSum === 1){
      this.props.dispatch(asyncNewTemplate(this.props.faid, this.props.config.currentMblxId, this.props.mblx, sessionStorage.getItem("currentMbmc"), res));
    } else {
      alert("权重总和不为1， 请重新调整权重之后再提交");
    }
    
  }
  setTemplateName = (e) => {
    sessionStorage.setItem("currentMbmc", e.target.value);
    this.setState({mbmc:e.target.value});
  }
  submitItem = () => {
    this.props.dispatch(resetJudgeTeamList());
    if(sessionStorage.getItem("currentMbmc") === "" || sessionStorage.getItem("currentMbmc") === undefined){
      this.props.dispatch(showModal("请输入名称之后再创建"));
    } else {
      this.setState({data: []});
      this.props.dispatch(hiddenCreateTemplate());
      this.props.dispatch(hiddenAddTemplate());
      this.props.dispatch(showEditTemplate());
    }
  }
  addNewTemplate = () => {
    this.props.dispatch(showCreateTemplate());
    this.props.dispatch(hiddenAddTemplate());
    this.props.dispatch(hiddenEditTemplate());
  }
  back = () => {
    this.props.dispatch(setSubProcess(3));
  }
  render() {
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
            title: col.title,
            editing: this.isEditing(record),
          }),
        };
      });
      columns['width'] = '20%';
    }
    return (
      <div className="editTale">
        {this.props.config.showEditTable ? this.props.mblx === "2" ? <span style={{color: 'red', marginBottom: '2%'}}>请输入考核的指标项，如工作态度、作风建设等</span> :
        <span style={{color: 'red', marginBottom: '2%'}}>请输入考核的具体内容，如PCS建设情况，预期全部完成，考核权重为0.7等</span>
         : null}
        {this.props.config.templateTypeStatus[this.props.config.currentMblxId] === undefined || Object.keys(this.props.config.templateTypeStatus[this.props.config.currentMblxId].detail).length === 0 ? null : <h3>已有模板：</h3>}
        <ul>
        {this.props.config.templateTypeStatus[this.props.config.currentMblxId] !== undefined ? Object.keys(this.props.config.templateTypeStatus[this.props.config.currentMblxId].detail).map((key) => {
          let status = this.props.config.templateTypeStatus[this.props.config.currentMblxId].detail;
          if(status[key].status){
            return(<li><span>{status[key].KHMBMC}<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /></span></li>);
          } else {
            return(<li><span>Amazing! why this situation happened!</span></li>);
          }
        }) : null}
        </ul>
        {this.props.config.createTemplate === true ? <div><br /><Input key={"inputname"} placeholder="创建模板名称" onChange={this.setTemplateName}/>
        <Button onClick={this.submitItem} >提&nbsp;&nbsp;交</Button></div>: null}
        {this.props.config.showAddTemplate ? <div><Button onClick={this.addNewTemplate} type="primary" style={{ marginBottom: 16 }}>
          增加一个模板
        </Button><br />
        <Button onClick={this.back}>点我返回</Button>
        </div> : null}
         {this.props.config.showEditTable === true ? <div>
          <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: '20px' }}>
            增加一行
          </Button>
          <h3>当前模板名称为：{this.state.mbmc}</h3>
          <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            rowClassName="editable-row"
            pagination={false}
          />
        </EditableContext.Provider>
          <Button onClick={this.submit} style={{marginTop: '20px'}}>提交</Button>
          </div> : null}
      </div>
    );
  }
  componentWillUnmount(){
      // 卸载异步操作设置状态
      this.setState = (state, callback) => {
          return;
      }
  }
}

const EditableFormTable = Form.create()(EditableTable);

{/*ReactDOM.render(<EditableFormTable />, mountNode);*/}
function mapStateToProps(state) {
  return {
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(EditableFormTable)