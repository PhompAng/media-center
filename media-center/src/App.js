import { connect } from 'react-redux'
import { Container, Row } from 'reactstrap'
import React, { Component } from 'react'

import Bar from '~/ui/bar'
import { fetchInit } from '~/redux/action'
import Folders from './Folders'
import './App.css'
import PropTypes from 'prop-types'

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
