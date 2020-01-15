import { List, Record } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('services/categories');

export const types = {
  FETCH_CATEGORIES_REQUEST: ns('FETCH_CATEGORIES_REQUEST'),
  FETCH_CATEGORIES_SUCCESS: ns('FETCH_CATEGORIES_SUCCESS'),
  FETCH_CATEGORIES_FAILURE: ns('FETCH_CATEGORIES_FAILURE'),
};

export const actions = {
  fetchCategoriesRequest: noPayload(types.FETCH_CATEGORIES_REQUEST),
  fetchCategoriesSuccess: withPayload(types.FETCH_CATEGORIES_SUCCESS),
  fetchCategoriesFailure: withPayload(types.FETCH_CATEGORIES_FAILURE),
};

export const State = Record({
  data: null,
  error: null,
});

const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_CATEGORIES_REQUEST:
      return state.set('error', null);
    case types.FETCH_CATEGORIES_SUCCESS:
      return state.set('data', List(payload));
    case types.FETCH_CATEGORIES_FAILURE:
      return state.set('error', payload);
    default:
      return state;
  }
};

export default reducer;
