import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import LoginForm from './LoginForm.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    }
  }

  render() {
    return (
      <div className="app">
        <MuiThemeProvider>
          <AppBar title="Decont Proiecte Cercetare"
                  iconClassNameRight="muidocs-icon-navigation-expand-more"/>
        </MuiThemeProvider>
        {!this.state.loggedIn ? this._renderLoginForm()
                              : this._renderProjects()}
      </div>
    );
  }

  onFormSubmit(values) {
    debugger;
    console.log('Wololo' + values)
  }

  _renderLoginForm() {
    return <LoginForm className='login-form' onFormSubmit={this.onFormSubmit}/>;
  }

  _renderProjects() {
    return null;
  }
}

export default App;
