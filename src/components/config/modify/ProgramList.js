import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import {asyncGetAllPrograms, setMainProcess, setSubProcess} from '../../../action/ConfigAction';
import {setModifyProcess, asyncModifyProject} from '../../../action/ModifyAction';
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
    this.props.dispatch(asyncGetAllPrograms());
  }
  constructor(props){
    super(props);
    this.state = {
      data, 
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
              <a disabled={editingKey !== ''} onClick={() => this.look(record.key)}>查看内容</a>
            </span>
          );
        },
      },
    ]
  }
  }
  componentDidMount(){
    let temp = this.state.columns;
    //let columnTemp = this.props.modify.allProgramTitle;
    for(let j = this.props.modify.allProgramTitle.length - 1; j >= 0; j--) {
      temp.unshift(this.props.modify.allProgramTitle[j]);
    } 
    // columnTemp[2].render = (text, record) => {
    //   return(
    //     <span>
    //       <Icon style={{ marginRight: 12 }} onClick={() => this.edit(record.KHFAID)} type="edit" />
    //       <a style={{ marginRight: 12 }} onClick={() => this.delete(record.KHFAID)} >删除</a>
    //       <a onClick={() => this.look(record.KHFAID)}>查看内容</a>
    //     </span>
    //   );
    // }
    this.setState({columns: temp});
  }
  componentWillReceiveProps(nextProps){
    if(this.props.config.programList !== nextProps.config.programList){
      const _obj = JSON.stringify(nextProps.config.programList);
      const initData = JSON.parse(_obj);
      nextProps.config.programList.forEach((item) => {
        item.key = item.KHFAID;
      });
      //console.log(nextProps.config.programList);
      this.setState({data: nextProps.config.programList, initData: initData});
      return true;
    }
  }
  handleDelete = key => {
    const dataSource = [...this.state.data];
    console.log(dataSource.filter(item => item.key !== key));
    const index = dataSource.findIndex(item => key === item.key);
    let temp = [];
    dataSource[index].XGLX = "delete";
    temp.push(dataSource[index]);
    this.props.dispatch(asyncModifyProject(temp));
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
        newData[index].XGLX = "modify";
        let temp = [];
        temp.push(newData[index]);
        this.props.dispatch(asyncModifyProject(temp));
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
  look = (id) => {
    sessionStorage.setItem("currentProgramId", id);
    this.props.dispatch(setModifyProcess(1));
  };
  addMore = () => {
    this.props.dispatch(setMainProcess(0));
    this.props.dispatch(setSubProcess(0));
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

      <div className="editTale">
        <Button onClick={this.addMore} type="primary" style={{marginBottom: '20px'}}>新建方案</Button>
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
        </div>
      </div>
    );

  }

}

const ProgramList = Form.create()(EditableTable);

{/*ReactDOM.render(<EditableFormTable />, mountNode);*/}
function mapStateToProps(state) {
  return {
    modify: state.modify,
    config: state.config // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(ProgramList)