import { List, Record } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('services/categories');

export const types = {};

export const actions = {};

export const State = Record({});

const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    default:
      return state;
  }
};

export default reducer;
