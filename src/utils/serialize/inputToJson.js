// src/utils/inputToJson.js
export const serializeInputToJSON = (inputElement) => {
  if (!(inputElement instanceof HTMLInputElement)) {
    throw new Error("제공된 엘리먼트는 input 요소가 아닙니다.");
  }

  const key = inputElement.name;
  let value = inputElement.value;

  switch (inputElement.type) {
    case 'number':
      value = Number(value);
      break;
    case 'date':
      value = new Date(value);
      break;
    case 'checkbox':
      value = inputElement.checked;
      break;
    default:
      break;
  }

  return { [key]: value };
};
