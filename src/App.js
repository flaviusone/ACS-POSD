import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import LoginForm from './LoginForm.js';
import Projects from './Projects.js';
import * as firebase from "firebase";

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

    this.state = {
      loggedIn: false,
      loggedUser: null
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      let userEmail;

      if(firebaseUser) {
        userEmail = firebaseUser.email;
      }
      this.setState({
        loggedIn: !!firebaseUser,
        loggedUser: userEmail || null
      })
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
                              : this._renderProjects()}
      </div>
    );
  }

  onFormSubmit(values) {
    if(values && values.register) {
      this._registerNewUser(values);
    } else {
      this._loginUser(values);
    }
  }

  _registerNewUser(values) {
    const {email, password} = values;

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(
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

    firebase.auth().signInWithEmailAndPassword(email, password).catch(
      function(error) {
        alert(error.message);
      });
  }

  _renderLoginForm() {
    return <LoginForm className='login-form' onFormSubmit={this.onFormSubmit}/>;
  }

  _renderProjects() {
    return null;
  }
}

export default App;
