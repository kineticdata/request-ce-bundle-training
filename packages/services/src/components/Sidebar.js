import React from 'react';
import { Link } from '@reach/router';
import { Nav, NavItem } from 'reactstrap';

export const Sidebar = props => (
  <div className="sidebar">
    <div className="sidebar-group--content-wrapper">
      <div className="sidebar-group">
        <Nav vertical>
          <NavItem>
            <Link to="requests" className="nav-link">
              My Requests
            </Link>
          </NavItem>
        </Nav>
      </div>
    </div>
  </div>
);
