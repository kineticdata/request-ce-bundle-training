import { List, Record } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('services/sites');

export const types = {};

export const actions = {};

export const State = Record({
  data: null,
  error: null,
});

const reducer = (state = State(), { type, payload }) => {};
