export const getTranslatedField = (dataObject, fieldName, language) => {
  if (!dataObject) return '';
  const key = `${language}_${fieldName}`;
  return dataObject[key] || dataObject[`en_${fieldName}`] || ''; 
};