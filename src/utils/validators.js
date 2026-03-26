export const validateInstructionData = (data) => {
  const errors = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Wpisz nazwę instrukcji';
  } else if (data.title.trim().length > 100) {
    errors.title = 'Nazwa nie może być dłuższa niż 100 znaków';
  }

  if (!data.category || !data.category.trim()) {
    errors.category = 'Wybierz kategorię';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};