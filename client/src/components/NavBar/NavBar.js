import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import './NavBar.scss';
import mainLogo from '../../assets/images/logo512a.png';
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

    return (
      <div className="NavBar">
        <Link to="/">
          <div className="logo">
            <img src={mainLogo} className="logo-image" alt="" />
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