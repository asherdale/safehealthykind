import React from 'react';
import './NavBar.scss';
import mainLogo from '../../assets/images/logo-512.png';


function NavBar() {
  return (
    <div className="NavBar">
      <img  src={mainLogo} className="logoImage" alt="" />
      <p className="logoText">SafeHealthyKind</p>
    </div>
  );
}
  
export default NavBar;  