import React from 'react';
import axios from 'axios';
import { Container, Button, Typography } from '@material-ui/core';
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

    return (
      <Container className="Home">
        <div className="intro">
          <Typography variant="h4" className="intro-header">
            Real stories from real health care workers
          </Typography>
  
          <Container maxWidth="md">
            <Typography variant="h3" className="intro-paragraph">
              Remember why we health care workers do what we do, and why we should keep at it, even in these challenging times.
            </Typography>
          </Container>

          <div className="share-cta">
            <Typography variant="h5">Healthcare worker?</Typography>
            <Button color="primary" variant="outlined" size="large" onClick={this.handleDialogOpen}>
              Share your story
            </Button>
          </div>
        </div>

        <CardDisplay data={scenarios} reloadFunc={this.fetchScenarioData} />

        <AddScenarioDialog isOpen={isAddingScenario} handleClose={this.handleDialogClose} reloadFunc={this.fetchScenarioData} />
        
      </Container>
    );
  }
}

export default Home;  