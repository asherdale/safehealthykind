import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import './Posts.scss';

const Posts = ({ match }) => (
  <Typography variant="h4">
    ID: {match.params.id}
  </Typography>
);

Posts.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


export default Posts;