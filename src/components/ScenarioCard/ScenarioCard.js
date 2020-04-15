import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import './ScenarioCard.scss';
import ResponseCard from '../ResponseCard';

function ScenarioCard({ scenario }) {
  const { scenarioText, responses } = scenario.data;

  if (responses) {
    responses.sort((a, b) => b.dateCreated.seconds - a.dateCreated.seconds);
  }

  const responseCards = !responses ? [] : responses.map(response => {
    return <ResponseCard key={response.dateCreated.seconds} response={response} />
  });

  return (
    <Card variant="outlined" className="ScenarioCard">
      <CardContent className="scenario-content">
        <p className="scenario">&quot;{scenarioText}&quot;</p>

        {responses
          && <div className="responses">
            {responseCards}
          </div>
        }
      </CardContent>

      <CardActions className="actions" disableSpacing>
        <IconButton aria-label="add" color="primary" >
          <Add fontSize="default" />
        </IconButton>
      </CardActions>
    </Card>
  );
}

ScenarioCard.propTypes = {
  scenario: PropTypes.shape({
    data: PropTypes.shape({
      scenarioText: PropTypes.string,
      responses: PropTypes.arrayOf(PropTypes.object)
    })
  }).isRequired,
};

export default ScenarioCard;  