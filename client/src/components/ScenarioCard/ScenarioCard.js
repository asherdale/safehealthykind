import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  IconButton,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos, MoreHoriz } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import './ScenarioCard.scss';
import ResponseCard from '../ResponseCard';
import ReportDialog from '../ReportDialog';
import { timeSince } from '../../utils/utils';

class ScenarioCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingResponse: false,
      isErrorOnAdd: false,
      addFormName: '',
      addFormLocation: '',
      addFormText: '',
      shouldShowForwardArrow: props.scenario.responses.length > 2,
      shouldShowBackwardArrow: false,
      menuAnchorEl: null,
      isReportDialogOpen: false,
      isScenarioVisible: props.scenario.reports < 3,
    };

    this.responsesContainer = null;
    this.scenarioRef = null;
  }

  handleAddClick = () => {
    this.setState({ isAddingResponse: true });
  }

  handleAddNameChange = (event) => {
    this.setState({ addFormName: event.target.value });
  }

  handleAddLocationChange = (event) => {
    this.setState({ addFormLocation: event.target.value });
  }

  handleAddTextChange = (event) => {
    this.setState({ addFormText: event.target.value });
  }

  handleAddCancelClick = () => {
    this.setState({ isAddingResponse: false });
  }

  handleAddFormSubmit = async (event) => {
    event.preventDefault();

    const { scenario, reloadFunc } = this.props;
    const { addFormName, addFormLocation, addFormText } = this.state;

    try {
      const apiResponse = await axios.post('/api/response', {
        scenarioId: scenario.id,
        name: addFormName,
        location: addFormLocation,
        responseText: addFormText,
      });
  
      if (apiResponse && apiResponse.data && apiResponse.data.isAdded) {
        await reloadFunc();
        
        this.setState({
          isAddingResponse: false,
          isErrorOnAdd: false,
          addFormName: '',
          addFormLocation: '',
          addFormText: '',
        });
      } else {
        this.setState({ isErrorOnAdd: true });
      }
    } catch (error) {
      this.setState({ isErrorOnAdd: true });
    }
  }

  handleResponsesScroll = () => {
    const { shouldShowBackwardArrow, shouldShowForwardArrow } =  this.state;
    const { scrollLeft, offsetWidth, scrollWidth } = this.responsesContainer;

    if (!shouldShowBackwardArrow && scrollLeft > 0) {
      this.setState({ shouldShowBackwardArrow: true });
    } else if (shouldShowBackwardArrow && scrollLeft === 0) {
      this.setState({ shouldShowBackwardArrow: false });
    }

    const isAtEnd = scrollLeft + offsetWidth === scrollWidth;

    if (!shouldShowForwardArrow && !isAtEnd) {
      this.setState({ shouldShowForwardArrow: true });
    } else if (shouldShowForwardArrow && isAtEnd) {
      this.setState({ shouldShowForwardArrow: false });
    }
  }

  handleResponsesScrollForward = () => {
    const distance = this.responsesContainer.offsetWidth;
    this.responsesContainer.scrollBy({ left: distance, behavior: 'smooth' });
  }

  handleResponsesScrollBackward = () => {
    const distance = -1 * this.responsesContainer.offsetWidth;
    this.responsesContainer.scrollBy({ left: distance, behavior: 'smooth' });
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

    const { scenario } = this.props;
    
    scenario.reports = (scenario.reports || 0) + 1;
    
    axios.put('/api/scenario', {
      scenarioId: scenario.id,
      update: { reports: scenario.reports },
    });

    this.setState({ isScenarioVisible: false });
  }

  render() {
    const { scenario } = this.props;

    const {
      shouldShowForwardArrow,
      shouldShowBackwardArrow,
      isAddingResponse,
      isErrorOnAdd,
      addFormName,
      addFormLocation,
      addFormText,
      menuAnchorEl,
      isReportDialogOpen,
      isScenarioVisible,
    } = this.state;

    if (!isScenarioVisible) {
      return null;
    }

    const dateText = timeSince(scenario.dateCreated);

    scenario.responses.sort((a, b) => b.dateCreated - a.dateCreated);

    const responseCards = scenario.responses.map(response => {
      return <ResponseCard key={response.dateCreated._seconds} response={response} />;
    });

    return (
      <Card variant="outlined" className="ScenarioCard" ref={node => { this.scenarioRef = node; }} >
        <CardContent className="scenario-content">
          <div className="scenario-post">
            <div className="scenario-main">
              <Typography variant="h5" className="scenario-text">&quot;{scenario.scenarioText}&quot;</Typography>

              <div className="scenario-menu">
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
            </div>

            <div className="scenario-metadata">
              <Typography variant="h5" className="scenario-signature">- {scenario.name}, {scenario.title}</Typography>
              <Typography variant="h5" className="scenario-date">{dateText}</Typography>
            </div>
          </div>

          <div className="response-section">
            <IconButton color="primary" disabled={!shouldShowBackwardArrow} className="arrow-button" onClick={this.handleResponsesScrollBackward}>
              {shouldShowBackwardArrow && <ArrowBackIos fontSize="default" />}
            </IconButton>

            <div className="responses" ref={node => { this.responsesContainer = node; }} onScroll={this.handleResponsesScroll}>
              {responseCards}
              <span>&nbsp;</span>
            </div>

            <IconButton color="primary" disabled={!shouldShowForwardArrow} className="arrow-button" onClick={this.handleResponsesScrollForward}>
              {shouldShowForwardArrow && <ArrowForwardIos fontSize="default" />}
            </IconButton>
          </div>

          {isAddingResponse
            ? (
              <form className="add-affirmation-form" onSubmit={this.handleAddFormSubmit}>
                <div className="add-form-fields">
                  <TextField
                    className="add-form-field"
                    label="Name"
                    variant="outlined"
                    required
                    value={addFormName}
                    onChange={this.handleAddNameChange}
                  />

                  <TextField
                    className="add-form-field"
                    label="Location"
                    variant="outlined"
                    required
                    value={addFormLocation}
                    onChange={this.handleAddLocationChange}
                  />

                  <TextField
                    className="add-form-field"
                    label="Affirmation"
                    rows={3}
                    multiline
                    variant="outlined"
                    required
                    value={addFormText}
                    onChange={this.handleAddTextChange}
                  />
                </div>
                
                <div className="add-form-buttons">
                  <Button color="primary" size="large" onClick={this.handleAddCancelClick}>
                    Cancel
                  </Button>
                  <Button color="primary" size="large" type="submit" autoFocus>
                    <strong>Post</strong>
                  </Button>
                </div>

                {isErrorOnAdd && <Alert severity="error">There was an error when trying to post. Please reload the page and try again.</Alert>}
              </form>
            ) : (
              <div className="scenario-actions">
                <Button color="primary" variant="outlined" size="large" onClick={this.handleAddClick}>
                  Post an Affirmation for {scenario.name}
                </Button>
              </div>
            )
          }
        </CardContent>

        <ReportDialog
          isOpen={isReportDialogOpen}
          handleCancel={this.handleReportDialogClose}
          handleConfirm={this.handleReportConfirmed}
        />
      </Card>
    );
  }
}

ScenarioCard.propTypes = {
  scenario: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scenarioText: PropTypes.string.isRequired,
    responses: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    reports: PropTypes.number.isRequired,
    dateCreated: PropTypes.object.isRequired,
  }).isRequired,
  reloadFunc: PropTypes.func.isRequired,
};

export default ScenarioCard;
