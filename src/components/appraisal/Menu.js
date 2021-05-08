import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';
import './Appraisal.css';
import { selectType, asyncGetTemplateType, asyncGetMenu } from '../../action/AppraisalAction';
const { SubMenu } = Menu;

class MenuPage extends React.Component {
  componentWillMount(){
    this.props.dispatch(asyncGetMenu(this.props.appraisal.currentuser));
  }
  constructor() {
      super();
      this.state = {};
  }
  selectType = (e) => {
    let res = {};
    Object.keys(this.props.appraisal.menuList).map((key) => {
        if(e.key === (key + "")){
          res[key] = true;
        } else {
          res[key] = false;
        }
    });
    this.props.dispatch(selectType(res));
    this.props.dispatch(asyncGetTemplateType(this.props.appraisal.currentuser, e.key));
  };
  render() {    
    return (
      <div className="main-menu">
        {this.props.appraisal.menuList !== {} && this.props.appraisal.menuList !== undefined ? 
          <Menu
            style={{ 'width': '100%' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
          {Object.keys(this.props.appraisal.menuList).map((key) => {
            return(
            <Menu.Item
              key={key + "menu"}
              value={key}
              onClick={this.selectType.bind(this)}
              style={{'fontSize': '20px', 'marginTop':'5%'}}>
              {this.props.appraisal.menuList[key]}
            </Menu.Item>
            );
          })
        } 
        </Menu>: null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appraisal: state.appraisal // gives our component access to state through props.toDoApp
  }
}

export default connect(mapStateToProps)(MenuPage)