import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Col } from 'reactstrap'
import React, { Component } from 'react'

import styles from './style.css'

const mapStateToProps = state => {
  return { dir: state.currentDir }
}

class Bar extends Component {
  static protoType = {
    dir: PropTypes.string.isRequired
  }
  render () {
    return (
      <Col className={styles.bar}>
        <div className={styles.address}>
          <span>{this.props.dir}</span>
        </div>
      </Col>
    )
  }
}

export default connect(mapStateToProps)(Bar)