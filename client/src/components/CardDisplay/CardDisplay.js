import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import './CardDisplay.scss';
import ScenarioCard from '../ScenarioCard';

function CardDisplay({ data, reloadFunc }) {
  const cards = data
    ? data.map(scenario => <ScenarioCard key={scenario.id} scenario={scenario} reloadFunc={reloadFunc} />)
    : [<Skeleton className="skeleton" key={0} variant="rect" width="100%" height={400} />];

  return (
    <Grid
      container
      className="CardDisplay"
      direction="row"
      justify="space-evenly"
      alignItems="flex-start"
    >
      {cards}
    </Grid>
  );
}

CardDisplay.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  reloadFunc: PropTypes.func.isRequired,
};

CardDisplay.defaultProps = {
  data: undefined,
};

export default CardDisplay;  