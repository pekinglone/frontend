import React from 'react';
import { connect } from 'react-redux';
import HeaderPage from './PageHeader';
import MenuPageNew from './MenuPageNew';
import ContentPageNew from './ContentPageNew';
import './Appraisal.css';

class IndexNew extends React.Component {

  render() {
    return (
      <div>
        <HeaderPage />
        <div className="main-wrapper">
          <MenuPageNew />
          <ContentPageNew />
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

export default connect(mapStateToProps)(IndexNew)