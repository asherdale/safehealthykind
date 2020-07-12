import React from 'react';
import axios from 'axios';
import { Typography, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './Home.scss';
import CardDisplay from '../../components/CardDisplay';
import AddPostDialog from '../../components/AddPostDialog';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingScenario: false,
      isErrorOnFetch: false,
    };
  }
  
  componentDidMount() {
    this.fetchScenarioData();
  }

  fetchScenarioData = async () => {
    try {
      const response = await axios.get('/api/scenario');
      this.setState({ scenarios: response.data.scenarios, isErrorOnFetch: false });
    } catch {
      this.setState({ isErrorOnFetch: true });
    }
  }

  handleDialogOpen = () => {
    this.setState({ isAddingScenario: true });
  }

  handleDialogClose = () => {
    this.setState({ isAddingScenario: false });
  }

  render() {
    const { scenarios, isAddingScenario, isErrorOnFetch } = this.state;

    const isInternetExplorer = false || !!document.documentMode;

    return (
      <div className="Home">
        {isInternetExplorer && <Alert severity="error">Internet Explorer is not a supported browser. Please consider using a browser like Google Chrome, Firefox, or Microsoft Edge.</Alert>}

        <div className="intro">
          <Typography variant="h4" id="intro-1">
            HEALTHCARE WORKERS
          </Typography>
  
          <Typography variant="h1" id="intro-2">
            How&apos;s your day, <span className="purp">really?</span>
          </Typography>

          <Typography variant="subtitle1" id="intro-3">
            We&apos;re here to listen. SafeHealthyKind is a safe space for you to share your experiences, frustrations, and fears, and get support from your peers.
          </Typography>

          <div className="share-cta">
            <Button onClick={this.handleDialogOpen}>SHARE YOUR STORY</Button>
          </div>
        </div>

        {isErrorOnFetch && <Alert severity="error">There was an error when communicating with the server. Please try again.</Alert>}

        <CardDisplay scenarios={scenarios} />

        <AddPostDialog
          isOpen={isAddingScenario}
          handleClose={this.handleDialogClose}
          submitCallback={this.fetchScenarioData}
          isScenario
        />
        
      </div>
    );
  }
}

export default Home;  