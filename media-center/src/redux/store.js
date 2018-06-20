import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import reducer from '~/redux/reducer'
import logger from 'redux-logger'
import saga from '~/redux/saga'

const sageMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(logger, sageMiddleware))
)
sageMiddleware.run(saga)

export default store