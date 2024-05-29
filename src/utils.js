// Helper, that is used to forcibly finalize all promises
// in thunk before running matcher against state.
import { getLocale } from '@edx/frontend-platform/i18n';

export const executeThunk = async (thunk, dispatch, getState) => {
  await thunk(dispatch, getState);
  await new Promise(setImmediate);
};

// Utility function for appending the browser timezone to the url
// Can be used on the backend when the user timezone is not set in the user account
export const appendBrowserTimezoneToUrl = (url) => {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const urlObject = new URL(url);
  if (browserTimezone) {
    urlObject.searchParams.append('browser_timezone', browserTimezone);
  }
  return urlObject.href;
};

// TODO remove following code when we upgrade frontend-platform to latest version

const rtlLocales = [
  'ar', // Arabic
  'ar-ma', // Arabic Morocco
  'he', // Hebrew
  'fa', // Farsi (not currently supported)
  'fa-ir', // Farsi Iran
  'ur', // Urdu (not currently supported)
];

export const isRTL = (locale) => rtlLocales.includes(locale);

export function handleRtl() {
  if (isRTL(getLocale())) {
    document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
  } else {
    document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
  }
}
