import React from 'react';
import { Link } from '@reach/router';
import { List } from 'immutable';

import { getTeamColor } from '../../utils';

import { Avatar, MessagesGroup } from 'common';
import { I18n } from '../../../../app/src/I18nProvider';

const getTeamHeaderStyle = (discussion, teams) => {
  const teamRI = discussion.relatedItems.find(ri => ri.type === 'Team');
  const teamSlug = teamRI ? teamRI.key : null;

  if (teamSlug) {
    const team = teams.find(t => t.slug === teamSlug);
    return team
      ? {
          borderTopWidth: '6px',
          borderTopColor: getTeamColor(team),
        }
      : {};
  }

  return {};
};

const RelatedItemBadge = ({ discussion }) => {
  const relatedItem = discussion.relatedItems[0] || null;

  if (relatedItem && relatedItem.type === 'Queue Task') {
    return (
      <Link
        className="btn btn-inverse btn-sm"
        to={`/kapps/queue/submissions/${relatedItem.key}`}
      >
        <I18n>View Task</I18n>
      </Link>
    );
  }
  return <span />;
};

export const Discussion = ({ discussion, me, teams }) => {
  const displayableMessages =
    discussion && discussion.messages
      ? discussion.messages.filter(m => m.type !== 'System').slice(-1)
      : [];
  const messages = List(displayableMessages);

  return (
    <div
      className="discussion-summary"
      style={getTeamHeaderStyle(discussion, teams)}
    >
      <div className="header">
        <Link to={`/discussions/${discussion.id}`} className="header__title">
          {discussion.title}
        </Link>
        <RelatedItemBadge discussion={discussion} />
        <div className="participants">
          {discussion.participants
            .filter(p => p.user.unknown !== true)
            .map(participant => (
              <Avatar
                key={participant.user.username}
                username={participant.user.username}
                size={24}
              />
            ))}
        </div>
      </div>

      <div className="messages">
        {messages.size > 0 && (
          <MessagesGroup
            discussion={discussion}
            messages={messages}
            profile={me}
          />
        )}
      </div>
    </div>
  );
};
