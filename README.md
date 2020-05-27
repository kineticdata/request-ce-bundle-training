# Kinetic Bundle Training - Step 7

### Description

By this step, we have completed a number of task.

In this step, we are going to explore some of previous concepts.  We will start by adding a new route.  Using recompose we will dispatch an action.  The action will kick off a redux saga that will fetch records from a datastore.

We will use a helper from the react kinetic lib to assist in fetching the datastore records.  Further building on our understanding 
of datastores using a custom index to fetch specific records from the datastore.

---

##### The below exercises will guide you through using a custom index to fetch specific records from a datastore.

**_The changes in all of the below exercises will be to files inside the services package._**

---

### Exercise 1

**Create the Sites view.**

**_The changes in this exercise will be to the `src/components/Sites.js` and `src/AppProvider.js` files._**

1.  Add JSX to the Sites component in the Sites.js file.
```javascript
  <Fragment>
    <PageTitle parts={[]} />
    <div className="page-container">
      <div className="page-panel">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>
              <Link to="..">services</Link> /{' '}
            </h3>
            <h1>Sites</h1>
          </div>
        </div>
        
      </div>
    </div>
  </Fragment>;
```

2.  Import the Sites component into AppProvider.js file.
```javascript
  import { Sites } from './components/Sites';
```

3.  Add a new route to the AppProvider in AppProvider.js file.
```javascript
  <Sites path="sites" />
```
* __Note:__ remember that new routes are added between the Router component tags. 

You should now be able to visit #/kapps/services/sites.

---

### Exercise 2

**Build and export sites types, actions, and reducer.**

**_The changes in this exercise will be to the `src/redux/modules/sites.js` file._**

1.  Add types to the types object.
```javascript
  FETCH_SITES: ns('FETCH_SITES'),
  FETCH_SITES_SUCCESS: ns('FETCH_SITES_SUCCESS'),
  FETCH_SITES_FAILURE: ns('FETCH_SITES_FAILURE'),
```

2. Add actions to the actions object.
```javascript
  fetchSites: noPayload(types.FETCH_SITES),
  fetchSitesSuccess: withPayload(types.FETCH_SITES_SUCCESS),
  fetchSitesFailure: withPayload(types.FETCH_SITES_FAILURE),
```

3. Add reducer cases to the reducer functions.
```javascript
  switch (type) {
    case types.FETCH_SITES:
      return state.set('error', null);
    case types.FETCH_SITES_SUCCESS:
      return state.set('data', List(payload));
    case types.FETCH_SITES_FAILURE:
      return state.set('error', payload);
    default:
      return state;
  }
```

4. Add default export to the bottom of the file.
```javascript
  export default reducer;
```

---

### Exercise 3

**Add to sites saga.  This exercise assumes there is a `sites` datastore with records. Hard code State and City values to match your dataset.**

**_The changes in this exercise will be to the `src/redux/sagas/sites.js` file._**

1.  Update the `fetchSitesSagas`.  (replace **foo** and **bar** with actual values)
```javascript
  const { submissions, error } = yield call(searchSubmissions, {
    datastore: true,
    form: 'sites',
    search: new SubmissionSearch(true)
      .limit(1000)
      .index('values[State],values[City]')
      .eq('values[State]', 'foo')
      .eq('values[City]', 'bar')
      .include('details,values')
      .build(),
  });

  if (error) {
    yield put(actions.fetchSitesFailure(error));
  } else {
    yield put(actions.fetchSitesSuccess(submissions));
  }
```
__Notes:__ 
* A submission search to a datastore requires `datastore: true` to be passed.
* When a `new SubmissionSearch` for a datastore is defined passing `true` is required.

---

### Exercise 4

**Add the sites reducer and saga to the global reducers and sagas**

**_The changes in this exercise will be to the `src/redux/reducers.js` and `src/redux/sagas.js` files._**

1. Import and rename the sites reducer in the reducers.js file.
```javascript
  import sitesReducer from './modules/sites';
```

2. Add `sitesReducer` to the default export object in the reducers.js file.
```javascript
  sites: sitesReducer
```

3. In the sagas.js file import `watchSites` from the sites saga. 
```javascript
  import { watchSites } from './sagas/sites';
```

4. Add `watchSites` to the default export function in the sagas.js file.
```javascript
watchSites()
```

---

### Exercise 5

**Fetch sites from the Sites datastore and diplay in the Sites component**

**_The changes in this exercise will be to the `src/components/Sites.js` file._**

1. Add to Sites component below the page-title__wrapper closing div.
```javascript
  <dl>
    {props.sites &&
      props.sites.map(site => (
        <Fragment>
          <dt>
            Site: {site['City']}, {site['State']}
          </dt>
          <dd>Manager: {site['Site Manager']}</dd>
        </Fragment>
      ))}
  </dl>
```

2. Add to `mapStateToProps` function.
```javascript
  sites:
    state.sites.data &&
    state.sites.data.reduce((acc, site) => {
      acc = acc.push(site.values);
      return acc;
    }, List()),
```
* __Note:__ To [return an object from an arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) wrap object with parentheses. ex () => ({foo: 'bar'})

3. Add `fetchSites` to the `mapDispatchToProps` object. 
```javascript
  fetchSites: actions.fetchSites,
```

4. fetch Sites when the component mounts by adding this to the lifecycle. (Do a search for lifecycle to find where to add)
```javascript
    componentDidMount() {
      this.props.fetchSites();
    },
```

---

We have now built out a new view, fetched information from a datastore based on a custom index, and display the information to the user.