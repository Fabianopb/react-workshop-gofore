import React, {Component} from 'react';
import axios from 'axios';
import { getRandomCountry } from './ducks/rounds';
import RadioPads from './components/Radio-pads';
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
    choices: [],
    correctAnswer: {
      code: null,
      choice: null
    },
    resultMessage: null
  };

  componentWillMount() {
    axios.get('/api/countries').then(response => {
      this.setState({ countries: response.data }, this._getChoices)
    });
  }

  _getChoices() {
    const choices = [];
    while (choices.length < 3) {
      const randomCountry = getRandomCountry(this.state.countries);
      if (choices.map(choice => choice.code).indexOf(randomCountry.code) === -1) {
        choices.push(randomCountry);
      }
    }
    this.setState({ choices });
    const randomIndex = Math.floor(Math.random() * choices.length);
    this.setState({ correctAnswer: choices[randomIndex] });
  }

  _handleCountrySelection = (countryCode) => {
    const resultMessage = countryCode === this.state.correctAnswer.code ? 'Correct answer!' : 'Wrong answer!';
    this.setState({ resultMessage });
  }

  render() {

    const { code, choice } = this.state.correctAnswer;

    const flagImage = this.state.correctAnswer.code ? (
        <img src={ `/flags/${ code }.png` } alt={ choice[code] } />
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
          { this.state.resultMessage ? (
            this.state.resultMessage
          ) : (
            <RadioPads
              options={ this.state.choices.map(choice => choice.choice) }
              handleSelection= { this._handleCountrySelection }
              />
          ) }
        </main>
      </div>
    )
  }
}

App.propTypes = {}

export default App
