const STORAGE_KEY = "InfraDraw-project";

export const saveToLocal = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadFromLocal = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearLocal = () => {
  localStorage.removeItem(STORAGE_KEY);
};
