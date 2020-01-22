import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Navbar,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { Link } from 'react-router-dom';
import { selectVisibleKapps } from 'common';

export const HeaderComponent = props => (
  <Navbar light>
    <Nav className="nav-header">
      <NavItem id="header-sidebar-toggle">
        <NavLink
          className="drawer-button"
          role="button"
          tabIndex="0"
          onClick={props.toggleSidebar}
        >
          <i className="fa fa-fw fa-bars" />
        </NavLink>
      </NavItem>
      <NavItem>
        <Dropdown
          id="header-kapp-dropdown"
          isOpen={props.kappDropdownOpen}
          toggle={props.kappDropdownToggle}
        >
          <DropdownToggle nav role="button">
            <span>{props.kapp ? props.kapp.name : 'Home'}</span>{' '}
            <i className="fa fa-caret-down" />
          </DropdownToggle>
          <DropdownMenu>
            <Link
              className="dropdown-item"
              to="/"
              onClick={props.kappDropdownToggle}
            >
              Home
            </Link>
            {props.visibleKapps.map(kapp => (
              <Link
                className="dropdown-item"
                to={`/kapps/${kapp.slug}`}
                key={kapp.slug}
                onClick={props.kappDropdownToggle}
              >
                {kapp.name}
              </Link>
            ))}
            <DropdownItem divider />
            <Link
              className="dropdown-item"
              to="/settings"
              onClick={props.kappDropdownToggle}
            >
              Settings
            </Link>
          </DropdownMenu>
        </Dropdown>
      </NavItem>
      <div className="nav-item-right" />
    </Nav>
  </Navbar>
);

export const mapStateToProps = state => ({
  space: state.app.space,
  kapp: state.app.kapp,
  visibleKapps: selectVisibleKapps(state),
});

export const Header = compose(
  connect(mapStateToProps),
  withState('kappDropdownOpen', 'setKappDropdownOpen', false),
  withHandlers({
    kappDropdownToggle: props => () => props.setKappDropdownOpen(open => !open),
  }),
)(HeaderComponent);
