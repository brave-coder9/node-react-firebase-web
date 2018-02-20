import React, { Component } from 'react';
import Input from '../uielements/input';
import Form from '../uielements/form';
import { Modal, Spin } from 'antd';
import { firebaseStorage } from '../../config.js';
import ImageUploader from './react-firebase-image-uploader/lib';
import { firebaseApp } from '../../helpers/firebase';

const FormItem = Form.Item;


class UploadAvatar extends Component {
  state = {
    avatar: '',
    isUploading: false,
    progress: 0,
    avatarUrl: ''
  }
  handleUploadStart = () => this.setState({isUploading: true, progress: 0});
  handleProgress = (progress) => this.setState({progress});
  handleUploadError = (error) => {
      this.setState({isUploading: false});
      console.error(error);
  }
  handleUploadSuccess = (filename) => {
      const { avatarCallback } = this.props;
      this.setState({avatar: filename, progress: 100, isUploading: false});
      firebaseApp.storage().ref(firebaseStorage.dirname).child(filename).getDownloadURL().then(url => {
        avatarCallback(url);
        this.setState({avatarURL: url});
      });
  };
  render() {
    return (
      <div>
        { this.state.isUploading ? 
          <Spin />
          :
          <img src={this.state.avatarURL ? this.state.avatarURL : this.props.avatarUrl} alt="avatar" height="60" />
        }
        <ImageUploader
            name="avatar"
            storageRef={firebaseApp.storage().ref(firebaseStorage.dirname)}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
        />
      </div>
    );
  }
}


const SettingModal = Form.create()((props) => {

  const { visible, isEditModal, onCancel, onCreate, form, userInfo, avatarCallback, avatarUrl } = props;
  var modalTitle = "";
  var modalOk = "";
  if (isEditModal===true) {
    modalTitle = "Edit Your Information";
    modalOk = "Update";
  } else {
    modalTitle = "Add Your Information";
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
            initialValue: userInfo.email,
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
          label="Given Name"
        >
          {getFieldDecorator('firstname', {
            initialValue: userInfo.givenName,
            rules: [{ required: true, message: 'Please input your given name!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          label="Family Name"
        >
          {getFieldDecorator('lastname', {
            initialValue: userInfo.familyName,
            rules: [{ required: true, message: 'Please input your family name!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          label="Team Name"
        >
          {getFieldDecorator('teamName', {
            initialValue: userInfo.teamName,
            rules: [{ required: true, message: 'Please input your team name!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          label="Team Address"
        >
          {getFieldDecorator('teamAddress', {
            initialValue: userInfo.address,
            rules: [{ required: true, message: 'Please input your team address!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          label="Team ZIP"
        >
          {getFieldDecorator('teamZip', {
            initialValue: userInfo.zip,
            rules: [{ required: true, message: 'Please input your team zip!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          label="Team Town"
        >
          {getFieldDecorator('teamTown', {
            initialValue: userInfo.town,
            rules: [{ required: true, message: 'Please input your team town!' }],
          })(
            <Input size="small" />
          )}
        </FormItem>
        <FormItem
          label="Avatar"
        >
          <UploadAvatar 
            avatarCallback={avatarCallback}
            avatarUrl={avatarUrl} />
        </FormItem>
      </Form>

    </Modal>
  );
});


export default SettingModal;