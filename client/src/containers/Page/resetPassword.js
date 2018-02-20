import React from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';

class ResetPassword extends React.Component {
  render() {
    return (
      <div className="isoResetPassPage">
        <div className="isoFormContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              <IntlMessages id="page.resetPassTitle" />
            </Link>
          </div>

          <div className="isoFormHeadText">
            <h3>
              <IntlMessages id="page.resetPassSubTitle" />
            </h3>
            <p>
              <IntlMessages id="page.resetPassDescription" />
            </p>
          </div>

          <div className="isoResetPassForm">
            <div className="isoInputWrapper">
              <Input size="large" type="password" placeholder="New Password" />
            </div>

            <div className="isoInputWrapper">
              <Input
                size="large"
                type="password"
                placeholder="Confirm Password"
              />
            </div>

            <div className="isoInputWrapper">
              <Button type="primary">
                <IntlMessages id="page.resetPassSave" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;