import { Col } from 'reactstrap'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import LazyLoad from 'react-lazyload'
import folder from './folder.jpg'
import styles from './FolderCard.scss'

let cx = classNames.bind(styles)

class FolderCard extends Component {
  static protoType = {
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    return (
      <Col sm="6" md="4" lg="3" xl="2" onClick={this.props.onClick}>
        <div className={styles.card}>
          <div className={styles.wrapper}>
            <LazyLoad height={540} once offset={-200}>
              <img className={styles.cover} alt="" src={this.props.imageUrl ? this.props.imageUrl : folder}></img>
            </LazyLoad>
            <div className={styles.header}>
            </div>
            <div className={cx(styles.data, {noImage: this.props.type === 'folder' || this.props.imageUrl == null})}>
              <div className={styles.content}>
                {/* <span className={styles.author}>Jane Doe</span> */}
                <h2 className={styles.title}>{this.props.title}</h2>
              </div>
            </div>
          </div>
        </div>
      </Col>
    )
  }
}

export default FolderCard