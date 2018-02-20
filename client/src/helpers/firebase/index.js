import firebase from 'firebase';
import { firebaseConfig, firebaseDatabase, siteConfig, pagingConfig } from '../../config.js';
import FirebasePaginator from 'firebase-paginator';
import axios from 'axios';
import moment from 'moment';

// init firebase client
const valid = firebaseConfig  && firebaseConfig.apiKey && firebaseConfig.projectId;
var firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth();
/// init firebase admin
// var admin = require("firebase-admin");
// var serviceAccount = require('./serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: firebaseConfig.databaseURL
// });
// const firebaseAdminAuth = admin.auth();


class FirebaseHelper {

  isValid = valid;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    firebaseAuth.onAuthStateChanged(firebaseUser => {
      console.log('onAuthStateChanged: ', firebaseUser);
    });
  }

  /**
   * Firebase Signup : auth firebase and save user info into db.
   * 
   * @param {Object} values : { email, firstname, lastname, teamName, teamAddress, teamZip, teamTown, password }
   * @param {function} successCallback : (user) => {}
   * @param {function} errorCallback : (err) => {}
   * @memberof FirebaseHelper
   */
  signup(values, successCallback, errorCallback) {
    firebaseAuth.createUserWithEmailAndPassword(values.email, values.password)
      .then(user => {
        // insert user into db
        const teamUuid = Date.now();
        const userObject = {
          "date": teamUuid,
          "email": values.email,
          "avatar": "",
          "givenName": values.firstname,
          "familyName": values.lastname,
          "isAccepted": false,
          "uuid": user.uid,
          "teamName": values.teamName,
          "teamUuid": teamUuid,
          "zip": values.teamZip,
          "town": values.teamTown,
          "address": values.teamAddress,
          "subscription": ""
        };
        const userKey = firebaseDatabase.user.prefix + user.uid;
        const userPath = '/' + firebaseDatabase.user.collection + '/' + userKey;
        firebaseApp.database().ref(userPath).set(userObject).then(val => {
          // insert team into db
          const teamObject = {
            "name": values.teamName,
            "uuid": teamUuid,
            "zip": values.teamZip,
            "town": values.teamTown,
            "address": values.teamAddress,
            "members": [user.uid],
            "subscriptions": []
          };
          const teamKey = firebaseDatabase.team.prefix + teamUuid;
          const teamPath = '/' + firebaseDatabase.team.collection + '/' + teamKey;
          const teamRef = firebaseApp.database().ref(teamPath);
          teamRef.set(teamObject).then(val => {
            // add 3 subscription
            var newSubscription = {
              "type": "trial",
              "uuid": "",
              "user": "",
              "date": "",
              "expirationDate": "",
              "autoRenewal": false
            };
            var subscKey = Date.now();
            var subscriptionPath = '/' + firebaseDatabase.subscription.collection + '/' + firebaseDatabase.subscription.prefix + subscKey;
            newSubscription.uuid = subscKey;  newSubscription.date = subscKey;  newSubscription.expirationDate = moment(subscKey).add(10, 'days').unix();
            firebaseApp.database().ref(subscriptionPath).set(newSubscription).then(v0 => {
              subscKey++;
              subscriptionPath = '/' + firebaseDatabase.subscription.collection + '/' + firebaseDatabase.subscription.prefix + subscKey;
              newSubscription.uuid = subscKey;  newSubscription.date = subscKey;  newSubscription.expirationDate = moment(subscKey).add(10, 'days').unix();
              firebaseApp.database().ref(subscriptionPath).set(newSubscription).then(v1 => {
                subscKey++;
                subscriptionPath = '/' + firebaseDatabase.subscription.collection + '/' + firebaseDatabase.subscription.prefix + subscKey;
                newSubscription.uuid = subscKey;  newSubscription.date = subscKey;  newSubscription.expirationDate = moment(subscKey).add(10, 'days').unix();
                firebaseApp.database().ref(subscriptionPath).set(newSubscription).then(v2 => {
                    teamRef.child('subscriptions').set([subscKey-2,subscKey-1,subscKey]).then(vs => {
                        successCallback(userObject);
                    }).catch(err => errorCallback(err));
                }).catch(err => errorCallback(err));
              }).catch(err => errorCallback(err));
            }).catch(err => errorCallback(err));
            
          }).catch(err => errorCallback(err));
        }).catch(err => errorCallback(err));
      }).catch(err => errorCallback(err));
  }

  /**
   * Firebase Login : auth firebase
   * 
   * @param {Object} values : { email, password }
   * @param {bool} remember : true or false
   * @param {function} successCallback : (user) => {}
   * @param {function} errorCallback : (err) => {}
   * @memberof FirebaseHelper
   */
  login(values, remember, successCallback, errorCallback) {
    firebaseAuth.signInWithEmailAndPassword(values.email, values.password)
      .then(user => {
        // fetch user info
        const userPath = '/' + firebaseDatabase.user.collection + '/' + firebaseDatabase.user.prefix + user.uid;
        firebaseApp.database().ref(userPath).once('value')
          .then(snap => {
            const userObject = snap.val();
            // and then invoke callback
            successCallback(userObject);
          })
          .catch(err => {
            errorCallback(err);
          })
      })
      .catch(err => errorCallback(err));
  }

  /**
   * SignOut Firebase :
   * 
   * @memberof FirebaseHelper
   */
  logout() {
    firebaseAuth.signOut();
  }

  /**
   * Send an email for the Password Reset :
   * 
   * @param {string} email : user's email address
   * @param {function} successCallback : (value) => {}
   * @param {function} errorCallback : (err) => {}
   * @memberof FirebaseHelper
   */
  resetPassword(email, successCallback, errorCallback) {
    firebaseAuth.sendPasswordResetEmail(email)
      .then(value => {
        successCallback(value);
      })
      .catch(err => {
        errorCallback(err);
      })
  }

  listenCaptain(userCaptain, successCallback) {
    // listen captain info
    const captainPath = '/' + firebaseDatabase.user.collection + '/' + firebaseDatabase.user.prefix + userCaptain.uuid;
    this.captainRef = firebaseApp.database().ref(captainPath);
    this.captainRef.on('value', snap => {
      const captain = snap.val();
      successCallback(captain);
    });
  }
  removeListenCaptain() {
    if (this.captainRef) this.captainRef.off();
  }

  /**
   * Add/Remove Listener : 
   * 
   * @param {Object} userCaptain : current user information
   * @param {function} successCallback : (userList) => {}
   * @param {function} errorCallback : (err) => {}
   * @memberof FirebaseHelper
   */
  listenUsersOfTeam(userCaptain, successCallback, errorCallback) {
    const membersPath = '/' + firebaseDatabase.team.collection + '/' + firebaseDatabase.team.prefix + userCaptain.teamUuid + '/members';
    this.membersRef = firebaseApp.database().ref(membersPath);
    this.membersRef.on('value', snap => {
      const userUuids = snap.val();
      const userList = [];
      if (userUuids.length === 1) {
        successCallback(userList);
        return;
      }
      var userIndex = 0;
      userUuids.forEach((userUuid, index) => {
        if (userUuid !== userCaptain.uuid) {
          const userPath = '/' + firebaseDatabase.user.collection + '/' + firebaseDatabase.user.prefix + userUuid;
          firebaseApp.database().ref(userPath).once('value')
            .then(snap => {
              const user = snap.val();
              user.id = userIndex++;
              user.membersIndex = index;
              user.name = user.givenName + ' ' + user.familyName;
              if (user.avatar === undefined || user.avatar === "" ) {
                user.avatar = siteConfig.defaultAvatar;
              }
              userList.push(user);
              if (userList.length === (userUuids.length-1))
                  successCallback(userList);
            })
            .catch(err => {
              errorCallback(err);
              return;
            });
        }
      });
    });
  }
  removeListenUsersOfTeam() {
    if (this.membersRef) this.membersRef.off();
  }

  /**
   * Add/Remove Listener : 
   * 
   * @param {Object} userCaptain : current user information
   * @param {function} successCallback : (subscriptionList) => {}
   * @param {function} errorCallback : (err) => {}
   * @memberof FirebaseHelper
   */
  listenTeamSubscriptions(userCaptain, successCallback, errorCallback) {
    const subscriptionsPath = '/' + firebaseDatabase.team.collection + '/' + firebaseDatabase.team.prefix + userCaptain.teamUuid + '/subscriptions';
    this.subscriptionsRef = firebaseApp.database().ref(subscriptionsPath);
    this.subscriptionsRef.on('value', snap => {
      const subscriptionUuids = snap.val();
      if (!subscriptionUuids) return;
      const subscriptionList = [];
      subscriptionUuids.forEach((subscriptionUuid, index) => {
        const subscriptionPath = '/' + firebaseDatabase.subscription.collection + '/' + firebaseDatabase.subscription.prefix + subscriptionUuid;
        console.log('subscriptionPath = ', subscriptionPath);
        firebaseApp.database().ref(subscriptionPath).once('value').then(snapSubsc => {
          subscriptionList.push(snapSubsc.val());
          if (subscriptionList.length === subscriptionUuids.length)
              successCallback(subscriptionList);
        }).catch(err => errorCallback(err));
      })
    });
  }
  removeListenTeamSubscriptions() {
    if (this.subscriptionsRef) this.subscriptionsRef.off();
  }

  /**
   * Add a new member into members and add new user
   * 
   * @param {Object} userCaptain : -user...
   * @param {Object} values : { email, firstname, lastname, password }
   * @param {function} successCallback : () => {}
   * @param {function} errorCallback : (err) => {}
   * @memberof FirebaseHelper
   */
  addNewMember(userCaptain, values, successCallback, errorCallback) {
    // signup new user
    firebaseAuth.createUserWithEmailAndPassword(values.email, values.password)
      .then(user => {
        // add new user into db
        const userObject = {
          "date": Date.now(),
          "email": values.email,
          "avatar": "",
          "givenName": values.firstname,
          "familyName": values.lastname,
          "isAccepted": false,
          "uuid": user.uid,
          "teamName": userCaptain.teamName,
          "teamUuid": userCaptain.teamUuid,
          "zip": userCaptain.zip,
          "town": userCaptain.town,
          "address": userCaptain.address,
          "subscription": ""
        };
        const userPath = '/' + firebaseDatabase.user.collection + '/' + firebaseDatabase.user.prefix + user.uid;
        firebaseApp.database().ref(userPath).set(userObject).then(val => {
          // push new member
          const membersPath = '/' + firebaseDatabase.team.collection + '/' + firebaseDatabase.team.prefix + userCaptain.teamUuid + '/members';
          firebaseApp.database().ref(membersPath).once('value', snap => {
            firebaseApp.database().ref(membersPath + '/' + snap.numChildren()).set(user.uid).then(value => {
              successCallback(value);
            });
          });
        }).catch(err => {
          errorCallback(err);
        })
      })
      .catch(err => {
        errorCallback(err);
      });
  }

  /**
   * attach/unattach a subscription to a member : 
   * @param {Object} user : member's user info
   * @param {Object} values : { email, firstname, lastname, subscription }
   * @param {function} successCallback : () => {}
   * @param {function} errorCallback : (err) => {}
   */
  attachMemberSubscription(user, values, successCallback, errorCallback) {
    // update the member user's subscription
    const userSubscriptionPath = '/' + firebaseDatabase.user.collection + '/' + firebaseDatabase.user.prefix + user.uuid + '/subscription';
    const userSubscriptionRef = firebaseApp.database().ref(userSubscriptionPath);
    userSubscriptionRef.once('value').then(snap => {
      const originalSubscriptionUuid = snap.val();
      firebaseApp.database().ref(userSubscriptionPath).set(values.subscription).then(val => {
        var userUuid = user.uuid;
        var subscriptionUuid = values.subscription;
        if (values.subscription === "") { // unattach or attach
          userUuid = "";
          subscriptionUuid = originalSubscriptionUuid;
        }
        // update the subscription's user
        const subscriptionUserPath = '/' + firebaseDatabase.subscription.collection + '/' + firebaseDatabase.subscription.prefix + subscriptionUuid + '/user';
        firebaseApp.database().ref(subscriptionUserPath).set(userUuid).then(v => {
          successCallback();
        }).catch(err => errorCallback(err));
      }).catch(err => errorCallback(err));
    }).catch(err => errorCallback(err));
  }

  /**
   * Update user and team information :
   * 
   * @param {Object} user : 
   * @param {function} successCallback : (value) => {}
   * @param {function} errorCallback : (err) => {}
   * @memberof FirebaseHelper
   */
  updateTeamInfo(user, successCallback, errorCallback) {
    const userPath = '/' + firebaseDatabase.user.collection + '/' + firebaseDatabase.user.prefix + user.uuid;
    firebaseApp.database().ref(userPath).update(user).then(value => {
      const teamPath = '/' + firebaseDatabase.team.collection + '/' + firebaseDatabase.team.prefix + user.teamUuid;
      const teamRef = firebaseApp.database().ref(teamPath);
      teamRef.once('value').then(snap => {
        const team = snap.val();
        team.name = user.teamName;
        team.address = user.address;
        team.zip = user.zip;
        team.town = user.town;
        teamRef.update(team).then(value => {
          successCallback(value);
        }).catch(err => errorCallback(err))
      }).catch(err => errorCallback(err))
    }).catch(err => errorCallback(err))
  }

  /**
   * Delete a user of a team :
   * 
   * @param {Object} user : 
   * @param {function} errorCallback : (err) => {}
   * @memberof FirebaseHelper
   */
  deleteUserOfTeam(user, errorCallback) {
    // delete in members
    const membersPath = '/' + firebaseDatabase.team.collection + '/' + firebaseDatabase.team.prefix + user.teamUuid + '/members';
    const membersRef = firebaseApp.database().ref(membersPath);
    membersRef.once('value').then(snap => {
      var members = snap.val();
      members.splice(user.membersIndex, 1);
      membersRef.set(members).catch(err => errorCallback(err));
    }).catch(err => errorCallback(err));
    // delete -user item
    const userPath = '/' + firebaseDatabase.user.collection + '/' + firebaseDatabase.user.prefix + user.uuid;
    firebaseApp.database().ref(userPath).remove().catch(err => errorCallback(err));
    // delete auth user
    axios.post('/api/delete_spec_user', {userUuid: user.uuid})
      .then(res => {
        console.log('axios result = ', res);
      })
      .catch(err => {
        console.log('axios error = ', err);
      })
  }

  /**
   * Add to Subscriptions, Teams
   * 
   * @param {string} teamUuid :
   * @param {Object} categoryInfo :  {
                                  type: "basic"
                                  title: "Basic",
                                  image: "/images/subscription-basic.png",
                                  monthly: 29.95,
                                  yearly: 359.4,
                                  description: "plus tax",
                                }
   * @param {bool} isMonthly : true or false
   * @param {function} successCallback : () => {}
   * @param {function} errorCallback : (err) => {}
   */
  addNewSubscription(teamUuid, categoryInfo, isMonthly, successCallback, errorCallback) {
    // new subscription
    const newSubscriptionUuid = Date.now();
    const diff = isMonthly ? 'months' : 'years';
    var expirationDate;
    if (categoryInfo.monthly > 0) {
      expirationDate = moment(newSubscriptionUuid).add(1, diff).unix();
    } else {  // when it's free trial
      expirationDate = moment(newSubscriptionUuid).add(10, 'days').unix();
    }
    const newSubscriptionObject = {
      "type": categoryInfo.type,
      "uuid": newSubscriptionUuid,
      "user": "",
      "date": newSubscriptionUuid,
      "expirationDate": expirationDate,
      "autoRenewal": false
    };
    const subscriptionPath = '/' + firebaseDatabase.subscription.collection + '/' + firebaseDatabase.subscription.prefix + newSubscriptionUuid;
    firebaseApp.database().ref(subscriptionPath).set(newSubscriptionObject).then(value => {
      // insert into team's subscriptions
      const teamSubscPath = '/' + firebaseDatabase.team.collection + '/' + firebaseDatabase.team.prefix + teamUuid + '/subscriptions';
      const teamSubscRef = firebaseApp.database().ref(teamSubscPath);
      teamSubscRef.once('value').then(snap => {
        const subscs = snap.val() ? snap.val() : [];
        subscs.push(newSubscriptionUuid);
        teamSubscRef.update(subscs).then(val => {
          successCallback();
        }).catch(err => errorCallback(err))
      }).catch(err => errorCallback(err))
    }).catch(err => errorCallback(err))
  }

  /**
   * getPagination : 
   * 
   * @param {string} firebasePath 
   * @param {Object} options : paging options, can be null
   * @param {function} valueCallback : (array) => {}
   * @param {function} isLastPageCallback : () => { isLastPage = true }
   * @returns {FirebasePaginator} : can invoke paginator.next() or paginator.previous()
   */
  getPagination(firebasePath, options, valueCallback, isLastPageCallback) {
    //The paging options
    if (!options)
      options = pagingConfig;
    var ref = firebaseApp.database().ref(firebasePath);
    var paginator = new FirebasePaginator(ref, options);

    // Callback pattern
    paginator.on('value', () => {
      valueCallback(paginator.collection);
    });
    paginator.on('isLastPage', isLastPageCallback);
    return paginator;
  }

  /**
   * listenRooms : 
   * 
   * @param {function} successCallback 
   */
  listenRooms(successCallback) {
    const historyMessagesPath = '/' + firebaseDatabase.chat.collection;
    // get last 10 rooms
    this.roomsRef = firebaseApp.database().ref(historyMessagesPath).limitToLast(pagingConfig.pageSize);
    this.roomsRef.on('value', snap => {
      const rooms = snap.val();
      var roomKeys = Object.keys(rooms);
      // reverse sort
      roomKeys = roomKeys.reverse();
      const roomList = [];
      // get last message for each room
      roomKeys.forEach(roomKey => {
        firebaseApp.database().ref(historyMessagesPath + '/' + roomKey).limitToLast(1).once('value').then(snap1 => {
          roomList.push(snap1.val());
          if (roomList.length === roomKeys.length) {
            successCallback(roomList);
          }
        })
      })
    })
  }
  removeListenRooms() {
    if (this.roomsRef)
      this.roomsRef.off();
  }

  // listenConversations(roomID, successCallback) {
  //   this.removeListenConversations();
  //   // need to renew listen...
  //   this.removeListenConversations();
  //   const roomPath = '/' + firebaseDatabase.chat.collection + '/' + roomID;
  //   this.roomRef = firebaseApp.database().ref(roomPath);
  //   this.roomRef.on('value', snap => {
  //     this.roomRef.limitToLast(1).once('value', snap1 => {
  //       successCallback(snap1.val());
  //     })
  //   })
    
  // }
  // removeListenConversations() {
  //   if (this.roomRef)
  //     this.roomRef.off();
  // }

  sendMessage(roomID, userUuid, userName, inputText, errorCallback) {
    const date = Date.now();
    const uuid = date + userUuid;
    const message = {
      chatroomID: roomID,
      date: date,
      lastMessage: inputText,
      sender: userUuid,
      senderName: userName,
      uuid: uuid
    };
    const messagePath = '/' + firebaseDatabase.chat.collection + '/' + roomID + '/' + uuid;
    firebaseApp.database().ref(messagePath).set(message).catch(err => errorCallback(err));
  }
}

export default new FirebaseHelper();
export { firebaseApp }