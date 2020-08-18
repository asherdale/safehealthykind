import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import './ReportDialog.scss';

const ReportDialog = ({ isOpen, handleCancel, handleConfirm }) => (
  <Dialog
    className="ReportDialog"
    open={isOpen}
    onClose={handleCancel}
  >
    <div className="dialog-top">
      <Typography className="modal-title" variant="h5">
        Report Confirmation
      </Typography>

      <IconButton onClick={handleCancel}>
        <Close fontSize="large" />
      </IconButton>
    </div>

    <DialogContent>
      <DialogContentText>
        Are you sure that you would like to report this post for inappropriate content?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button color="secondary" onClick={handleCancel}>
        No
      </Button>
      <Button color="primary" onClick={handleConfirm} autoFocus>
        Yes, report post
      </Button>
    </DialogActions>
  </Dialog>
);

ReportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default ReportDialog;
