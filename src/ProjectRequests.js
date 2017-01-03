import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import BackButton from 'material-ui/svg-icons/navigation/arrow-back';
import { Tabs, Card, Button } from 'antd';
import DeclineMessageForm from './DeclineMessageForm.js';
import _ from 'lodash';
import * as firebase from "firebase";

import "./ProjectRequests.css";

const TabPane = Tabs.TabPane;

class ProjectRequests extends Component {
  constructor(props) {
    super(props);
    this.onRequestAccept = this.onRequestAccept.bind(this);
    this.onRequestDecline = this.onRequestDecline.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.sendDeclineEmail = this.sendDeclineEmail.bind(this);
    this._renderDeclineModal = this._renderDeclineModal.bind(this);

    this.state = {
      showDeclineModal: false
    };
  }
  render() {
    const projectName = this.props.projectData.name;

    return <div className='project-requests'>
      <Tabs defaultActiveKey="1">
        <TabPane tab={projectName} key="1">
          {this._renderRequestCards()}
        </TabPane>
      </Tabs>
      {this.state.showDeclineModal ? this._renderDeclineModal() : null}
      {this._renderBackbutton()}
    </div>;
  }

  _renderBackbutton() {
    return <div className='back-button'>
      <MuiThemeProvider>
        <FloatingActionButton onClick={this.props.onBackclick}>
          <BackButton />
        </FloatingActionButton>
      </MuiThemeProvider>
    </div>
  }

  _renderRequestCards() {
    return <div className="requests-cards-container">
      {_.map(this.props.projectData.requests, (request, id) => {
        return this._renderRequestCard(request, id);
      })}
    </div>;
  }

  onRequestAccept(id) {
    const {projectData, projectId} = this.props;

    // Check if we can accept the order
    const request = this.props.projectData.requests[id];
    const {requestedBudget, requesterId, requestKey} = request;
    const {budgetLimit, buget} = projectData;

    if(requestedBudget > budgetLimit || requestedBudget > buget) {
      alert('Buget insuficient sau cererea depaseste 20% din valoarea ' +
            'bugetului. Va rugam anulati.')
      return;
    }

    // Update the project budget
    firebase.database().ref('/projects/' + projectId).update({
      buget: buget - requestedBudget
    });
    // Update status in project
    firebase.database().ref('/projects/' + projectId + '/requests/' + id)
      .update({
        status: 2
      });
    // Update status in user
    firebase.database().ref('/users/' + requesterId + '/requests/' + requestKey)
      .update({
        status: 2
      });

    // Notify user
    this.sendAcceptEmail(requesterId);
  }

  onRequestDecline(id) {
    const {projectId} = this.props;

    // Check if we can accept the order
    const request = this.props.projectData.requests[id];
    const {requesterId, requestKey} = request;

    // Update status in project
    firebase.database().ref('/projects/' + projectId + '/requests/' + id)
      .update({
        status: 0
      });
    // Update status in user
    firebase.database().ref('/users/' + requesterId + '/requests/' + requestKey)
      .update({
        status: 0
      });
    // Notify user
    this.setState({
      showDeclineModal: true,
      requesterId
    })
  }

  _renderDeclineModal() {
    return <DeclineMessageForm
      ref={(form) => { this.form = form; }}
      onCancel={this.handleCancel}
      onCreate={this.handleCreate}
    />
  }

  handleCreate() {
    const form = this.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.sendDeclineEmail(values);

      form.resetFields();
      this.setState({ showDeclineModal: false});
    });
  }

  handleCancel() {
    this.setState({
      showDeclineModal: false
    })
  }

  sendAcceptEmail(requesterId) {
    const service_id = "yahoo";
    const template_id = "mail_anulare";
    let userName, userEmail;

    firebase.database().ref('/users/' + requesterId).once('value',
      (snapshot) => {
        userName = snapshot.val().username;
        userEmail = snapshot.val().email;
      });

    const params = {
      reply_to: userEmail,
      from_name: this.props.projectOwnerName,
      to_name: userName,
      message_html: 'O cerere a fost acceptata'
    }

    window.emailjs.send(service_id,template_id,params)
    .then(function(){
       alert("Sent!");
     }, function(err) {
       alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
    });
  }

  sendDeclineEmail(values) {
    const service_id = "yahoo";
    const template_id = "mail_anulare";
    let userName, userEmail;

    firebase.database().ref('/users/' + this.state.requesterId).once('value',
      (snapshot) => {
        userName = snapshot.val().username;
        userEmail = snapshot.val().email;
      });

    const params = {
      reply_to: userEmail,
      from_name: this.props.projectOwnerName,
      to_name: userName,
      message_html: values.message
    }

    window.emailjs.send(service_id,template_id,params)
    .then(function(){
       alert("Sent!");
     }, function(err) {
       alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
    });

    this.setState({
      showDeclineModal: false
    })
  }

  _renderRequestCard(request, id) {
    const statusMapping = {
      0: 'ANULATA',
      1: 'IN ASTEPTARE',
      2: 'ACCEPTATA'
    };

    return <div key={id} className="request-card">
      <Card title={`Request ${id}`}>
        <h3>Solicitant: {request.requesterName}</h3>
        <h3>Tara deplasare: {request.country}</h3>
        <h3>Suma solicitata: {request.requestedBudget}</h3>
        <h3>Status: {statusMapping[request.status]}</h3>
        {request.status === 1
            ? <div className="request-card-button-container">
                <Button type="ghost" size="large" style={{marginRight: 20}}
                        onClick={this.onRequestDecline.bind(this, id)}>
                  Decline
                </Button>
                <Button type="ghost" size="large"
                        onClick={this.onRequestAccept.bind(this, id)}>
                Accept
                </Button>
              </div>
            : null}

      </Card>
    </div>;
  }
}

export default ProjectRequests;
