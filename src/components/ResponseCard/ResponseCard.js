import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
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
    };
  }

  handleLikeClick = () => {
    this.setState(prevState => ({ isLiked: !prevState.isLiked }));

    const { isLiked } = this.state;
    const { response } = this.props;

    response.likes += isLiked ? -1 : 1;
    updateResponse(response, { likes: response.likes });

    analytics.logEvent('like_click');
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
  }

  render() {
    const { isLiked, menuAnchorEl, isDialogOpen } = this.state;
    const { response } = this.props;

    const dateText = timeSince(response.dateCreated.toDate());

    return (
      <Card className="ResponseCard">
        <CardContent className="response-content">
          <p className="response">{response.responseText}</p>

          <div className="response-metadata">
            <p className="signature">- {response.name}, {response.location}</p>
            <p className="date">{dateText}</p>
          </div>
        </CardContent>

        <CardActions className="response-actions" disableSpacing>
          <IconButton aria-label="add" onClick={this.handleLikeClick} >
            { isLiked
              ? <FavoriteIcon fontSize="default" color="secondary" />
              : <FavoriteBorderIcon fontSize="default" />}

            <span className="likes-number">{response.likes}</span>
          </IconButton>

          <div className="response-menu">
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleMenuOpen}>
              <MoreHorizIcon fontSize="default" />
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
            <Button onClick={this.handleDialogClose} color="primary">
              No
            </Button>
            <Button onClick={this.handleReportConfirmed} color="secondary" autoFocus>
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