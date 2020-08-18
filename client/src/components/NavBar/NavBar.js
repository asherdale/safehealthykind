import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import './NavBar.scss';
import ContactUsDialog from '../ContactUsDialog';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isContactDialogOpen: false,
    };
  }

  handleContactClick = () => {
    this.setState({ isContactDialogOpen: true });
  }

  handleContactDialogClose = () => {
    this.setState({ isContactDialogOpen: false });
  }

  render() {
    const { isContactDialogOpen } = this.state;
    const { location } = this.props;

    if (location.pathname.startsWith('/posts/')) {
      return null;
    }

    return (
      <div className="NavBar">
        <Link to="/">
          <div className="logo">
            <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M28.9388 0C34.1659 0 39.2979 3.77689 39.2979 10.3267C39.2979 23.2829 22.904 33.8486 20.0528 35.0916C19.8152 35.2351 19.4826 35.1873 19.1975 35.0916C16.2989 33.8486 -3.05176e-05 23.2351 -3.05176e-05 10.3267C-3.05176e-05 3.77689 5.13198 0 10.359 0C15.2535 0 17.9145 2.91634 19.3401 6.11952C19.4351 6.35857 19.8628 6.35857 19.9578 6.11952C21.3834 2.91634 24.0444 0 28.9388 0ZM25.4225 20.5578C25.2324 21.0358 25.47 21.5139 25.7551 21.9442L25.7551 21.9442C25.8026 21.992 25.8977 22.0876 25.9452 22.1833C26.0402 22.3745 26.1828 22.5179 26.3728 22.6135C26.6104 22.7091 26.848 22.6613 27.0856 22.5657C29.1764 21.8008 30.9346 20.3665 32.2176 18.5498C33.4531 16.7331 34.2134 14.5817 34.4985 12.3825C34.6411 11.2829 34.6411 10.0876 34.4035 8.98803C34.1659 7.88843 33.6432 6.78883 32.7879 6.02389C31.885 5.16333 30.602 4.73305 29.3665 4.78086C26.2778 4.92429 23.9494 8.46214 25.565 11.3307C26.4204 12.8605 28.4161 13.6733 30.0793 13.1474C29.9843 15.6813 28.5587 18.1195 26.4204 19.5538C26.4094 19.5607 26.3984 19.5676 26.3873 19.5746C26.0131 19.8095 25.5609 20.0934 25.4225 20.5578Z" fill="#3643C0"/>
            </svg>

            <Typography variant="h5" className="logo-text">SafeHealthyKind</Typography>
          </div>
        </Link>

        <div className="end">
          <Button className="navbar-button" size="large">
            <Link to="/about">About</Link>
          </Button>

          { location.pathname === '/about' &&
            <Button className="navbar-button" size="large" onClick={this.handleContactClick}>
              Contact
            </Button>
          }
        </div>

        <ContactUsDialog isOpen={isContactDialogOpen} handleClose={this.handleContactDialogClose} />
      </div>
    );
  }
};

NavBar.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};
  
export default withRouter(NavBar);