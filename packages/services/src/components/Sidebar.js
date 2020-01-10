import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

export const SidebarComponent = props => (
  <div className="sidebar">
    <div className="sidebar-group--content-wrapper">
      <div className="sidebar-group">
        <h1>Services Sidebar</h1>
      </div>
    </div>
  </div>
);

export const mapStateToProps = state => ({});

export const Sidebar = compose(connect(mapStateToProps))(SidebarComponent);
