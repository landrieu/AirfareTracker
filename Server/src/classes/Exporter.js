const fs = require('fs');

export class Exporter{
    constructor(fileName, prefix, path, newDataPath = ''){
        this.inProgress = false;
        this.stack = [];

        this.fileName = fileName;
        this.prefix = prefix;
        this.path = path;
        this.overwriteExistingFile = true;
        this.newDataPath = newDataPath;
    }

    executeStack(){
        if(this.stack && this.stack.length > 0){
            let expt = this.stack.pop();
            this.run(expt);
        }
    }

    addStack(params){
        this.stack.push(params);
    }

    run({fileName = this.fileName, prefix = this.prefix, path = this.path, newDataPath = this.newDataPath, data, emptyFileData = this.emptyFileData}){
        if(this.inProgress){
            this.addStack(params);
            return;
        }

        if(!fileName || !path || !data){
            throw new Error('At least one of the required arguments is missing.');
        }

        //Default params can be overwrite
        this.inProgress = true;
        this.write({fileName, prefix, path, data, newDataPath, emptyFileData});
    }

    geEmptyFileData(){
        return {
            date: new Date()
        }
    }

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

    createNewFile(emptyFileData){
        return typeof emptyFileData === 'function' ? emptyFileData() : emptyFileData;
    }

    addNewData(newData, data, newDataPath){
        data[newDataPath].push(newData);
        return JSON.stringify(data); 
    }

    saveFile(prefix, fileName, path, data, callback){
        let fullPath = this.getFilePath(prefix, fileName, path);
        try {
            fs.writeFile(fullPath, data, 'utf8', callback);
        } catch (error) {
            console.log(error);
        }
        
    }
    
    getFullFileName(prefix, fileName){
        //let d = new Date();
        return `${prefix}_${fileName}.json`; 
    }

    getFilePath(prefix, fileName, path){
        let fullFileName = this.getFullFileName(prefix, fileName)
        return `${__basedir}/${path}/${fullFileName}`;
    }

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
