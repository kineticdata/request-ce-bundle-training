import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { Link } from '@reach/router';
import { push } from 'redux-first-history';
import { parse } from 'query-string';
import { Discussion as KinopsDiscussion, PageTitle } from 'common';
import { I18n } from '../../../../app/src/I18nProvider';
import { context } from '../../redux/store';

const buildRelatedItemLink = relatedItem => {
  let label = relatedItem.type;
  let link;

  if ('Form' === relatedItem.type && relatedItem.item.slug) {
    const form = relatedItem.item;
    link = `/kapps/${form.kapp.slug}/settings/forms/${form.slug}`;
    label = 'Manage Form';
  } else if ('Submission' === relatedItem.type && relatedItem.item.id) {
    const submission = relatedItem.item;

    link = `/kapps/${submission.form.kapp.slug}/submissions/${submission.id}`;
    label = 'Open Item';
  } else if ('Team' === relatedItem.type) {
    link = '/teams/' + relatedItem.key;
    label = 'Team Home';
  } else if (
    'Datastore Submission' === relatedItem.type &&
    relatedItem.item.id
  ) {
    const submission = relatedItem.item;

    link = `/settings/datastore/${submission.form.slug}/${submission.id}`;
    label = 'Open Item';
  }

  return (
    link && (
      <Link
        className="btn btn-inverse btn-sm related-link ml-3"
        to={link}
        key={`${relatedItem.type}/${relatedItem.key}`}
      >
        <I18n>{label}</I18n>
      </Link>
    )
  );
};

const DiscussionHeader = props => {
  const discussion = props.discussion;
  const discussionName =
    discussion && discussion.title ? discussion.title : 'Loading...';
  const relatedItems = discussion ? discussion.relatedItems : [];

  return (
    <Fragment>
      <PageTitle parts={[discussionName, 'Discussions']} />
      <div className="discussion__subheader">
        <Link to={'/'}>
          <I18n>home</I18n>
        </Link>{' '}
        / {discussionName}
        {relatedItems &&
          relatedItems.map(relatedItem => buildRelatedItemLink(relatedItem))}
      </div>
    </Fragment>
  );
};
export const DiscussionComponent = ({
  discussionId,
  handleLeave,
  invitationToken,
}) => (
  <div className="page-panel page-panel--discussions">
    {discussionId ? (
      <KinopsDiscussion
        fullPage
        id={discussionId}
        invitationToken={invitationToken}
        onLeave={handleLeave}
        renderHeader={DiscussionHeader}
      />
    ) : (
      <Fragment>
        <DiscussionHeader />
        <div className="empty-state empty-state--discussions">
          <h6 className="empty-state__title">
            <I18n>No discussion to display</I18n>
          </h6>
        </div>
      </Fragment>
    )}
  </div>
);

const handleLeave = ({ push }) => () => {
  push('/');
};

const mapStateToProps = props => ({
  discussionId: props.id,
  invitationToken: parse(props.location.search).invitationToken,
});

const mapDispatchToProps = {
  push,
};

export const Discussion = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withHandlers({
    handleLeave,
  }),
)(DiscussionComponent);
