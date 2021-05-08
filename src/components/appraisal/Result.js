import React from 'react';
import { connect } from 'react-redux';
import HeaderPage from './PageHeader';
// import MenuPage from './Menu';
// import ContentPage from './Content';
import './Appraisal.css';
import { Menu, Table } from 'antd';
class Result extends React.Component {
  constructor() {
    super();
    this.state = {
      menu: "1",
      container: "3"
    }
  }
  handleClick = e => {
    if(e.key === "1"){
      this.setState({menu: e.key, container: "3"});
    } else {
      this.setState({menu: e.key, container: "5"});
    }
  };
  selectContainer = e => {
    this.setState({container: e.key});
  };
  render() {
    const dataSource1 = [{"KHDXMC":"范智慧","1":95,"2":95,"3":95,"4":95,"5":75,"6":75,"7":75,"8":75,"KHDXID":"fanzh"},{"KHDXMC":"胡渤","1":80,"2":80,"3":80,"4":80,"5":80,"6":80,"7":80,"8":80,"KHDXID":"hubo"}];
    const column1 = [{"title":"姓名|指标","dataIndex":"KHDXMC","key":"KHDXMC"},{"title":"政治素质","dataIndex":"1","key":"1"},{"title":"职业操守","dataIndex":"2","key":"2"},{"title":"作风建设","dataIndex":"3","key":"3"},{"title":"廉洁从业","dataIndex":"4","key":"4"},{"title":"组织管理能力","dataIndex":"5","key":"5"},{"title":"担当执行能力","dataIndex":"6","key":"6"},{"title":"学习创新能力","dataIndex":"7","key":"7"},{"title":"团队建设能力","dataIndex":"8","key":"8"}];
    const dataSource2 = [{"khcs":"信息与科技管理处","KHZBMC":"业财融合项目","KHZBPJBZ":"稳定开展","KHMBJFZID":"95,90,85,80,75","KHZBQZ":0.4,"KHZBID":"1","KHZBWCQK":"开展80%","FS":85},{"khcs":"信息与科技管理处","KHZBMC":"PCS项目","KHZBPJBZ":"PCS设计完成","KHMBJFZID":"95,90,85,80,75","KHZBQZ":0.6,"KHZBID":"2","KHZBWCQK":"设计完成","FS":75}];
    const column2 = [{"title":"处室名称","dataIndex":"khcs","key":"khcs"},{"title":"指标项目","dataIndex":"KHZBMC","key":"KHZBMC"},{"title":"考核目标值","dataIndex":"KHZBPJBZ","key":"KHZBPJBZ"},{"title":"考核权重","dataIndex":"KHZBQZ","key":"KHZBQZ"},{"title":"指标完成情况","dataIndex":"KHZBWCQK","key":"KHZBWCQK"},{"title":"得分","dataIndex":"FS","key":"FS"}];
    const dataSource3 = [{"khdx":"谭继明", "KHZBMC":"生产系统需求调研","KHZBPJBZ":"需求调研完成","KHZBLXMC":"年度量化考核指标","KHZBQZ":0.2,"KHZBID":"1","KHZBWCQK":"需求调研完成90%","FS":95},{"khdx":"谭继明", "KHZBMC":"业才融合系统","KHZBPJBZ":"系统上线","KHZBLXMC":"年度量化考核指标","KHZBQZ":0.2,"KHZBID":"3","KHZBWCQK":"系统完成50%","FS":95},{"khdx":"谭继明", "KHZBMC":"会议系统项目","KHZBPJBZ":"项目完结","KHZBLXMC":"年度重点工作","KHZBQZ":0.5,"KHZBID":"2","KHZBWCQK":"项目完成70%","FS":95},{"khdx":"谭继明", "KHZBMC":"一体化系统","KHZBPJBZ":"项目完成80%","KHZBLXMC":"年度重点工作","KHZBQZ":0.1,"KHZBID":"4","KHZBWCQK":"项目完成","FS":95}];
    const column3 = [{"title":"姓名|指标","dataIndex":"khdx","key":"khdx"},{"title":"指标类别","dataIndex":"KHZBLXMC","key":"KHZBLXMC"},{"title":"指标项目","dataIndex":"KHZBMC","key":"KHZBMC"},{"title":"考核目标值","dataIndex":"KHZBPJBZ","key":"KHZBPJBZ"},{"title":"考核权重","dataIndex":"KHZBQZ","key":"KHZBQZ"},{"title":"指标完成情况","dataIndex":"KHZBWCQK","key":"KHZBWCQK"},{"title":"得分","dataIndex":"FS","key":"FS"}];
    const dataSource4 = [{"KHDXMC":"谭继明","1":95,"2":95,"3":95,"4":95,"5":75,"6":75,"7":75,"8":75,"KHDXID":"tanjm"}];
    const column4 = [{"title":"姓名|指标","dataIndex":"KHDXMC","key":"KHDXMC"},{"title":"政治素质","dataIndex":"1","key":"1"},{"title":"职业操守","dataIndex":"2","key":"2"},{"title":"作风建设","dataIndex":"3","key":"3"},{"title":"廉洁从业","dataIndex":"4","key":"4"},{"title":"组织管理能力","dataIndex":"5","key":"5"},{"title":"担当执行能力","dataIndex":"6","key":"6"},{"title":"学习创新能力","dataIndex":"7","key":"7"},{"title":"团队建设能力","dataIndex":"8","key":"8"}];
    return (
      <div>
        <HeaderPage />
        <div className="main-wrapper">
          <Menu
            onClick={this.handleClick}
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            mode="inline"
          >
            <Menu.Item key="1">处级干部考核结果</Menu.Item>
            <Menu.Item key="2">副处级干部考核结果</Menu.Item>
          </Menu>
          <div style={{display: 'flex', flexDirection: 'column', marginLeft: '5%'}}>
            {this.state.menu === "1" ? <Menu key="module" mode="horizontal" style={{width: '100%', marginBottom: '5%'}}>
              <Menu.Item key={"3"} onClick={this.selectContainer}>处室重点工作考核</Menu.Item>
              <Menu.Item key={"4"} onClick={this.selectContainer}>素质能力考核</Menu.Item>
            </Menu> : null}
            {this.state.menu === "2" ? <Menu key="module" mode="horizontal" style={{width: '100%', marginBottom: '5%'}}>
              <Menu.Item key={"5"} onClick={this.selectContainer}>副处工作业绩考核</Menu.Item>
              <Menu.Item key={"6"} onClick={this.selectContainer}>素质能力考核</Menu.Item>
            </Menu> : null}
            {this.state.menu === "1" &&　this.state.container === "4" ? <Table dataSource={dataSource1} columns={column1} /> : null}
            {this.state.menu === "1" &&　this.state.container === "3" ? <Table dataSource={dataSource2} columns={column2} /> : null}
            {this.state.menu === "2" &&　this.state.container === "5" ? <Table dataSource={dataSource3} columns={column3} /> : null}
            {this.state.menu === "2" &&　this.state.container === "6" ? <Table dataSource={dataSource4} columns={column4} /> : null}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    menu: state // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(Result)