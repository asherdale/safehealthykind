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
  Snackbar,
} from '@material-ui/core';
import {
  MoreHoriz,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  ArrowBack,
  OutlinedFlag,
  InsertLink,
} from '@material-ui/icons';
import TextTruncate from 'react-text-truncate';
import './ScenarioCard.scss';
import ResponseCard from '../ResponseCard';
import ReportDialog from '../ReportDialog';
import AddPostDialog from '../AddPostDialog';
import { timeSince } from '../../utils/utils';

const SNACKBAR_LINK_COPIED = 'Link Copied';
const SNACKBAR_REPORTED = 'Successfully Reported';

class ScenarioCard extends React.Component {
  constructor(props) {
    super(props);

    props.scenario.responses.sort((a, b) => b.likes - a.likes);

    this.state = {
      isLiked: localStorage.getItem(`${props.scenario.id}_like`) === 'true',
      menuAnchorEl: null,
      isReportDialogOpen: false,
      isAddingResponse: false,
      isTextExpanded: props.location.state && props.location.state.expanded,
      isScenarioVisible: localStorage.getItem(`${props.scenario.id}_report`) !== 'true',
      isSnackbarOpen: false,
      snackbarText: SNACKBAR_LINK_COPIED,
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
    this.handleReportSnackbarOpen();
  }

  handleCopyLinkClick = () => {
    this.handleMenuClose();

    const { scenario } = this.props;

    const pathname = `/posts/${scenario.id}`;
    const fullLink = window.location.href.slice(0, -1) + pathname;

    navigator.clipboard.writeText(fullLink);
    this.handleCopySnackbarOpen();
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

  handleSnackbarClose = () => {
    this.setState({ isSnackbarOpen: false });
  };

  handleCopySnackbarOpen = () => {
    this.setState({ isSnackbarOpen: true, snackbarText: SNACKBAR_LINK_COPIED });
  }

  handleReportSnackbarOpen = () => {
    this.setState({ isSnackbarOpen: true, snackbarText: SNACKBAR_REPORTED });
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
      isSnackbarOpen,
      snackbarText,
    } = this.state;

    const snackbar = (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isSnackbarOpen}
        onClose={this.handleSnackbarClose}
        message={snackbarText}
        autoHideDuration={2000}
        className="link-copied-snackbar"
      />
    );

    if (!isScenarioVisible) {
      return snackbar;
    }

    const dateText = timeSince(scenario.dateCreated);

    const responseCards = scenario.responses
      .filter(response => localStorage.getItem(`${response.id}_report`) !== 'true')
      .map(response => <ResponseCard key={response.dateCreated._seconds} response={response} />);

    const numVisibleResponses = responseCards.reduce((acc, curr) => {
      return localStorage.getItem(`${curr.props.response.id}_report`) === 'true' ? acc - 1 : acc;
    }, responseCards.length);

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
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <MenuItem className="more-menu-item" onClick={this.handleCopyLinkClick}>
                  <InsertLink/> Copy Link
                </MenuItem>

                <MenuItem className="more-menu-item" onClick={this.handleReportClick}>
                  <OutlinedFlag/> Report
                </MenuItem>
              </Menu>
            </div>
          </div>

          <div className="scenario-mid">
            <Typography variant="body1" onClick={this.handleExpandToggle}>
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

          {scenario.likes > 0 && <div className="scenario-bottom">
            <div className="likes">
              <FavoriteBorder />
              <Typography variant="body1" className="like-number">{scenario.likes}</Typography>
            </div>
          </div>}

          <div className="actions">
            <div onClick={this.handleLikeClick} aria-hidden="true" className={isLiked ? 'liked' : ''}>
              {isLiked ? <Favorite /> : <FavoriteBorder />}
              <Typography variant="body1" className="action-text">{isLiked ? 'Liked' : 'Like'}</Typography>
            </div>

            <div className="action-line" />

            <div onClick={this.handleAddDialogOpen} aria-hidden="true">
              <ChatBubbleOutline />
              <Typography variant="body1" className="action-text">Reply</Typography>
            </div>
          </div>
        </div>

        { 
          numVisibleResponses > 0 ? (
            <div className="response-content">
              {location.pathname.startsWith('/posts') ? responseCards : responseCards.slice(0, 2)}
            </div>
          ) : (
            <div className="empty-responses">
              <Typography variant="body1">
                Looks like there aren’t any replies yet.
                <br />
                Be the first to send a kind word.
              </Typography>
            </div>
          )
        }

        { location.pathname === '/' &&
            <div className="detail-button">
              <Link to={{ pathname: `/posts/${scenario.id}`, state: { fromHome: true } }}>
                <Button>
                  {
                    numVisibleResponses > 2
                      ? `View all ${numVisibleResponses} replies`
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

        {snackbar}
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
