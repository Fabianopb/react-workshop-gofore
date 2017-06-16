import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import App from './App'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import {applyMiddleware, compose, createStore, combineReducers, bindActionCreators} from 'redux'
import {Provider, connect} from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import {
  put,
  take,
  takeEvery,
  call,
  all,
  select
} from 'redux-saga/effects'
import { getRandomCountry } from './ducks/rounds';
// import reducer from './reducer.js'

// import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const middleware = [ sagaMiddleware ]
const enhancers = []
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const createChoices = (countries) => {
  const choices = [];
  while (choices.length < 3) {
    const randomCountry = getRandomCountry(countries);
    if (choices.map(choice => choice.code).indexOf(randomCountry.code) === -1) {
      choices.push(randomCountry);
    }
  }
  return choices
}

function* createChoicesSaga(countries) {

  const choices = yield call(createChoices, countries)
  const randomIndex = Math.floor(Math.random() * choices.length);
  const correctAnswer = choices[randomIndex]

  yield put(choicesCreated(choices))
  yield put(correctAnswerSet(correctAnswer))
}

function* fetchCountriesSaga() {
  yield take('FETCH_COUNTRIES')
  const countries = yield call(() => axios.get('/api/countries'));    
  yield put(countriesLoaded(countries.data))

  yield call(createChoicesSaga, countries.data)

  // console.log(choices, randomIndex)
}

function* handleCountrySelectionSaga() {
  while(true) {
    const { payload } = yield take('CHECK_ANSWER')

    // console.log(countryCode)

    const correctAnswer = yield select((state) => state.correctAnswer.code)

    const resultMessage = payload === correctAnswer ? 
      'Correct answer!' : 'Wrong answer!';

    yield put(resultMessageSet(resultMessage))
  }
}

function* resetChoicesSaga() {
  const countries = yield select((state) => state.countries)
  yield call(createChoicesSaga, countries)
}

function* restartGameSaga() {
  yield takeEvery('GAME_RESTARTED', resetChoicesSaga)
}


function* rootSaga() {
  yield all([
    fetchCountriesSaga(),
    handleCountrySelectionSaga(),
    restartGameSaga()
  ])
}


  // choices: [],
  // correctAnswer: {
  //   code: null,
  //   choice: null
  // },
  // resultMessage: null

const fetchCountries = () => {
  return {
    type: 'FETCH_COUNTRIES'
  }
}

const countriesLoaded = (payload) => {
  return { type: 'COUNTRIES_LOADED', payload }
}

const choicesCreated = (payload) => {
  return { type: 'CHOICES_CREATED', payload }
}

const correctAnswerSet = (payload) => {
  return { type: 'CORRECT_ANSWER_SET', payload }
}

const resultMessageSet = (payload) => {
  return { type: 'RESULT_MESSAGE_SET', payload }
}

const checkAnswer = (payload) => {
  // console.log(payload)
  return { type: 'CHECK_ANSWER', payload }
}

const restartGame = () => {
  return { type: 'GAME_RESTARTED' }
}


// setInterval(() => {
//   mockActionCreator()
// }, 3000)

const initialState = {
  countries: {},
  choices: [],
  correctAnswer: {
    code: null,
    choice: null
  },
  resultMessage: null
}

const countryReducer = (countries = initialState.countries, action) => {
  if (action.type === 'COUNTRIES_LOADED') {
    return action.payload
  }
  return countries
}

const choicesReducer = (choices = initialState.choices, action) => {
  if (action.type === 'CHOICES_CREATED') {
    return action.payload
  }
  else if (action.type === 'GAME_RESTARTED') {
    return initialState.choices
  }
  return choices
}

const correctAnswerReducer = (correctAnswer = initialState.correctAnswer, action) => {
  if (action.type === 'CORRECT_ANSWER_SET') {
    return action.payload
  }
  else if (action.type === 'GAME_RESTARTED') {
    return initialState.correctAnswer
  }
  return correctAnswer
}

const resultMessageReducer = (resultMessage = initialState.resultMessage, action) => {
  if (action.type === 'RESULT_MESSAGE_SET') {
    return action.payload
  }
  else if (action.type === 'GAME_RESTARTED') {
    return initialState.resultMessage
  }
  return resultMessage
}

const rootReducer = combineReducers({
  countries: countryReducer,
  choices: choicesReducer,
  correctAnswer: correctAnswerReducer,
  resultMessage: resultMessageReducer
})

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware), ...enhancers),
)

const mapStateToProps = (state) => {
  return {
    countries: state.countries,
    choices: state.choices,
    correctAnswer: state.correctAnswer,
    resultMessage: state.resultMessage
  }
}

const mapDispatchToProps = (dispatch) => 
  bindActionCreators({ 
    fetchCountries,
    checkAnswer,
    restartGame
  }, dispatch)

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root'),
)

registerServiceWorker()
