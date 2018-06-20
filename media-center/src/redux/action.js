import * as actionType from '~/redux/constant/action-types'

export const fetchContents = homeDir => {
  return ({ type: actionType.FETCH_CONTENTS, payload: homeDir })
}

export const fetchInit = () => ({ type: actionType.FETCH_INIT })

export const cd = (dir) => ({ type: actionType.CHANGE_DIR, payload: dir })