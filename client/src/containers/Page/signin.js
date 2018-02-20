import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthActions from '../../redux/auth/actions';
import FirebaseHelper from '../../helpers/firebase';
import SigninForm from './SigninForm';
import { notification } from 'antd';


class SignIn extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      redirectToReferrer: false
    };
  }
  
  // componentWillReceiveProps(nextProps) {
  //   if (this.props.isLoggedIn !== nextProps.isLoggedIn && nextProps.isLoggedIn === true) {
  //     this.setState({ redirectToReferrer: true });
  //   }
  // }

  /**
   * Signin Handler :
   * 
   * @param {Object} values : { email, password }
   * @param {bool} remember : true or false
   * @memberof SignIn
   */
  handleLogin(values, remember) {
    FirebaseHelper.login(
      values,
      remember,
      function successCallback(userObject) {
        this.props.login_success(userObject);
        this.props.history.push('/dashboard');
      }.bind(this),
      function errorCallback(err) {
        notification['error']({
          message: "Login Error!",
          description: err.message
        });
      }
    );
  }

  render() {
    const from = { pathname: '/dashboard' };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <div className="isoSignInPage">
        <div className="isoLoginContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              <img src="/images/logo.png" alt="logo" height="60" style={{marginTop:5}} />
            </Link>
          </div>

          <div className="isoSignInForm">
            
            <SigninForm 
              onSubmit={this.handleLogin}
            />

            <div className="isoCenterComponent isoHelperWrapper">
              <Link to="/forgotpassword" className="isoForgotPass">
                Forgot password?
              </Link>
              <Link to="/signup">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const { login_success } = AuthActions;

export default connect(null, {
  login_success
})(SignIn);

