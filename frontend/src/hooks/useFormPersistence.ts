import { useEffect } from 'react';

export const useFormPersistence = <T>(
  storageKey: string, //unique key to store/retrieve from data
  data: T,
  onDataLoad: (data: Partial<T>) => void
) => {
  //loading data when component mounts
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData) as Partial<T>;
        onDataLoad(parsedData);
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }, []);

  //saving data whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [data, storageKey]);
};