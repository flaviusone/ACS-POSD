import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import LoginForm from './LoginForm.js';
import Projects from './Projects.js';
import ProjectRequests from './ProjectRequests.js';
import Orders from './Orders.js';
import * as firebase from "firebase";
import { Tabs } from 'antd';
import _ from 'lodash';

const TabPane = Tabs.TabPane;

import './App.css';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCNNEa_v41Vmn9_JrWdjD-i08XXLBLIrfA",
  authDomain: "proiect-psd.firebaseapp.com",
  databaseURL: "https://proiect-psd.firebaseio.com",
  storageBucket: "proiect-psd.appspot.com",
  messagingSenderId: "535681694530"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this._logoutCurrentUser = this._logoutCurrentUser.bind(this);
    this._renderProjects = this._renderProjects.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.onRequestBackClick = this.onRequestBackClick.bind(this);

    this.state = {
      loggedIn: false,
      loggedUser: null,
      loggedUserId: null,
      loggedUserName: null,
      projects: [],
      userRequests: [],
      displayProjectRequests: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      let userEmail, userId, userName, requests;

      if(firebaseUser) {
        const projectsRef = firebase.database().ref('projects/');

        userEmail = firebaseUser.email;
        userId = firebaseUser.uid;

        firebase.database().ref('/users/' + userId).on('value',
          (snapshot) => {
            userName = snapshot.val().username;
            requests = snapshot.val().requests;

            this.setState({
              loggedUserName: userName,
              userRequests: requests
            });
          });

        projectsRef.on('value', (snapshot) => {
          this.setState({projects: snapshot.val()});
        });

        this.setState({
          loggedIn: true,
          loggedUser: userEmail,
          loggedUserId: userId
        })
      } else {
        // Detach listeners
        firebase.database().ref('/users/' + this.state.loggedUserId).off();
        firebase.database().ref('projects/').off();

        // User logged out
        this.setState({
          loggedIn: false,
          loggedUser: null,
          loggedUserId: null,
          loggedUserName: null,
          projects: [],
          userRequests: []
        })
      }
    })
  }

  render() {
    const {loggedIn, loggedUser} = this.state;

    return (
      <div className="app">
        <MuiThemeProvider>
          <AppBar
            title="Decont Proiecte Cercetare"
            iconElementLeft={loggedIn ? <div>User: {loggedUser}</div>
                                      : <div></div>}
            iconStyleLeft={{color: "white", fontSize: 16, position: "absolute",
                            top: 10, display: "inline-block"}}
            iconElementRight={
              loggedIn ? <FlatButton label="Logout"
                                     onClick={this._logoutCurrentUser} />
                       : null}
            iconStyleRight={{position: "absolute", right: 25}} />
        </MuiThemeProvider>

        {!this.state.loggedIn ? this._renderLoginForm()
                              : this.state.displayProjectRequests
                                    ? this._renderProjectRequests()
                                    : this._renderTabs()}
      </div>
    );
  }

  handleCardClick(id) {
    this.setState({
      displayProjectRequests: true,
      activeProject: id
    })
  }

  onFormSubmit(values) {
    if(values && values.register) {
      this._registerNewUser(values);
    } else {
      this._loginUser(values);
    }
  }

  _renderProjectRequests() {
    return <ProjectRequests
      projectId={this.state.activeProject}
      projectOwnerName={this.state.loggedUserName}
      projectData={this.state.projects[this.state.activeProject]}
      onBackclick={this.onRequestBackClick}/>
  }

  onRequestBackClick() {
    this.setState({
      displayProjectRequests: false,
      activeProject: null
    })
  }

  _registerNewUser(values) {
    const {email, password, name} = values;

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((firebaseUser) => {
        const {email, uid} = firebaseUser;

        firebase.database().ref('users/' + uid).set({
          username: name,
          email: email,
        });
      })
      .catch(
        function(error) {
          alert(error.message);
      });
  }

  _logoutCurrentUser() {
    firebase.auth().signOut().then(() => {}, (error) => {
      alert(error.message);
    });
  }

  _loginUser(values) {
    const {email, password} = values;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(
        function(error) {
          alert(error.message);
      });
  }

  _renderLoginForm() {
    return <LoginForm className='login-form' onFormSubmit={this.onFormSubmit}/>;
  }

  _renderTabs() {
    return <Tabs defaultActiveKey="1">
      <TabPane tab="Proiecte" key="1">{this._renderProjects()}</TabPane>
      <TabPane tab="Ordine cerute" key="2">{this._renderOrders()}</TabPane>
    </Tabs>
  }

  _renderOrders() {
    const {loggedUserId, loggedUserName} = this.state;

    return <Orders
              userId={loggedUserId}
              userName={loggedUserName}
              projects={this.state.projects}
              orders={this.state.userRequests} />;
  }

  _renderProjects() {
    const loggedUserProjects = _.pickBy(this.state.projects,
      (value, key) => {
        return _.isEqual(value.ownerId, this.state.loggedUserId);
      });

    const {loggedUserId, loggedUserName} = this.state;

    return <Projects
              userId={loggedUserId}
              userName={loggedUserName}
              projects={loggedUserProjects}
              handleCardClick={this.handleCardClick} />;
  }
}

export default App;
