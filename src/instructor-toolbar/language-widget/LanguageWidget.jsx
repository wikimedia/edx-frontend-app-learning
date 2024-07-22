import React, { useEffect, useState } from 'react';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { getLanguageOptions, postLanguageOptions } from './data/api';

const LanguageWidget = ({ intl }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getLanguageOptions().then((data) => {
      setOptions(data);
    });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const payload = {
      'pref-lang': e.target.value,
    };
    postLanguageOptions(payload)
      .then(() => {
        // reload the page for the language to take effect
        window.location.reload();
      })
      .catch((error) => {
        console.error('Unable to patch user preference', error);
      });
  };

  return options.length ? (
    <select
      id="language-select"
      className="select-dropdown mx-2 w-12"
      onChange={handleChange}
      value={intl.locale} // Controlled component
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  ) : null;
};

LanguageWidget.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(LanguageWidget);
