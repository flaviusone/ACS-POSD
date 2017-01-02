import React from 'react';
import {Modal, Form, Select, InputNumber, Button } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;

const AddOrderForm = Form.create()(React.createClass({
  _renderOptions() {
    return _.map(this.props.projects,(project, key) => {
      return <Option key={key} value={key}>
        {project.name} (Owner: {project.ownerName})
      </Option>
    })
  },

  render() {
    const { author, visible, onCancel, onCreate, form, loading } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        visible={visible}
        title="Solicita ordin de deplasare"
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
          <FormItem label="Solicitant">
            {author}
          </FormItem>
          <FormItem label="Proiect">
            {getFieldDecorator('projectId', {
              rules: [{ required: true, message: 'Introduceti numele proiectului!' }],
            })(
              <Select
                showSearch
                placeholder="Selectati proiect"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.value.toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0}
              >
                {this._renderOptions()}
              </Select>
            )}
          </FormItem>
          <FormItem label="Buget cerut">
            {getFieldDecorator('budget', {
              rules: [{required: true, message: 'Introduceti valoare buget!'}]
            })(<InputNumber min={1} max={999999999}/>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}));
export default AddOrderForm;
