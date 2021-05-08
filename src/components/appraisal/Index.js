import React from 'react';
import { connect } from 'react-redux';
import HeaderPage from './PageHeader';
import MenuPage from './Menu';
import ContentPage from './Content';
import './Appraisal.css';

class Index extends React.Component {

  render() {
    return (
      <div>
        <HeaderPage />
        <div className="main-wrapper">
          <MenuPage />
          <ContentPage />
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

export default connect(mapStateToProps)(Index)