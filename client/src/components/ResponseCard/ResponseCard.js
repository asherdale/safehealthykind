import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  IconButton,
  Typography,
} from '@material-ui/core';
import { EmojiFlags } from '@material-ui/icons';
import './ResponseCard.scss';
import { timeSince } from '../../utils/utils';
import ReportDialog from '../ReportDialog';

class ResponseCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReportDialogOpen: false,
      isResponseVisible: props.response.reports < 3,
    };
  }

  handleReportClick = () => {
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
    const { isReportDialogOpen, isResponseVisible } = this.state;
    const { response } = this.props;

    if (!isResponseVisible) {
      return null;
    }

    const dateText = timeSince(response.dateCreated);

    return (
      <div className="ResponseCard">
        <div className="response-top">
          <Typography variant="body1" className="response">{response.responseText}</Typography>
        </div>

        <div className="response-bottom">
          <div>
            <Typography variant="body1" className="response-signature"><strong>{response.name}</strong>, {response.location}</Typography>
            <Typography variant="body2" className="response-date">{dateText}</Typography>
          </div>

          <IconButton aria-label="report" onClick={this.handleReportClick} >
            <EmojiFlags className="flag-icon" />
          </IconButton>
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
    likes: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    responseText: PropTypes.string.isRequired,
    dateCreated: PropTypes.object.isRequired,
    scenarioId: PropTypes.string.isRequired,
    reports: PropTypes.number.isRequired,
  }).isRequired,
};

export default ResponseCard;  