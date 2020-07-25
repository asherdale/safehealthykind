import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Alert } from '@material-ui/lab';
import './Posts.scss';
import ScenarioCard from '../../components/ScenarioCard';

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

  render() {
    const { scenario, isErrorOnFetch } = this.state;

    return (
      <div className={scenario ? 'Posts' : 'Posts loading'}>
        {isErrorOnFetch && <Alert severity="error">Either this post does not exist, or there was an error when communicating with the server. Please try again.</Alert>}
        {scenario ? <ScenarioCard isSolo scenario={scenario} /> : <div className="loader">Loading ...</div>}
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