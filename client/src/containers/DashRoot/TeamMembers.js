import React, { Component } from 'react';
import { connect } from 'react-redux';
import FirebaseHelper from '../../helpers/firebase';
import { notification, Layout } from 'antd';
import ContactList from '../../components/contacts/contactList';
import EditMemberModal from './EditMemberModal';
import moment from 'moment';
import { DATEformat } from '../../config';


class TeamMembers extends Component {

  state = {
    visibleModal: false,
  }
  contact_id = -1;

  changeContact = (contact_id) => {
    /*  this.props.members[contact_id] = {
          avatar: "",
          email: "",
          familyName: "",
          givenName: "",
          isAccepted: false,
          subscription: "",
          uuid: "",
          ....
        }
    */
    const memberInfo = this.props.members[contact_id];
    const attachedSubscriptions = this.props.subscriptions.filter(subsc => {
      if (subsc.uuid !== memberInfo.subscription) return false;
      return true;
    });
    var subscriptionValue = "Unattach";
    if (attachedSubscriptions.length > 0) {
      const subsc = attachedSubscriptions[0];
      subscriptionValue = `${subsc.type} : (${moment.unix(subsc.expirationDate).format(DATEformat)})`;
    }
    this.modalForm.setFields({
      email: {value: memberInfo.email},
      firstname: {value: memberInfo.familyName},
      lastname: {value: memberInfo.givenName},
      subscription: {value: subscriptionValue}
    });
    this.contact_id = contact_id;
    this.modalShow();
  }

  handleDeleteMember = (contact_id) => {
    FirebaseHelper.deleteUserOfTeam(
      this.props.members[contact_id],
      function errorCallback(err) {
        notification['error']({
          message: 'Deleting a member - Error!',
          description: err.message
        })
      }
    )
  }

  render() {
    const unattachedSubscriptions = this.props.subscriptions.filter(subsc => {
      if (subsc.user !== "") return false;
      return true;
    });
    return (
      <Layout className="isomorphicContacts" style={{ background:"none",padding:0 }}>
        <div className="isoContactListBar ant-layout-sider">
          <ContactList
            contacts={this.props.members}
            changeContact={this.changeContact}
            deleteContact={this.handleDeleteMember.bind(this)}
          />
        </div>
        <EditMemberModal
          ref={this.modalRef}
          visible={this.state.visibleModal}
          onCancel={this.modalCancel}
          onCreate={this.modalCreate}
          subscriptions={unattachedSubscriptions}
        />
      </Layout>
    )
  }

  modalForm = undefined;
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
    // values: see changeContact

    // compare with original subscription
    const orgSubsc = this.props.members[this.contact_id].subscription;
    if (values.subscription === "Unattach")
      values.subscription = "";
    if (orgSubsc === values.subscription) {  // no change
      return;
    }

    // update
    this.props.attachMemberSubscription(this.props.members[this.contact_id], values);
  }

}

export default connect(state => ({
  userInfo: state.Auth.get('userInfo')
}), null)(TeamMembers);
