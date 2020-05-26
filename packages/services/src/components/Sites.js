import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';
import { Link } from '@reach/router';
import { List } from 'immutable';
import { PageTitle } from './shared/PageTitle';
import { connect } from '../redux/store';
import { actions } from '../redux/modules/sites';

export const SitesComponent = props => {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export const Sites = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({}),
)(SitesComponent);
