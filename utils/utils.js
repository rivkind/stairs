const path = require('path');

const logFN = path.join(__dirname,'..','logs', '_server.log');

const arrayToHash = (arr,keyField) => {
    let hash={};
    for ( let i=0; i<arr.length; i++ ) {
        let row=arr[i];
        let key=row[keyField];
        hash[key]=row;
    }
    return hash;
}
let dividerRES="[ \n\r]";
let tagNameRES="[a-zA-Z0-9]+";
let attrNameRES="[a-zA-Z]+";
let attrValueRES="(?:\".+?\"|'.+?'|[^ >]+)";
let attrRES="("+attrNameRES+")(?:"+dividerRES+"*="+dividerRES+"*("+attrValueRES+"))?";
let openingTagRES="<("+tagNameRES+")((?:"+dividerRES+"+"+attrRES+")*)"+dividerRES+"*/?>"; // включает и самозакрытый вариант
let closingTagRES="</("+tagNameRES+")"+dividerRES+"*>";
let openingTagRE=new RegExp(openingTagRES,"g");
let closingTagRE=new RegExp(closingTagRES,"g");

// удаляет из строки все теги
const removeTags = (str,replaceStr="") => {
    if ( typeof(str)=="string" && str.indexOf("<")!=-1 ) {
        str=str.replace(openingTagRE,replaceStr);
        str=str.replace(closingTagRE,replaceStr);
    }
    return str;
}

const textMailWelcome = (token) => {
    return `Для подтверждения регистрации перейдите по следующей ссылке ${process.env.HOST}/users/confirm/${token}`
}

const logToConsole = (text) => {
    const logDT=new Date();
    let time=logDT.toLocaleDateString()+" "+logDT.toLocaleTimeString();
    let fullLogLine=time+" " + text;

    console.log(fullLogLine); // выводим сообщение в консоль
}

const logLineAsync = (logLine) => {

    return new Promise( (resolve,reject) => {

        const logDT=new Date();
        let time=logDT.toLocaleDateString()+" "+logDT.toLocaleTimeString();
        let fullLogLine=time+" "+logLine;
    
        console.log(fullLogLine); // выводим сообщение в консоль
    
        fs.open(logFN, 'a+', (err,logFd) => {
            if ( err ) 
                reject(err);
            else    
                fs.write(logFd, fullLogLine + os.EOL, (err) => {
                    if ( err )
                        reject(err); 
                    else    
                        fs.close(logFd, (err) =>{
                            if ( err )
                                reject(err);
                            else    
                                resolve();
                        });
                });
    
        });
            
    } );

}

const getChangeFreq = (def = 'weekly') => {
    const data = [
        {value: 'always', default: false},
        {value: 'hourly', default: false},
        {value: 'daily', default: false},
        {value: 'weekly', default: true},
        {value: 'monthly', default: false},
        {value: 'yearly', default: false},
        {value: 'never', default: false}
    ];
    const arr = data.map(d=>{
        let sel = (d.value===def);
        return {
            ...d,
            default: sel
        }
    });
    return arr;
}

const getPriority = (def = '0.8') => {
    const data = [
        {value: '0.1', default: false},
        {value: '0.2', default: false},
        {value: '0.3', default: false},
        {value: '0.4', default: false},
        {value: '0.5', default: false},
        {value: '0.6', default: false},
        {value: '0.7', default: false},
        {value: '0.8', default: false},
        {value: '0.9', default: false},
        {value: '1', default: false}
    ];
    const arr = data.map(d=>{
        let sel = (d.value===def);
        return {
            ...d,
            default: sel
        }
    });
    return arr;
}


module.exports={
    arrayToHash,
    removeTags,
    textMailWelcome,
    logToConsole,
    getChangeFreq,
    getPriority,
    logLineAsync
};
