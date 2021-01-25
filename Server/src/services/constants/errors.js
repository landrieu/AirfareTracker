/**
 * Define error codes
 */

export const validationErrors = {
    
}

export const AUTH_ERRORS = {
    EMAIL_FORMAT_INVALID: 'The email format is invalid',
    PASSWORD_LENGTH_SHORT: 'The password is too short (must be at least 6 chars)',
    PASSWORD_LENGTH_LONG: 'The password is too long (must be at most 20 chars)',
    PASSWORD_INVALID_CHAR: 'The password contains invalid character',
    USER_ALREADY_EXISTS: 'A user already exists with this email address',
    USER_NOT_EXISTS: 'There is no account matching with this email address',
    PASSWORD_INCORRECT: 'The password is incorrect'
}