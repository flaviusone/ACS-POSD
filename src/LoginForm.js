import React from 'react';
import Toggle from 'material-ui/Toggle';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Form, Icon, Input, Button } from 'antd';
const FormItem = Form.Item;

import './LoginForm.css';

const LoginForm = Form.create()(React.createClass({
  getInitialState() {
    return {
      register: false
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onFormSubmit(Object.assign({}, values, {
          register: this.state.register
        }));
      }
    });
  },

  handleToggle(e) {
    console.log('Toggle')
    this.setState({
      register: !this.state.register
    })
  },

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {this.state.register ? <FormItem>
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: 'Please input your name!'
            }],
          })(
            <Input addonBefore={<Icon type="user" />} placeholder="Name" />
          )}
        </FormItem>
                            : null}
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your email!'
            }],
          })(
            <Input addonBefore={<Icon type="mail" />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' },
                    {min: 6, message: 'Password must be at least 6 characters'}],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
        <Button type="primary" htmlType="submit" className="login-form-button">
          {this.state.register ? "Register" : "Log in"}
        </Button>

        <MuiThemeProvider>
          <Toggle
            label="Register"
            defaultToggled={false}
            onToggle={this.handleToggle}
            labelPosition="left"
            style={{marginTop: 20, width: 'auto'}}
          />
        </MuiThemeProvider>
        </FormItem>
      </Form>
    );
  },
}));

export default LoginForm;
