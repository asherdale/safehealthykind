import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import './CardDisplay.scss';
import ScenarioCard from '../ScenarioCard';

function CardDisplay({ scenarios }) {
  const cards = scenarios
    ? scenarios.map(scenario => <ScenarioCard key={scenario.id} scenario={scenario} />)
    : [<Skeleton className="skeleton" key={0} variant="rect" width="100%" height={400} />];

  return (
    <Grid
      container
      className="CardDisplay"
      direction="column"
      justify="flex-start"
      alignItems="center"
    >
      {cards}
    </Grid>
  );
}

CardDisplay.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.object),
};

CardDisplay.defaultProps = {
  scenarios: null,
};

export default CardDisplay;  