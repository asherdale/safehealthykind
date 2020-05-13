import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Input, IconButton } from '@material-ui/core';
import { Search, Clear } from '@material-ui/icons';
import './NavBar.scss';
import mainLogo from '../../assets/images/logo512a.png';

const NavBar = ({ value, onChange, onClear }) => {
  return (
    <div className="NavBar">
      <img  src={mainLogo} className="logoImage" alt="" />
      <Typography variant="h5" className="logoText">SafeHealthyKind</Typography>

      <div>
        <Input
          disableUnderline
          className="search-box"
          placeholder="Search"
          startAdornment={
            <Search className="search-icon" />
          }
          endAdornment={
            value &&
              (<IconButton className="clear-icon" onClick={onClear}>
                <Clear />
              </IconButton>)
          }
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

NavBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};
  
export default NavBar;  