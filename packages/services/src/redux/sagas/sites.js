import { call, put, takeEvery, select } from 'redux-saga/effects';
import { searchSubmissions, SubmissionSearch } from '@kineticdata/react';

import { actions, types } from '../modules/sites';

export function* fetchSitesSaga() {}

export function* watchSites() {
  yield takeEvery(types.FETCH_SITES, fetchSitesSaga);
}
