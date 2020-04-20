import React from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Card,
  CardActions,
  CardContent,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@material-ui/core';
import { FavoriteBorder, Favorite, MoreHoriz } from '@material-ui/icons';
import './ResponseCard.scss';
import { timeSince } from '../../utils/utils';
import { analytics, updateResponse } from '../../api/firebase';

class ResponseCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLiked: false,
      menuAnchorEl: null,
      isDialogOpen: false,
      isResponseVisible: true,
    };
  }

  handleLikeClick = () => {
    this.setState(prevState => ({ isLiked: !prevState.isLiked }));

    const { isLiked } = this.state;
    const { response } = this.props;

    response.likes += isLiked ? -1 : 1;
    updateResponse(response, { likes: response.likes });

    analytics.logEvent(isLiked ? 'unlike_response' : 'like_response');
  }

  handleMenuOpen = (event) => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  handleReportClick = () => {
    this.handleMenuClose();
    this.handleDialogOpen();
    analytics.logEvent('open_report_dialog');
  }

  handleDialogOpen = () => {
    this.setState({ isDialogOpen: true });
  }

  handleDialogClose = () => {
    this.setState({ isDialogOpen: false });
  }

  handleReportConfirmed = () => {
    this.handleDialogClose();

    const { response } = this.props;
    
    response.reports = (response.reports || 0) + 1;
    updateResponse(response, { reports: response.reports });

    this.setState({ isResponseVisible: false });
    analytics.logEvent('confirm_report_response');
  }

  render() {
    const { isLiked, menuAnchorEl, isDialogOpen, isResponseVisible } = this.state;
    const { response } = this.props;

    if (!isResponseVisible) {
      return null;
    }

    const dateText = timeSince(response.dateCreated.toDate());

    return (
      <Card className="ResponseCard MuiPaper-elevation5">
        <CardContent className="response-content">
          <p className="response">{response.responseText}</p>

          <div className="response-metadata">
            <p className="response-signature">- {response.name}, {response.location}</p>
            <p className="response-date">{dateText}</p>
          </div>
        </CardContent>

        <CardActions className="response-actions" disableSpacing>
          <IconButton aria-label="add" onClick={this.handleLikeClick} >
            { isLiked
              ? <Favorite fontSize="default" className="liked-button" />
              : <FavoriteBorder fontSize="default" />}

            <span className="likes-number">{response.likes}</span>
          </IconButton>

          <div className="response-menu">
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleMenuOpen}>
              <MoreHoriz fontSize="default" />
            </IconButton>

            <Menu
              id="simple-menu"
              anchorEl={menuAnchorEl}
              keepMounted
              open={Boolean(menuAnchorEl)}
              onClose={this.handleMenuClose}
            >
              <MenuItem onClick={this.handleReportClick}>Report</MenuItem>
            </Menu>
          </div>
        </CardActions>

        <Dialog
          open={isDialogOpen}
          onClose={this.handleDialogClose}
          className="report-dialog"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Report Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure that you would like to report this comment for inappropriate content?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} className="cancel-report-button">
              No
            </Button>
            <Button onClick={this.handleReportConfirmed} className="confirm-report-button" autoFocus>
              Yes, I would like to report this comment.
            </Button>
          </DialogActions>
        </Dialog> 
      </Card>
    );
  }
}

ResponseCard.propTypes = {
  response: PropTypes.shape({
    id: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    responseText: PropTypes.string.isRequired,
    dateCreated: PropTypes.object.isRequired,
    scenarioRef: PropTypes.object.isRequired,
    reports: PropTypes.number.isRequired,
  }).isRequired,
};

export default ResponseCard;  