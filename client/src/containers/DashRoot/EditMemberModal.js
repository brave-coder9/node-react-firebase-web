import React from 'react';
import Input from '../../components/uielements/input';
import Form from '../../components/uielements/form';
import { Modal } from 'antd';
import Select from '../../components/uielements/select';
import moment from 'moment';
import { DATEformat } from '../../config';

const FormItem = Form.Item;


const EditMemberModal = Form.create()((props) => {

  const { visible, onCancel, onCreate, form, subscriptions } = props;
  const modalTitle = "Attach/Unattach Subscription";
  const modalOk = "Update Subscription";

  const { getFieldDecorator } = form;

  const subscriptionOptions = [];
  subscriptionOptions.push(
    <Select.Option value="" key={0}>Unattach</Select.Option>
  );
  subscriptions.forEach((subsc, index) => {
    subscriptionOptions.push(
      <Select.Option value={""+subsc.uuid} key={index+1}>{subsc.type} : ({moment.unix(subsc.expirationDate).format(DATEformat)})</Select.Option>
    );
  })

  return (
    <Modal style={{ top:60 }}
      visible={visible}
      title={modalTitle}
      okText={modalOk}
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form layout="vertical">
        {/* E-Mail */}
        <FormItem
          label="E-mail"
          hasFeedback
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="Given Name"
        >
          {getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please input your given name!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="Family Name"
        >
          {getFieldDecorator('lastname', {
            rules: [{ required: true, message: 'Please input your family name!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="Subscription"
        >
          {getFieldDecorator('subscription', {
            rules: [{ required: false }],
          })(
            <Select style={{ width: 220 }}>
              {subscriptionOptions}
            </Select>
          )}
        </FormItem>
      </Form>

    </Modal>
  );
});


export default EditMemberModal;