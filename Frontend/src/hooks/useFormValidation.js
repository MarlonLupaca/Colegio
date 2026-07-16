/**
 * useFormValidation — Hook centralizado de validación de formularios
 * Provee funciones de validación reutilizables para todos los formularios del sistema.
 */

// ── Reglas de validación individuales ──────────────────────────────────────────

/** Valida que un campo no esté vacío */
export const isRequired = (value) => {
  if (typeof value === 'string') return value.trim() !== '';
  return value !== null && value !== undefined && value !== '';
};

/** Valida que un string tenga una longitud mínima */
export const minLength = (value, min) => {
  return String(value).trim().length >= min;
};

/** Valida que un string tenga una longitud máxima */
export const maxLength = (value, max) => {
  return String(value).trim().length <= max;
};

/** Valida que un número esté dentro de un rango */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/** Valida formato de correo electrónico */
export const isEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(value).trim());
};

/** Valida DNI peruano (exactamente 8 dígitos numéricos) */
export const isDNI = (value) => {
  return /^\d{8}$/.test(String(value).trim());
};

/** Valida número de teléfono peruano (9 dígitos empezando por 9, o formato fijo de 7 dígitos) */
export const isPhone = (value) => {
  const cleaned = String(value).replace(/\s|-/g, '');
  return /^9\d{8}$/.test(cleaned) || /^\d{7,9}$/.test(cleaned);
};

/** Valida que la contraseña tenga al menos 6 caracteres */
export const isPasswordStrong = (value) => {
  return String(value).length >= 6;
};

/** Valida que dos contraseñas coincidan */
export const passwordsMatch = (password, confirm) => {
  return password === confirm;
};

/** Valida código de usuario (formato: 2 letras + 4 dígitos año + 4 dígitos) */
export const isUserCode = (value) => {
  return /^[A-Z]{2}\d{8}$/.test(String(value).trim().toUpperCase());
};

// ── Función principal de validación de formularios ──────────────────────────────

/**
 * Valida un objeto de datos de formulario contra un esquema de reglas.
 * 
 * @param {Object} data — Datos del formulario a validar
 * @param {Object} rules — Esquema de reglas: { campo: [{ check: fn, msg: string }] }
 * @returns {{ isValid: boolean, errors: Object }} Resultado con isValid y mapa de errores
 * 
 * @example
 * const { isValid, errors } = validateForm(formData, {
 *   nombres: [
 *     { check: (v) => isRequired(v), msg: 'El nombre es obligatorio' },
 *     { check: (v) => minLength(v, 2), msg: 'Mínimo 2 caracteres' }
 *   ],
 *   dni: [
 *     { check: (v) => isDNI(v), msg: 'El DNI debe tener 8 dígitos' }
 *   ]
 * });
 */
export const validateForm = (data, rules) => {
  const errors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    for (const rule of fieldRules) {
      if (!rule.check(value)) {
        errors[field] = rule.msg;
        break; // Solo muestra el primer error por campo
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ── Esquemas de validación predefinidos ─────────────────────────────────────────

/** Esquema para crear/editar usuario ALUMNO */
export const userAlumnoRules = {
  nombres: [
    { check: (v) => isRequired(v), msg: 'El nombre es obligatorio' },
    { check: (v) => minLength(v, 2), msg: 'Mínimo 2 caracteres' },
    { check: (v) => maxLength(v, 80), msg: 'Máximo 80 caracteres' }
  ],
  apellidos: [
    { check: (v) => isRequired(v), msg: 'Los apellidos son obligatorios' },
    { check: (v) => minLength(v, 2), msg: 'Mínimo 2 caracteres' },
    { check: (v) => maxLength(v, 80), msg: 'Máximo 80 caracteres' }
  ],
  dni: [
    { check: (v) => isRequired(v), msg: 'El DNI es obligatorio' },
    { check: (v) => isDNI(v), msg: 'El DNI debe tener exactamente 8 dígitos numéricos' }
  ],
  telefono: [
    { check: (v) => isRequired(v), msg: 'El teléfono es obligatorio' },
    { check: (v) => isPhone(v), msg: 'Ingresa un número de teléfono válido (9 dígitos)' }
  ],
  fechaNacimiento: [
    { check: (v) => isRequired(v), msg: 'La fecha de nacimiento es obligatoria' }
  ]
};

/** Esquema para crear/editar usuario PADRE/DOCENTE */
export const userAdultoRules = {
  nombres: [
    { check: (v) => isRequired(v), msg: 'El nombre es obligatorio' },
    { check: (v) => minLength(v, 2), msg: 'Mínimo 2 caracteres' },
    { check: (v) => maxLength(v, 80), msg: 'Máximo 80 caracteres' }
  ],
  apellidos: [
    { check: (v) => isRequired(v), msg: 'Los apellidos son obligatorios' },
    { check: (v) => minLength(v, 2), msg: 'Mínimo 2 caracteres' },
    { check: (v) => maxLength(v, 80), msg: 'Máximo 80 caracteres' }
  ],
  dni: [
    { check: (v) => isRequired(v), msg: 'El DNI es obligatorio' },
    { check: (v) => isDNI(v), msg: 'El DNI debe tener exactamente 8 dígitos numéricos' }
  ],
  email: [
    { check: (v) => isRequired(v), msg: 'El correo electrónico es obligatorio' },
    { check: (v) => isEmail(v), msg: 'Ingresa un correo electrónico válido' }
  ],
  telefono: [
    { check: (v) => isRequired(v), msg: 'El teléfono es obligatorio' },
    { check: (v) => isPhone(v), msg: 'Ingresa un número de teléfono válido (9 dígitos)' }
  ]
};

/** Esquema de cambio de contraseña */
export const changePasswordRules = (nuevaPassword, confirmPassword) => ({
  passwordActual: [
    { check: (v) => isRequired(v), msg: 'La contraseña actual es obligatoria' },
    { check: (v) => minLength(v, 6), msg: 'Mínimo 6 caracteres' }
  ],
  nuevaPassword: [
    { check: (v) => isRequired(v), msg: 'La nueva contraseña es obligatoria' },
    { check: (v) => minLength(v, 6), msg: 'La contraseña debe tener al menos 6 caracteres' },
    { check: (v) => v !== 'Colegio2024', msg: 'No puedes reutilizar la contraseña por defecto' }
  ],
  confirmPassword: [
    { check: (v) => isRequired(v), msg: 'Confirma tu nueva contraseña' },
    { check: (v) => v === nuevaPassword, msg: 'Las contraseñas no coinciden' }
  ]
});
