import React from 'react';
import { Typography } from '@material-ui/core';
import './NavBar.scss';
import mainLogo from '../../assets/images/logo-512.png';


function NavBar() {
  return (
    <div className="NavBar">
      <img  src={mainLogo} className="logoImage" alt="" />
      <Typography variant="h5" color="primary" className="logoText">SafeHealthyKind</Typography>
    </div>
  );
}
  
export default NavBar;  