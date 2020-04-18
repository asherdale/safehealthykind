import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import { Scrollbars } from 'react-custom-scrollbars';
import './ScenarioCard.scss';
import ResponseCard from '../ResponseCard';
import { analytics, addResponse } from '../../api/firebase';

class ScenarioCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingResponse: false,
      isErrorOnAdd: false,
      isShowingAllResponses: false,
      addFormName: '',
      addFormLocation: '',
      addFormText: '',
    };
  }

  handleAddClick = () => {
    this.setState({ isAddingResponse: true });
    analytics.logEvent('start_adding_response');
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
    analytics.logEvent('cancel_adding_response');
  }

  handleAddFormSubmit = async (event) => {
    event.preventDefault();

    const { scenario, reloadFunc } = this.props;
    const { addFormName, addFormLocation, addFormText } = this.state;
    
    analytics.logEvent('post_response');
    const isAdded = await addResponse(scenario, addFormName, addFormLocation, addFormText);

    if (isAdded) {
      await reloadFunc();
      
      this.setState({
        isAddingResponse: false,
        isErrorOnAdd: false,
        addFormName: '',
        addFormLocation: '',
        addFormText: '',
      });

      this.scrollToResponsesTop();
    } else {
      this.setState({ isErrorOnAdd: true });
      analytics.logEvent('post_response_error');
    }
  }

  scrollToResponsesTop = () => {
    this.responsesRef.scrollTop = 0;
  }

  handleSeeMore = () => {
    this.setState({ isShowingAllResponses: true });
  }

  render() {
    const { scenario } = this.props;
    const { isAddingResponse, isErrorOnAdd, isShowingAllResponses, addFormName, addFormLocation, addFormText } = this.state;

    scenario.responses.sort((a, b) => b.dateCreated.seconds - a.dateCreated.seconds);

    const responseCards = scenario.responses.map(response => {
      return <ResponseCard key={response.dateCreated.seconds} response={response} />;
    });

    return (
      <Card variant="outlined" className="ScenarioCard">
        <CardContent className="scenario-content">
          <p className="scenario-text">&quot;{scenario.scenarioText}&quot;</p>

          <Divider />

          {scenario.responses.length > 0 && isShowingAllResponses
            ? (
              <Scrollbars className="scrollbar">
                <div className="responses" ref={ref => { this.responsesRef = ref; } }>
                  {responseCards}
                </div>
              </Scrollbars>
            ) : (
              <div className="responses" ref={ref => { this.responsesRef = ref; } }>
                {responseCards[0]}
                
                <Button className="see-more-button" onClick={this.handleSeeMore}>See More</Button>
              </div>
            )
          }
        </CardContent>

        <CardActions className="actions" disableSpacing>
          {isAddingResponse
            ? (
              <form onSubmit={this.handleAddFormSubmit}>
                <Divider className="add-form-divider"/>

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
                  <Button onClick={this.handleAddCancelClick}>
                    Cancel
                  </Button>
                  <Button type="submit" autoFocus>
                    <strong>Post</strong>
                  </Button>
                </div>

                {isErrorOnAdd && <Alert severity="error">There was an error when trying to post. Please reload the page and try again.</Alert>}
              </form>
            ) : (
              <div className="add-button-container">
                <IconButton  aria-label="add" onClick={this.handleAddClick} >
                  <Add fontSize="default" />
                </IconButton>
              </div>
            )
          }
          
        </CardActions>
      </Card>
    );
  }
}

ScenarioCard.propTypes = {
  scenario: PropTypes.shape({
    scenarioText: PropTypes.string.isRequired,
    responses: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  reloadFunc: PropTypes.func.isRequired,
};

export default ScenarioCard;  