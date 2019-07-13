import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

import App from '~/ui/app'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route exact path="/" component={App} />
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root