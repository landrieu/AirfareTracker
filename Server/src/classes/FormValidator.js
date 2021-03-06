import { isAsyncFunction } from '../services/helpers/function';

/**
 * Check the required fields
 * @param {Object} rFields 
 * @param {Object} obj 
 * @param {Array} errors 
 */

/**
 * 
 */
export class FormValidator {
    /**
     * 
     * @param {Object} form Object to validate
     * @param {Object} requiredFields Required fields configuration
     * @param {Object} valueFields Value fields configuration
     * @param  {Functions} additionalValidations Additional validations functions to execute
     */
    constructor(form, {requiredFields = {}, valueFields = {}}, ...additionalValidations){
        this.form = form;
        this.requiredFields = requiredFields;
        this.valueFields = valueFields;
        this.additionalValidations = additionalValidations;
        this.errors = [];
    }

    async execute(){
        this.checkRequiredFields();

        this.checkValueFields();

        if(this.additionalValidations){
            for(let v of this.additionalValidations){
                if(typeof v === 'function'){
                    if(isAsyncFunction(v)) await v(this.form, this.errors)
                    else v(this.form, this.errors);
                } 
            }
        }

        return this.valid();
    }

    /**
     * Return if the form is valid
     */
    valid(){
        return { valid: this.errors.length === 0, errors: this.errors };
    }

    /**
     * Check form required fields
     */
    checkRequiredFields(){
        for(let field in this.requiredFields){
            let fieldConf = this.requiredFields[field];
            let isRequired = (fieldConf.condition && fieldConf.condition(this.form)) 
                          || (!fieldConf.condition);
    
            if(!isRequired){
                continue;
            }

            //Check if required
            if(isRequired && !this.form[field]){
                this.errors.push(`The field ${field} is required`);
            //Check the type
            }else if(fieldConf.type && typeof this.form[field] !== fieldConf.type){
                this.errors.push(`Incorrect type for the field ${field}, ${typeof this.form[field]} instead of ${fieldConf.type}`);
            }
        }
    }

    checkTypeFields(){

    }

    /**
     * Check the form values
     */
    checkValueFields(){
        for(let field in this.valueFields){
            let params = this.valueFields[field];
            let value = this.form[field];
            if(!value) continue;

            if(params.minLength && value.length < params.minLength){
                this.errors.push(`Length must be greater than ${minLength}`);
            }else if(params.maxLength && value.length > params.maxLength){
                this.errors.push(`Length must be lower than ${maxLength}`);
            }else if(params.possibleValues && params.possibleValues.indexOf(value) === -1){
                this.errors.push(`The value: '${value}' is not authorized  for ${field}`);
            }
        }
    }
};
