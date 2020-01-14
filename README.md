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

---

### Exercise 1

****

1.  

```javascript

```

---

##### We have now updated the services package to fetch the kapp's categories and display them. This way of fetching data will be used throughout the entire package to interact with all of the data the application has available. In the next step, we will add routing to the services package and add more pages that we can navigate through.

Please proceed to Step 4. The code in the `step/4` branch has all of the above exercises completed.
