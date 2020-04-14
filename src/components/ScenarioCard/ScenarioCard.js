import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import './ScenarioCard.scss';

function ScenarioCard({ scenario, response, signature }) {
  return (
    <Card variant="outlined" className="ScenarioCard">
      <CardContent>
        <p className="scenario">{scenario}</p>

        <p className="response">{response}</p>
        <p className="signature">- {signature}</p>
      </CardContent>

      <CardActions className="actions" disableSpacing>
        <Button size="medium" color="primary">See More</Button>
      </CardActions>
    </Card>
  );
}

ScenarioCard.propTypes = {
  scenario: PropTypes.string.isRequired,
  response: PropTypes.string.isRequired,
  signature: PropTypes.string.isRequired,
};

export default ScenarioCard;  