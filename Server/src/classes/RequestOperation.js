/**
 * Objects used to return data from the API
 */
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

export class UnexpectedError extends Error{
    constructor(type, errors){
        super(type, 'Unexpected error');
        this.errors = errors;
    }
}

export class AuthenticationError extends Error{
    constructor(type, errors){
        super(type, 'Authentication error');
        this.errors = errors;
    }
}

export class LoginSuccess{
    constructor(id, user, token){
        this.success = true;
        this.id = id;
        this.user = user;
        this.token = token;
    }
}

export class RegisterSuccess{
    constructor(success, user){
        this.success = success;
        this.user = user;
    }
}

export class TrackerCreationSuccess{
    constructor(tracker){
        this.success = true;
        this.tracker = tracker;
    }
}

export class OperationResult{
    constructor(success, type, error){
        this.success = success;
        this.type = type;
        this.error = error;
    }
}

export class TrackerCreationCheck {
    constructor(success, canCreateNewTracker, nbTrackersCreated, error){
        this.success = success;
        this.canCreateNewTracker = canCreateNewTracker;
        this.nbTrackersCreated = nbTrackersCreated;
        this.error = error;
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

export class InputError{
    constructor(target, message){
        this.target = target;
        this.message = message;
    }
}