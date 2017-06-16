import React, {Component} from 'react';
import axios from 'axios';
import { getRandomCountry } from './ducks/rounds';
import RadioPads from './components/Radio-pads';
import Button from './components/Button';
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

  componentWillMount() {
    this.props.fetchCountries()
  }

  _restartGame = () => {
    this.props.fetchCountries()
  }

  render() {
    const { correctAnswer } = this.props
    const { code, choice } = correctAnswer
    const flagImage = code ? (
        <img className="flag-image" src={ `/flags/${ code }.png` } alt={ choice[code] } />
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
          <div className="title-question">What country this flag belongs to?</div>
          { flagImage }
          { this.props.resultMessage ? (
            <div className="result-wrapper">
              <div className="result-message">{ this.props.resultMessage }</div>
              <Button children={ 'Restart the game?' } onClick={ this.props.restartGame } />
            </div>
          ) : (
            <RadioPads
              options={ this.props.choices.map(choice => choice.choice) }
              handleSelection= { this.props.checkAnswer }
              />
          ) }
        </main>
      </div>
    )
  }
}

App.propTypes = {}

export default App
