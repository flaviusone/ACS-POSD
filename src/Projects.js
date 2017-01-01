import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AddProjectForm from './AddProjectForm.js';
import { Card } from 'antd';
import * as firebase from "firebase";

import './Projects.css';

class Projects extends Component {
  constructor(props) {
    super(props);

    this.onCreateProjectClick = this.onCreateProjectClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCreate = this.handleCreate.bind(this);

    this.state = {
      addProjectModalOpen: false,
      modalSubmitPending: false
    }
  }

  render() {
    return <div className='projects'>
      {this._renderProjectCards()}
      {this._renderAddProjectButton()}
      {this.state.addProjectModalOpen ? this._renderAddProjectModal() : null}
    </div>;
  }

  onCreateProjectClick() {
    this.setState({
      addProjectModalOpen: true
    });
  }

  handleCancel() {
    this.setState({
      addProjectModalOpen: false
    })
  }

  handleCreate(e) {
    this.setState({ modalSubmitPending: true });

    setTimeout(() => {
      const form = this.form;

      form.validateFields((err, values) => {
        if (err) {
          this.setState({ modalSubmitPending: false });
          return;
        }

        this.addProjectToDB(values);

        form.resetFields();
        this.setState({ modalSubmitPending: false, addProjectModalOpen: false});
      });
    }, 1000);
  }

  addProjectToDB(values) {
    // Get a key for a new Project.
    var newProjectKey = firebase.database().ref().child('posts').push().key;
    // debugger;
    firebase.database().ref('posts/' + newProjectKey).set({
      ownerName: this.props.userName,
      ownerId: this.props.userId,
      name: values.name,
      buget: values.budget
    });
  }

  _renderProjectCards() {
    const {projects} = this.props;

    return <div className='project-cards-container'>
      {projects ? projects.map((project, id) => {
                    return this._renderProjectCard(project, id);
                  })
                : null}
    </div>;
  }

  _renderProjectCard(projectData, id) {
    return <div key={id} className='project-card'>
      <Card title={projectData.name}>
        <p>Budget ramas: {projectData.buget}</p>
      </Card>
    </div>
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
    return <AddProjectForm
      ref={(form) => { this.form = form; }}
      visible={this.state.addProjectModalOpen}
      loading={this.state.modalSubmitPending}
      onCancel={this.handleCancel}
      onCreate={this.handleCreate}
    />
  }
}

export default Projects;
