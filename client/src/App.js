import React, {Component} from 'react';
import axios from 'axios';
import { getRandomCountry } from './ducks/rounds';
import './App.css';

// this is a little helper you can use if you like, or erase and make your own
const renderCurrentMessage = (  // eslint-disable-line no-unused-vars
  seconds,
  stoppedTime,
  round
) => {
  const {active, isCorrect, started} = round
  const showWelcomeMessage = !started && !active
  const showStartMessage = stoppedTime === null && active
  const showSuccessMessage = stoppedTime > 0 && isCorrect
  const showMistakeMessage = stoppedTime > 0 && !isCorrect

  let message = <span>Oops, time expired</span>

  if (showWelcomeMessage) {
    message = <span>Welcome. Ready to get vexed?</span>
  } else if (showStartMessage) {
    message = <span>Time remaining: {seconds}</span>
  } else if (showSuccessMessage) {
    message = (
      <span>Good job! Answered in {10 - stoppedTime} {seconds === 1 ? 'second' : 'seconds'}</span>
    )
  } else if (showMistakeMessage) {
    message = <span>Wrong answer. Keep studying!</span>
  }
  return <div className='messages-text'>{message}</div>
}

class App extends Component {

  state = {
    countries: {},
    choices: null,
    correctAnswer: null,
    activeFlag: null
  };

  componentWillMount() {
    axios.get('/api/countries').then(response => {
      this.setState({ countries: response.data }, this._setRandomFlag)
    });
  }

  _setRandomFlag() {
    this.setState({ activeFlag: getRandomCountry(this.state.countries) });
  }

  render() {

    const flagImage = this.state.activeFlag ? (
        <img src={ `/flags/${ this.state.activeFlag.code }.png` }></img>
    ) : null;

    return (
      <div className='App'>

        <div className='App-header'>
          <i className='fa fa-flag-o' aria-hidden='true' />
          <h1>Vexed</h1>
          <h4>
            A game to improve your vexillogical knowledge
          </h4>
        </div>

        <nav><h4 style={{color: '#fff'}}>Cool nav bar here</h4></nav>

        <main>
          { flagImage }
        </main>
      </div>
    )
  }
}

App.propTypes = {}

export default App
