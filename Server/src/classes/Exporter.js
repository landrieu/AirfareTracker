import fs from 'fs';

/**
 * Export data to a json file
 */
export class Exporter{
    /**
     * Filename format: <prefix>_<fileName>.json
     * @param {String} fileName 
     * @param {String} prefix 
     * @param {String} path Location of the json file
     * @param {String} newDataPath If additional data, provide the location
     */
    constructor(fileName, prefix, path, newDataPath = ''){
        this.inProgress = false;
        this.stack = [];

        this.fileName = fileName;
        this.prefix = prefix;
        this.path = path;
        this.overwriteExistingFile = true;
        this.newDataPath = newDataPath;
    }

    /**
     * Execute the export that was saved in the stack
     */
    executeStack(){
        if(this.stack && this.stack.length > 0){
            let expt = this.stack.pop();
            this.run(expt);
        }
    }

    /**
     * Export in progress, add a params to the stack
     * @param {Object} params 
     */
    addStack(params){
        this.stack.push(params);
    }

    /**
     * Run the exporter script, check if params exists, then write json file
     * @param {Object} param0 
     */
    run({fileName = this.fileName, prefix = this.prefix, path = this.path, newDataPath = this.newDataPath, data, emptyFileData = this.emptyFileData}){
        if(this.inProgress){
            this.addStack({fileName, prefix, path, newDataPath, data, emptyFileData});
            return;
        }

        if(!fileName || !path || !data){
            throw new Error('At least one of the required arguments is missing.');
        }

        //Default params can be overwrite
        this.inProgress = true;
        this.write({fileName, prefix, path, data, newDataPath, emptyFileData});
    }

    /**
     * Write and save json file
     * @param {Object} param
     */
    async write({fileName, prefix, path, data, newDataPath, emptyFileData}){        
        let newData;

        if(this.overwriteExistingFile){
            newData = data;
        }else{
            let file; 
            file = await this.read(prefix, fileName, path);
            if(!file) file = this.createNewFile(emptyFileData);
            newData = this.addNewData(data, file, newDataPath);
        }

        //let newData = this.overwriteExistingFile ? data : this.addNewData(data, file, newDataPath);

        this.saveFile(prefix, fileName, path, newData, (err) => {
            this.inProgress = false;
            this.executeStack();
            if(err){
                console.error(err);
            }
        });
    }

    /**
     * Create a new file
     * @param {Function|Object} emptyFileData 
     */
    createNewFile(emptyFileData){
        return typeof emptyFileData === 'function' ? emptyFileData() : emptyFileData;
    }

    /**
     * Add additional data to an existing file
     * @param {Object} newData 
     * @param {Object} data 
     * @param {String} newDataPath 
     */
    addNewData(newData, data, newDataPath){
        data[newDataPath].push(newData);
        return JSON.stringify(data); 
    }

    /**
     * Save json file
     * @param {String} prefix 
     * @param {String} fileName 
     * @param {String} path 
     * @param {Object} data 
     * @param {Function} callback 
     */
    saveFile(prefix, fileName, path, data, callback){
        let fullPath = this.getFilePath(prefix, fileName, path);
        try {
            fs.writeFile(fullPath, data, 'utf8', callback);
        } catch (error) {
            console.log(error.message);
            callback(error.message);
        }
    }
    
    /**
     * Return file name
     * @param {String} prefix 
     * @param {String} fileName 
     */
    getFullFileName(prefix, fileName){
        return `${prefix}_${fileName}.json`; 
    }

    /**
     * Return the full filename with its path
     * @param {String} prefix 
     * @param {String} fileName 
     * @param {String} path 
     */
    getFilePath(prefix, fileName, path){
        let fullFileName = this.getFullFileName(prefix, fileName)
        return `${__basedir}/${path}/${fullFileName}`;
    }

    /**
     * Read a json file
     * @param {String} prefix 
     * @param {String} fileName 
     * @param {String} path 
     */
    read(prefix = this.prefix, fileName = this.fileName, path = this.path){
        let fullPath = this.getFilePath(prefix, fileName, path);
        return new Promise((resolve) => {
            
            fs.readFile(fullPath, 'utf8', (err, data) => {
                if(err || !data){
                    return resolve(null);
                }
    
                resolve(JSON.parse(data)); //now it an object
            });
        });
    }
}
