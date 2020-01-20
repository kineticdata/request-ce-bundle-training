import { List, Record } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('services/submissions`');

export const types = {
  FETCH_SUBMISSIONS_REQUEST: ns('FETCH_SUBMISSIONS_REQUEST'),
  FETCH_SUBMISSIONS_SUCCESS: ns('FETCH_SUBMISSIONS_SUCCESS'),
  FETCH_SUBMISSIONS_FAILURE: ns('FETCH_SUBMISSIONS_FAILURE'),
};

export const actions = {
  fetchSubmissionsRequest: noPayload(types.FETCH_SUBMISSIONS_REQUEST),
  fetchSubmissionsSuccess: withPayload(types.FETCH_SUBMISSIONS_SUCCESS),
  fetchSubmissionsFailure: withPayload(types.FETCH_SUBMISSIONS_FAILURE),
};

export const State = Record({
  data: null,
  error: null,
});

const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_SUBMISSIONS_REQUEST:
      return state.set('error', null);
    case types.FETCH_SUBMISSIONS_SUCCESS:
      return state.set('data', List(payload));
    case types.FETCH_SUBMISSIONS_FAILURE:
      return state.set('error', payload);
    default:
      return state;
  }
};

export default reducer;
