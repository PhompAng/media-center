import { connect } from 'react-redux'
import { RecyclerListView, DataProvider } from 'recyclerlistview'
import { Row } from 'reactstrap'
import React, { Component } from 'react'

import FolderCard from '~/component/FolderCard'

import styles from './Folders.css'
import { cd } from '~/redux/action'
import PropTypes from 'prop-types'

const mapStateToProp = state => {
  return {
    dir: state.currentDir,
    contents: state.contents
  }
}

const mapDispatchToProp = dispatch => {
  return {
    onCd: (currentDir, dir) => { dispatch(cd(currentDir + '/' + dir))},
    onUp: (currentDir) => { dispatch(cd(currentDir.split('/').slice(0, -1).join('/'))) }
  }
}

class Folders extends Component {
  static protoType = {
    dir: PropTypes.string.isRequired,
    contents: PropTypes.array,
    onCd: PropTypes.func.isRequired,
    onUp: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      })
    }
  }

  rowRenderer = (type, content) => {
    if (type === 'folder') {
      return (
        <FolderCard
          key={content.name}
          onClick={this.props.onCd.bind(this, this.props.dir, content.name)}
          title={content.name}
          type={content.type}
          imageUrl={content.image ? 'http://127.0.0.1:3001/static' + this.props.dir + '/' + content.name + '/' + content.image : null}></FolderCard>
      )
    } else if (type === 'file') {
      return (
        <FolderCard
          key={content.name}
          onClick={() => {}}
          title={content.name}
          type={content.type}
          imageUrl={'http://127.0.0.1:3001/static' + this.props.dir + '/' + content.name}></FolderCard>
      )
    } else {
      return null
    }
  }

  render () {
    const contents = this.props.contents.map(content => {
      if (content.type === 'folder') {
        return (
          <FolderCard
            key={content.name}
            onClick={this.props.onCd.bind(this, this.props.dir, content.name)}
            title={content.name}
            type={content.type}
            imageUrl={content.image ? 'http://127.0.0.1:3001/static' + this.props.dir + '/' + content.name + '/' + content.image : null}></FolderCard>
        )
      } else if (content.type === 'file') {
        return (
          <FolderCard
            key={content.name}
            onClick={() => {}}
            title={content.name}
            type={content.type}
            imageUrl={'http://127.0.0.1:3001/static' + this.props.dir + '/' + content.name}></FolderCard>
        )
      } else {
        return null
      }
    })

    return (
      <Row className={styles.folders}>
        <FolderCard
          onClick={this.props.onUp.bind(this, this.props.dir)}
          title="..."
          type="special"></FolderCard>
        { contents }
      </Row>
    )
  }
}

export default connect(mapStateToProp, mapDispatchToProp)(Folders)