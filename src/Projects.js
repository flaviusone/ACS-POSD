import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import './Projects.css';

class Projects extends Component {
  constructor(props) {
    super(props);

    this.onCreateProjectClick = this.onCreateProjectClick.bind(this);

    this.state = {
      addProjectModalOpen: false
    }
  }

  render() {
    return <div className='projects'>
      {this._renderAddProjectButton()}
      {this.state.addProjectModalOpen ? this._renderAddProjectModal() : null}
    </div>;
  }

  onCreateProjectClick() {
    this.setState({
      addProjectModalOpen: true
    });
  }

  _renderAddProjectButton() {
    return <div className='add-item-button'>
      <MuiThemeProvider>
        <FloatingActionButton onClick={this.onCreateProjectClick}>
          <ContentAdd />
        </FloatingActionButton>
      </MuiThemeProvider>
    </div>
  }

  _renderAddProjectModal() {
    console.log('Modal Open')
  }
}

export default Projects;
