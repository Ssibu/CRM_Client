// import { useTranslation } from 'react-i18next';
// import { useLanguage } from '@/context/LanguageContext';
// import { getTranslatedField } from '@/utils/getTranslatedField';

// export const useGlobalTranslation = () => {
//   const { t } = useTranslation();
//   const { language } = useLanguage();

//   const translate = (keyOrObject, fieldName) => {
//     if (typeof keyOrObject === 'string') {
//       // For static text from JSON files
//       return t(keyOrObject);
//     }
//     if (typeof keyOrObject === 'object' && fieldName) {
//       // For dynamic data from API
//       return getTranslatedField(keyOrObject, fieldName, language);
//     }
//     return '';
//   };

//   return { translate, language };
// };


import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedField } from '@/utils/getTranslatedField';
import { useCallback } from 'react'; 

export const useGlobalTranslation = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const translate = useCallback((keyOrObject, fieldName) => {
    if (typeof keyOrObject === 'string') {
      return t(keyOrObject);
    }
    if (typeof keyOrObject === 'object' && fieldName) {
      return getTranslatedField(keyOrObject, fieldName, language);
    }
    return '';
  }, [t, language]); 

  return { translate, language };
};