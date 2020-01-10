import { all } from 'redux-saga/effects';

import { watchApp } from './sagas/app';

export default function*() {
  yield all([watchApp()]);
}
