import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Skeleton, Alert } from '@material-ui/lab';
import './Posts.scss';
import ScenarioCard from '../../components/ScenarioCard';
import CardDisplay from '../../components/CardDisplay';

class Posts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isErrorOnFetch: false,
    };
  }

  componentDidMount() {
    this.fetchScenarioData();
  }

  fetchScenarioData = async () => {
    const { match } = this.props;

    try {
      const response = await axios.get(`/api/scenario?id=${match.params.id}`);
      this.setState({ scenario: response.data.scenarios[0], isErrorOnFetch: false });
    } catch {
      this.setState({ isErrorOnFetch: true });
    }
  }

  scenarioDisplay = (scenario) => {
    if (!scenario) {
      return null;
    }
    
    return window.innerWidth < 768 ? <ScenarioCard isSolo scenario={scenario} /> : <CardDisplay scenarios={[scenario]} />;
  }

  render() {
    const { scenario, isErrorOnFetch } = this.state;

    return (
      <div className="Posts">
        {isErrorOnFetch && <Alert severity="error">Either this post does not exist, or there was an error when communicating with the server. Please try again.</Alert>}
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