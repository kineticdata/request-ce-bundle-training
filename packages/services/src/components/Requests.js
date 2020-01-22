import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';
import { Link } from '@reach/router';
import { PageTitle } from './shared/PageTitle';
import { connect } from '../redux/store';
import { actions } from '../redux/modules/submissions';
import { TimeAgo } from 'common';

export const RequestsComponent = props => {
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
              <h1>My Requests</h1>
            </div>
          </div>
          {props.submissionsError ? (
            <div className="alert alert-danger">
              {props.submissionsError.message}
            </div>
          ) : props.submissions === null ? (
            <div className="alert alert-info">
              <span className="fa fa-spinner fa-spin fa-fw" /> Loading
            </div>
          ) : (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Handle</th>
                  <th>Submission Label</th>
                  <th>Core State</th>
                  <th>Created At</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {props.submissions.size > 0 ? (
                  props.submissions.map(submission => (
                    <tr key={submission.id}>
                      <td>
                        <Link
                          to={`${submission.id}${
                            submission.coreState !== 'Draft' ? '/review' : ''
                          }`}
                        >
                          {submission.handle}
                        </Link>
                      </td>
                      <td>{submission.label}</td>
                      <td>{submission.coreState}</td>
                      <td>
                        <TimeAgo timestamp={submission.createdAt} />
                      </td>
                      <td>
                        {submission.submittedAt && (
                          <TimeAgo timestamp={submission.submittedAt} />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No Requests Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
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
  fetchSubmissions: actions.fetchSubmissionsRequest,
};

export const Requests = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchSubmissions();
    },
  }),
)(RequestsComponent);
