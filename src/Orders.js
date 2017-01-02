import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AddOrderForm from './AddOrderForm.js';
import * as firebase from "firebase";

class Orders extends Component {
  constructor(props) {
    super(props);

    this.onCreateOrder = this.onCreateOrder.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCreate = this.handleCreate.bind(this);

    this.state = {
      addOrderModalOpen: false,
      modalSubmitPending: false
    }
  }

  handleCancel() {
    this.setState({
      addOrderModalOpen: false
    })
  }

  handleCreate() {
    this.setState({ modalSubmitPending: true });

    setTimeout(() => {
      const form = this.form;

      form.validateFields((err, values) => {
        if (err) {
          this.setState({ modalSubmitPending: false });
          return;
        }

        this.addOrderToDB(values);

        form.resetFields();
        this.setState({ modalSubmitPending: false, addOrderModalOpen: false});
      });
    }, 1000);
  }

  addOrderToDB(values) {
    const {userId} = this.props;
    const {projectId, budget} = values;

    // Get a key for a user order.
    const newUserOrderKey = firebase.database().ref()
      .child('/users/' + userId + '/requests/').push().key;

    // Get a key for a project order
    const newProjectOrderKey = firebase.database().ref()
      .child('/projects/' + projectId + '/requests/').push().key;

    firebase.database()
      .ref('/projects/' + projectId + '/requests/' + newProjectOrderKey).set({
        requestedBudget: budget,
        status: 1, // Pending
        requesterName: this.props.userName,
        requesterId: userId
    });

    firebase.database()
      .ref('/users/' + userId + '/requests/' + newUserOrderKey).set({
        projectId: projectId,
        projectName: this.props.projects[projectId].name,
        requestedBudget: budget,
    });
  }


  render() {
    return <div className='orders'>
      {this._renderAddOrderButton()}
      {this.state.addOrderModalOpen ? this._renderAddOrderModal() : null}
    </div>;
  }

  _renderAddOrderModal() {
    return <AddOrderForm
      ref={(form) => { this.form = form; }}
      visible={this.state.addOrderModalOpen}
      loading={this.state.modalSubmitPending}
      author={this.props.userName}
      projects={this.props.projects}
      onCancel={this.handleCancel}
      onCreate={this.handleCreate}
    />
  }

  onCreateOrder() {
    this.setState({
      addOrderModalOpen: true
    });
  }

  _renderAddOrderButton() {
    return <div className='add-item-button'>
      <MuiThemeProvider>
        <FloatingActionButton onClick={this.onCreateOrder}>
          <ContentAdd />
        </FloatingActionButton>
      </MuiThemeProvider>
    </div>
  }
}

export default Orders;
