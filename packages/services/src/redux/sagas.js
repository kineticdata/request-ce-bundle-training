import { all } from 'redux-saga/effects';

import { watchApp } from './sagas/app';
import { watchCategories } from './sagas/categories';
import { watchSites } from './sagas/sites';
import { watchSubmissions } from './sagas/submissions';

export default function*() {
  yield all([watchApp(), watchCategories(), watchSites(), watchSubmissions()]);
}
