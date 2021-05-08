import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { asyncGetItems, asyncGetItemsName, setModifyProcess, asyncModifyTemplate} from '../../../action/ModifyAction';
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
    const khmbid = sessionStorage.getItem("currentTemplateId");
    console.log("mbid: " + khmbid);
  	if(sessionStorage.getItem("currentMBType") !== "2"){
	    this.props.dispatch(asyncGetItems(khfaid, mblxid, khmbid));
  	}
  	this.props.dispatch(asyncGetItemsName(mblxid, khmbid));
    
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
    if(sessionStorage.getItem("currentMBType") === "2"){
      temp.unshift({
        title: '指标描述',
        key: 'KHZBPJBZ',
        dataIndex: 'KHZBPJBZ',
        width: '25%',
        editable: true,
      });
      temp.unshift({
        title: '权重',
        dataIndex: 'KHZBQZ',
        key: 'KHZBQZ',
        width: '25%',
        editable: true,
      });
      temp.unshift({
        title: '考核指标项',
        key: 'KHZBMC',
        dataIndex: 'KHZBMC',
        width: '25%',
        editable: true,
      });
    }
    this.setState({columns: temp});
    this.props.modify.templateList.forEach((item) => {
      if(item.KHMBID === sessionStorage.getItem("currentTemplateId")){
        this.setState({mbmc: item.KHMBMC});
      }
    });
  }
  componentWillReceiveProps(nextProps){
  	if(this.props.modify.tableTitle !== nextProps.modify.tableTitle){
    	let temp = this.state.columns;
  		if(sessionStorage.getItem("currentMBType") !== "2"){
  			for(let i = nextProps.modify.tableTitle.length - 1; i > -1 ; i--){
  				if(nextProps.modify.tableTitle[i].type !== 'dropDown'){
  					let title = {};
					title.key = nextProps.modify.tableTitle[i].EnglishName;
					title.dataIndex = nextProps.modify.tableTitle[i].EnglishName;
					title.title = nextProps.modify.tableTitle[i].KHZBMC;
					title.editable = true;
					temp.unshift(title);
  				}
	      }
  		}
    	this.setState({columns: temp});
    	return true;
  	}
  	if(this.props.modify.tableData !== nextProps.modify.tableData){
      const _obj = JSON.stringify(nextProps.modify.tableData);
      const initData = JSON.parse(_obj);
  		nextProps.modify.tableData.forEach((item) => {
  			item.key = item.KHZBID;
  		})
    	this.setState({data: nextProps.modify.tableData, initData: initData});
    	return true;
  	}
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
      key: 'new' +　count,
    };
    this.setState({
      data: [...data, newData],
      count: count + 1,
    });
  };
  submit = () => {
  	console.log(this.state.data);
  	let res = [];
    let weightSum = 0;
    let isNameRepeated = false;
    let nameList = [];
  	this.state.data.forEach((item, index) => {
  		if(item.KHZBID != undefined){
  			item.XGLX = "modify";
  		} else {
  			item.ORDERID = index+1;
  			item.XGLX = "add";
  		}
  		nameList.forEach((name) => {
  			if(item.KHZBMC === name){
  				isNameRepeated = true;
  			}
  		});
  		if(!isNameRepeated){
  			nameList.push(item.KHZBMC);
  		}
  		res.push(item);
  		weightSum = weightSum + parseFloat(item.KHZBQZ);
  	});
  	if(weightSum !== 1){
  		alert("权重总和不为1， 请重新调整权重之后再提交");
		} else if(isNameRepeated){
			alert("指标名称重复，请修改");
		} else{
  		this.state.initData.forEach((oldData) => {
	  		let isExisted = true;
	  		this.state.data.forEach((newData) => {
	  			if(newData.KHZBID !== undefined && newData.KHZBID === oldData.KHZBID){
	  				isExisted = false;
	  			}
	  		});
	  		if(isExisted){
	  			oldData.XGLX = "delete";
	  			res.push(oldData);
	  		}
	  	});
		  const khfaid = sessionStorage.getItem("currentProgramId");
	    const mblxid = sessionStorage.getItem("currentTemplateTypeId");
	    const mbtype = sessionStorage.getItem("currentMBType");
	    const khmbid = sessionStorage.getItem("currentTemplateId");
	  	this.props.dispatch(asyncModifyTemplate(khfaid, mblxid, mbtype, khmbid, res));
  	}
  }
  back = () => {
    this.props.dispatch(setModifyProcess(2));
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
            key: record.key,
            title: col.title,
            editing: this.isEditing(record),
          }),
        };
      });
      columns['width'] = '20%';
    }
    return (
      <div className="editTale">
        <div>
          <h3>当前模板名称为：{this.state.mbmc}</h3>
          <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
            增加一行
          </Button>
          <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            pagination={true}
          />
          </EditableContext.Provider>
          <Button onClick={this.submit}>提交</Button>
          <Button onClick={this.back}>不保存更改，直接返回上一级</Button>
        </div>
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

const TemplateDetail = Form.create()(EditableTable);

{/*ReactDOM.render(<EditableFormTable />, mountNode);*/}
function mapStateToProps(state) {
  return {
    modify: state.modify // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(TemplateDetail)
