import * as actionType from '~/redux/constant/action-types'

export const fetchContents = (dir, pageInformation) => ({
  type: actionType.FETCH_CONTENTS,
  payload: {
    dir: dir,
    pageInformation: pageInformation
  }
})


export const fetchInit = () => ({ type: actionType.FETCH_INIT })

export const cd = (dir) => ({
  type: actionType.CHANGE_DIR,
  payload: dir
})

export const loadMore = (dir, pageInformation) => ({
  type: actionType.LOAD_MORE,
  payload: {
    dir: dir,
    pageInformation: pageInformation
  }
})