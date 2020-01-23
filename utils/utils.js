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
    return `Для подтверждения регистрации перейдите по следующей ссылке http://localhost:8881/users/confirm/${token}`
}





module.exports={
    arrayToHash,
    removeTags,
    textMailWelcome
};
