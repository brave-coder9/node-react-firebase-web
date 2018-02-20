import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, notification, Alert } from 'antd';
import moment from 'moment';
import PageHeader from '../../components/utility/pageHeader';
import Box from '../../components/utility/box';
import Button from '../../components/uielements/button';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import ContentHolder from '../../components/utility/contentHolder';
import basicStyle from '../../config/basicStyle';
import { firebaseDatabase, subscriptionsConfig } from '../../config.js';
import FirebaseHelper from '../../helpers/firebase/index';
import AddNewModal from './AddNewModal';
import TeamDetailForm from './TeamDetailForm';
import NewSubscriptions from './NewSubscriptions';
import TeamSubscriptions from './TeamSubscriptions';
import TeamMembers from './TeamMembers';
import TeamChat from './TeamChat';

class DashRoot extends Component {
  constructor(props) {
    super(props);

    this.modalCancel = this.modalCancel.bind(this);
    this.modalConfirm = this.modalConfirm.bind(this);
    this.modalCreate = this.modalCreate.bind(this);
    this.modalRef = this.modalRef.bind(this);
    this.modalShow = this.modalShow.bind(this);

    this.state = {
      members: [],
      subscriptions: [],
      visibleModal: false,
      isEditModal: false,
    };
  }

  componentWillMount() {
    this.listenOn();
  }

  componentWillUnmount() {
    this.listenOff();
  }

  listenOn = () => {
    FirebaseHelper.listenUsersOfTeam(
      this.props.userInfo,
      function successCallback(userList) {
        this.setState({ members: userList });
      }.bind(this),
      function errorCallback(err) {
        notification['error']({
          message: 'Fetch Members - Error!',
          description: err.message
        })
      }
    );
    FirebaseHelper.listenTeamSubscriptions(
      this.props.userInfo,
      function successCallback(subscriptionList) {
        this.setState({ subscriptions: subscriptionList });
      }.bind(this),
      function errorCallback(err) {
        notification['error']({
          message: 'Fetch Subscriptions - Error!',
          description: err.message
        })
      }
    );
  }
  listenOff = () => {
    FirebaseHelper.removeListenUsersOfTeam();
    FirebaseHelper.removeListenTeamSubscriptions();
  }

  handleAddMember() {
    this.modalShow();
  }

  handleUpdateTeamDetails(e) {
    e.preventDefault();
    this.teamDetailForm.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const userInfo = this.props.userInfo;
        userInfo.teamName = values.teamName;
        userInfo.address = values.teamAddress;
        userInfo.zip = values.teamZip;
        userInfo.town = values.teamTown;
        FirebaseHelper.updateTeamInfo(
          userInfo,
          function successCallback(value) {
            notification['success']({
              message: 'Updated your team information!',
            })
          },
          function errorCallback(err) {
            notification['error']({
              message: 'Error!',
              description: err.message
            })
          }
        );
      }
    });
  }

  teamDetailFormRef = (form) => {
    this.teamDetailForm = form;
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
    // values = { email, firstname, lastname }
    values.password = firebaseDatabase.defaultPassword;
    if (!this.state.isEditModal) {
      // register new member
      FirebaseHelper.addNewMember(
        this.props.userInfo,
        values,
        function successCallback() {
          notification['success']({
            message: 'New Member Added!',
          });
        },
        function errorCallback(err) {
          notification['error']({
            message: 'Add Member - Error!',
            description: err.message
          });
        }
      );
    }
  }

  attachMemberSubscription = (memberUser, values) => {
    FirebaseHelper.attachMemberSubscription(
      memberUser,
      values,
      function successCallback() {
        notification['success']({
          message: "Member's Subscription Updated!",
        });
        // refresh members, subscriptions
        this.listenOff();
        this.listenOn();
      }.bind(this),
      function errorCallback(err) {
        notification['error']({
          message: "Updating Member's Subscription - Error!",
          description: err.message
        });
      }
    );
  }

  renewMonth = (subscription) => {
    
  }

  renewYear = (subscription) => {
    
  }

  renderReminder = () => {
    const { subscriptions } = this.state;
    const subscAlerts = [];
    subscriptions.forEach((subsc,index) => {
      const diffDays = moment.unix(subsc.expirationDate).diff(moment(), 'days');
      if (diffDays < subscriptionsConfig.reminderDays) {
        const msg = <div>
                      Your subscription "{subsc.type}" license remains {diffDays} days.
                      <Button onClick={() => this.renewMonth(subsc)} style={{marginLeft:10}} type="primary" size="small">Renew for 1 month</Button>
                      <Button onClick={() => this.renewYear(subsc)} style={{marginLeft:10}} type="primary" size="small">Renew for 1 year</Button>
                    </div>
        subscAlerts.push(
          <Alert message="Expiration Notice" description={msg} type="warning" banner showIcon closable style={{width:"100%",margin:10}}></Alert>
        );
      }
    });
    return subscAlerts;
  }

  render() {
    const { rowStyle, colStyle, gutter } = basicStyle;
    return (
      <LayoutWrapper>
        <PageHeader>
            TEAM
        </PageHeader>
        { this.renderReminder() }
        <Row style={rowStyle} gutter={gutter}>
            {/* Left Side */}
            <Col md={11} sm={11} xs={22} style={colStyle}>
              <Box title="">
                <Row type="flex" justify="space-between" align="middle" style={{marginTop:10, marginBottom:10}}>
                  <h3>Team Members</h3>
                  <Button icon="plus-circle" type="primary" onClick={this.handleAddMember.bind(this)} >Add</Button>
                </Row>
                <ContentHolder>
                  <TeamMembers 
                    members={this.state.members}
                    subscriptions={this.state.subscriptions}
                    attachMemberSubscription={this.attachMemberSubscription} />
                </ContentHolder>
                {/* Team Subscriptions */}
                <Row type="flex" justify="space-between" align="middle" style={{marginTop:30, marginBottom:10}}>
                  <h3>Team Subscriptions</h3>
                </Row>
                <ContentHolder>
                  <TeamSubscriptions subscriptions={this.state.subscriptions} />
                </ContentHolder>
              </Box>
            </Col>
            {/* Right Side */}
            <Col md={11} sm={11} xs={22} style={colStyle}>
              {/* Team Detail */}
              <Box title="">
                <Row type="flex" justify="space-between" align="middle" style={{marginTop:10, marginBottom:10}}>
                  <h3>Team Details</h3>
                  <Button type="primary" onClick={this.handleUpdateTeamDetails.bind(this)} >Update</Button>
                </Row>
                <ContentHolder>
                  <TeamDetailForm
                    userInfo={this.props.userInfo}
                    ref={this.teamDetailFormRef}
                  />
                </ContentHolder>
              </Box>
            </Col>
        </Row>
        <Row style={rowStyle} gutter={gutter}>
          <NewSubscriptions />
        </Row>
        {/* create modal form */}
        <AddNewModal
          ref={this.modalRef}
          visible={this.state.visibleModal}
          isEditModal={this.state.isEditModal}
          onCancel={this.modalCancel}
          onCreate={this.modalCreate}
        />
        {/* create TeamChat */}
        <TeamChat />
      </LayoutWrapper>
    )
  }
}

export default connect(state => ({
  userInfo: state.Auth.get('userInfo')
}), null)(DashRoot);
