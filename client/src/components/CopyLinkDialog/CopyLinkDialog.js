import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  IconButton,
  Typography,
  Button,
  TextField,
  Snackbar,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import './CopyLinkDialog.scss';

const CopyLinkDialog = ({ isOpen, handleClose, docId }) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(null);

  const pathname = `/posts/${docId}`;
  const fullLink = window.location.href.slice(0, -1) + pathname;

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const handleSnackbarOpen = () => {
    setIsSnackbarOpen(true);
  };

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(fullLink);
    handleSnackbarOpen();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="CopyLinkDialog"
    >
      <div className="dialog">
        <div className="dialog-top">
          <Typography className="modal-title" variant="h5">
            Save Your Post
          </Typography>

          <IconButton onClick={handleClose}>
            <Close fontSize="large" />
          </IconButton>
        </div>

        <div className="dialog-content">
          <Typography variant="subtitle2" className="copy-description">
            Thanks for sharing!
            <br/><br/>
            Here&apos;s a direct link to your post if you want to access it later, see new replies, and share it with others.
          </Typography>

          <TextField
            className="link-text"
            variant="outlined"
            value={fullLink}
            InputProps={{
              readOnly: true,
            }}
          />

          <Button
            id="copy-button"
            size="large"
            variant="outlined"
            onClick={handleCopyButtonClick}
          >
            Copy Link
          </Button>
        </div>

        <div className="dialog-bottom">
          <Button
            className="back-button"
            size="large"
            variant="outlined"
            onClick={handleClose}
          >
            Back To Home
          </Button>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isSnackbarOpen}
        onClose={handleSnackbarClose}
        message="Link Copied"
        autoHideDuration={1000}
        className="link-copied-snackbar copy-modal-snackbar"
      />
    </Dialog>
  );
};

CopyLinkDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  docId: PropTypes.string.isRequired,
};

export default CopyLinkDialog;
