import { call, put, takeEvery, select } from 'redux-saga/effects';
import { searchSubmissions, SubmissionSearch } from '@kineticdata/react';

import { actions, types } from '../modules/submissions';

export function* fetchSubmissionsRequestSaga() {
  const kapp = yield select(state => state.app.kapp.slug);
  const username = yield select(state => state.app.profile.username);

  const { submissions, error } = yield call(searchSubmissions, {
    kapp,
    search: new SubmissionSearch()
      .limit(1000)
      .eq('createdBy', username)
      .include('details')
      .build(),
  });

  if (error) {
    yield put(actions.fetchSubmissionsFailure(error));
  } else {
    yield put(actions.fetchSubmissionsSuccess(submissions));
  }
}

export function* watchSubmissions() {
  yield takeEvery(types.FETCH_SUBMISSIONS_REQUEST, fetchSubmissionsRequestSaga);
}
