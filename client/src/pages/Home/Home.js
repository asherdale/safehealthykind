import React from 'react';
import axios from 'axios';
import { Typography, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './Home.scss';
import CardDisplay from '../../components/CardDisplay';
import AddPostDialog from '../../components/AddPostDialog';
import CopyLinkDialog from '../../components/CopyLinkDialog';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingScenario: false,
      isCopyingLink: false,
      isErrorOnFetch: false,
      hasMoreScenarios: true,
      isFetching: false,
    };
  }
  
  componentDidMount() {
    this.fetchScenarioData();
  }

  fetchScenarioData = async () => {
    try {
      const { lastDate, scenarios, isFetching, hasMoreScenarios } = this.state;

      if (isFetching || !hasMoreScenarios) {
        return;
      }

      this.setState({ isFetching: true });

      const params = lastDate ? `?lastDate=${lastDate}` : '';
      const response = await axios.get(`/api/scenario${params}`);

      if (!response.data.scenarios) {
        throw new Error();
      }

      const newScenarios = scenarios ? scenarios.concat(response.data.scenarios) : response.data.scenarios;

      this.setState({
        scenarios: newScenarios,
        hasMoreScenarios: response.data.scenarios && response.data.scenarios.length > 0,
        lastDate: newScenarios.slice(-1)[0].dateCreated._seconds,
        isErrorOnFetch: false,
        isFetching: false,
      });
    } catch {
      this.setState({
        isErrorOnFetch: true,
        hasMoreScenarios: false,
        isFetching: false,
      });
    }
  }

  handleNewScenario = (scenario) => {
    const { scenarios } = this.state;

    const newScenario = [{
      reports: 0,
      likes: 0,
      responses: [],
      dateCreated: { _seconds: Math.round(new Date() / 1000) - 3 },
      ...scenario,
    }];

    this.setState({ scenarios: newScenario.concat(scenarios), docIdToCopy: scenario.id });
    this.handleCopyLinkDialogOpen();
  }

  handleNewScenarioDialogOpen = () => {
    this.setState({ isAddingScenario: true });
  }

  handleNewScenarioDialogClose = () => {
    this.setState({ isAddingScenario: false });
  }

  handleCopyLinkDialogOpen = () => {
    this.setState({ isCopyingLink: true });
  }

  handleCopyLinkDialogClose = () => {
    this.setState({ isCopyingLink: false });
  }

  render() {
    const {
      scenarios,
      isAddingScenario,
      hasMoreScenarios,
      isErrorOnFetch,
      isCopyingLink,
      docIdToCopy,
    } = this.state;

    const isInternetExplorer = false || !!document.documentMode;

    return (
      <div className="Home">
        {isInternetExplorer && <Alert severity="error">Internet Explorer is not a supported browser. Please consider using a browser like Google Chrome, Firefox, or Microsoft Edge.</Alert>}

        <div className="intro">
          <Typography variant="subtitle1" id="intro-1">
            HEALTHCARE WORKERS
          </Typography>
  
          <Typography variant="h1" id="intro-2">
            How&apos;s your day, <span className="purp">really?</span>
          </Typography>

          <Typography variant="body1" id="intro-3">
            We&apos;re here to listen. SafeHealthyKind is a safe space for you to share your experiences, frustrations, and fears, and get support from your peers.
          </Typography>

          <div className="share-cta">
            <Button onClick={this.handleNewScenarioDialogOpen}>SHARE YOUR STORY</Button>
          </div>
        </div>

        {isErrorOnFetch && <Alert severity="error">There was an error when communicating with the server. Please try again.</Alert>}

        <CardDisplay
          scenarios={scenarios}
          hasMoreScenarios={hasMoreScenarios}
          infiniteScrollFunc={this.fetchScenarioData}
        />

        <AddPostDialog
          isOpen={isAddingScenario}
          handleClose={this.handleNewScenarioDialogClose}
          submitCallback={this.handleNewScenario}
          isScenario
        />

        {docIdToCopy && <CopyLinkDialog
          isOpen={isCopyingLink}
          handleClose={this.handleCopyLinkDialogClose}
          docId={docIdToCopy}
        />}
      </div>
    );
  }
}

export default Home;  