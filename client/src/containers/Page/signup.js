import React from 'react';
import { connect } from 'react-redux';
import AuthActions from '../../redux/auth/actions';
import { Link } from 'react-router-dom';
// import Auth0 from '../../helpers/auth0/index';
import FirebaseHelper from '../../helpers/firebase';
// import FirebaseLogin from '../../components/firebase';
import IntlMessages from '../../components/utility/intlMessages';
import { notification, Spin } from 'antd';
import SignupForm from './SignupForm';


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.refSignupForm = this.refSignupForm.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.state = {
      redirectToReferrer: false,
      loading: false
    };
  }
  
  // componentWillReceiveProps(nextProps) {
  //   if (this.props.isLoggedIn !== nextProps.isLoggedIn && nextProps.isLoggedIn === true) {
  //     this.setState({ redirectToReferrer: true });
  //   }
  // }

  refSignupForm(form) {
    this.signupForm = form;
  }

  /**
   * Signup Handler :
   * 
   * @param {Object} values : { email, firstname, lastname, teamName, teamAddress, teamZip, teamTown, password }
   * @memberof SignUp
   */
  handleSignup(values) {
    this.setState({loading: true});
    FirebaseHelper.signup(
      values,
      function successCallback(userObject) {
        this.props.login_success(userObject);
        this.setState({loading: false});
        this.props.history.push('/dashboard');
      }.bind(this),
      function errorCallback(err) {
        notification['error']({
          message: "SignUp Error!",
          description: err.message
        });
        this.setState({loading: false});
      }.bind(this)
    );
  }

  render() {
    return (
      <div className="isoSignUpPage">
        <div className="isoSignUpContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              <img src="/images/logo.png" alt="logo" height="60" style={{marginTop:5}} />
            </Link>
          </div>

          <Spin spinning={this.state.loading} size="large" >
          <div className="isoSignUpForm">
            <SignupForm 
              ref={this.refSignupForm}
              onSubmit={this.handleSignup}
            />
            <div className="isoInputWrapper isoCenterComponent isoHelperWrapper" style={{marginBottom:40}} >
              <Link to="/signin">
                <IntlMessages id="page.signUpAlreadyAccount" />
              </Link>
            </div>
          </div>
          </Spin>

        </div>
      </div>
    );
  }
}

const { login_success } = AuthActions;

export default connect(null, {
  login_success
})(SignUp);
