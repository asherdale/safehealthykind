import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import './CardDisplay.scss';
import ScenarioCard from '../ScenarioCard';

function CardDisplay({ data }) {
  const cards = data.map(scenario => {
    return <ScenarioCard key={scenario.id} scenario={scenario} />
  });

  return (
    <Grid
      container
      className="CardDisplay"
      direction="row"
      justify="space-evenly"
      alignItems="center"
    >
      {cards}
    </Grid>
  );
}

CardDisplay.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CardDisplay;  