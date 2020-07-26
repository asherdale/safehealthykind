import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  IconButton,
  Typography,
  Button,
  Popover,
} from '@material-ui/core';
import { Close, InsertLink } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import './CopyLinkDialog.scss';

const CopyLinkDialog = ({ isOpen, handleClose, docId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const pathname = `/posts/${docId}`;
  const fullLink = window.location.href.slice(0, -1) + pathname;

  const handleCopyButtonClick = (event) => {
    navigator.clipboard.writeText(fullLink);
    setAnchorEl(event.currentTarget);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="CopyLinkDialog"
    >
      <div className="dialog">
        <div className="dialog-top">
          <IconButton onClick={handleClose}>
            <Close fontSize="large" />
          </IconButton>
        </div>

        <div className="dialog-content">
          <Typography variant="h4" className="copy-title">One more thing</Typography>
          
          <Typography variant="subtitle1" className="copy-description">
            Here&apos;s a direct link to your post if you&apos;d like to access it in the future and see any replies to your post.
          </Typography>
          
          <Button
            id="copy-button"
            size="large"
            variant="contained"
            color="primary"
            startIcon={<InsertLink />}
            onClick={handleCopyButtonClick}
          >
            Copy Link
          </Button>

          <Popover
            id="copy-button-popover"
            open={!!anchorEl}
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Typography variant="subtitle1">Link copied!</Typography>
            <Link to={{ pathname, state: { fromHome: true } }}>{fullLink}</Link>
          </Popover>
        </div>
      </div>
    </Dialog>
  );
};

CopyLinkDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  docId: PropTypes.string.isRequired,
};

export default CopyLinkDialog;
