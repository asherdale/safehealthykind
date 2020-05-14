import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button, Input, IconButton } from '@material-ui/core';
import { Search, Clear } from '@material-ui/icons';
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
    const { searchValue, onSearchClear, onSearchChange } = this.props;
    const { isContactDialogOpen } = this.state;

    return (
      <div className="NavBar">
        <div className="start">
          <img src={mainLogo} className="logo-image" alt="" />
          <Typography variant="h5" className="logo-text">SafeHealthyKind</Typography>

          <div>
            <Input
              disableUnderline
              className="search-box"
              placeholder="Search"
              startAdornment={
                <Search className="search-icon" />
              }
              endAdornment={
                searchValue &&
                  (<IconButton className="clear-icon" onClick={onSearchClear}>
                    <Clear />
                  </IconButton>)
              }
              value={searchValue}
              onChange={onSearchChange}
            />
          </div>
        </div>

        <div className="end">
          <Button className="contact-us" size="large" onClick={this.handleContactClick}>
            Contact Us
          </Button>
        </div>

        <ContactUsDialog isOpen={isContactDialogOpen} handleClose={this.handleContactDialogClose} />
      </div>
    );
  }
};

NavBar.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearchClear: PropTypes.func.isRequired,
};
  
export default NavBar;  