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
  all
} from 'redux-saga/effects'
// import reducer from './reducer.js'

// import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const middleware = [ sagaMiddleware ]
const enhancers = []
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function* testSaga() {
  yield takeEvery('TEST_ACTION', () => console.log('yey'))
}

function* fetchCountriesSaga() {
  yield take('FETCH_COUNTRIES')
  const countries = yield call(() => axios.get('/api/countries'));    
  yield put(countriesLoaded(countries.data))
  
      // .then(response => {
        // this.setState({ countries: response.data }, this._getChoices)

      // axios.get('/api/countries').then(response => {
    //   this.setState({ countries: response.data }, this._getChoices)
    // });
}

function* rootSaga() {
  yield all([
    testSaga(),
    fetchCountriesSaga()
  ])
}

const testActionCreator = () => {
  return {
    type: 'TEST_ACTION'
  }
}

const fetchCountries = () => {
  return {
    type: 'FETCH_COUNTRIES'
  }
}

const countriesLoaded = (payload) => {
  return { type: 'COUNTRIES_LOADED', payload }
}



// setInterval(() => {
//   mockActionCreator()
// }, 3000)

const initialState = {
  test: 1,
  countries: {}
}

const testReducer = (test = initialState.test, action) => {
  if (action.type === 'TEST_ACTION') {
    console.log('yea', test)
    return test + 1
  }
  return test
}

const countryReducer = (countries = initialState.countries, action) => {
  if (action.type === 'COUNTRIES_LOADED') {
    return action.payload
  }
  return countries
}

const rootReducer = combineReducers({
  test: testReducer,
  countries: countryReducer
})

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware), ...enhancers),
)

const mapStateToProps = (state) => {
  return {
    test: state.test,
    countries: state.countries
  }
}

const mapDispatchToProps = (dispatch) => 
  bindActionCreators({ 
    testActionCreator,
    fetchCountries
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
