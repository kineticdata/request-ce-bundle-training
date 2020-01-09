# Kinetic Bundle Training - Step 1

#### Description

At this step, the app package contains the (roughly) minimum code needed to start an implementation of a kinetic bundle. It also contains all the necessary authentication code.

The file structure within the src folder of a package consists of the following folders.

- `assets`
 - Contains images and styles. Styles are built up using Sass.
- `components`
 - Contains the display layer of the application.  
   \* The `layout` folder in this step provides some files that we will be working with in the below exercises. It typically doesn't exist.
- `redux`
 - Contains the sagas and models that handle fetching and storing the data used by the package.
- `utils` or `helpers` (optional folder)
 - Contains helper functions used throughout the package.

The bundle first loads `packages/app/src/index.js` which calls `ReactDOM.render` to render the entire application.

The rendered content includes several wrapper components for setting up the store, KineticLib, routing, and authentication, and finally it renders the `App` component from `packages/app/src/App.js`.

The `App` component calls the `fetchApp` action when it mounts to fetch the data needed by the application (this includes the space, kapps, and profile data).

The `fetchApp` action is defined and handled by redux and redux-saga. The saga in `packages/app/src/redux/sagas/app.js` is triggered when the `fetchApp` action is fired and fetches the necessary data. The saga then calls additional actions that trigger the reducer in `packages/app/src/redux/modules/app.js` to save the fetched data into the store.

The `App` component can then use the retrieved data to render the bundle UI. In this step, this just displays the space name and a list of kapps as links which can be clicked to change the URL and show which kapp is currently selected. The reducer is what handles figuring out which, if any, of the kapps are the current kapp based on the URL. This will allow us to later render different packages for each kapp.

---

###### The below exercises will guide you through defining the layout for the entire application, which will be used to render the contents of every package to allow for a unified user interface.

The `App` component in the app package acts as the layout for the entire application. This layout will pull in its contents from other packages to render the appropriate content based on the url.

The app package will define a `Header` component that will be used by all packages. Each package will define and export an `AppProvider` component which will be responsible for providing the contents of that package to be rendered by the layout. Each package will define its own content and sidebar.

---

#### Exercise 1

**Add a header to the App layout.** This will be the header that is used by all packages.

1.  Import the provided Header component and wrap the App content with the following classes. This should render a header bar with the word Header in it.

```
import { Header } from './components/layout/Header';

<div className="app-wrapper">
  <div className="app-header">
    <Header />
  </div>
  <div class="app-body">
    <div class="app-main-container">
      // Main Content Goes Here
    </div>
  </div>
</div>
```

2.  Update the Header component to add a dropdown menu for the kapp links. Show the current kapp name in the header, or 'Home' if there is no current kapp.

- Use recompose to add state for tracking when the dropdown menu is open, and a handler for toggling the menu.

```
withState('kappDropdownOpen', 'setKappDropdownOpen', false)
withHandlers({ kappDropdownToggle: props => () => props.setKappDropdownOpen(open => !open) })
```

- Add the dropdown menu to the header.

```
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
    </DropdownMenu>
  </Dropdown>
</NavItem>
```

---

#### Exercise 2

**Add a sidebar to the App layout.** We will later dynamically load a sidebar based on the current package being displayed.

1.  Import the provided Sidebar and add it wrapped in the below class as the first child of `<div class="app-body">`. This should render a sidebar on the left side with links to the kapps.

```
<div className="app-sidebar-container">
  <Sidebar />
</div>
```

2.  Now we need to add the ability to toggle the sidebar open and closed. The bundle already has state and an action for keeping track of the sidebar inside the `packages/app/src/redux/modules/layout.js` file. We'll need to add a toggle button in the header and add the appropriate classes to show or hide the sidebar based on the stored state value.

- Add the `sidebarOpen` state value within `mapStateToProps`.

```
export const mapStateToProps = state => ({
  ...
  sidebarOpen: state.layout.sidebarOpen,
)}
```

- Import the layout actions and add the `setSidebarOpen` action within `mapDispatchToProps`.

```
import { actions as layoutActions } from './redux/modules/layout';

export const mapDispatchToProps = {
  ...
  setSidebarOpen: layoutActions.setSidebarOpen,
};
```

- Add a conditional class to `<div class="app-body">` to either show or hide the sidebar based on the state.

```
<div className={`app-body ${props.sidebarOpen ? 'open-sidebar' : 'closed-sidebar'}`}>
```

- Pass a `toggleSidebar` function to the header where we'll need to add a toggle button.

```
<Header toggleSidebar={() => props.setSidebarOpen(!props.sidebarOpen)} />
```

- Update `Header.js` to add a toggle button as the first child of `<Nav className="nav-header">`.

```
NavItem id="header-sidebar-toggle">
  <NavLink
    className="drawer-button"
    role="button"
    tabIndex="0"
    onClick={props.toggleSidebar}
  >
    <i className="fa fa-fw fa-bars" />
  </NavLink>
</NavItem>
```
