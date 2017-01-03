import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AddProjectForm from './AddProjectForm.js';
import { Card } from 'antd';
import * as firebase from "firebase";
import _ from 'lodash';

import './Projects.css';

class Projects extends Component {
  constructor(props) {
    super(props);

    this.onCreateProject = this.onCreateProject.bind(this);
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

  onCreateProject() {
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
    var newProjectKey = firebase.database().ref().child('projects').push().key;

    firebase.database().ref('projects/' + newProjectKey).set({
      ownerName: this.props.userName,
      ownerId: this.props.userId,
      name: values.name,
      buget: values.budget,
      budgetLimit: 20 / 100 * values.budget
    });
  }

  _renderProjectCards() {
    const {projects} = this.props;

    return <div className='project-cards-container'>
      {projects ? _.map(projects, (project, id) => {
                    return this._renderProjectCard(project, id);
                  })
                : null}
    </div>;
  }

  handleCardClick(id, event) {
    event.preventDefault();
    this.props.handleCardClick(id);
  }

  _renderProjectCard(projectData, id) {
    return <div key={id} className='project-card' onClick={this.handleCardClick.bind(this, id)}>
      <Card title={projectData.name}>
        <h3>Budget ramas: {projectData.buget}</h3>
      </Card>
    </div>
  }

  _renderAddProjectButton() {
    return <div className='add-item-button'>
      <MuiThemeProvider>
        <FloatingActionButton onClick={this.onCreateProject}>
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
