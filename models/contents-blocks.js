const { insert, select, selectInnerJoin } = require('../utils/dbQuery');
const TABLE_NAME = 'contents_blocks';

const addBlocksFromContents = async (stcr, contents, types) => {
    for (let prop in stcr) {
        if(stcr[prop].data.length > 0) {
            for(let i=0;i<stcr[prop].data.length;i++){
                let attr = null;
                switch ( stcr[prop].data[i].type ) {
                    case 'HEADER_H1':
                    case 'HEADER_H2':
                    case 'HEADER_H3':
                    case 'HEADER_H4':
                    case 'HEADER_H5':
                    case 'HEADER_H6':
                    case 'FORMAT_TEXT':
                        attr = {text: stcr[prop].data[i].text};
                        break;
                    case 'IMAGE':
                        attr = {image: stcr[prop].data[i].image};
                        break;
                    case 'COLUMN_BLOCK':
                        
                        attr = {content: []};
                        for(let j=0; j<stcr[prop].data[i].text.content.length; j++){
                            attr.content.push(contents[stcr[prop].data[i].text.content[j]].id);
                        }
                        break;
                }
                const data = {
                    content: contents[prop].id,
                    content_ord: (i+1),
                    block_type: types[stcr[prop].data[i].type].id,
                }
                if(attr !== null) data.block_attributes = JSON.stringify(attr);
                await insert(TABLE_NAME, data);
            }
        }
    }
}

const getBlocksByContents = async (prop, contents, types) => {
    const where = { content: prop }
    const blocks = await select(TABLE_NAME,where);
    const attr = {name:contents[prop].place,data:[],comment:contents[prop].comment}
    blocks.forEach(block => {
        let text = '';
        let image = '';
        let t = '';
        
        switch ( types[block.block_type].code ) {
            case 'HEADER_H1':
            case 'HEADER_H2':
            case 'HEADER_H3':
            case 'HEADER_H4':
            case 'HEADER_H5':
            case 'HEADER_H6':
            case 'FORMAT_TEXT':
                t = JSON.parse(block.block_attributes)
                text = t.text;
                break;
            case 'IMAGE':
                t = JSON.parse(block.block_attributes)
                image = t.image;
                break;
            case 'COLUMN_BLOCK':
                t = JSON.parse(block.block_attributes)
                const content = [];
                t.content.forEach(c => {
                    content.push(contents[c].place)
                });
                text = {content}
                break;
            case 'CONTENT':
                text = 'Информация';
                break;
        }
        const d = {type: types[block.block_type].code}
        if(text) d.text = text;
        if(image) d.image = image;
        attr.data.push(d);
    });
    return attr;
}

const getContentBlocks = async (content) => {
    return await selectInnerJoin(TABLE_NAME,['contents_blocks.content',content],['block_types','contents_blocks.block_type','block_types.id'],'contents_blocks.content_ord')
}

module.exports = {
    addBlocksFromContents,
    getBlocksByContents,
    getContentBlocks
}