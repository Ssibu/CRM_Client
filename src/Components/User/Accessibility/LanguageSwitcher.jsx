import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const { translate } = useGlobalTranslation();

  return (
    <div>
      <label>{translate('changeLanguage')}: </label>
      <select onChange={(e) => changeLanguage(e.target.value)} value={language}>
        <option value="en">English</option>
        <option value="od">Odia</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;