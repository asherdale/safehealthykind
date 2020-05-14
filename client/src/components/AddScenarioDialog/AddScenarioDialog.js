import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './AddScenarioDialog.scss';

class AddScenarioDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scenarioName: '',
      scenarioTitle: '',
      scenarioText: '',
      isErrorOnAdd: false,
    };
  }

  handleAddNameChange = (event) => {
    this.setState({ scenarioName: event.target.value });
  }

  handleAddTitleChange = (event) => {
    this.setState({ scenarioTitle: event.target.value });
  }

  handleAddTextChange = (event) => {
    this.setState({ scenarioText: event.target.value });
  }

  handleAddFormSubmit = async (event) => {
    event.preventDefault();

    const { handleClose, reloadFunc } = this.props;
    const { scenarioName, scenarioTitle, scenarioText } = this.state;

    try {
      const apiResponse = await axios.post('/api/scenario', {
        name: scenarioName,
        title: scenarioTitle,
        scenarioText,
      });
  
      if (apiResponse && apiResponse.data && apiResponse.data.isAdded) {
        handleClose();
  
        await reloadFunc();
        
        this.setState({
          isErrorOnAdd: false,
          scenarioName: '',
          scenarioTitle: '',
          scenarioText: '',
        });
      } else {
        this.setState({ isErrorOnAdd: true });
      }
    } catch (error) {
      this.setState({ isErrorOnAdd: true });
    }
  }

  render() {
    const { isOpen, handleClose } = this.props;
    const { scenarioName, scenarioTitle, scenarioText, isErrorOnAdd } = this.state;

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="AddScenarioDialog"
      >
        <DialogTitle className="dialog-title">Share Your Story</DialogTitle>

        <DialogContent>
          <form className="add-scenario-form" onSubmit={this.handleAddFormSubmit}>
            <div className="add-form-fields">
              <TextField
                className="add-form-field"
                label="Name"
                variant="outlined"
                required
                value={scenarioName}
                onChange={this.handleAddNameChange}
              />

              <TextField
                className="add-form-field"
                label="Description"
                placeholder="e.g. 'ICU Doctor', 'Nurse'"
                variant="outlined"
                required
                value={scenarioTitle}
                onChange={this.handleAddTitleChange}
              />

              <TextField
                className="add-form-field"
                label="Add your story here..."
                rows={5}
                rowsMax={13}
                multiline
                variant="outlined"
                required
                value={scenarioText}
                onChange={this.handleAddTextChange}
              />
            </div>

            <div className="add-form-buttons">
              <Button color="primary" size="large" onClick={handleClose}>
                Cancel
              </Button>

              <Button color="primary" size="large" type="submit" autoFocus>
                <strong>Post</strong>
              </Button>
            </div>

            {isErrorOnAdd && <Alert severity="error">There was an error when trying to post. Please reload the page and try again.</Alert>}
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

AddScenarioDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  reloadFunc: PropTypes.func.isRequired,
};

export default AddScenarioDialog;
