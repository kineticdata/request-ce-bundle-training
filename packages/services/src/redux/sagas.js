import { all } from 'redux-saga/effects';

import { watchApp } from './sagas/app';
import { watchCategories } from './sagas/categories';

export default function*() {
  yield all([watchApp(), watchCategories()]);
}
