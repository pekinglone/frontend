import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import {asyncGetJudgeTeam, asyncModifyJudgeTeam, setModifyProcess} from '../../../action/ModifyAction';
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
class EditableJudgeGroup extends React.Component {
  componentWillMount(){
    const khmbid = sessionStorage.getItem("currentTemplateId");
	const khfaid = sessionStorage.getItem("currentProgramId");
    this.props.dispatch(asyncGetJudgeTeam(khfaid, khmbid));
  }
  constructor(){
      super();
      this.state = {
        data:[],
        count: 0,
        initData: [],
        columns:[{
	  		key: "PWZMC",
	  		dataIndex: "PWZMC",
	  		title: "评委组名称",
	  		editable: true
	  	},{
	  		key: "PWZQZ",
	  		dataIndex: "PWZQZ",
	  		title: "评委组权重",
	  		editable: true
	  	},{
	        title: '操作',
	        key: 'op',
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
			          <Icon style={{ marginRight: 12 }} onClick={() => this.edit(record.key)} type="edit" />
			          <a style={{ marginRight: 12 }} onClick={() => this.handleDelete(record.key)} >删除</a>
			          {record.PWZID ? <a style={{ marginRight: 12 }} onClick={() => this.look(record.key)}>查看评委</a>:null}
                <a onClick={() => this.rules(record.key)}>编辑规则</a>
			        </span>
	          	);
	        },
      	}]
      };
  }
  componentWillReceiveProps(nextProps){
  	if(this.props.modify.judgeTeam !== nextProps.modify.judgeTeam){
      if(nextProps.modify.judgeTeam !== undefined &&nextProps.modify.judgeTeam.length > 0){
        const _obj = JSON.stringify(nextProps.modify.judgeTeam);
        const initData = JSON.parse(_obj);
        nextProps.modify.judgeTeam.forEach((item) => {
          item.key = item.PWZID;
        });
        this.setState({data: nextProps.modify.judgeTeam, initData: initData});
      }
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
  look = key => {
  	sessionStorage.setItem("currentJudgeTeamId", key);
    this.props.dispatch(setModifyProcess(6));
  };
  rules = key => {
    sessionStorage.setItem("currentJudgeTeamId", key);
    this.props.dispatch(setModifyProcess(7));
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
    console.log("test");
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
  	let res = [];
    let weightSum = 0;
    let isNameRepeated = false;
    let nameList = [];
    console.log(this.state.data);
  	this.state.data.forEach((item, index) => {
  		if(item.PWZID != undefined){
  			item.XGLX = "modify";
  		} else {
  			item.ORDERID = index+1;
  			item.XGLX = "add";
  		}
  		if(nameList.length > 0){
        nameList.forEach((name) => {
    			if(item.PWZMC === name){
    				isNameRepeated = true;
    			}
    		});
      }
      if(!isNameRepeated){
        nameList.push(item.PWZMC);
      }
  		res.push(item);
  		weightSum = weightSum + parseFloat(item.PWZQZ);
  	});
  	if(weightSum !== 1){
  		alert("权重总和不为1， 请重新调整权重之后再提交");
		} else if(isNameRepeated){
			alert("评委组名称重复，请修改");
		} else{
      console.log(this.state.initData);
  		this.state.initData.forEach((oldData) => {
	  		let isExisted = true;
	  		this.state.data.forEach((newData) => {
	  			if(newData.PWZID !== undefined && newData.PWZID === oldData.PWZID){
	  				isExisted = false;
	  			}
	  		});
	  		if(isExisted){
	  			oldData.XGLX = "delete";
	  			res.push(oldData);
	  		}
	  	});
		const khfaid = sessionStorage.getItem("currentProgramId");
	    const khmbid = sessionStorage.getItem("currentTemplateId");
	  	this.props.dispatch(asyncModifyJudgeTeam(khfaid, khmbid, res));
  	}
  }
  back = () => {
    this.props.dispatch(setModifyProcess(2));
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
        <div>
          <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
            新增一个评委组
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
          <Button type="primary" style={{marginRight: '30px'}} onClick={this.submit}>提交</Button>
          <Button onClick={this.back}>返回上一级</Button>
        </div>
      </div>
    );

  }

}
const JudgeGroup = Form.create()(EditableJudgeGroup);
function mapStateToProps(state) {
  return {
    modify: state.modify, // gives our component access to state through props.toDoApp
    config: state.config
  }
}

export default connect(mapStateToProps)(JudgeGroup)