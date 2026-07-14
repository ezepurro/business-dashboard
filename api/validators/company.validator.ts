import { body, query } from 'express-validator';

export const createCompanyValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la empresa es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('industry')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('El rubro debe tener como máximo 100 caracteres.'),

  body('currency')
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('La divisa debe tener 3 caracteres (ISO 4217).'),

  body('foundedAt')
    .optional({ values: 'null' })
    .isISO8601()
    .withMessage('La fecha de fundación debe ser una fecha válida.')
    .toDate(),
];

export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor o igual a 1.')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100.')
    .toInt(),
];

export const updateCompanyValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre de la empresa no puede estar vacío.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('industry')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('El rubro debe tener como máximo 100 caracteres.'),

  body('currency')
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('La divisa debe tener 3 caracteres (ISO 4217).'),

  body('foundedAt')
    .optional({ values: 'null' })
    .isISO8601()
    .withMessage('La fecha de fundación debe ser una fecha válida.')
    .toDate(),
];
