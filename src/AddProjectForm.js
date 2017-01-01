import React from 'react';
import {Modal, Form, Input, InputNumber, Button } from 'antd';
const FormItem = Form.Item;

const AddProjectForm = Form.create()(React.createClass({
  render() {
    const { visible, onCancel, onCreate, form, loading } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        visible={visible}
        title="Creeaza proiect de cercetare"
        onCancel={onCancel}
        footer={[
          <Button key="back" type="ghost" size="large"
                  onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" htmlType="submit" type="primary" size="large"
                  loading={loading} onClick={onCreate}>
            Submit
          </Button>,
        ]}>
        <Form vertical>
          <FormItem label="Nume">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Introduceti numele proiectului!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Buget">
            {getFieldDecorator('budget', {
              rules: [{required: true, message: 'Introduceti valoare buget!'}]
            })(<InputNumber min={1} max={999999999}/>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}));
export default AddProjectForm;
