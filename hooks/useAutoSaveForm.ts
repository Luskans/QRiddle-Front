import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAutoSaveForm = (formValues: any, storageKey: string, transform?: (values: any) => any) => {
  // Sauvegarder les valeurs du formulaire dans le storage avec un debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Si il y a une fonction callback en paramètre, on prend les données transformée plutôt que celles de base
      const datas = transform ? transform(formValues) : formValues;
      AsyncStorage.setItem(storageKey, JSON.stringify(datas))
        .catch((err) => console.error('Erreur lors de la sauvegarde du formulaire :', err));
    }, 5000); // sauvegarde après 5000ms d'inactivité

    return () => clearTimeout(timeout);
  }, [formValues, storageKey, transform]);
};

export const loadFormState = async (storageKey: string) => {
  try {
    const storedData = await AsyncStorage.getItem(storageKey);
    return storedData ? JSON.parse(storedData) : null;

  } catch (error) {
    console.error('Erreur lors du chargement du formulaire sauvegardé :', error);
    return null;
  }
};

export const clearFormState = async (storageKey: string) => {
  try {
    await AsyncStorage.removeItem(storageKey);
    
  } catch (error) {
    console.error('Erreur lors du reset de l\'état du formulaire :', error);
  }
};