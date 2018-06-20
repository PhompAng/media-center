import * as actionType from '~/redux/constant/action-types'

const initialState = {
  homeDir: '/',
  currentDir: '/',
  contents: []
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionType.SET_HOME_DIR:
    return { ...state, homeDir: action.payload }
  case actionType.SET_CONTENTS:
    return { ...state, contents: action.payload }
  case actionType.SET_CURRENT_DIR:
    return { ...state, currentDir: action.payload }
  default:
    return state
  }
}
export default rootReducer