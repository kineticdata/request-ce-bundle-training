import { takeEvery, call, put, all, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import axios from 'axios';
import {
  bundle,
  fetchVersion,
  fetchProfile,
  fetchSpace,
  fetchKapps,
  fetchDefaultLocale,
} from '@kineticdata/react';
import semver from 'semver';
import { importLocale, searchHistoryActions, Utils } from 'common';

import { actions, types } from '../modules/app';

const MINIMUM_CE_VERSION = '2.0.2';
const MINIMUM_TRANSLATIONS_CE_VERSION = '2.3.0';
const SPACE_INCLUDES = ['details', 'attributes', 'attributesMap'];
const KAPP_INCLUDES = ['details', 'attributes', 'attributesMap'];
const PROFILE_INCLUDES = [
  'details',
  'attributes',
  'profileAttributes',
  'profileAttributesMap',
  'memberships',
  'memberships.team',
  'memberships.team.attributes',
  'memberships.team.attributesMap',
];

// Fetch Entire App
export function* fetchAppTask({ payload }) {
  const { version } = yield call(fetchVersion);
  const initialLoad = payload;
  // Check to make sure the version is compatible with this bundle.
  if (
    semver.satisfies(semver.coerce(version.version), `>=${MINIMUM_CE_VERSION}`)
  ) {
    // Set data needed for initialization from server into redux
    yield all([
      call(fetchSpaceTask),
      call(fetchKappsTask),
      call(fetchProfileTask),
      call(fetchLocaleMetaTask),
      put(actions.setCoreVersion(version.version)),
    ]);

    // Fetch data needed for initialization from redux
    const {
      currentRoute,
      space,
      profile,
      kapps,
      errors,
      coreVersion,
    } = yield select(state => ({
      errors: state.app.app.errors,
      currentRoute: state.router.location.pathname,
      space: state.app.app.space,
      profile: state.app.app.profile,
      kapps: state.app.app.kapps,
      coreVersion: state.app.app.coreVersion,
    }));
    // Make sure there were no errors fetching metadata
    if (errors.isEmpty()) {
      // Configure Search History for Kapps
      yield all([
        ...kapps.map(kapp => {
          return put(
            searchHistoryActions.enableSearchHistory({
              kappSlug: kapp.slug,
              value: Utils.getAttributeValue(kapp, 'Record Search History', ''),
            }),
          );
        }),
      ]);

      // Preload locale before displaying the app to get rid of flicker
      if (profile.preferredLocale) {
        importLocale(profile.preferredLocale);
        yield put(actions.setUserLocale(profile.preferredLocale));
      } else if (
        semver.satisfies(
          semver.coerce(coreVersion),
          `>=${MINIMUM_TRANSLATIONS_CE_VERSION}`,
        )
      ) {
        const { defaultLocale } = yield call(fetchDefaultLocale);
        importLocale((defaultLocale && defaultLocale.code) || 'en');
        yield put(actions.setUserLocale(defaultLocale && defaultLocale.code));
      }

      // Determine default kapp route
      if (initialLoad && currentRoute === '/') {
        const defaultKappDisplaySpace =
          space.attributesMap &&
          space.attributesMap['Default Kapp Display'] &&
          space.attributesMap['Default Kapp Display'].length > 0
            ? space.attributesMap['Default Kapp Display'][0]
            : 'NOT_SET';
        const defaultKappDisplayProfile =
          profile.profileAttributesMap &&
          profile.profileAttributesMap['Default Kapp Display'] &&
          profile.profileAttributesMap['Default Kapp Display'].length > 0
            ? profile.profileAttributesMap['Default Kapp Display'][0]
            : 'NOT_SET';
        const defaultDisplayRoute =
          defaultKappDisplayProfile !== 'NOT_SET'
            ? defaultKappDisplayProfile
            : defaultKappDisplaySpace;

        if (defaultDisplayRoute !== 'NOT_SET' && defaultDisplayRoute !== '') {
          yield put(push(`/kapps/${defaultDisplayRoute}`));
        }
      }
      yield put(actions.fetchAppSuccess());
    }
  } else {
    window.alert(
      `You must be running Kinetic Request v${MINIMUM_CE_VERSION} or later in order to use this app. You are currently running v${
        version.version
      }.`,
    );
  }
}

// Fetch Kapps Task
export function* fetchKappsTask() {
  const { kapps, error } = yield call(fetchKapps, {
    include: KAPP_INCLUDES.join(','),
  });
  if (error) {
    yield put(actions.fetchKappsFailure(error));
  } else {
    yield put(actions.fetchKappsSuccess(kapps));
  }
}

// Fetch Space Task
export function* fetchSpaceTask() {
  const { space, error } = yield call(fetchSpace, {
    include: SPACE_INCLUDES.join(','),
  });
  if (error) {
    yield put(actions.fetchSpaceFailure(error));
  } else {
    yield put(actions.fetchSpaceSuccess(space));
  }
}

// Fetch Profile Task
export function* fetchProfileTask() {
  const { profile, error } = yield call(fetchProfile, {
    include: PROFILE_INCLUDES.join(','),
  });
  if (error) {
    yield put(actions.fetchProfileFailure(error));
  } else {
    yield put(actions.fetchProfileSuccess(profile));
  }
}

// Fetch Locales Metadata Task
export function* fetchLocaleMetaTask() {
  const { locales, timezones } = yield all({
    locales: call(fetchLocales),
    timezones: call(fetchTimezones),
  });
  yield put(
    actions.fetchLocaleMetaSuccess({
      locales: locales.data.locales,
      timezones: timezones.data.timezones,
    }),
  );
}

// TODO: Move to react-kinetic-lib
const fetchLocales = () => axios.get(`${bundle.apiLocation()}/meta/locales`);
const fetchTimezones = () =>
  axios.get(`${bundle.apiLocation()}/meta/timezones`);

export function* watchApp() {
  yield takeEvery(types.FETCH_APP_REQUEST, fetchAppTask);
}
