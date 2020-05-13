import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Button,
} from '@material-ui/core';
import './ReportDialog.scss';

const ReportDialog = ({ isOpen, handleCancel, handleConfirm }) => (
  <Dialog
    open={isOpen}
    onClose={handleCancel}
  >
    <DialogTitle>Report Confirmation</DialogTitle>
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
        Yes, I would like to report this post
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
