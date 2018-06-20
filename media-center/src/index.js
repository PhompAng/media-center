import { Provider } from "react-redux"
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import './common/base.scss'
import './index.css'

import store from '~/redux/store'
import registerServiceWorker from './registerServiceWorker'

window.store = store
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))
registerServiceWorker()
