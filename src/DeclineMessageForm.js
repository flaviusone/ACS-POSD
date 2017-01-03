import React from 'react';
import {Modal, Form, Input, Button } from 'antd';
const FormItem = Form.Item;

const DeclineMessageForm = Form.create()(React.createClass({
  render() {
    const { visible, onCancel, onCreate, form, loading } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        visible={true}
        title="Mesaj anulare cerere"
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
          <FormItem label="Mesaj">
            {getFieldDecorator('message', {
              rules: [{ required: true, message: 'Introduceti mesaj anulare!' }],
            })(
              <Input type="textarea" rows={4} />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}));
export default DeclineMessageForm;
