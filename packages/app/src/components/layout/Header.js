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
      <NavItem>Header</NavItem>
      <div className="nav-item-right" />
    </Nav>
  </Navbar>
);

export const mapStateToProps = state => ({
  space: state.app.space,
  kapp: state.app.kapp,
  visibleKapps: selectVisibleKapps(state),
});

export const Header = compose(connect(mapStateToProps))(HeaderComponent);
