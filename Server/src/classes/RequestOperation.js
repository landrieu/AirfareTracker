export class Error{
    constructor(type, message){
        this.type = type;
        this.message = message;
        this.success = false;
    }
}

export class UserInputError extends Error{
    constructor(type, errors){
        super(type, 'Input error');
        this.errors = errors;
    }
}

export class ValidationError extends Error{
    constructor(type, errors){
        super(type, 'Validation error');
        this.errors = errors;
    }
}

export class AuthenticationError extends Error{
    constructor(message, errors){
        super("AUTHENTICATION_ERROR", message);
        this.errors = errors;
    }
}

export class AuthenticationSuccess{
    constructor(id, user, token){
        this.success = true;
        this.id = id;
        this.user = user;
        this.token = token;
    }
}

export class RegisterCreation{
    constructor(success, user){
        this.success = success;
        this.user = user;
    }
}

export class OperationError extends Error{
    constructor(message, operationType){
        super("OPERATION_ERROR", message);
        this.operationType = operationType;
    }
}

export class OperationSuccess{
    constructor(resource){
        this.success = true;
    }
}