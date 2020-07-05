import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  IconButton,
  Card,
  CardActions,
  CardContent,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { FavoriteBorder, Favorite, MoreHoriz } from '@material-ui/icons';
import './ResponseCard.scss';
import { timeSince } from '../../utils/utils';
import ReportDialog from '../ReportDialog';

class ResponseCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLiked: false,
      menuAnchorEl: null,
      isReportDialogOpen: false,
      isResponseVisible: props.response.reports < 3,
    };
  }

  handleLikeClick = () => {
    this.setState(prevState => ({ isLiked: !prevState.isLiked }));

    const { isLiked } = this.state;
    const { response } = this.props;

    response.likes += isLiked ? -1 : 1;

    axios.put('/api/response', {
      scenarioId: response.scenarioId,
      responseId: response.id,
      update: { likes: response.likes },
    });
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
    
    axios.put('/api/response', {
      scenarioId: response.scenarioId,
      responseId: response.id,
      update: { reports: response.reports },
    });

    this.setState({ isResponseVisible: false });
  }

  render() {
    const { isLiked, menuAnchorEl, isReportDialogOpen, isResponseVisible } = this.state;
    const { response } = this.props;

    if (!isResponseVisible) {
      return null;
    }

    const dateText = timeSince(response.dateCreated);

    return (
      <Card className="ResponseCard MuiPaper-elevation5">
        <CardContent className="response-content">
          <Typography variant="body1" className="response">{response.responseText}</Typography>

          <div className="response-metadata">
            <Typography variant="body1" className="response-signature">- {response.name}, {response.location}</Typography>
            <Typography variant="body1" className="response-date">{dateText}</Typography>
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
              anchorEl={menuAnchorEl}
              keepMounted
              open={Boolean(menuAnchorEl)}
              onClose={this.handleMenuClose}
            >
              <MenuItem onClick={this.handleReportClick}>Report</MenuItem>
            </Menu>
          </div>
        </CardActions>

        <ReportDialog
          isOpen={isReportDialogOpen}
          handleCancel={this.handleReportDialogClose}
          handleConfirm={this.handleReportConfirmed}
        />
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
    scenarioId: PropTypes.string.isRequired,
    reports: PropTypes.number.isRequired,
  }).isRequired,
};

export default ResponseCard;  