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
} from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import './ScenarioCard.scss';
import ResponseCard from '../ResponseCard';
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

    const apiResponse = await axios.post('/api/response', {
      scenarioId: scenario.id,
      name: addFormName,
      location: addFormLocation,
      responseText: addFormText,
    });

    if (apiResponse.data.isAdded) {
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
    } = this.state;

    const dateText = timeSince(scenario.dateCreated);

    scenario.responses.sort((a, b) => b.dateCreated - a.dateCreated);

    const responseCards = scenario.responses.map(response => {
      return <ResponseCard key={response.dateCreated} response={response} />;
    });

    return (
      <Card variant="outlined" className="ScenarioCard" ref={node => { this.scenarioRef = node; }} >
        <CardContent className="scenario-content">
          <div className="scenario-post">
            <Typography variant="h5" className="scenario-text">&quot;{scenario.scenarioText}&quot;</Typography>

            <div className="scenario-metadata">
              <Typography variant="h5" className="scenario-signature">- {scenario.name}, {scenario.title}</Typography>
              <Typography variant="h5" className="scenario-date">{dateText}</Typography>
            </div>
          </div>

          <div className="response-section">
            <IconButton disabled={!shouldShowBackwardArrow} className="arrow-button" onClick={this.handleResponsesScrollBackward}>
              {shouldShowBackwardArrow && <ArrowBackIos fontSize="default" />}
            </IconButton>

            <div className="responses" ref={node => { this.responsesContainer = node; }} onScroll={this.handleResponsesScroll}>
              {responseCards}
              <span>&nbsp;</span>
            </div>

            <IconButton disabled={!shouldShowForwardArrow} className="arrow-button" onClick={this.handleResponsesScrollForward}>
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
                    size="small"
                    required
                    value={addFormName}
                    onChange={this.handleAddNameChange}
                  />

                  <TextField
                    className="add-form-field"
                    label="Location"
                    variant="outlined"
                    size="small"
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
                  <Button size="large" onClick={this.handleAddCancelClick}>
                    Cancel
                  </Button>
                  <Button size="large" type="submit" autoFocus>
                    <strong>Post</strong>
                  </Button>
                </div>

                {isErrorOnAdd && <Alert severity="error">There was an error when trying to post. Please reload the page and try again.</Alert>}
              </form>
            ) : (
              <div className="add-button-container">
                <Button variant="outlined" size="large" onClick={this.handleAddClick}>Post an Affirmation for {scenario.name}</Button>
              </div>
            )
          }
        </CardContent>
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
    dateCreated: PropTypes.string.isRequired,
  }).isRequired,
  reloadFunc: PropTypes.func.isRequired,
};

export default ScenarioCard;
