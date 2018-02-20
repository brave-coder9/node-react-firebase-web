import React, { Component } from 'react';
import { connect } from 'react-redux';
import { subscriptionsConfig, paypalConfig } from '../../config.js';
import FirebaseHelper from '../../helpers/firebase/index';
// import Box from '../../components/utility/box';
import Card from '../../components/uielements/card';
import { Row, Col, notification } from 'antd';
import PaypalExpressBtn from 'react-paypal-express-checkout';


class NewSubscriptions extends Component {

  onSuccess = (payment, categoryInfo, isMonthly) => {
    // Congratulation, it came here means everything's fine!
    console.log("The payment was succeeded!", payment);
    // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data

    FirebaseHelper.addNewSubscription(
      this.props.userInfo.teamUuid,
      categoryInfo,
      isMonthly,
      function successCallback() {
        notification['success']({
          message: 'Subscription Success!'
        })
      },
      function errorCallback(err) {
        notification['error']({
          message: 'Error attaching your subscription into your team',
          description: err.message
        })
      }
    )
  }

  onCancel = (data) => {
    // User pressed "cancel" or close Paypal's popup!
    console.log('The payment was cancelled!', data);
    // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
  }

  onError = (err) => {
    // The main Paypal's script cannot be loaded or somethings block the loading of that script!
    console.log("Error!", err);
    // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
    // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear			
  }

  renderCard = (categoryInfo, index) => {
    return (
      <Col span={6} key={index}>
        <Card style={{ width:200,textAlign:"center" }}>
          <div>
            <h2>{categoryInfo.title}</h2>
          </div>
          <div style={{display:"block"}}>
            <img alt="#" width="100%" src={categoryInfo.image} />
          </div>
          <div>
            <p>{categoryInfo.description}</p>
          </div>
          { categoryInfo.monthly > 0 ?
            <div>
              <a style={{fontSize:"large"}} onClick={()=>this.onSuccess("test", categoryInfo, true)}>
                ${categoryInfo.monthly} / month
              </a>
              <PaypalExpressBtn 
                env={paypalConfig.env} 
                client={paypalConfig.client} 
                currency={paypalConfig.currency} 
                shipping={0} 
                onError={this.onError} 
                onSuccess={payment => this.onSuccess(payment, categoryInfo, true)} 
                onCancel={this.onCancel} 
                total={categoryInfo.monthly} />
            </div>
            :
            <div>
              <a style={{fontSize:"large"}} onClick={()=>this.onSuccess("test", categoryInfo, true)}>
                Free Trial
              </a>
            </div>
          }
          { categoryInfo.yearly > 0 && 
            <div>
              <a style={{fontSize:"large"}} onClick={()=>this.onSuccess("test", categoryInfo, false)}>
                ${categoryInfo.yearly} / year
              </a>
              <PaypalExpressBtn 
                env={paypalConfig.env} 
                client={paypalConfig.client} 
                currency={paypalConfig.currency} 
                shipping={0} 
                onError={this.onError} 
                onSuccess={payment => this.onSuccess(payment, categoryInfo, false)} 
                onCancel={this.onCancel} 
                total={categoryInfo.yearly} />
            </div>
          }
        </Card>
      </Col>
    )
  }

  render() {

    const subscriptionCards = [];
    subscriptionsConfig.categories.forEach((subsc,index) => {
      subscriptionCards.push(this.renderCard(subsc,index));
    })

    return (
      <div style={{ padding: '30px' }}>
        <Row gutter={16}>
          { subscriptionCards }
        </Row>
      </div>
    )
  }
}

export default connect(state => ({
  userInfo: state.Auth.get('userInfo')
}), null)(NewSubscriptions);
