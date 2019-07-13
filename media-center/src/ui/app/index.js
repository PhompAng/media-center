import { connect } from 'react-redux'
import { Container, Row } from 'reactstrap'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Bar from './bar'
import Folders from './folders'

import { fetchInit } from '~/redux/action'

const mapDispatchToProp = dispatch => {
  return {
    onFetchInit: () => { dispatch(fetchInit()) }
  }
}

class App extends Component {
  static protoType = {
    onFetchInit: PropTypes.func.isRequired
  }
  componentDidMount () {
    this.props.onFetchInit()
  }
  render () {
    return (
      <Container fluid>
        <Row>
          <Bar></Bar>
        </Row>
        <Folders></Folders>
      </Container>
    )
  }
}

export default connect(null, mapDispatchToProp)(App)
