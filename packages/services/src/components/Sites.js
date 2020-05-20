import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';
import { Link } from '@reach/router';
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
              <h1>Hello</h1>
            </div>
          </div>
          Body
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  kapp: state.app.kapp,
  profile: state.app.profile,
  submissions: state.submissions.data,
  submissionsError: state.submissions.error,
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
