import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popover from '../uielements/popover';
import authAction from '../../redux/auth/actions';
import SettingModal from './SettingModal';
import { notification } from 'antd';
import FirebaseHelper from '../../helpers/firebase/index';

const { login_success, logout } = authAction;

class TopbarUser extends Component {
  constructor(props) {
    super(props);

    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);

    this.modalCancel = this.modalCancel.bind(this);
    this.modalConfirm = this.modalConfirm.bind(this);
    this.modalCreate = this.modalCreate.bind(this);
    this.modalRef = this.modalRef.bind(this);
    this.modalShow = this.modalShow.bind(this);
    this.setAvatarCallback = this.setAvatarCallback.bind(this);

    this.state = {
      visible: false,
      visibleModal: false,
      isEditModal: true,
    };
  }

  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }
  handleSetting() {
    this.modalShow();
  }

  setAvatarCallback = (url) => {
    this.avatar_url = url;
  }
  modalRef = (form) => {
    this.modalForm = form;
  }
  modalShow = () => {
    this.setState({ visibleModal : true });
  }
  modalCancel = () => {
    this.setState({ visibleModal: false });
  }
  modalCreate = () => {
    const modalForm = this.modalForm;
    modalForm.validateFields((err, values) => {
      if (err) return;
      modalForm.resetFields();
      this.setState({ visibleModal: false });
      this.modalConfirm(values);
    });
  }
  modalConfirm = (values) => {
    // values = { email, firstname, lastname, ...}
    if (this.state.isEditModal) {
      const userInfo = this.props.userInfo;
      userInfo.email = values.email;
      userInfo.givenName = values.firstname;
      userInfo.familyName = values.lastname;
      userInfo.teamName = values.teamName;
      userInfo.zip = values.teamZip;
      userInfo.town = values.teamTown;
      userInfo.address = values.teamAddress;
      userInfo.avatar = this.avatar_url!==undefined ? this.avatar_url : this.props.avatarUrl;

      FirebaseHelper.updateTeamInfo(
        userInfo,
        function successCallback() {
          notification['success']({
            message: 'Updated Your Information!',
          });
        },
        function errorCallback(err) {
          notification['error']({
            message: 'Update Settings - Error!',
            description: err.message
          });
        }
      );
    }
  }

  render() {
    const content = (
      <div className="isoUserDropdownContent">
        <a className="isoDropdownLink" onClick={this.handleSetting.bind(this)}>Settings</a>
        <a className="isoDropdownLink" onClick={this.props.logout}>Logout</a>
      </div>
    );

    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        overlayClassName="isoUserDropdown"
        arrowPointAtCenter={true}
      >
        <div className="isoImgWrapper">
          <img alt="User" src={this.props.avatarUrl} />
          <span className="userActivity online" />
        </div>
        {/* create modal form */}
        <SettingModal
          userInfo={this.props.userInfo}
          ref={this.modalRef}
          visible={this.state.visibleModal}
          isEditModal={this.state.isEditModal}
          onCancel={this.modalCancel}
          onCreate={this.modalCreate}
          avatarCallback={this.setAvatarCallback}
          avatarUrl={this.props.avatarUrl}
        />
      </Popover>
    );
  }
}

export default connect(state => ({
  avatarUrl: state.Auth.get('avatarUrl'),
  userInfo: state.Auth.get('userInfo')
}), { login_success, logout })(TopbarUser);
