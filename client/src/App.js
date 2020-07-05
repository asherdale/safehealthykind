import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import Posts from './pages/Posts';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <NavBar />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About}/>
        <Route exact path="/posts/:id" component={Posts}/>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
