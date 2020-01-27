const {
    composeBlock_HeaderH1,
    composeBlock_HeaderH2,
    composeBlock_HeaderH3, 
    composeBlock_HeaderH4,
    composeBlock_HeaderH5,
    composeBlock_HeaderH6,
    composeBlock_Content,
    composeBlock_ContentBlock,
    composeBlock_FormattedText,
    composeBlock_Image,
    composeBlock_Header,
    composeBlock_Search,
    composeBlock_Menu,
    composeBlock_News,
    composeBlock_News_All
} = require("./blocks");
const { getContentBlocks } = require("../models/contents-blocks");

const { logLineAsync } = require('../utils/utils');

const composeContent = async (contentId,appData, req) => {

    let contentHTMLs=[];

    try {
        let contentBlocks = await getContentBlocks(contentId);
        for ( let cb=0; cb<contentBlocks.length; cb++ ) {
            const contentBlock=contentBlocks[cb];

            let blockAttributes={};
            if ( contentBlock.block_attributes && contentBlock.block_attributes.trim() ) {
                blockAttributes=JSON.parse(contentBlock.block_attributes);
            }

            let blockHTML='';

            switch ( contentBlock.code ) {
                case 'HEADER_H1':
                    blockHTML=await composeBlock_HeaderH1(blockAttributes);
                    break;
                case 'HEADER_H2':
                    blockHTML=await composeBlock_HeaderH2(blockAttributes);
                    break;
                case 'HEADER_H3':
                    blockHTML=await composeBlock_HeaderH3(blockAttributes);
                    break;
                case 'HEADER_H4':
                    blockHTML=await composeBlock_HeaderH4(blockAttributes);
                    break;
                case 'HEADER_H5':
                    blockHTML=await composeBlock_HeaderH5(blockAttributes);
                    break;
                case 'HEADER_H6':
                    blockHTML=await composeBlock_HeaderH6(blockAttributes);
                    break;
                case 'HEADER':
                    blockHTML=await composeBlock_Header(appData);
                    break;
                case 'FORMAT_TEXT':
                    blockHTML=await composeBlock_FormattedText(blockAttributes);
                    break;
                case 'CONTENT':
                    if(appData[0].content) {
                        const HTMLs=await composeContent(appData[0].content,appData);
                        blockHTML=await composeBlock_Content(HTMLs);
                    } else {
                        blockHTML='{{{body}}}';
                    }
                    break;
                case 'COLUMN_BLOCK':
                    const bls = [];
                    for (const s of blockAttributes.content) {
                        const ctn = await composeContent(s,appData);
                        bls.push(ctn);
                    }
                    blockHTML=await composeBlock_ContentBlock(bls);
                    break;
                case 'IMAGE':
                    blockHTML=await composeBlock_Image(blockAttributes);
                    break;                
                case 'SEARCH':
                    blockHTML=await composeBlock_Search();
                    break;
                case 'MENU':
                    blockHTML=await composeBlock_Menu(req);
                    break;
                case 'NEWS_LIST':
                    blockHTML=await composeBlock_News();
                    break;
                case 'NEWS_ALL':
                    blockHTML=await composeBlock_News_All();
                    break;           
                default:
                    console.log(`cannot compose block id=${contentBlock.id} - type code ${contentBlock.code} unknown`);
            }
            contentHTMLs.push(blockHTML);
        }
    } catch (error) {
        console.error(error);
    }
    return contentHTMLs;
}

module.exports={
    composeContent 
};
