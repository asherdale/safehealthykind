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
import './ContactUsDialog.scss';

class ContactUsDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sender: '',
      subject: '',
      text: '',
      isErrorOnAdd: false,
    };
  }

  handleSenderChange = (event) => {
    this.setState({ sender: event.target.value });
  }

  handleSubjectChange = (event) => {
    this.setState({ subject: event.target.value });
  }

  handleTextChange = (event) => {
    this.setState({ text: event.target.value });
  }

  handleAddFormSubmit = async (event) => {
    event.preventDefault();

    const { handleClose } = this.props;
    const { sender, subject, text } = this.state;

    try {
      const apiResponse = await axios.post('/api/email', {
        sender,
        subject,
        text,
      });
  
      if (apiResponse.status === 200) {
        handleClose();

        this.setState({
          sender: '',
          subject: '',
          text: '',
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
    const { sender, subject, text, isErrorOnAdd } = this.state;

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="ContactUsDialog"
      >
        <DialogTitle className="dialog-title">Contact Us</DialogTitle>

        <DialogContent>
          <form className="contact-form" onSubmit={this.handleAddFormSubmit}>
            <div className="contact-form-fields">
              <TextField
                className="contact-form-field"
                label="Email Address"
                variant="outlined"
                required
                value={sender}
                onChange={this.handleSenderChange}
              />

              <TextField
                className="contact-form-field"
                label="Subject"
                variant="outlined"
                required
                value={subject}
                onChange={this.handleSubjectChange}
              />

              <TextField
                className="contact-form-field"
                label="Message"
                rows={5}
                rowsMax={13}
                multiline
                variant="outlined"
                required
                value={text}
                onChange={this.handleTextChange}
              />
            </div>

            <div className="contact-form-buttons">
              <Button color="primary" size="large" onClick={handleClose}>
                Cancel
              </Button>

              <Button color="primary" size="large" type="submit" autoFocus>
                <strong>Send</strong>
              </Button>
            </div>

            {isErrorOnAdd && <Alert severity="error">There was an error when trying to send the message. Please reload the page and try again.</Alert>}
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

ContactUsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ContactUsDialog;
