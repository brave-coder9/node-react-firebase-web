import React from 'react';
import Input from '../../components/uielements/input';
import Form from '../../components/uielements/form';
import { Modal } from 'antd';

const FormItem = Form.Item;


const AddNewModal = Form.create()((props) => {

  const { visible, isEditModal, onCancel, onCreate, form } = props;
  var modalTitle = "";
  var modalOk = "";
  if (isEditModal===true) {
    modalTitle = "Edit Member Information";
    modalOk = "Update";
  } else {
    modalTitle = "Add New Member";
    modalOk = "Add";
  }

  const { getFieldDecorator } = form;

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
        <div>
          Password: 123456
        </div>
      </Form>

    </Modal>
  );
});


export default AddNewModal;