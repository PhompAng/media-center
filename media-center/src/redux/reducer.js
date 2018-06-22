import * as actionType from '~/redux/constant/action-types'

const initialState = {
  homeDir: '/',
  currentDir: '/',
  contents: [],
  pageInformation: {
    number: 1,
    size: 15
  },
  totalNumberOfPages: 1
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionType.SET_HOME_DIR:
    return { ...state, homeDir: action.payload }
  case actionType.SET_CONTENTS:
    return { ...state, contents: action.payload }
  case actionType.SET_CURRENT_DIR:
    return { ...state, currentDir: action.payload }
  case actionType.SET_PAGE_INFORMATION:
    return {
      ...state,
      pageInformation: action.payload.pageInformation,
      totalNumberOfPages: action.payload.totalNumberOfPages
    }
  case actionType.APPEND_CONTENTS:
    return { ...state, contents: [...state.contents, ...action.payload] }
  default:
    return state
  }
}
export default rootReducer