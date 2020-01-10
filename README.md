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

We will need to update the app package to dynamically select correct `AppProvider` to render.

We will also need to pass the data fetched by the app package (space, kapps, profile, etc) into the `AppProvider` which will then need to store that data in its own redux store. This is so that we don't need to refetch the same date multiple times since each package will likely use this common data.

---

#### Exercise 1



---

###### 

Please proceed to Step 3. The code in the `step/3` branch has all of the above exercises completed.
