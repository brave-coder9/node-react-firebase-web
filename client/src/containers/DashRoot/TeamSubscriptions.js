import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DATEformat } from '../../config.js';
import Card from '../../components/uielements/card';
import moment from 'moment';

/*
  subscriptions: [
    {
      "type": "basic",
      "uuid": "150111222",
      "user": "",
      "date": "1506536727444",
      "expirationDate": "1506536738444",
      "autoRenewal": false
    },
  ]
 */
class TeamSubscriptions extends Component {

  renderSubscription(subsc, index) {
    const cardGridStyle = {
      textAlign: "center",
      padding: 0,
      marginRight: 4,
      marginBottom: 4,
      width: 90,
      height: "auto"
    };
    const expirationDate = moment.unix(subsc.expirationDate).format(DATEformat);
    return (
      <Card.Grid style={cardGridStyle} key={index}>
        <h3>{subsc.type}</h3>
        <div>{expirationDate}</div>
        { subsc.user === "" ? 
          <img alt="used" src="/images/star-white.png" height="30" />
          :
          <img alt="used" src="/images/star-red.png" height="30" />
        }
      </Card.Grid>
    )
  }

  render() {
    const cards = [];
    this.props.subscriptions.forEach((subsc, index) => {
      cards.push(this.renderSubscription(subsc, index));
    });

    return (
      <div style={{ display:"flex",justifyContent:"start",alignItems:"center" }}>
        <Card bordered={false} noHovering={true}>
          {cards}
        </Card>
      </div>
    )
  }
}

export default connect(state => ({
  userInfo: state.Auth.get('userInfo')
}), null)(TeamSubscriptions);
