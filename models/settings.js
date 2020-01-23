const { insert, update, select } = require('../utils/dbQuery');
const TABLE_NAME = 'settings';

const NEED_PROCESS = 1;
const START_PROCESS = 2;

const updateProcess = async (name) => {
    updateData = {
        value: NEED_PROCESS
    }
    return await update( TABLE_NAME, updateData, {name} );
}

const isNeedProcess = async (name) => {

    const whereData = {
        name,
        value: NEED_PROCESS
    }

    return await select( TABLE_NAME, whereData );
}

const finishedProcess = async (name) => {

    const whereData = {
       name,
       value: START_PROCESS
    };
    updateData = {
        value: 0
    }
    return await update( TABLE_NAME, updateData, whereData );
}

const startedProcess = async (name) => {

    const whereData = {
       name,
       value: NEED_PROCESS
    };
    updateData = {
        value: START_PROCESS
    }
    return await update( TABLE_NAME, updateData, whereData );
}

module.exports = {
    startedProcess,
    finishedProcess,
    isNeedProcess,
    updateProcess
}