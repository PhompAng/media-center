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
    const response = yield call(Api.list, action.payload.dir, action.payload.pageInformation)
    const json = yield call([response, 'json'])
    yield put({type: actionType.SET_CONTENTS, payload: json.page.entities})
    yield put({
      type: actionType.SET_PAGE_INFORMATION,
      payload: {
        pageInformation: json.page.pageInformation,
        totalNumberOfPages: json.page.totalNumberOfPages
      }
    })
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
    yield call(fetchList, fetchContents(action.payload, {
      number: 1,
      size: 15
    }))
  } catch (err) {

  }
}

export function* loadMore(action) {
  try {
    let page = parseInt(action.payload.pageInformation.number, 10)
    console.log(action.payload.pageInformation.number)
    action.payload.pageInformation.number = page + 1
    const response = yield call(Api.list, action.payload.dir, action.payload.pageInformation)
    const json = yield call([response, 'json'])
    yield put({type: actionType.APPEND_CONTENTS, payload: json.page.entities})
    yield put({
      type: actionType.SET_PAGE_INFORMATION,
      payload: {
        pageInformation: json.page.pageInformation,
        totalNumberOfPages: json.page.totalNumberOfPages
      }
    })
  } catch (err) {

  }
}

export function* fetchListAsync() {
  yield takeEvery(actionType.FETCH_CONTENTS, fetchList)
}

export function* initAsync() {
  yield takeEvery(actionType.FETCH_INIT, init)
}

export function* cdAsync() {
  yield takeEvery(actionType.CHANGE_DIR, cd)
}

export function* loadMoreAsync() {
  yield takeEvery(actionType.LOAD_MORE, loadMore)
}

export default function* rootSaga() {
  yield [
    initAsync(),
    fetchListAsync(),
    cdAsync(),
    loadMoreAsync()
  ]
}