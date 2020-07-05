import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  MoreHoriz,
  FavoriteBorder,
  ChatBubbleOutline,
} from '@material-ui/icons';
import './ScenarioCard.scss';
import ResponseCard from '../ResponseCard';
import ReportDialog from '../ReportDialog';
import { timeSince } from '../../utils/utils';

class ScenarioCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLiked: false,
      menuAnchorEl: null,
      isReportDialogOpen: false,
      isScenarioVisible: props.scenario.reports < 3,
    };

    this.responsesContainer = null;
    this.scenarioRef = null;
  }

  // handleAddFormSubmit = async (event) => {
  //   event.preventDefault();

  //   const { scenario, reloadFunc } = this.props;
  //   const { addFormName, addFormLocation, addFormText } = this.state;

  //   try {
  //     const apiResponse = await axios.post('/api/response', {
  //       scenarioId: scenario.id,
  //       name: addFormName,
  //       location: addFormLocation,
  //       responseText: addFormText,
  //     });
  
  //     if (apiResponse && apiResponse.data && apiResponse.data.isAdded) {
  //       await reloadFunc();
        
  //       this.setState({
  //         isAddingResponse: false,
  //         isErrorOnAdd: false,
  //         addFormName: '',
  //         addFormLocation: '',
  //         addFormText: '',
  //       });
  //     } else {
  //       this.setState({ isErrorOnAdd: true });
  //     }
  //   } catch (error) {
  //     this.setState({ isErrorOnAdd: true });
  //   }
  // }

  handleMenuOpen = (event) => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

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

    axios.put('/api/scenario', {
      scenarioId: scenario.id,
      update: { likes: scenario.likes },
    });
  }

  render() {
    const { scenario } = this.props;

    const {
      isLiked,
      menuAnchorEl,
      isReportDialogOpen,
      isScenarioVisible,
    } = this.state;

    if (!isScenarioVisible) {
      return null;
    }

    const dateText = timeSince(scenario.dateCreated);

    scenario.responses.sort((a, b) => b.dateCreated - a.dateCreated);

    const responseCards = scenario.responses.map(response => {
      return <ResponseCard key={response.dateCreated._seconds} response={response} />;
    });

    return (
      <div className="ScenarioCard" >
        <div className="scenario-content">
          <div className="scenario-top">
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
            <Typography variant="h5">{scenario.scenarioText}</Typography>
          </div>

          <div className="scenario-bottom">
            <div className="metadata">
              <Typography variant="body1"><strong>{scenario.name}</strong>, {scenario.title}</Typography>
              <Typography variant="body2">{dateText}</Typography>
            </div>

            <div className="likes">
              <FavoriteBorder fontSize="large" />
              <Typography variant="h5" className="like-number">{scenario.likes}</Typography>
            </div>
          </div>

          <div className="actions">
            <div onClick={this.handleLikeClick} aria-hidden="true" className={isLiked ? 'liked' : ''}>
              <FavoriteBorder fontSize="default" />
              <Typography variant="body1" className="action-text">{isLiked ? 'Liked' : 'Like'}</Typography>
            </div>

            <div>
              <ChatBubbleOutline fontSize="default" />
              <Typography variant="body1" className="action-text">Reply</Typography>
            </div>
          </div>
        </div>

        <div className="response-content">
          {responseCards}
        </div>

        <ReportDialog
          isOpen={isReportDialogOpen}
          handleCancel={this.handleReportDialogClose}
          handleConfirm={this.handleReportConfirmed}
        />
      </div>
    );
  }
}

ScenarioCard.propTypes = {
  scenario: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scenarioText: PropTypes.string.isRequired,
    responses: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    reports: PropTypes.number.isRequired,
    likes: PropTypes.number.isRequired,
    dateCreated: PropTypes.object.isRequired,
  }).isRequired,
  reloadFunc: PropTypes.func.isRequired,
};

export default ScenarioCard;
