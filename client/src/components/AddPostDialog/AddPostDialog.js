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
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import './AddPostDialog.scss';

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
    return isScenario ? 'Share your story' : 'Send your affirmation';
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
        name,
        title,
        location,
        [textKey]: postText,
      };

      if (!isScenario) {
        newPost.scenarioId = scenarioId;
      }

      const apiResponse = await axios.post(apiEndpoint, newPost);
  
      if (apiResponse && apiResponse.data && apiResponse.data.isAdded) {
        handleClose();
  
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

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="AddPostDialog"
      >
        <div className="dialog">
          <div className="dialog-top">
            <IconButton onClick={handleClose}>
              <Close fontSize="large" />
            </IconButton>
          </div>

          <form className="add-scenario-form" onSubmit={this.handleAddFormSubmit}>
            <div className="add-form-fields">
              <TextField
                className="add-form-field"
                id="multiline"
                label={isScenario ? 'Your story...' : 'Your affirmation...'}
                multiline
                variant="outlined"
                required
                value={postText}
                onChange={this.handleAddTextChange}
                InputLabelProps={{ required: false }}
              />

              <FormControl className="add-form-field">
                <TextField
                  label="Display Name"
                  variant="outlined"
                  required
                  value={name}
                  onChange={this.handleAddNameChange}
                  InputLabelProps={{ required: false }}
                  inputProps={{ maxLength: 20 }}
                />
                <FormHelperText id="display-name-helper">No need to use your real name</FormHelperText>
              </FormControl>

              <Select
                native
                required
                value={title}
                variant="outlined"
                className="add-form-field"
                inputProps={{ className: title === '' ? 'select-bold' : '' }}
                onChange={this.handleAddTitleChange}
              >
                <option value="" disabled>Your Role</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="PA">PA/NP</option>
                <option value="RT">RT</option>
                <option value="PT">PT</option>
                <option value="SW">SW</option>
                <option value="RT">RT</option>
                <option value="Technician">Technician</option>
                <option value="Clinical Assistant">Clinical Assistant</option>
                <option value="Student/Trainee">Student/Trainee</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Other">Other</option>
              </Select>

              <Select
                native
                required
                value={location}
                variant="outlined"
                className="add-form-field"
                inputProps={{ className: location === '' ? 'select-bold' : '' }}
                onChange={this.handleAddLocationChange}
              >
                <option value="" disabled>State</option>
                <option value="AL">AL</option>
                <option value="AK">AK</option>
                <option value="AZ">AZ</option>
                <option value="AR">AR</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="CT">CT</option>
                <option value="DE">DE</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="HI">HI</option>
                <option value="ID">ID</option>
                <option value="IL">IL</option>
                <option value="IN">IN</option>
                <option value="IA">IA</option>
                <option value="KS">KS</option>
                <option value="KY">KY</option>
                <option value="LA">LA</option>
                <option value="ME">ME</option>
                <option value="MD">MD</option>
                <option value="MA">MA</option>
                <option value="MI">MI</option>
                <option value="MN">MN</option>
                <option value="MS">MS</option>
                <option value="MO">MO</option>
                <option value="MT">MT</option>
                <option value="NE">NE</option>
                <option value="NV">NV</option>
                <option value="NH">NH</option>
                <option value="NJ">NJ</option>
                <option value="NM">NM</option>
                <option value="NY">NY</option>
                <option value="NC">NC</option>
                <option value="ND">ND</option>
                <option value="OH">OH</option>
                <option value="OK">OK</option>
                <option value="OR">OR</option>
                <option value="PA">PA</option>
                <option value="RI">RI</option>
                <option value="SC">SC</option>
                <option value="SD">SD</option>
                <option value="TN">TN</option>
                <option value="TX">TX</option>
                <option value="UT">UT</option>
                <option value="VT">VT</option>
                <option value="VA">VA</option>
                <option value="WA">WA</option>
                <option value="WV">WV</option>
                <option value="WI">WI</option>
                <option value="WI">WY</option>
              </Select>
            </div>

            <Button className="submit-button" type="submit" size="large" disabled={isLoading}>
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
