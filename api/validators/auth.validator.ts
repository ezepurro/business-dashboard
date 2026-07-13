import { body } from 'express-validator';

export const registerValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El username es obligatorio.')
    .isLength({ min: 3, max: 30 })
    .withMessage('El username debe tener entre 3 y 30 caracteres.'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio.')
    .isEmail()
    .withMessage('Email inválido.')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria.')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres.'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio.')
    .isEmail()
    .withMessage('Email inválido.')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
];
