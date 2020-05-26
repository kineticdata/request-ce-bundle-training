import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';
import { Link } from '@reach/router';
import { List } from 'immutable';
import { PageTitle } from './shared/PageTitle';
import { connect } from '../redux/store';
import { actions } from '../redux/modules/sites';

export const SitesComponent = props => {
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container">
        <div className="page-panel">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="..">services</Link> /{' '}
              </h3>
              <h1>Sites</h1>
            </div>
          </div>
          <dl>
            {props.sites &&
              props.sites.map(site => (
                <Fragment>
                  <dt>
                    Site: {site['City']}, {site['State']}
                  </dt>
                  <dd>Manager: {site['Site Manager']}</dd>
                </Fragment>
              ))}
          </dl>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  sites:
    state.sites.data &&
    state.sites.data.reduce((acc, site) => {
      acc = acc.push(site.values);
      return acc;
    }, List()),
});

const mapDispatchToProps = {
  fetchSites: actions.fetchSites,
};

export const Sites = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchSites();
    },
  }),
)(SitesComponent);
