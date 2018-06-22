import { connect } from 'react-redux'
import { RecyclerListView, DataProvider } from 'recyclerlistview/web'
import { Row } from 'reactstrap'
import React, { Component } from 'react'

import { LayoutUtil } from '~/common/utils/LayoutUtil'

import FolderCard from '~/component/FolderCard'

import styles from './Folders.css'
import { cd, loadMore } from '~/redux/action'
import PropTypes from 'prop-types'

const mapStateToProp = state => {
  return {
    dir: state.currentDir,
    contents: state.contents,
    pageInformation: state.pageInformation,
    totalNumberOfPages: state.totalNumberOfPages
  }
}

const mapDispatchToProp = dispatch => {
  return {
    onCd: (currentDir, dir) => { dispatch(cd(currentDir + '/' + dir))},
    onUp: (currentDir) => { dispatch(cd(currentDir.split('/').slice(0, -1).join('/'))) },
    onLoadMore: (currentDir, pageInformation) => {
      console.log("load more " + currentDir)
      dispatch(loadMore(currentDir, pageInformation))
    }
  }
}

class Folders extends Component {
  static protoType = {
    dir: PropTypes.string.isRequired,
    contents: PropTypes.array,
    pageInformation: PropTypes.object.isRequired,
    totalNumberOfPages: PropTypes.number.isRequired,
    onCd: PropTypes.func.isRequired,
    onUp: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    dataProvider: PropTypes.object,
    layoutProvider: PropTypes.object
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    return {
      dataProvider: prevState.dataProvider.cloneWithRows([{type: 'special'},...nextProps.contents])
    }
  }

  constructor(props) {
    super(props)
    let dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    })
    this.state = {
      dataProvider: dataProvider,
      layoutProvider: LayoutUtil.getLayoutProvider(window.innerWidth, 0)
    }
    this.rowRenderer = this.rowRenderer.bind(this)
  }

  getImageUrl = (content) => {
    if (content.type === 'folder') {
      return content.image ? 'http://127.0.0.1:3001/static' + this.props.dir + '/' + content.name + '/' + content.image : null
    } else if (content.type === 'file') {
      switch (content.mime.mime.split('/')[0]) {
      case 'image':
        return 'http://127.0.0.1:3001/static' + this.props.dir + '/' + content.name
      case 'video':
        return 'http://127.0.0.1:3001/thumbnail/' + content.image
      default:
        return null
      }
    }
  }

  rowRenderer = (type, content) => {
    if (content.type === 'folder') {
      return (
        <FolderCard
          key={content.name}
          onClick={this.props.onCd.bind(this, this.props.dir, content.name)}
          title={content.name}
          type={content.type}
          dimensions={content.dimensions}
          imageUrl={this.getImageUrl(content)}></FolderCard>
      )
    } else if (content.type === 'file') {
      return (
        <FolderCard
          key={content.name}
          onClick={() => {}}
          title={content.name}
          type={content.type}
          dimensions={content.dimensions}
          imageUrl={this.getImageUrl(content)}></FolderCard>
      )
    } else if (content.type === 'special') {
      return (
        <FolderCard
          onClick={this.props.onUp.bind(this, this.props.dir)}
          title="..."
          type="special"></FolderCard>
      )
    } else {
      return null
    }
  }

  loadMore = () => {
    if (this.props.pageInformation.number < this.props.totalNumberOfPages) {
      this.props.onLoadMore(this.props.dir, this.props.pageInformation)
    }
  }

  render () {
    return (
      <Row className={styles.folders}>
        <RecyclerListView
          useWindowScroll={true}
          layoutProvider={this.state.layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this.rowRenderer}
          onEndReached={this.loadMore} />
      </Row>
    )
  }
}

export default connect(mapStateToProp, mapDispatchToProp)(Folders)