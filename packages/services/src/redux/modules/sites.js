import { List, Record } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('services/sites');

export const types = {
  FETCH_SITES: ns('FETCH_SITES'),
  FETCH_SITES_SUCCESS: ns('FETCH_SITES_SUCCESS'),
  FETCH_SITES_FAILURE: ns('FETCH_SITES_FAILURE'),
};

export const actions = {
  fetchSites: noPayload(types.FETCH_SITES),
  fetchSitesSuccess: withPayload(types.FETCH_SITES_SUCCESS),
  fetchSitesFailure: withPayload(types.FETCH_SITES_FAILURE),
};

export const State = Record({
  data: null,
  error: null,
});

const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_SITES:
      return state.set('error', null);
    case types.FETCH_SITES_SUCCESS:
      return state.set('data', List(payload));
    case types.FETCH_SITES_FAILURE:
      return state.set('error', payload);
    default:
      return state;
  }
};

export default reducer;
