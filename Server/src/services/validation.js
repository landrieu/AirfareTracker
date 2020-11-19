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
     * @param {Object} rConf Required fields configuration
     * @param {Object} vConf Value fields configuration
     * @param  {Functions} additionalValidations Additional validations functions to execute
     */
    constructor(form, rConf, vConf, ...additionalValidations){
        this.form = form;
        this.rConf = rConf;
        this.vConf = vConf;
        this.additionalValidations = additionalValidations;
        this.errors = [];
    }

    execute(){
        this.requiredFields();

        this.valueFields();

        if(this.additionalValidations){
            for(let v of this.additionalValidations){
                if(typeof v === 'function') v(this.form, this.errors);
            }
        }

        return this.valid();
    }

    valid(){
        return { valid: this.errors.length === 0, errors: this.errors };
    }

    requiredFields(){
        for(let field in this.rConf){
            let fieldConf = this.rConf[field];
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

    typeFields(){

    }

    valueFields(){
        for(let field in this.vConf){
            let fieldConf = this.vConf[field];
            let value = this.form[field];
            if(!value) continue;

            if(fieldConf.minLength && value.length < fieldConf.minLength){
                this.errors.push(`Length must be greater than ${minLength}`);
            }else if(fieldConf.maxLength && value.length > fieldConf.maxLength){
                this.errors.push(`Length must be lower than ${maxLength}`);
            }else if(fieldConf.possibleValues && fieldConf.possibleValues.indexOf(value) === -1){
                this.errors.push(`The value: '${value}' is not authorized  for ${field}`);
            }
        }
    }
};