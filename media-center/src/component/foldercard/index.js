import classNames from 'classnames/bind'
import ImageWorker from 'react-worker-image';
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import VisibilitySensor from 'react-visibility-sensor'

import folder from './folder.jpg'
import styles from './styles.scss'

let cx = classNames.bind(styles)

class FolderCard extends Component {
  static protoType = {
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    dimensions: PropTypes.object,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    return (
      <VisibilitySensor>
        <div className={styles.card} onClick={this.props.onClick}>
          <div className={styles.wrapper}>
            {
              this.props.imageUrl ?
                (<ImageWorker
                  containerClass={styles.cover}
                  imageClass={
                    this.props.dimensions ?
                      (this.props.dimensions.width < this.props.dimensions.height) ? styles.portrait : null :
                      null
                  }
                  alt=""
                  src={this.props.imageUrl}></ImageWorker>) :
                (<div className={styles.cover}>
                  <img alt="" src={folder}></img>
                </div>)
            }

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
      </VisibilitySensor>
    )
  }
}

export default FolderCard