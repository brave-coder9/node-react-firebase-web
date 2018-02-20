import React, { Component } from 'react';
import { connect } from 'react-redux';
import FirebaseHelper from '../../helpers/firebase';
import moment from 'moment';
import { SideBar, ChatList, MessageList, Input, Button } from './react-chat-elements/src';
import ChatAction from '../../redux/chat/actions';
import './TeamChat.css';
import { firebaseDatabase } from '../../config';
import { notification } from 'antd';

class TeamChat extends Component {

  constructor(props) {
    super(props);

    this.fetchRoomList = this.fetchRoomList.bind(this);
    this.updateNewConvList = this.updateNewConvList.bind(this);

    this.isLoadMessageFirst = true;
    this.roomID = undefined;
    this.state = {
      showChat: false,
      messageList: [],
      isLastMessagePagination: false,
    };
  }

  componentDidMount() {
    // for test
    // this.setState({
    //   roomList: [
    //     {
    //       id: "0",
    //       avatar: "/images/chat-icon.png",
    //       avatarFlexible: true,
    //       statusColor: "lightgreen",
    //       alt: "@",
    //       title: "David",
    //       date: new Date(),
    //       subtitle: "Hey there",
    //       unread: 2,
    //       // dropdownMenu: (<Dropdown/>),
    //       dateString: moment(new Date()).format('HH:mm'),
    //     }
    //   ]
    // });

    FirebaseHelper.listenRooms(this.fetchRoomList);
  }

  componentWillUnmount() {
    FirebaseHelper.removeListenRooms();
  }

  fetchRoomList(rooms) {
    console.log('fetchRoomList');
    const roomList = [];
    const roomsNewConvList = [];
    rooms.forEach((room,index) => {
      const roomObj = room[Object.keys(room)[0]];
      roomList.push({
        id: ""+index,
        avatar: "/images/chat-icon.png",
        avatarFlexible: true,
        statusColor: "lightgreen",
        alt: "@",
        title: roomObj.senderName,
        date: roomObj.date,
        subtitle: roomObj.lastMessage,
        unread: 0,
        // dropdownMenu: (<Dropdown/>),
        dateString: moment(Number(roomObj.date)).format('HH:mm'),
        chatroomID: roomObj.chatroomID,
        convUuid: roomObj.uuid
      });
      roomsNewConvList.push({
        convUuid: roomObj.uuid,
        roomID: roomObj.chatroomID,
        newsCount: 0
      });
    });
    this.updateNewConvList(roomList, roomsNewConvList);
  }

  updateNewConvList(roomList, roomsNewConvList) {
    if (this.props.roomsNewConvList.length === 0) {
      this.props.fetch_room_success(roomList, roomsNewConvList);
      return;
    }
    console.log('updateNewConvList');
    for (let i = 0; i < roomsNewConvList.length; i++) {
      var oldConv = undefined;
      if (i < this.props.roomsNewConvList.length)
        oldConv = this.props.roomsNewConvList[i];
      const newConv = roomsNewConvList[i];
      if (oldConv !== undefined) {
        if (oldConv.convUuid !== newConv.convUuid) {
          console.log('New message detected');
          roomsNewConvList[i].newsCount = oldConv.newsCount + 1;
          if (newConv.roomID === this.roomID) {
            console.log('New message detected in current room');
            // initialize MessageList
            this.isLoadMessageFirst = true;
            this.setState({
              messageList: [],
              isLastMessagePagination: false,
            });
            this.pagination.reset().then(() => {
              console.log('resetted paginator, goToPage 1');
              this.pagination.goToPage(1);
            });
          }
        } else {
          roomsNewConvList[i].newsCount = oldConv.newsCount;
        }
      }
    }
    this.props.fetch_room_success(roomList, roomsNewConvList);
  }

  handleIconClick() {
    this.setState({showChat: !this.state.showChat});
  }

  handleRoomClick(room, i, e) {
    console.log('handleRoomClick');
    // initialize MessageList
    this.isLoadMessageFirst = true;
    this.setState({
      messageList: [],
      isLastMessagePagination: false,
    });

    const userUuid = this.props.userInfo.uuid;
    // fetch MessageList
    this.roomID = room.chatroomID;
    const convsPath = '/' + firebaseDatabase.chat.collection + '/' + this.roomID;
    this.pagination = FirebaseHelper.getPagination(
      convsPath,
      null,
      function fetchPageConvs(convs) {
        console.log('convs = ', convs);
        const messageList = [];
        Object.keys(convs).forEach(key => {
          const convObj = convs[key];
          messageList.push({
            type: 'text',
            status: 'read',
            forwarded: true,
            theme: 'white',
            titleColor: '#000',
            view: 'list',
            position: convObj.sender===userUuid ? 'right' : 'left',
            title: convObj.senderName,
            text: convObj.lastMessage,
            date: convObj.date,
            dateString: moment(Number(convObj.date)).format('HH:mm'),
            data: {
              status: {
                click: false,
                loading: 0
              }
            }
          });
        });
        const messageListState = messageList.concat(this.state.messageList);
        console.log('messageListState = ', messageListState);
        this.setState({
          messageList: messageListState
        });
      }.bind(this),
      function() {
        console.log('LAST_PAGE, LAST_PAGE, LAST_PAGE');
        this.setState({
          isLastMessagePagination: true
        });
      }.bind(this)
    );

    // listen conversations
    // FirebaseHelper.listenConversations(
    //   this.roomID,
    //   function convListener(lastConv) {
    //     console.log('------ conversation list changed ------');
    //     this.state.roomList[i].convUuid
    //   }.bind(this)
    // );
  }

  handleScroll(e) {
    const scrollTop = e.target.scrollTop;
    const scrollBottom = e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight;
    if (scrollTop === 0) {
      console.log('<<< scrollTop >>>');
      if (!this.state.isLastMessagePagination && !this.isLoadMessageFirst) {
        this.pagination.previous();
      }
    } else if (scrollBottom === 0) {
      console.log('<<< scrollBottom >>>');
      if (this.isLoadMessageFirst)
        this.isLoadMessageFirst = false;
    }
  }

  // for test
  handleReset() {
    this.pagination.reset();
  }
  handlePrevious() {
    this.pagination.previous();
  }
  handleNext() {
    this.pagination.next();
  }

  handleSendMessage() {
    var inputText = this.refs.input.state.value;
    inputText.trim();
    if (inputText === "" || this.roomID === undefined)
      return;
    this.refs.input.clear();
    // save it to database
    FirebaseHelper.sendMessage(this.roomID, this.props.userInfo.uuid, this.props.userInfo.givenName, inputText, (err) => {
      notification['error']({
        message: 'Sending message failed',
        description: err.message
      })
    });
  }

  render() {

    return (
      <div style={{ position:"fixed", right:30, bottom:20, zIndex:99999 }}>
          {/* Chat Icon */}
          <div hidden={this.state.showChat}>
            <a onClick={this.handleIconClick.bind(this)}>
              <img alt="CHAT" src="/images/chat-icon.png" height="60" />
            </a>
          </div>
          
          <div hidden={!this.state.showChat}>
            {/* Header */}
            <div className="sc-header">
              <img className="sc-header--img" src="" alt="" />
              <div className="sc-header--team-name" onClick={this.handleReset.bind(this)}>Paginator-Reset</div>
              <div className="sc-header--team-name" onClick={this.handlePrevious.bind(this)}>Paginator-Previous</div>
              <div className="sc-header--team-name" onClick={this.handleNext.bind(this)}>Paginator-Next</div>
              <div className="sc-header--close-button" onClick={this.handleIconClick.bind(this)}>
                <img src="/images/close-icon.png" alt="X" />
              </div>
            </div>
            {/* Body */}
            <div className='chat-container'>
              <div className='chat-list'>
                <SideBar
                  top={<div></div>}
                  center={
                    <ChatList
                      dataSource={this.props.roomList}
                      onClick={this.handleRoomClick.bind(this)}
                    />
                  }
                  bottom={<div></div>}
                />
              </div>
              <div className='right-panel'>
                <MessageList
                  className='message-list'
                  lockable={true}
                  onScroll={this.handleScroll.bind(this)}
                  dataSource={this.state.messageList} />
                <Input
                  placeholder="Your Message..."
                  defaultValue=""
                  ref='input'
                  multiline={true}
                  // buttonsFloat='left'
                  onKeyPress={(e) => {
                      if (e.shiftKey && e.charCode === 13) {
                          return true;
                      }
                      if (e.charCode === 13) {
                          this.handleSendMessage();
                          e.preventDefault();
                          return false;
                      }
                  }}
                  rightButtons={
                      <Button
                          text='Send'
                          onClick={this.handleSendMessage.bind(this)} />
                  }
                />
              </div>
            </div>
          </div>

      </div>
    )
  }

}

const { fetch_room_success } = ChatAction;

export default connect(state => ({
  userInfo: state.Auth.get('userInfo'),
  roomList: state.Chat.get('roomList'),
  roomsNewConvList: state.Chat.get('roomsNewConvList'),  // [ {convUuid:"xxxx", roomID:"yyyy", newsCount:0}, ... ]
}), {
  fetch_room_success
})(TeamChat);
