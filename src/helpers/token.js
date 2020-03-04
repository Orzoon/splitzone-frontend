
class Token{
    
    static setLocalStorageData(name,value, cb){
        localStorage.setItem(name,value);
        if(cb){
            cb();
        }
    }
    static getLocalStorageData(name){
        const item = localStorage.getItem(name)
        return item;
    }
}

export default Token;