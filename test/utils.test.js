require('dotenv').config()
const { arrayToHash, removeTags, getPriority, getChangeFreq, textMailWelcome } = require('../utils/utils');

test('array to hash', () => {
    const data = [
        {id: 1, text: 'First'},
        {id: 2, text: 'Second'}
    ]
    const result = {
        "1":{id: 1, text: 'First'},
        "2":{id: 2, text: 'Second'}
    }
  expect(arrayToHash(data,'id')).toStrictEqual(result);
});

test('remove tags', () => {
    expect(removeTags("<div>Hello</div>")).toBe("Hello");
})

test('get priority default', () => {
    const result = [
        {value: '0.1', default: false},
        {value: '0.2', default: false},
        {value: '0.3', default: false},
        {value: '0.4', default: false},
        {value: '0.5', default: false},
        {value: '0.6', default: false},
        {value: '0.7', default: false},
        {value: '0.8', default: true},
        {value: '0.9', default: false},
        {value: '1', default: false}
    ]
    expect(getPriority()).toStrictEqual(result);
})

test('get priority 0.5', () => {
    const result = [
        {value: '0.1', default: false},
        {value: '0.2', default: false},
        {value: '0.3', default: false},
        {value: '0.4', default: false},
        {value: '0.5', default: true},
        {value: '0.6', default: false},
        {value: '0.7', default: false},
        {value: '0.8', default: false},
        {value: '0.9', default: false},
        {value: '1', default: false}
    ]
    expect(getPriority('0.5')).toStrictEqual(result);
})

test('get change freq default', () => {
    const result = [
        {value: 'always', default: false},
        {value: 'hourly', default: false},
        {value: 'daily', default: false},
        {value: 'weekly', default: true},
        {value: 'monthly', default: false},
        {value: 'yearly', default: false},
        {value: 'never', default: false}
    ]
    expect(getChangeFreq()).toStrictEqual(result);
})

test('get change freq daily', () => {
    const result = [
        {value: 'always', default: false},
        {value: 'hourly', default: false},
        {value: 'daily', default: true},
        {value: 'weekly', default: false},
        {value: 'monthly', default: false},
        {value: 'yearly', default: false},
        {value: 'never', default: false}
    ]
    expect(getChangeFreq('daily')).toStrictEqual(result);
})

test('mail text welcome', () => {
    const token = "sdsfdfgterecvcn";
    const result = `Для подтверждения регистрации перейдите по следующей ссылке ${process.env.HOST}/users/confirm/${token}`;
    
    expect(textMailWelcome(token)).toBe(result);
})

