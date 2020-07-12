import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Skeleton } from '@material-ui/lab';
import './Posts.scss';
import ScenarioCard from '../../components/ScenarioCard';
import CardDisplay from '../../components/CardDisplay';

class Posts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.fetchScenarioData();
  }

  fetchScenarioData = async () => {
    const { match } = this.props;

    try {
      const response = await axios.get(`/api/scenario?id=${match.params.id}`);
      this.setState({ scenario: response.data.scenarios[0] });
    } catch {
      // TODO
    }
  }

  scenarioDisplay = (scenario) => {
    if (!scenario) {
      return null;
    }
    
    return window.innerWidth < 768 ? <ScenarioCard isSolo isFull scenario={scenario} /> : <CardDisplay scenarios={[scenario]} />;
  }

  render() {
    const { scenario } = this.state;

    return (
      <div className="Posts">
        {this.scenarioDisplay(scenario) || <Skeleton variant="rect" height="100vh" width="100vw" />}
      </div>
    );
  }
}

Posts.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


export default Posts;