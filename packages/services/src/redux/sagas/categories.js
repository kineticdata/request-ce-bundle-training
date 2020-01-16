import { call, put, takeEvery, select } from 'redux-saga/effects';
import { fetchCategories } from '@kineticdata/react';

import { actions, types } from '../modules/categories';

export function* fetchCategoriesRequestSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);

  const { categories, error } = yield call(fetchCategories, {
    kappSlug,
    include: 'attributes,categorizations.form,categorizations.form.attributes',
  });

  if (error) {
    yield put(actions.fetchCategoriesFailure(error));
  } else {
    yield put(actions.fetchCategoriesSuccess(categories));
  }
}

export function* watchCategories() {
  yield takeEvery(types.FETCH_CATEGORIES_REQUEST, fetchCategoriesRequestSaga);
}
