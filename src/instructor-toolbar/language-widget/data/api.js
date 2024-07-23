import { getConfig, camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient, getAuthenticatedUser } from '@edx/frontend-platform/auth';

export async function getLanguageOptions() {
  const url = new URL(`${getConfig().LMS_BASE_URL}/lang_pref/released_languages`);
  const { data } = await getAuthenticatedHttpClient().get(url.href, {});
  const options = data.released_languages.map((language) => ({ value: language[0], label: language[1] }));
  return options;
}

export async function getShowLanguageWidget() {
  const url = new URL(`${getConfig().LMS_BASE_URL}/lang_pref/language_selector_is_enabled`);
  const { data } = await getAuthenticatedHttpClient().get(url.href);
  return camelCaseObject(data);
}

export async function postLanguageOptions(payload) {
  const { username } = getAuthenticatedUser();
  const config = {
    headers: {
      'Content-Type': 'application/merge-patch+json',
    },
  };
  const url = new URL(`${getConfig().LMS_BASE_URL}/api/user/v1/preferences/${username}`);
  const { data } = await getAuthenticatedHttpClient().patch(url.href, payload, config);
  return camelCaseObject(data);
}
