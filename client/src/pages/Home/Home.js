import React from 'react';
import axios from 'axios';
import { Typography, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './Home.scss';
import CardDisplay from '../../components/CardDisplay';
import AddScenarioDialog from '../../components/AddScenarioDialog';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingScenario: false,
    };
  }
  
  componentDidMount() {
    this.fetchScenarioData();
  }

  fetchScenarioData = async () => {
    try {
      const response = await axios.get('/api/scenario');
      this.setState({ scenarios: response.data.scenarios });
    } catch {
      // TODO
    }
  }

  handleDialogOpen = () => {
    this.setState({ isAddingScenario: true });
  }

  handleDialogClose = () => {
    this.setState({ isAddingScenario: false });
  }

  render() {
    const { scenarios, isAddingScenario } = this.state;

    const isInternetExplorer = false || !!document.documentMode;

    return (
      <div className="Home">
        {isInternetExplorer && <Alert severity="error">Internet Explorer is not a supported browser. Please consider using a browser like Google Chrome, Firefox, or Microsoft Edge.</Alert>}

        <div className="intro">
          <Typography variant="h4" id="intro-1">
            Healthcare workers
          </Typography>
  
          <Typography variant="h1" id="intro-2">
            How&apos;s your day, really?
          </Typography>

          <Typography variant="h5" id="intro-3">
            We&apos;re here to listen. SafeHealthyKind is a safe space for you to share your experiences, frustrations, and fears, and get support from your peers.
          </Typography>

          <div className="share-cta">
            <Button onClick={this.handleDialogOpen}>SHARE YOUR STORY</Button>
          </div>
        </div>

        <CardDisplay
          scenarios={scenarios}
          reloadFunc={this.fetchScenarioData}
        />

        <AddScenarioDialog
          isOpen={isAddingScenario}
          handleClose={this.handleDialogClose}
          reloadFunc={this.fetchScenarioData}
        />
        
      </div>
    );
  }
}

export default Home;  