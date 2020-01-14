# Kinetic Bundle Training - Step 2

#### Description

By this step, the app package now renders an `AppProvider` which is passed a render function. The `AppProvider` calls that render function and passes to it the content that should be rendered in the sidebar and the main body of the application. This allows us to dynamically load content from different packages.

In this step, we will create a new package and update the app package to dynamically load the correct `AppProvider` based on the current route.

We have included the structure for a services package with the following directories and files to get the package started.

- `src`
  - `assets`  
    <small>Contains the styles for the package.</small>
  - `components`  
    <small>Contains the components that will make up the user interface of the application.</small>  
    <small>_Includes several sample files we will use in the below exercises._</small>
  - `redux`
    - `modules`  
      <small>Contains the actions and reducers used to interact with the redux store.</small>
      - `app.js`  
        <small>Defines a reducer to store any state passed from the app package into this package's store.</small>
    - `sagas`  
      <small>Contains the sagas which fetch data to be saved in the redux store.</small>
      - `app.js`  
        <small>Contains a sample saga that is triggered by the action in the `app.js` module.</small>
    - `store.js`  
      <small>File that defines the redux store for this package and exports the connect function we will be using to connect our components to the store.</small>
    - `reducers.js`  
      <small>Maps the reducers of this package into the redux store state object.</small>
    - `sagas.js`  
      <small>Contains the saga watchers for this package.</small>
  - `AppProvider.js`  
    <small>The entry point into the package that will be rendered by the app package.</small>
  - `index.js`  
    <small>Defines the exports of this package, allowing us to import them in other packages directly by the package's name.</small>
- `package.json`  
  <small>Contains the dependencies for this package and the official name of the package which we will use when importing the `AppProvider` in the app package.</small>

The services `AppProvider` imports `Catalog` and `Sidebar` components from the `components` directory, which are very minimal placeholder files.

---

###### The below exercises will guide you through connecting the services package to the app package.

We will need to update the app package to dynamically select the correct `AppProvider` to render.

We will also need to pass the data fetched by the app package (space, kapps, profile, etc) into the `AppProvider` which will then need to store that data in its own redux store. This is so that we don't need to refetch the same date multiple times since each package will likely use this common data.

In your space, you will need to have a services kapp with a Bundle Package kapp attribute value of 'services'.

---

#### Exercise 0

**Import the styles from the services package into the app package.**

This training will not cover creating CSS for the bundle, but let's briefly discuss the structure of our styles. We use Sass to wrtie our styles, which gets compiled into CSS as part of the build process.

Each package has an `assets/styles` directory which contains the styles specific to that package. If you look at `packages/services/src/assets/styles/master.scss`, you will see that the file imports all of the packages style files as descendants of the class `.package-layout--services`. This is to prevent styles from one package from affecting other packages.

It also imports the styles as descendants of `#root ~ div` which is required to style modals due to where in the dom modals appear. The modal styles will affect other packages, so you will need to be careful to always be specific with your style targets.

Next, if you look at `packages/app/src/assets/styles/master.scss`, you will see that it imports `variables` first, followed by `master.scss` from the common package. The variables file defines various color variables that are use throughout the project. These variables should not get redefined in any other packages in order to allow all the packages to have a uniform look. The common package includes common styles used throughout the bundle. We need to import the `master.scss` file from every package we have directly after the common styles.

1.  Import the services package styles into `packages/app/src/assets/styles/master.scss`.

```scss
@import '~services/src/assets/styles/master';
```

Now, the bundle will load the styles for the services package, which may override any styles defined by the common package.

Going further down in `packages/app/src/assets/styles/master.scss`, we import `modularscale` styles, which allows us to scale the font down as the screen shrinks.

Lastly, we import the style files from the app package. Importing them last is important as it will allow us to override any common or package specific styles from within the app package.

---

#### Exercise 1

**Modify the app package to dynamically render the appropriate `AppProvider`.**

**_The changes in this exercise will be to the `App.js` file inside the app package._**

1.  In order to figure out which `AppProvider` to load, we'll use a kapp attribute called 'Bundle Package'. Create a map where the key is the string value that will be stored in that attribute, and the value is the `AppProvider` that should be used. We'll need to import the `AppProvider` from the services package first.

```javascript
import ServicesAppProvider from 'services';

const BUNDLE_PACKAGE_PROVIDERS = {
  services: ServicesAppProvider,
};
```

2.  Create a function that will select the correct `AppProvider` based on the attribute value of the kapp. We can use a helper function from the common `Utils` for getting the attribute value of the kapp.

```javascript
import { Utils } from 'common';

const getAppProvider = kapp => {
  if (kapp) {
    return (
      BUNDLE_PACKAGE_PROVIDERS[
        Utils.getAttributeValue(kapp, 'Bundle Package', kapp.slug)
      ] || AppProvider
    );
  } else {
    return AppProvider;
  }
};
```

3.  Use the `withProps` higher-order component from `recompose` to add an `AppProvider` prop which will be set to the result of the `getAppProvider` function we created. Make sure you import `withProps` from `recompose`.

```javascript
withProps(props => ({
  AppProvider: getAppProvider(props.kapp),
}));
```

4.  Update the component to use the `AppProvider` from the props.

```javascript
<props.AppProvider render={({ main, sidebar }) => (
  // Keep all the same code here
)} />
```

You should now be able to see the services `AppProvider` rendered when you click the link to load the services kapp in the header menu.

---

#### Exercise 2

**Pass state from the app package to the `AppProvider`.** In order to not require each package to have to refetch the space, kapp, and profile data, we will pass that data to that `AppProvider` to that each package will receive it. We will also pass a `refreshApp` function to the `AppProvider` that will allow any package to request that the app package refetches the data it passes through.

**_The changes in this exercise will be to the `App.js` file inside the app package._**

1.  Modify `mapStateToProps` to have a single prop with the entire state object so it can be easily passed through.

```javascript
export const mapStateToProps = state => ({
  ...
  app: state.app,
});
```

2.  Pass all of the app state from the app package into the `AppProvider` as an `appState` prop.

```javascript
<props.AppProvider
  appState={{
    ...props.app.toObject(),
  }}
  // Keep the render function the same
/>
```

3.  Pass a `location` state value to the `AppProvider`. This will be used as the base route for the `AppProvider` and will allow us to make all child routes inside our packages relative by using the `@reach/router` library.

```javascript
<props.AppProvider
  appState={{
    ...
    location: `${props.kapp !== null ? `/kapps/${props.kapp.slug}` : '/'}`,
  }}
/>
```

4.  Use the `withHandlers` higher-order component from `recompose` to add a `refreshApp` handler function to the props which will reload the app package state data. Make sure you import `withHandlers` from `recompose`.

```javascript
withHandlers({
  refreshApp: props => () => props.fetchApp(),
});
```

5.  Pass an `actions` object which contains the `refreshApp` function to the `AppProvider`.

```javascript
<props.AppProvider
  appState={{
    ...
    actions: {
      refreshApp: props.refreshApp,
    },
  }}
/>
```

---

#### Exercise 3

**Update the services package `AppProvider` to store the `appState` passed in from the app package.** In order to have access to this state throughout the entire package, we will store it in the package's redux store.

**_The changes in this exercise will be to the `AppProvider.js` file inside the services package._**

1.  Import the `syncAppState` function which will take the passed in `appState` and store each part of the data (space, kapp, etc.) into the services package store.

```javascript
import { syncAppState } from './redux/modules/app';
```

The services package contains the file `packages/services/src/redux/modules/app.js` which implements a reducer that takes the given payload (in this case the state from the app package) and stores it in this package's store. It also makes sure that all the necessary data is passed in and then sets a `ready` state variable to let the `AppProvider` know that it can now render its contents.

2.  Update the `AppProvider` to call `syncAppState` and watch for changes in the state passed from the app package. You will also need to import the `is` helper method from immutable.

```javascript
import { is } from 'immutable';

export class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
    // Listen to the local store to see if the embedded app is ready to be
    // re-rendered. Currently this just means that the required props have been
    // synced into the local store.
    this.unsubscribe = store.subscribe(() => {
      const ready = store.getState().app.ready;
      if (ready !== this.state.ready) {
        this.setState({ ready });
      }
    });
  }

  componentDidMount() {
    Object.entries(this.props.appState).forEach(syncAppState);
  }

  componentDidUpdate(prevProps) {
    Object.entries(this.props.appState)
      .filter(([key, value]) => !is(value, prevProps.appState[key]))
      .forEach(syncAppState);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      this.state.ready && (
        <Provider store={store} context={context}>
          <CommonProvider>
            <App render={this.props.render} />
          </CommonProvider>
        </Provider>
      )
    );
  }
}
```

If you use the Redux Developer Tools in the browser to inspect the redux store for the services package, you will now see an `app` state that contains `space`, `kapps`, `profile`, etc.

---

#### Exercise 4

**Update the services package to use the state data passed in from the app package.**

**_The changes in this exercise will be to the `src/components/Catalog.js` file inside the services package._**

1.  Use `connect` from `react-redux` to access the state in the redux store. Rename the `Catalog` component to `CatalogComponent` so that we can export higher-order component with the name `Catalog`.

```javascript
import { connect } from '../redux/store';

const mapStateToProps = state => ({
  profile: state.app.profile,
  kapp: state.app.kapp,
});

export const Catalog = connect(mapStateToProps)(CatalogComponent);
```

2.  Update the `CatalogComponent` content display the display name of the current user, as well as the kapp name and slug.

```javascript
export const CatalogComponent = props => {
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container">
        <div className="page-panel">
          <div className="page-panel__header">
            <div className="search-services-home">
              <div className="search-services-home__wrapper">
                <h1 className="text-truncate">
                  Welcome {props.profile.displayName}
                </h1>
              </div>
            </div>
          </div>
          <div className="page-panel__body">
            <div className="page-title">
              <div className="page-title__wrapper">
                <h1>{`${props.kapp.name} <${props.kapp.slug}>`}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
```

You should now see a banner with your name at the top, and the kapp name and slug below in the main body of the page when viewing the services kapp. If you create another kapp and set its Bundle Package attribute to 'services', it will also use the services package to render, but you will see the new kapp's name and slug instead.

---

###### We have now updated the app package to dynamically load the correct `AppProvider` based on the current kapp and a mapping of kapp attributes to bundle packages. We've also made the app package pass the data it fetches to the `AppProvider` it loads, and we updated the services package to store that data in its own redux store so it can be used throughout the package. In the next step, we will build out the services package UI by fetching and displaying the categories of the kapp.

Please proceed to Step 3. The code in the `step/3` branch has all of the above exercises completed.
