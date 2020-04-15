import React from 'react';
import Container from '@material-ui/core/Container';
import './Home.scss';
import { getScenarioData, analytics } from '../../api/firebase';
import CardDisplay from '../../components/CardDisplay';

class Home extends React.Component {
  async componentDidMount() {
    analytics.logEvent('home_loaded');

    const scenarios = await getScenarioData();
    this.setState({ scenarios })
  }

  render() {
    return (
      <Container className="Home">
        <div className="intro-text">
          <p className="intro-header">
            In the face of COVID-19, be <strong>safe</strong>, be <strong>healthy</strong>, and be <strong>kind</strong>.
          </p>
  
          <p className="intro-paragraph">
            COVID-19 challenges us in many ways, not least among them, our psyche. Amidst our appropriate fear, isolation, sadness, and focus on self-preservation, it has become a daily challenge to do all components of what we know is right: to be safe, healthy, and kind. The scenarios below are true, written by real health care workers in this pandemic. Read the affirmational statements in response and write new ones. Come back to this site again and again to remember why we health care workers do what we do, and why we should keep at it, even in these challenging times.
          </p>
        </div>
  
        {this.state && <CardDisplay data={this.state.scenarios} />}
        
      </Container>
    );
  }
}

export default Home;  