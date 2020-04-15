import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import './ResponseCard.scss';
import { timeSince } from '../../utils/utils';

function ResponseCard({ response }) {
  const { location, name, responseText, dateCreated } = response;
  const dateText = timeSince(dateCreated.toDate());

  return (
    <Card className="ResponseCard">
      <CardContent className="response-content">
        <p className="response">{responseText}</p>

        <p className="signature">- {name}, {location}</p>
        <p className="date">{dateText}</p>
      </CardContent>
    </Card>
  );
}

ResponseCard.propTypes = {
  response: PropTypes.shape({
    location: PropTypes.string,
    likes: PropTypes.number,
    name: PropTypes.string,
    responseText: PropTypes.string,
    dateCreated: PropTypes.object
  }).isRequired,
};

export default ResponseCard;  