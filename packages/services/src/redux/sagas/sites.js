import { call, put, takeEvery, select } from 'redux-saga/effects';
import { searchSubmissions, SubmissionSearch } from '@kineticdata/react';

import { actions, types } from '../modules/sites';

export function* fetchSitesSaga() {
  const { submissions, error } = yield call(searchSubmissions, {
    datastore: true,
    form: 'sites',
    search: new SubmissionSearch(true)
      .limit(1000)
      .index('values[State],values[City]')
      .eq('values[State]', 'Minnesota')
      .eq('values[City]', 'St Paul')
      .include('details,values')
      .build(),
  });

  if (error) {
    yield put(actions.fetchSitesFailure(error));
  } else {
    yield put(actions.fetchSitesSuccess(submissions));
  }
}

export function* watchSites() {
  yield takeEvery(types.FETCH_SITES, fetchSitesSaga);
}
