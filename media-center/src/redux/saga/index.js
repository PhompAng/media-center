import { call, put, takeEvery } from 'redux-saga/effects'

import * as actionType from '~/redux/constant/action-types'
import { fetchContents } from '~/redux/action'

import * as Api from '~/common/Api'

export function* init() {
  try {
    const response = yield call(Api.init)
    const json = yield call([response, 'json'])
    yield put({type: actionType.SET_HOME_DIR, payload: json.homeDir})
    yield put({type: actionType.SET_CURRENT_DIR, payload: json.homeDir})
    yield call(fetchList, fetchContents(json.homeDir))
  } catch (err) {

  }
}

export function* fetchList(action) {
  try {
    const response = yield call(Api.list, action.payload)
    const json = yield call([response, 'json'])
    yield put({type: actionType.SET_CONTENTS, payload: json.page.entities})
  } catch (err) {
    console.log(err)
  }
}

export function* cd(action) {
  try {
    if (action.payload === "") {
      action.payload = "/"
    }
    yield put({type: actionType.SET_CURRENT_DIR, payload: action.payload})
    yield call(fetchList, fetchContents(action.payload))
  } catch (err) {

  }
}

export function* fetchListAsync() {
  yield takeEvery(actionType.FETCH_CONTENTS, fetchList)
}

export function* initAsync() {
  yield takeEvery(actionType.FETCH_INIT, init)
}

export function* cdAsync(action) {
  yield takeEvery(actionType.CHANGE_DIR, cd)
}
export default function* rootSaga() {
  yield [
    initAsync(),
    fetchListAsync(),
    cdAsync()
  ]
}