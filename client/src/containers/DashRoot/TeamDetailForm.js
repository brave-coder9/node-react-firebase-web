import React from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;
// const Option = Select.Option;
// const AutoCompleteOption = AutoComplete.Option;

class TeamInfoForm extends React.Component {

  render() {
    const { getFieldDecorator } = this.props.form;
    const { userInfo } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    
    return (
      <Form>
        <img src="/images/home-planet.png" alt="#" style={{marginBottom:15}} />
        <FormItem
          {...formItemLayout}
          label="Team Name"
        >
          {getFieldDecorator('teamName', {
            initialValue: userInfo.teamName,
            rules: [{ required: true, message: 'Please input your team name!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Team Address"
        >
          {getFieldDecorator('teamAddress', {
            initialValue: userInfo.address,
            rules: [{ required: true, message: 'Please input your team address!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Team ZIP"
        >
          {getFieldDecorator('teamZip', {
            initialValue: userInfo.zip,
            rules: [{ required: true, message: 'Please input your team zip!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Team Town"
        >
          {getFieldDecorator('teamTown', {
            initialValue: userInfo.town,
            rules: [{ required: true, message: 'Please input your team town!' }],
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    );
  }

}

const TeamDetailForm = Form.create()(TeamInfoForm);
export default TeamDetailForm;