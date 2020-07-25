import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';
import './CardDisplay.scss';
import ScenarioCard from '../ScenarioCard';

function CardDisplay({ scenarios, hasMoreScenarios, infiniteScrollFunc }) {
  const cards = scenarios ? scenarios.map(scenario => <ScenarioCard key={scenario.id} scenario={scenario} />) : [];

  return (
    <Grid
      container
      className="CardDisplay"
      direction="column"
      justify="flex-start"
      alignItems="center"
    >
      <InfiniteScroll
        className="infinite-scroll"
        pageStart={0}
        loadMore={infiniteScrollFunc}
        hasMore={hasMoreScenarios}
        loader={<div className="loader" key={0}>Loading ...</div>}
      >
        {cards}
      </InfiniteScroll>
    </Grid>
  );
}

CardDisplay.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.object),
  hasMoreScenarios: PropTypes.bool.isRequired,
  infiniteScrollFunc: PropTypes.func.isRequired,
};

CardDisplay.defaultProps = {
  scenarios: null,
};

export default CardDisplay;  