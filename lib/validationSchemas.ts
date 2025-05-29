import * as Yup from 'yup';
import { DESCRIPTION_MAX_LENGTH, HINT_MAX_LENGTH } from '@/constants/constants';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .required('Mot de passe requis')
});

export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Nom trop court')
    .max(20, 'Nom trop long')
    .required('Nom requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .matches(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial')
    .required('Mot de passe requis'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('Confirmation du mot de passe requise')
});

export const riddleSchema = Yup.object().shape({
  title: Yup.string().required('Le titre est requis.'),
  description: Yup.string()
    .required('La description est requise.')
    .max(DESCRIPTION_MAX_LENGTH, `La description ne doit pas dépasser ${DESCRIPTION_MAX_LENGTH} caractères.`),
  is_private: Yup.boolean().required('Indiquez si l’énigme est privée.'),
});

export const hintSchema = Yup.object().shape({
  type: Yup.string().oneOf(['text', 'image', 'audio']).required("Le type de support utilisé pour l'indice est requis"),
  content: Yup.string()
    .required('Le contenu de l\'indice est requis.')
    .max(HINT_MAX_LENGTH, `L'indice ne doit pas dépasser ${HINT_MAX_LENGTH} caractères.`),
});

export const reviewSchema = Yup.object().shape({
  rating: Yup.number()
    .required('La notation de l\'énigme est requise.')
    .min(1, 'La note minimum est 1.')
    .max(5, 'La note maximum est 5.')
    .integer('La note doit être un nombre entier.'),
  difficulty: Yup.number()
    .required('La notation de la difficulté de l\'énigme est requis.')
    .min(1, 'La difficulté minimum est 1.')
    .max(5, 'La difficulté maximum est 5.')
    .integer('La difficulté doit être un nombre entier.'),
  content: Yup.string()
    .notRequired()
    .max(DESCRIPTION_MAX_LENGTH, `Le commentaire ne doit pas dépasser ${DESCRIPTION_MAX_LENGTH} caractères.`),
});