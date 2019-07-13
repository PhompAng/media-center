import React from 'react'
import ReactDOM from 'react-dom'

import Root from './Root'

import './common/base.scss'
import './index.css'

import store from '~/redux/store'
import registerServiceWorker from './registerServiceWorker'

window.store = store
ReactDOM.render(<Root store={store} />, document.getElementById('root'))
registerServiceWorker()
