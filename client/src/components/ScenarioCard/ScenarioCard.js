import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import {
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
} from '@material-ui/core';
import {
  MoreHoriz,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  ArrowBack,
} from '@material-ui/icons';
import TextTruncate from 'react-text-truncate';
import './ScenarioCard.scss';
import ResponseCard from '../ResponseCard';
import ReportDialog from '../ReportDialog';
import AddPostDialog from '../AddPostDialog';
import { timeSince } from '../../utils/utils';

class ScenarioCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLiked: localStorage.getItem(`${props.scenario.id}_like`) === 'true',
      menuAnchorEl: null,
      isReportDialogOpen: false,
      isAddingResponse: false,
      isTextExpanded: props.location.state && props.location.state.expanded,
      isScenarioVisible: localStorage.getItem(`${props.scenario.id}_report`) !== 'true',
    };
  }

  handleMenuOpen = (event) => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  handleAddDialogOpen = () => {
    this.setState({ isAddingResponse: true });
  }

  handleAddDialogClose = () => {
    this.setState({ isAddingResponse: false });
  }

  handleNewResponse = (response) => {
    const { scenario } = this.props;

    scenario.responses.unshift({
      reports: 0,
      likes: 0,
      dateCreated: { _seconds: Math.round(new Date() / 1000) - 3 },
      ...response,
    });

    this.forceUpdate();
  }

  handleReportClick = () => {
    this.handleMenuClose();
    this.setState({ isReportDialogOpen: true });
  }

  handleReportDialogClose = () => {
    this.setState({ isReportDialogOpen: false });
  }

  handleReportConfirmed = () => {
    this.handleReportDialogClose();

    const { scenario } = this.props;
    
    scenario.reports = (scenario.reports || 0) + 1;
    localStorage.setItem(`${scenario.id}_report`, true);
    
    axios.put('/api/scenario', {
      scenarioId: scenario.id,
      update: { reports: scenario.reports },
    });

    this.setState({ isScenarioVisible: false });
  }

  handleLikeClick = () => {
    this.setState(prevState => ({ isLiked: !prevState.isLiked }));

    const { isLiked } = this.state;
    const { scenario } = this.props;

    scenario.likes += isLiked ? -1 : 1;
    localStorage.setItem(`${scenario.id}_like`, !isLiked);

    axios.put('/api/scenario', {
      scenarioId: scenario.id,
      update: { likes: scenario.likes },
    });
  }

  handleBackButton = () => {
    const { location, history } = this.props;

    if (location.state && location.state.fromHome) {
      history.goBack();
    }

    history.replace('/');
  }

  handleExpandToggle = () => {
    const { isSolo } = this.props;

    if (!isSolo) {
      return;
    }

    this.setState(prevState => ({ isTextExpanded: !prevState.isTextExpanded }));
  }

  getTruncateLink = (scenarioId) => {
    const { isSolo } = this.props;

    return isSolo ? (
      <span className="link-button">See more</span>
    ): (
      <Link className="link-button" to={{ pathname: `/posts/${scenarioId}`, state: { fromHome: true, expanded: true } }}>See more</Link>
    );
  }

  render() {
    const { scenario, location, isSolo } = this.props;

    const {
      isLiked,
      menuAnchorEl,
      isReportDialogOpen,
      isAddingResponse,
      isScenarioVisible,
      isTextExpanded,
    } = this.state;

    if (!isScenarioVisible) {
      return null;
    }

    const dateText = timeSince(scenario.dateCreated);

    scenario.responses.sort((a, b) => b.dateCreated._seconds - a.dateCreated._seconds);

    const responseCards = scenario.responses.map(response => {
      return <ResponseCard key={response.dateCreated._seconds} response={response} />;
    });

    return (
      <div className={`ScenarioCard ${isSolo ? 'solo' : 'feed'}`} >
        <div className="scenario-content">
          <div className="scenario-top">
            <div className="metadata">
              {isSolo && <IconButton className="back-button" onClick={this.handleBackButton}>
                <ArrowBack fontSize="default" htmlColor="white" />
              </IconButton>}
              <Typography className="header" variant="body2">{scenario.title} from {scenario.location}</Typography>
              <Typography variant="body2">{scenario.name}&nbsp;&bull;&nbsp;{dateText}</Typography>
            </div>

            <div className="scenario-menu">
              <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleMenuOpen}>
                <MoreHoriz fontSize="default" htmlColor="white" />
              </IconButton>

              <Menu
                anchorEl={menuAnchorEl}
                keepMounted
                open={Boolean(menuAnchorEl)}
                onClose={this.handleMenuClose}
              >
                <MenuItem onClick={this.handleReportClick}>Report</MenuItem>
              </Menu>
            </div>
          </div>

          <div className="scenario-mid">
            <Typography variant="h5" onClick={this.handleExpandToggle}>
              <TextTruncate
                line={!isTextExpanded && 10}
                element="span"
                truncateText="…"
                text={scenario.scenarioText}
                textTruncateChild={this.getTruncateLink(scenario.id)}
              />
              {isTextExpanded && <>
                <br />
                <span className="link-button">See less</span>
              </>}
            </Typography>
          </div>

          <div className="scenario-bottom">
            <div className="likes">
              <FavoriteBorder />
              <Typography variant="h5" className="like-number">{scenario.likes}</Typography>
            </div>
          </div>

          <div className="actions">
            <div onClick={this.handleLikeClick} aria-hidden="true" className={isLiked ? 'liked' : ''}>
              {isLiked ? <Favorite fontSize="large" /> : <FavoriteBorder fontSize="large" />}
              <Typography variant="h6" className="action-text">{isLiked ? 'Liked' : 'Like'}</Typography>
            </div>

            <div onClick={this.handleAddDialogOpen} aria-hidden="true">
              <ChatBubbleOutline fontSize="large" />
              <Typography variant="h6" className="action-text">Reply</Typography>
            </div>
          </div>
        </div>

        <div className="response-content">
          {location.pathname.startsWith('/posts') ? responseCards : responseCards.slice(0, 2)}
        </div>

        { location.pathname === '/' &&
            <div className="detail-button">
              <Link to={{ pathname: `/posts/${scenario.id}`, state: { fromHome: true } }}>
                <Button>
                  {
                    responseCards.length > 2
                      ? `View all ${responseCards.length} affirmations`
                      : 'View post'
                  }
                </Button>
              </Link>
            </div>
        }

        <ReportDialog
          isOpen={isReportDialogOpen}
          handleCancel={this.handleReportDialogClose}
          handleConfirm={this.handleReportConfirmed}
        />

        <AddPostDialog
          isOpen={isAddingResponse}
          handleClose={this.handleAddDialogClose}
          submitCallback={this.handleNewResponse}
          isScenario={false}
          scenarioId={scenario.id}
        />
      </div>
    );
  }
}

ScenarioCard.propTypes = {
  isSolo: PropTypes.bool,
  scenario: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scenarioText: PropTypes.string.isRequired,
    responses: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    reports: PropTypes.number.isRequired,
    likes: PropTypes.number.isRequired,
    dateCreated: PropTypes.object.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    state: PropTypes.object,
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

ScenarioCard.defaultProps = {
  isSolo: false,
};

export default withRouter(ScenarioCard);
