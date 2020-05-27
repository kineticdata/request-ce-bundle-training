# Kinetic Bundle Training - Step 3

### Description

By this step, the app package dynamically loads the `AppProvider` from the correct package and passes state data to it. The services package `AppProvider` take the state data from the app package and stores it in its own state to be used throughout the package.

In this step, we will build out the home page of the services kapp by fetching and displaying the available categories.

We have included some placeholder files within the redux folder.

- `src`
  - `redux`
    - `modules`
      - `categories.js`  
        We will define our actions and reducer for dealing with the categories state data here.
    - `sagas`
      - `categories.js`  
        We will define our sagas which will do the data fetching here.

---

##### The below exercises will guide you through fetching the kapp's categories using `redux-saga` and storing them in our `redux` store.

We will also update the `Catalog.js` file to display our categories.

In your space, you will need to have a services kapp with some categories defined.

**_The changes in all of the below exercises will be to files inside the services package._**

---

### Exercise 1

**Define the types, actions, default state, and reducer inside the `src/redux/modules/categories.js` file.**

1.  Define the types that will be used in the actions to fetch categories and set the state. `ns()` is a helper function that you can see defined at the top of the page that prepends a static string to the type name.

```javascript
export const types = {
  FETCH_CATEGORIES_REQUEST: ns('FETCH_CATEGORIES_REQUEST'),
  FETCH_CATEGORIES_SUCCESS: ns('FETCH_CATEGORIES_SUCCESS'),
  FETCH_CATEGORIES_FAILURE: ns('FETCH_CATEGORIES_FAILURE'),
};
```

2.  Define the actions that will be called to update the state and trigger a saga that we will define later to fetch the data. We use some helper functions that build up the action creators and whether they accept a payload or not.

We also use some specific naming conventions to make our bundle code more readable. We name the actions (and types) with the request that we're making (e.g. `fetchCategories` or `updateProfile`), and then suffix it with the word `Request` for the action that will trigger any data reads or writes, and suffix it with `Success` and `Failure` for the calls that will set the appropriate state when the request is completed.

```javascript
export const actions = {
  fetchCategoriesRequest: noPayload(types.FETCH_CATEGORIES_REQUEST),
  fetchCategoriesSuccess: withPayload(types.FETCH_CATEGORIES_SUCCESS),
  fetchCategoriesFailure: withPayload(types.FETCH_CATEGORIES_FAILURE),
};
```

3.  Define the default state. We use an `immutable` `Record` for storing our state. Our convention is to have a single state variable, `data`, for storing the data and an `error` variable for storing any errors. Occasionally we may also have a `loading` state variable if needed, but we often define loading to be `true` if the data variable is `null`.

```javascript
export const State = Record({
  data: null,
  error: null,
});
```

4.  Define the cases for each action type in the reducer.

- Clear the `error` state when we call `fetchCategoriesRequest`. We will leave the data as is so that a refetch will not hide the existing categories.

```javascript
case types.FETCH_CATEGORIES_REQUEST:
  return state.set('error', null);
```

- Set the `data` state with the content of the payload when the request is successful. We use an `immutable` `List` for storing our lists in state.

```javascript
case types.FETCH_CATEGORIES_REQUEST:
  return state.set('data', List(payload));
```

- Set the `error` state with the content of the payload when the request fails. Our api calls return a consistent error object so we just store that object in the state.

```javascript
case types.FETCH_CATEGORIES_FAILURE:
  return state.set('error', payload);
```

---

### Exercise 2

**Define the saga to fetch the categories inside the `src/redux/sagas/categories.js` file.**

1.  Import the `fetchCategories` api function from `@kineticdata/react`. This library has functions for all of the kinetic api endpoints, which all return results in a consistent structure and with consistent error objects.

```javascript
import { fetchCategories } from '@kineticdata/react';
```

2.  Implement the `fetchCategoriesRequestSaga` function to retrieve the categories and then call the appropriate success or failure action.

- Get the current kappSlug from the redux store, as we will need it to fetch the categories.

```javascript
const kappSlug = yield select(state => state.app.kappSlug);
```

- Call `fetchCategories` to get the data we're looking for. We will also fetch the category attributes, and the forms in this category via the `include` parameter of the api call.

```javascript
const { categories, error } = yield call(fetchCategories, {
  kappSlug,
  include: 'attributes,categorizations.form',
});
```

- Call the appropriate success or failure action to save the data into the state.

```javascript
if (error) {
  yield put(actions.fetchCategoriesFailure(error));
} else {
  yield put(actions.fetchCategoriesSuccess(categories));
}
```

3.  Implement the `watchCategories` function to trigger the saga whenever the `fetchCategoriesRequest` action is triggered.

```javascript
export function* watchCategories() {
  yield takeEvery(types.FETCH_CATEGORIES_REQUEST, fetchCategoriesRequestSaga);
}
```

---

### Exercise 3

**Connect the reducer and saga watcher to the package middleware.**

1.  Add the categories reducer to the `src/redux/reducers.js` file. This file is connected to the middleware and defines how the state created by the reducer will be accessible in the redux store.

```javascript
import categoriesReducer from './modules/categories';

export default {
  app,
  categories: categoriesReducer,
};
```

2.  Add the categories saga watcher to the `src/redux/sagas.js` file. This file is connected to the middleware, and will run the watch functions to make sure all triggered actions fire their corresponding sagas.

```javascript
import { watchCategories } from './sagas/categories';

export default function*() {
  yield all([watchApp(), watchCategories()]);
}
```

---

### Exercise 4

**Update the `src/components/Catalog.js` file to fetch the categories on load and to display them.**

1.  Fetch the categories by calling the `fetchCategoriesRequest` action in the `componentDidMount` lifecycle, using `recompose` to add the lifecycle method. We will need to add the action to the component props via `mapDispatchToProps`.

```javascript
import { compose, lifecycle } from 'recompose';
import { actions } from '../redux/modules/categories';

const mapDispatchToProps = {
  fetchCategories: actions.fetchCategoriesRequest,
};

export const Catalog = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchCategories();
    },
  }),
)(CatalogComponent);
```

2.  Add the categories data and error to the props via `mapStateToProps`.

```javascript
const mapStateToProps = state => ({
  ...
  categories: state.categories.data,
  categoriesError: state.categories.error,
});
```

3.  Display the categories within the `CatalogComponent`, after the `.page-title div`. Show an error state if there is an error. Show a loading state if data is `null` and there is no error.

```javascript
{
  !!props.categoriesError ? (
    <div className="alert alert-danger">
      <h4>Error Fetching Categories</h4>
      <p>{props.categoriesError.message}</p>
    </div>
  ) : !!props.categories ? (
    props.categories.map(category => (
      <div>
        <h3>{category.name}</h3>
      </div>
    ))
  ) : (
    <div>
      <h4 className="text-center">
        <span className="fa fa-spinner fa-spin" />
      </h4>
    </div>
  )
}
```

---

##### We have now updated the services package to fetch the kapp's categories and display them. This way of fetching data will be used throughout the entire package to interact with all of the data the application has available. In the next step, we will add routing to the services package and add more pages that we can navigate through.

Please proceed to Step 4. The code in the `step/4` branch has all of the above exercises completed.
