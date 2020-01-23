const { insert, remove, selectIn } = require('../utils/dbQuery');
const TABLE_NAME = 'index_urls_words';


const removeWordsByIndexUrl = async (index_url) => {
    await remove(TABLE_NAME,{index_url})
}

const insertWords = async (data) => {
    await insert(TABLE_NAME,data)
}


const removeAllWords = async () => {
    await remove(TABLE_NAME);
}

const searchWord = async (searchPhrase) => {
    const wordRE=/[а-яА-ЯёЁa-zA-Z]{4,}/g;
    let words=[];
    while (true) {
        let searchRes=wordRE.exec(searchPhrase);
        if ( !searchRes )
            break;
        words.push(searchRes[0].toUpperCase());
    }
    let allHits=await selectIn(TABLE_NAME, 'word', words,['index_url', 'clean_txt_index']);
    let spHits={}; // ключ - index_url, значение - { sp_hits:XXX, sp_uniq_hits:XXX, sp_words:{} }, в sp_words учитываем какие поисковые слова уже встречались
    allHits.forEach( hitRow => {
        if ( !(hitRow.index_url in spHits) )
            spHits[hitRow.index_url]={ sp_hits:0, sp_uniq_hits:0, sp_words:{} };
        let spHitsRow=spHits[hitRow.index_url];

        spHitsRow.sp_hits++;

        if ( !(hitRow.word in spHitsRow.sp_words) ) {
            spHitsRow.sp_words[hitRow.word]=true;
            spHitsRow.sp_uniq_hits++;
        }
    } );
    let results=[];
    for ( let index_url in spHits ) {
        let spHitsRow=spHits[index_url];
        results.push( { index_url, relev:(spHitsRow.sp_uniq_hits*10+spHitsRow.sp_hits*1) } );
    }

    // сортируем результаты по релевантности
    results.sort( (r1,r2) => r2.relev-r1.relev );

    return results;

    
}


module.exports = {
    insertWords,
    removeWordsByIndexUrl,
    removeAllWords,
    searchWord
}