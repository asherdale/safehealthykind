import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Dialog,
  TextField,
  Button,
  IconButton,
  Select,
  FormControl,
  FormHelperText,
  Typography,
  InputLabel,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import './AddPostDialog.scss';

const stateToAbbrev = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
};

class AddPostDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      title: '',
      location: '',
      postText: '',
      isErrorOnAdd: false,
      isLoading: false,
    };
  }

  getSubmitButtonText = () => {
    const { isScenario } = this.props;
    return isScenario ? 'Share your story' : 'Send your reply';
  }

  handleAddNameChange = (event) => {
    this.setState({ name: event.target.value });
  }

  handleAddTitleChange = (event) => {
    this.setState({ title: event.target.value });
  }

  handleAddLocationChange = (event) => {
    this.setState({ location: event.target.value });
  }

  handleAddTextChange = (event) => {
    this.setState({ postText: event.target.value });
  }

  handleAddFormSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    const { handleClose, submitCallback, isScenario, scenarioId } = this.props;
    const { name, title, postText, location } = this.state;

    try {
      const apiEndpoint = isScenario ? '/api/scenario' : '/api/response';
      const textKey = isScenario ? 'scenarioText' : 'responseText';

      const newPost = {
        name: name.trim(),
        title: title.trim(),
        location: stateToAbbrev[location] || '',
        [textKey]: postText.trim(),
      };

      if (!isScenario) {
        newPost.scenarioId = scenarioId;
      }

      const apiResponse = await axios.post(apiEndpoint, newPost);
  
      if (apiResponse && apiResponse.data && apiResponse.data.isAdded) {
        handleClose();
  
        newPost.id = apiResponse.data.docId;
        submitCallback(newPost);
        
        this.setState({
          isErrorOnAdd: false,
          name: '',
          title: '',
          location: '',
          postText: '',
          isLoading: false,
        });
      } else {
        this.setState({ isErrorOnAdd: true, isLoading: false });
      }
    } catch (error) {
      this.setState({ isErrorOnAdd: true, isLoading: false });
    }
  }

  render() {
    const { isOpen, handleClose, isScenario } = this.props;
    const { name, title, location, postText, isErrorOnAdd, isLoading } = this.state;
    const maxPostLength = isScenario ? 1500 : 350;
    const isValid = name.trim() && title.trim() && location.trim() && postText.trim() && postText.length <= maxPostLength;

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="AddPostDialog"
      >
        <div className="dialog">
          <div className="dialog-top">
            <Typography className="modal-title" variant="h5">
              {isScenario ? 'Share your story' : 'Post a kind word'}
            </Typography>

            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>

          <form className="add-scenario-form" onSubmit={this.handleAddFormSubmit}>
            <div className="add-form-fields">
              <FormControl className="add-form-field" id="multiline-parent">
                <TextField
                  id="multiline"
                  className={postText.length > maxPostLength ? 'red' : ''}
                  label={isScenario ? 'What\'s on your mind?' : 'Add your reply'}
                  multiline
                  variant="outlined"
                  required
                  value={postText}
                  onChange={this.handleAddTextChange}
                  InputLabelProps={{ required: false }}
                />
                <FormHelperText id="char-count" className={postText.length > maxPostLength ? 'red' : ''}>
                  {maxPostLength - postText.length}
                </FormHelperText>
              </FormControl>

              <FormControl className="add-form-field">
                <TextField
                  label="Display name"
                  variant="outlined"
                  required
                  value={name}
                  onChange={this.handleAddNameChange}
                  InputLabelProps={{ required: false }}
                  inputProps={{ maxLength: 20 }}
                />
                <FormHelperText id="display-name-helper">No need to give your real name</FormHelperText>
              </FormControl>

              <FormControl className="add-form-field">
                <InputLabel htmlFor="outlined-role-native-simple">Your role</InputLabel>
                <Select
                  native
                  value={title}
                  onChange={this.handleAddTitleChange}
                  variant="outlined"
                  label="Your role"
                  inputProps={{
                    name: 'role',
                    id: 'outlined-role-native-simple',
                  }}
                >
                  <option disabled aria-label="None" value="" />
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="PA/NP">PA/NP</option>
                  <option value="Social Worker">Social Worker</option>
                  <option value="Respiratory Therapist">Respiratory Therapist</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Child Life Specialist">Child Life Specialist</option>
                  <option value="Physical Therapist">Physical Therapist</option>
                  <option value="Technician">Technician</option>
                  <option value="Clinical Assistant">Clinical Assistant</option>
                  <option value="Student/Trainee">Student/Trainee</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>

              <FormControl className="add-form-field">
                <InputLabel htmlFor="outlined-location-native-simple">State</InputLabel>
                <Select
                  native
                  value={location}
                  onChange={this.handleAddLocationChange}
                  variant="outlined"
                  label="State"
                  inputProps={{
                    name: 'location',
                    id: 'outlined-location-native-simple',
                  }}
                >
                  <option disabled aria-label="None" value="" />
                  {Object.keys(stateToAbbrev).map(state => <option value={state} key={state}>{state}</option>)}
                </Select>
              </FormControl>
            </div>

            <Button className={isValid ? 'submit-button' : 'not-valid submit-button'} type="submit" size="large" disabled={isLoading || !isValid}>
              {
                isLoading ? (
                  <div className="loader">Loading ...</div>
                ) : (
                  this.getSubmitButtonText()
                )
              }
            </Button>

            {isErrorOnAdd && <Alert severity="error">There was an error when trying to post. Please try again.</Alert>}
          </form>
        </div>
      </Dialog>
    );
  }
}

AddPostDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isScenario: PropTypes.bool.isRequired,
  scenarioId: PropTypes.string,
};

AddPostDialog.defaultProps = {
  scenarioId: '',
};

export default AddPostDialog;