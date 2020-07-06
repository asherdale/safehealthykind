import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import './Posts.scss';
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
      console.log(response);
      this.setState({ scenarios: response.data.scenarios });
    } catch {
      // TODO
    }
  }

  render() {
    const { scenarios } = this.state;

    return (
      <div className="Posts">
        <Link to="/" id="back-arrow">
          <IconButton>
            <ArrowBackIos fontSize="large" />
          </IconButton>
        </Link>

        {/* TODO: pass in prop for whether this is singular */}
        <CardDisplay
          scenarios={scenarios}
          reloadFunc={this.fetchScenarioData}
        />
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