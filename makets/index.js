const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');
const { composeContent } = require("./contents");
const { contentByStructureId } = require('../models/contents');
const { logLineAsync } = require('../utils/utils');

const composeMaket = async (stre, appData, req = null) => {
  let  layoutString = '';
    try {
      const { title, keywords, description } = appData[0];
      const structure = await contentByStructureId(stre);
      
      const content = [];

      for (const s of structure) {
          content[s.place] = composeContent(s.id,appData, req);
      }
      
      const contents = await Promise.all([content.Head, content.Left, content.Main, content.Footer])
              .then(result=> {
                return {
                  head: result[0].join(''),
                  left: result[1].join(''),
                  main: result[2].join(''),
                  footer: result[3].join(''),
                }
              })
              .catch(error => {
                console.log(`Error in promises`, error);
                return false
              });
      if(contents) {
        const headString= await fs.readFile(path.join(__dirname, '..', 'templates','partials','head.hbs'),"utf8");
        const headTemplate = handlebars.compile(headString); 
        const headHTML = headTemplate({ 
            title, keywords, description
        });
        
        layoutString = await fs.readFile(path.join(__dirname,'..', 'templates','layouts','index.hbs'),"utf8");
        layoutString = layoutString.split("{{{head}}}").join(headHTML);
        layoutString = layoutString.split("{{{header}}}").join(contents.head);
        layoutString = layoutString.split("{{{left}}}").join(contents.left);
        layoutString = layoutString.split("{{{body}}}").join(contents.main);
        layoutString = layoutString.split("{{{footer}}}").join(contents.footer);
      } else throw Error();
    } catch (error) {
      console.log(error);
      layoutString = "Ошибка";
    }
    
  return layoutString;
}

module.exports={
    composeMaket
};