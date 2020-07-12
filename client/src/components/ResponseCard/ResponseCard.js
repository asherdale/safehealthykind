import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import './ResponseCard.scss';
import { timeSince } from '../../utils/utils';
import ReportDialog from '../ReportDialog';

class ResponseCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReportDialogOpen: false,
      isResponseVisible: true,
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
    
    axios.put('/api/response', {
      scenarioId: response.scenarioId,
      responseId: response.id,
      update: { reports: response.reports },
    });

    this.setState({ isResponseVisible: false });
  }

  render() {
    const { isReportDialogOpen, isResponseVisible, menuAnchorEl } = this.state;
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
            <Typography variant="body2">{response.name}&nbsp;&bull;&nbsp;{dateText}</Typography>
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
            >
              <MenuItem onClick={this.handleReportClick}>Report</MenuItem>
            </Menu>
          </div>
        </div>

        <div className="response-bottom">
          <Typography variant="body1" className="response">{response.responseText}</Typography>
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
  }).isRequired,
};

export default ResponseCard;  