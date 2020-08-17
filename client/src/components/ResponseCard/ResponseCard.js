import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  MoreHoriz,
  Favorite,
  FavoriteBorder,
  OutlinedFlag,
} from '@material-ui/icons';
import './ResponseCard.scss';
import { timeSince } from '../../utils/utils';
import ReportDialog from '../ReportDialog';

class ResponseCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReportDialogOpen: false,
      isLiked: localStorage.getItem(`${props.response.id}_like`) === 'true',
      isResponseVisible: localStorage.getItem(`${props.response.id}_report`) !== 'true',
      menuAnchorEl: null,
    };
  }

  handleMenuOpen = (event) => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  handleReportClick = () => {
    this.handleMenuClose();
    this.setState({ isReportDialogOpen: true });
  }

  handleReportDialogClose = () => {
    this.setState({ isReportDialogOpen: false });
  }

  handleReportConfirmed = () => {
    this.handleReportDialogClose();

    const { response } = this.props;
    
    response.reports = (response.reports || 0) + 1;
    localStorage.setItem(`${response.id}_report`, true);
    
    axios.put('/api/response', {
      scenarioId: response.scenarioId,
      responseId: response.id,
      update: { reports: response.reports },
    });

    this.setState({ isResponseVisible: false });
  }

  handleLikeClick = () => {
    this.setState(prevState => ({ isLiked: !prevState.isLiked }));

    const { isLiked } = this.state;
    const { response } = this.props;

    response.likes += isLiked ? -1 : 1;
    localStorage.setItem(`${response.id}_like`, !isLiked);

    axios.put('/api/response', {
      scenarioId: response.scenarioId,
      responseId: response.id,
      update: { likes: response.likes },
    });
  }

  render() {
    const { isReportDialogOpen, isResponseVisible, isLiked, menuAnchorEl } = this.state;
    const { response } = this.props;

    if (!isResponseVisible) {
      return null;
    }

    const dateText = timeSince(response.dateCreated);

    return (
      <div className="ResponseCard">
        <div className="response-top">
          <div>
            <Typography className="header" variant="body2">{response.title} from {response.location}</Typography>
            <Typography className="subheader" variant="body2">{response.name}&nbsp;&bull;&nbsp;{dateText}</Typography>
          </div>

          <div className="response-menu">
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleMenuOpen}>
              <MoreHoriz fontSize="default" htmlColor="black" />
            </IconButton>

            <Menu
              anchorEl={menuAnchorEl}
              keepMounted
              open={Boolean(menuAnchorEl)}
              onClose={this.handleMenuClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <MenuItem className="more-menu-item" onClick={this.handleReportClick}>
                <OutlinedFlag /> Report
              </MenuItem>
            </Menu>
          </div>
        </div>

        <div className="response-mid">
          <Typography variant="body1" className="response">{response.responseText}</Typography>
        </div>

        <div className="response-bottom">
          <div onClick={this.handleLikeClick} aria-hidden="true" className={isLiked ? 'liked' : ''}>
            {isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            <Typography variant="body1" className="action-text">{isLiked ? 'Liked' : 'Like'}</Typography>
          </div>

          {response.likes > 0 && <Typography variant="body1" className="response-likes">
            &nbsp;&bull;&nbsp;{response.likes} likes
          </Typography>}
        </div>

        <ReportDialog
          isOpen={isReportDialogOpen}
          handleCancel={this.handleReportDialogClose}
          handleConfirm={this.handleReportConfirmed}
        />
      </div>
    );
  }
}

ResponseCard.propTypes = {
  response: PropTypes.shape({
    id: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    responseText: PropTypes.string.isRequired,
    dateCreated: PropTypes.object.isRequired,
    scenarioId: PropTypes.string.isRequired,
    reports: PropTypes.number.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
};

export default ResponseCard;  