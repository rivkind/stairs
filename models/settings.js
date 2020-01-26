const { insert, update, select } = require('../utils/dbQuery');
const TABLE_NAME = 'settings';

const NEED_PROCESS = 1;
const START_PROCESS = 2;

const getSettings = async (name) => {
    const settings = await select( TABLE_NAME );
    const newSettings = settings.map(s=>{
        const form = (s.name == 'index_full');
        let text = 'актуальное состояние';
        if(s.name == 'indexing' && s.value) text = 'В ближайшие 10 минут будет переиндексация...';
        if(s.name == 'sitemap' && s.value) text = 'В ближайшие 20 минут будет персоздан sitemap';

        return {
            ...s,
            form,
            text,
            value: (s.value)? true : false
        }
    });
    return newSettings;
}

const updateSettings = async (value, name) => await update( TABLE_NAME, { value }, {name} );

const updateProcess = async (name) => await update( TABLE_NAME, { value: NEED_PROCESS }, {name} );

const isNeedProcess = async (name) => await select( TABLE_NAME, { name, value: NEED_PROCESS } );

const finishedProcess = async (name) => await update( TABLE_NAME, {value: 0}, {name, value: START_PROCESS} );

const startedProcess = async (name) => await update( TABLE_NAME, {value: START_PROCESS}, {name, value: NEED_PROCESS} );

module.exports = {
    startedProcess,
    finishedProcess,
    isNeedProcess,
    updateProcess,
    getSettings,
    updateSettings
}