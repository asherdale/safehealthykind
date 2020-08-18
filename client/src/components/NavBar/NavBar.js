import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
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
          <svg className="logo" width="285" height="36" viewBox="0 0 285 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0)">
              <path d="M57.3083 28.4413C53.0056 28.4413 49.6924 26.1895 49.6302 22.2787H54.0765C54.196 23.9377 55.2908 25.0325 57.2175 25.0325C59.1442 25.0325 60.3299 23.9951 60.3299 22.5178C60.3299 18.0381 49.6589 20.7345 49.6924 13.2381C49.6924 9.50423 52.7139 7.25244 56.9832 7.25244C61.2526 7.25244 64.1259 9.4134 64.3936 13.1473H59.8279C59.737 11.7847 58.6422 10.7186 56.8637 10.6899C55.2334 10.6277 53.9952 11.4309 53.9952 13.1186C53.9952 17.2684 64.604 14.9592 64.604 22.25C64.6279 25.5106 62.0223 28.4413 57.3083 28.4413Z" fill="#3643C0"/>
              <path d="M73.745 11.5507C74.792 11.5147 75.8321 11.7329 76.7763 12.1867C77.7205 12.6404 78.5406 13.3163 79.1665 14.1563V11.8137H83.345V28.236H79.1665V25.8169C78.5449 26.6727 77.7232 27.3633 76.7731 27.8283C75.8231 28.2934 74.7736 28.5187 73.7163 28.4846C69.5665 28.4846 66.2438 25.0758 66.2438 19.9459C66.2438 14.8161 69.5665 11.5507 73.745 11.5507ZM74.8112 15.1937C72.5881 15.1937 70.5084 16.8527 70.5084 19.9746C70.5084 23.0965 72.612 24.8655 74.8112 24.8655C77.0104 24.8655 79.1665 23.1491 79.1665 20.0368C79.1665 16.9244 77.0916 15.1937 74.8112 15.1937Z" fill="#3643C0"/>
              <path d="M87.1458 15.2222H85.2812V11.8134H87.1458V10.9959C87.1458 6.96563 89.431 5.09631 94.0542 5.21583V8.70109C92.0366 8.64372 91.3577 9.29392 91.3577 11.1346V11.8134H94.2263V15.2222H91.3577V28.2358H87.1458V15.2222Z" fill="#3643C0"/>
              <path d="M102.923 28.5033C98.1418 28.5033 94.6805 25.1806 94.6805 20.0268C94.6805 14.873 98.0606 11.5503 102.923 11.5503C107.665 11.5503 111.012 14.7774 111.012 19.6778C111.017 20.2139 110.978 20.7494 110.897 21.2794H98.8924C99.098 23.7081 100.757 25.0754 102.832 25.0754C103.521 25.1201 104.207 24.9525 104.798 24.5952C105.388 24.2379 105.855 23.708 106.135 23.077H110.615C109.712 26.1033 106.982 28.5033 102.923 28.5033ZM98.9211 18.4634H106.714C106.657 16.3025 104.935 14.9399 102.803 14.9399C100.819 14.9591 99.2462 16.2547 98.9211 18.4826V18.4634Z" fill="#3643C0"/>
              <path d="M126.378 19.4341H117.514V28.2357H113.364V7.54883H117.514V16.054H126.378V7.54883H130.518V28.2357H126.368L126.378 19.4341Z" fill="#3643C0"/>
              <path d="M141.17 28.5033C136.389 28.5033 132.932 25.1806 132.932 20.0268C132.932 14.873 136.308 11.5503 141.17 11.5503C145.912 11.5503 149.264 14.7774 149.264 19.6778C149.269 20.2141 149.229 20.7498 149.144 21.2794H137.139C137.345 23.7081 139.009 25.0754 141.084 25.0754C141.772 25.1184 142.456 24.9501 143.046 24.5929C143.636 24.2357 144.102 23.7067 144.382 23.077H148.857C147.959 26.1033 145.233 28.5033 141.17 28.5033ZM137.168 18.4634H144.966C144.904 16.3025 143.187 14.9399 141.05 14.9399C139.066 14.9591 137.498 16.2547 137.168 18.4826V18.4634Z" fill="#3643C0"/>
              <path d="M157.96 11.5507C159.007 11.5147 160.047 11.7329 160.991 12.1867C161.936 12.6404 162.756 13.3163 163.382 14.1563V11.8137H167.565V28.236H163.382V25.8169C162.76 26.6727 161.938 27.3633 160.988 27.8283C160.038 28.2934 158.989 28.5187 157.931 28.4846C153.782 28.4846 150.459 25.0758 150.459 19.9459C150.459 14.8161 153.782 11.5507 157.96 11.5507ZM159.026 15.1937C156.803 15.1937 154.7 16.8527 154.7 19.9746C154.7 23.0965 156.813 24.8607 159.026 24.8607C161.24 24.8607 163.382 23.1443 163.382 20.032C163.382 16.9196 161.307 15.1937 159.026 15.1937Z" fill="#3643C0"/>
              <path d="M170.725 6.30127H174.875V28.2359H170.725V6.30127Z" fill="#3643C0"/>
              <path d="M178.704 15.2221H176.749V11.8134H178.704V7.75439H182.883V11.8134H186.559V15.2221H182.883V23.1679C182.883 24.2628 183.332 24.7361 184.633 24.7361H186.545V28.2357H183.939C180.794 28.2357 178.68 26.9018 178.68 23.1393L178.704 15.2221Z" fill="#3643C0"/>
              <path d="M188.792 6.30127H192.942V13.8646C193.56 13.1193 194.341 12.526 195.224 12.1306C196.108 11.7352 197.071 11.5482 198.038 11.5841C201.743 11.5841 204.44 14.075 204.44 18.6072V28.2359H200.29V19.1523C200.29 16.5132 198.856 15.0933 196.647 15.0933C194.438 15.0933 192.942 16.5276 192.942 19.1523V28.2359H188.792V6.30127Z" fill="#3643C0"/>
              <path d="M218.008 11.8135H222.421L212.271 35.9999H207.853L211.41 27.8199L204.827 11.8135H209.479L213.72 23.2876L218.008 11.8135Z" fill="#3643C0"/>
              <path d="M227.904 19.0181V28.2357H223.745V7.54883H227.895V16.8237L235.425 7.54883H240.435L231.906 17.8038L240.684 28.2357H235.425L227.904 19.0181Z" fill="#3643C0"/>
              <path d="M241.912 7.42973C241.887 6.92003 242.016 6.41458 242.281 5.97861C242.546 5.54264 242.936 5.19615 243.4 4.98385C243.864 4.77156 244.381 4.7032 244.885 4.78761C245.388 4.87201 245.854 5.1053 246.224 5.45738C246.593 5.80945 246.848 6.26414 246.957 6.76279C247.065 7.26143 247.022 7.78114 246.832 8.25484C246.642 8.72855 246.315 9.13451 245.892 9.42035C245.47 9.70618 244.971 9.85877 244.461 9.85842C244.132 9.87393 243.803 9.82263 243.495 9.7076C243.187 9.59258 242.905 9.41622 242.667 9.1892C242.429 8.96217 242.239 8.6892 242.109 8.38678C241.98 8.08437 241.913 7.75879 241.912 7.42973V7.42973ZM242.357 11.8138H246.507V28.2361H242.357V11.8138Z" fill="#3643C0"/>
              <path d="M261.131 19.1664C261.131 16.5274 259.697 15.1075 257.484 15.1075C255.27 15.1075 253.778 16.5417 253.778 19.1664V28.2501H249.633V11.8134H253.778V13.8644C254.373 13.129 255.129 12.5406 255.988 12.1451C256.847 11.7495 257.786 11.5575 258.731 11.5839C262.556 11.5839 265.281 14.0748 265.281 18.6071V28.2357H261.131V19.1664Z" fill="#3643C0"/>
              <path d="M274.853 11.5507C275.882 11.5362 276.901 11.7585 277.831 12.2003C278.761 12.6421 279.578 13.2917 280.217 14.0989V6.30127H284.424V28.2359H280.217V25.8168C279.261 27.3276 277.401 28.5132 274.824 28.5132C270.645 28.5132 267.323 25.1045 267.323 19.9746C267.323 14.8447 270.645 11.5507 274.853 11.5507ZM275.89 15.1937C273.667 15.1937 271.563 16.8527 271.563 19.9746C271.563 23.0965 273.667 24.8606 275.89 24.8606C278.113 24.8606 280.245 23.1443 280.245 20.0319C280.245 16.9196 278.171 15.1937 275.89 15.1937V15.1937Z" fill="#3643C0"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M29.0964 0C34.3888 0 39.5283 3.78645 39.5283 10.3076C39.5283 23.302 23.0486 33.8486 20.1896 35.0486C20.0519 35.1065 19.904 35.1363 19.7546 35.1363C19.6052 35.1363 19.4573 35.1065 19.3195 35.0486C16.4223 33.8199 0 23.2159 0 10.3076C0 3.78645 5.13944 0 10.4319 0C15.3466 0 18.0287 2.90677 19.4677 6.1243C19.4967 6.18049 19.5406 6.22762 19.5945 6.26052C19.6485 6.29342 19.7105 6.31083 19.7737 6.31083C19.8369 6.31083 19.8989 6.29342 19.9529 6.26052C20.0069 6.22762 20.0507 6.18049 20.0797 6.1243C21.5139 2.90677 24.1817 0 29.0964 0ZM25.5913 21.2901C25.6558 21.5289 25.7719 21.7506 25.9315 21.9395L26.0988 22.1546C26.208 22.3292 26.3636 22.4699 26.5482 22.561C26.7832 22.6195 27.0312 22.5959 27.251 22.4941C29.3361 21.7202 31.1311 20.3209 32.3904 18.4877C33.6447 16.6518 34.4339 14.5385 34.69 12.3299C34.8624 11.1959 34.8333 10.0403 34.604 8.91637C34.3748 7.78861 33.8118 6.75584 32.988 5.95222C32.5235 5.52559 31.9785 5.19591 31.385 4.98247C30.7915 4.76903 30.1613 4.67613 29.5315 4.7092C26.4239 4.88609 24.0813 8.40003 25.7068 11.2686C26.1565 12.0313 26.8455 12.6242 27.6668 12.9553C28.488 13.2864 29.3956 13.3371 30.2486 13.0996C30.1889 14.3863 29.8256 15.6405 29.1882 16.7598C28.5509 17.879 27.6577 18.8316 26.5817 19.5395C26.5463 19.5629 26.5106 19.5863 26.4747 19.6098C26.0931 19.8596 25.694 20.1208 25.5586 20.5578C25.5157 20.8014 25.5269 21.0514 25.5913 21.2901Z" fill="#3643C0"/>
            </g>
            
            <defs>
              <clipPath id="clip0">
                <rect width="284.424" height="36" fill="white"/>
              </clipPath>
            </defs>
          </svg>
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