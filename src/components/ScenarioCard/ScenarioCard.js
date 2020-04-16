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
import './ScenarioCard.scss';
import ResponseCard from '../ResponseCard';
import { addResponse } from '../../api/firebase';

class ScenarioCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingResponse: false,
      isErrorOnAdd: false,
      addFormName: '',
      addFormLocation: '',
      addFormText: '',
    };
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
    }
  }

  scrollToResponsesTop = () => {
    this.responsesRef.scrollTop = 0;
  }

  render() {
    const { scenario } = this.props;
    const { isAddingResponse, isErrorOnAdd, addFormName, addFormLocation, addFormText } = this.state;

    scenario.responses.sort((a, b) => b.dateCreated.seconds - a.dateCreated.seconds);

    const responseCards = scenario.responses.map(response => {
      return <ResponseCard key={response.dateCreated.seconds} response={response} />;
    });

    return (
      <Card variant="outlined" className="ScenarioCard">
        <CardContent className="scenario-content">
          <p className="scenario-text">&quot;{scenario.scenarioText}&quot;</p>

          {scenario.responses.length > 0 &&
            <div className="responses" ref={ref => { this.responsesRef = ref; } }>
              {responseCards}
            </div>
          }
        </CardContent>

        <CardActions className="actions" disableSpacing>
          {isAddingResponse
            ? (
              <form onSubmit={this.handleAddFormSubmit}>
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
                  <Button onClick={this.handleAddCancelClick} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" autoFocus>
                    <strong>Post</strong>
                  </Button>
                </div>

                {isErrorOnAdd && <Alert severity="error">There was an error when trying to post. Please reload the page and try again.</Alert>}
              </form>
            )
            : (
              <div className="add-button-container">
                <IconButton  aria-label="add" color="primary" onClick={this.handleAddClick} >
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