import React from 'react';
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;
// const Option = Select.Option;
// const AutoCompleteOption = AutoComplete.Option;

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.state = {
      confirmDirty: false,
    };
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="E-Mail"
          hasFeedback
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Given Name"
        >
          {getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please input your given name!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Family Name"
        >
          {getFieldDecorator('lastname', {
            rules: [{ required: true, message: 'Please input your family name!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Team Name"
        >
          {getFieldDecorator('teamName', {
            rules: [{ required: true, message: 'Please input your team name!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Team Address"
        >
          {getFieldDecorator('teamAddress', {
            rules: [{ required: true, message: 'Please input your team address!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Team ZIP"
        >
          {getFieldDecorator('teamZip', {
            rules: [{ required: true, message: 'Please input your team zip!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Team Town"
        >
          {getFieldDecorator('teamTown', {
            rules: [{ required: true, message: 'Please input your team town!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Password"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input size="small" type="password" />
          )}
        </FormItem>
        {/* <FormItem
          {...formItemLayout}
          label="Confirm"
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input size="small" type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem> */}
        <FormItem className="isoInputWrapper" {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Register</Button>
        </FormItem>
      </Form>
    );
  }

}

const SignupForm = Form.create()(RegisterForm);
export default SignupForm;