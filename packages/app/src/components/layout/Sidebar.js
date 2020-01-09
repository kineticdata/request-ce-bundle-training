import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from '@reach/router';
import { Nav, NavItem } from 'reactstrap';
import { selectVisibleKapps } from 'common';

export const SidebarComponent = props => (
  <div className="sidebar">
    <div className="sidebar-group--content-wrapper">
      <div className="sidebar-group">
        <Nav vertical>
          <NavItem>
            <Link className="dropdown-item" to="/">
              Home
            </Link>
          </NavItem>
          {props.visibleKapps.map(kapp => (
            <NavItem key={kapp.slug}>
              <Link
                className="dropdown-item"
                to={`/kapps/${kapp.slug}`}
                onClick={props.kappDropdownToggle}
              >
                {kapp.name}
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  </div>
);

export const mapStateToProps = state => ({
  visibleKapps: selectVisibleKapps(state),
});

export const Sidebar = compose(connect(mapStateToProps))(SidebarComponent);
