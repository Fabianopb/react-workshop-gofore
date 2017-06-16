import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import {applyMiddleware, compose, createStore, combineReducers, bindActionCreators} from 'redux'
import {Provider, connect} from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import {
  put,
  takeEvery
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

const testActionCreator = () => {
  return {
    type: 'TEST_ACTION'
  }
}

// setInterval(() => {
//   mockActionCreator()
// }, 3000)

const initialState = {
  test: 1
}

const testReducer = (test = initialState.test, action) => {
  if (action.type === 'TEST_ACTION') {
    console.log('yea', test)
    return test + 1
  }
  return test
}

const rootReducer = combineReducers({
  test: testReducer
})

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware), ...enhancers),
)

const mapStateToProps = (state) => {
  return {
    test: state.test
  }
}

const mapDispatchToProps = (dispatch) => 
  bindActionCreators({ 
    testActionCreator 
  }, dispatch)

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

sagaMiddleware.run(testSaga)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root'),
)

registerServiceWorker()
