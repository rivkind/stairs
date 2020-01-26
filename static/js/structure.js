const title = document.getElementById("title");
const description = document.getElementById("description");
const keywords = document.getElementById("keywords");
const url = document.getElementById("url");
const button = document.getElementById("button");
const buttonTextarea = document.getElementById("buttonTextarea");
const buttonHeader = document.getElementById("buttonHeader");
const buttonImage = document.getElementById("buttonImage");
const type = document.getElementById("type");
const block = document.getElementById("block");
const header = document.getElementById("header");
const inputHeader = document.getElementById("inputHeader");
const left = document.getElementById("left");
const main = document.getElementById("main");
const footer = document.getElementById("footer");
const modalContent = document.getElementById("modalContent");
const textarea = document.getElementById("textarea");
const btnSave = document.getElementById("btnSave");
const structure = document.getElementById("structure");
const selectImages = document.getElementById("selectImages");
const modalImgBlock = document.getElementById("modalImgBlock");

let selectBlocks = [
    {id: '', text: 'Выберите блок'},
];
for (let prop in blocks){
    selectBlocks.push({
        id: prop,
        text: blocks[prop].comment
    });
}

const addBlocks = [];
let validate = false;
let blockId = null;
let typeId = null;
let id = null;
let contentId = 1;
const addBlock = (e) => {
    e.preventDefault();
    id = null;
    if(type.value && block.value) {
        blockId = block.value;
        typeId = type.value;
        addContent(type.value);
    } else {
        alert('Заполните все поля!');
    }
}

const createMakets = () => {
    if(stre) {
        header.innerHTML = `<div class="structure-title">Header block</div>${blocks.Head.data.map( (d,index) => `<div class="block">${contentBlock(d,index,blocks.Head.data.length, 'Head')}</div>` ).join("")}`;
        left.innerHTML = `<div class="structure-title">Left block</div>${blocks.Left.data.map( (d,index) => `<div class="block">${contentBlock(d,index, blocks.Left.data.length, 'Left')}</div>` ).join("")}`;
        footer.innerHTML = `<div class="structure-title">Footer block</div>${blocks.Footer.data.map( (d,index) => `<div class="block">${contentBlock(d,index, blocks.Footer.data.length, 'Footer')}</div>` ).join("")}`;
    
    }
    main.innerHTML = `<div class="structure-title">Content block</div>${blocks.Main.data.map( (d,index) => `<div class="block">${contentBlock(d,index, blocks.Main.data.length, 'Main')}</div>` ).join("")}`;
}

const contentBlock = (data, index, length, block) => {
    const txt = (data.image)? data.image : data.text;
    let html = `<div class="block-menu">
                    <div>${data.type}</div>`;
     if(isBtbEdit(data.type)) html += `<i class="fas fa-pen" title="Редактировать" onClick="editHandler('${block}', ${index})"></i>`;
    if(data.type === 'COLUMN_BLOCK') html += `<i class="fas fa-plus" title="Добавить колонку" onClick="columnHandler('${block}', ${index})"></i>`;               
    if(index !== 0) html += `<i class="fas fa-arrow-up" title="Переместить вверх" onClick="orderHandler('${block}', ${index}, -1)"></i>`;
    if(index !== (length-1)) html += `<i class="fas fa-arrow-down" title="Переместить вниз" onClick="orderHandler('${block}', ${index}, 1)"></i>`;
    html += `<i class="fas fa-times" title="Удалить" onClick="removeBlock('${block}', ${index})"></i>
            </div>
            ${getContent(data.type,txt)}`;

    return html;
}

const isBtbEdit = (type) => {
    const arr = ['CONTENT','COLUMN_BLOCK','HEADER','MENU','NEWS_LIST','NEWS_ALL','SEARCH'];
    return (!arr.includes(type))
}

const removeBlock = (block, i) => {
    if (confirm("Удалить?")) {
        if(blocks[block].data[i].type == 'COLUMN_BLOCK') {
            let allowDelete = true;
            const arr = blocks[block].data[i].text.content;
            for(let i=0;i<arr.length; i++) {
                if(blocks[arr[i]].data.length > 0) allowDelete = false;
            }
            if(allowDelete) {
                selectBlocks = selectBlocks.filter(d=>!arr.includes(d.id));
                arr.map(d=>{delete blocks[d]});
                const f = blocks[block].data.filter((d, index) => index !== i);
                blocks[block].data = f;
                createSelectBlocks();
                createMakets();
            } else {
                alert('Перед удалением блока удалите пожалуйста внутренние блоки!');
            }
            
        } else {
            if(blocks[block].data[i].type == 'CONTENT') validate = false;
            const f = blocks[block].data.filter((d, index) => index !== i);
            blocks[block].data = f;
            createMakets();
        }
    }
}

const orderHandler = (block, i, dir) => {
    const f = blocks[block].data.filter((d, index) => index !== i);
    f.splice((i+dir),0,blocks[block].data[i]);
    blocks[block].data = f;
    createMakets();
}

const editHandler = (block, i) => {
    id = i;
    blockId = block;
    const typeEdit = blocks[block].data[i].type;
    const textEdit = (blocks[block].data[i].image)? blocks[block].data[i].image : blocks[block].data[i].text;
    addContent(typeEdit, textEdit);
}

const getContent = (type,text) => {
    switch ( type ) {
        case 'HEADER_H1':
            return `<h1>${text}</h1>`;
            break;
        case 'HEADER_H2':
            return `<h2>${text}</h2>`;
            break;
        case 'HEADER_H3':
            return `<h3>${text}</h3>`;
            break;
        case 'HEADER_H4':
            return `<h4>${text}</h4>`;
            break;
        case 'HEADER_H5':
            return `<h5>${text}</h5>`;
            break;
        case 'HEADER_H6':
            return `<h6>${text}</h6>`;
            break;
        case 'FORMAT_TEXT':
            return text;
            break;
        case 'CONTENT':
            validate = true;
            return `<div>Информация</div>`;
            break;
        case 'HEADER':
            return `<div>Заголовок</div>`;
            break;
        case 'IMAGE':
            return `<img src="${images[text].url}"/>`;
            break;
        case 'NEWS_LIST':
            return `<div>Список новостей</div>`;
            break;
        case 'NEWS_ALL':
            return `<div>Все новости</div>`;
            break;
        case 'MENU':
                return `<div>Меню</div>`;
                break;
        case 'SEARCH':
            return `<div><input type="text" placeholder="Search..."></div>`;
            break;
        case 'COLUMN_BLOCK':
            let l = '';
            const col = (text.content.length > 1)? 'col-' + (12/text.content.length) : 'col';

            return `<div class="row">${text.content.map( (d) => `<div class="block-content ${col}"><div class="structure-title">${blocks[d].comment}</div>${blocks[d].data.map( (dd,index) => `<div class="block">${contentBlock(dd,index, blocks[d].data.length, d)}</div>` ).join("")}</div>` ).join("")}</div>`;
            break;
        default:
            console.log('Не найдено ' + type);
    }
}


const addContent = (type ,text = '') => {
    switch ( type ) {
        case 'HEADER_H1':
        case 'HEADER_H2':
        case 'HEADER_H3':
        case 'HEADER_H4':
        case 'HEADER_H5':
        case 'HEADER_H6':
            inputHeader.value = text;
            $('#modalHeader').modal('show');
            
            break;
        case 'IMAGE':
            modalImgBlock.innerHTML = '';
            selectImages.value = (text)? text:0;
            $('#modalImg').modal('show');
           
            break;
        case 'FORMAT_TEXT':
            tinymce.editors['textarea'].setContent(text);
            $('#modalFormat').modal('show');
            break;
        case 'COLUMN_BLOCK':
            columnHandler(blockId, -1);
            break;
        case 'CONTENT':
            blocks[blockId].data.push({
                type,
                text: 'Информация'
            });
            createMakets();
            validate = true;
            break;
        case 'HEADER':
            blocks[blockId].data.push({
                type,
                text: 'Заголовок'
            });
            createMakets();
            break;
        case 'SEARCH':
            blocks[blockId].data.push({
                type,
                text: 'Строка поиска'
            });
            createMakets();
            break;
        case 'NEWS_LIST':
            blocks[blockId].data.push({
                type,
                text: 'Список новостей'
            });
            createMakets();
            break;
        case 'NEWS_ALL':
            blocks[blockId].data.push({
                type,
                text: 'Список всех новостей'
            });
            createMakets();
            break;
        case 'MENU':
                blocks[blockId].data.push({
                    type,
                    text: 'Меню'
                });
                createMakets();
                break;
        default:
            console.log('Не найдено ' + type);
    }
}

const columnHandler = (blockId, i) => {
    const value = 'content' + contentId;
    const name = 'Column_block_' + contentId;
    const comment = 'Column block ' + contentId;
    if(i>-1 && blocks[blockId].data[i].text.content.length === 4) {
        alert('Больше 4-ех колонок добавить нельзя!');
    } else {
        selectBlocks.push({ id: value, text: name });

        if(i !== -1) {
            blocks[blockId].data[i].text.content.push(value);
        }else {
            blocks[blockId].data.push({ type: typeId, text: {content: [value]} }); 
        }
        
        blocks[value] = { id: contentId, name, comment, data: [] }
        contentId++;
        createSelectBlocks();
        createMakets();
    }
    
}

const saveHeaderBlock = () => {
    const modal = $('#modalHeader');
    addContentModal(inputHeader.value,modal);
}

const saveTextarearBlock = () => {
    const valueText = tinymce.editors['textarea'].getContent();
    const modal = $('#modalFormat');
    addContentModal(valueText,modal);
}

const saveImageBlock = () => {
    const modal = $('#modalImg');
    addContentModal(selectImages.value,modal, true);
}

const addContentModal = (value, type, img=false) => {
    const typeBlock = (img)? 'image' : 'text';
    if(value) {
        if(id !== null) {
            blocks[blockId].data[id][typeBlock] = value;
        } else {
            blocks[blockId].data.push({
                type: typeId,
                [typeBlock]: value
            });
        }
        
        type.modal('hide');
        createMakets();
    }else{
        alert('Заполните поле заголовок!');
    }
}

const createSelectBlocks = () => {
    let html = selectBlocks.map( d => `<option value=${d.id}>${d.text}</option>` ).join("");
    block.innerHTML = html;
}

const createSelectImages = () => {

    let html = `<option value="0">Выберите изображение</option>`;
    for(var prop in images) 
        html += `<option value='${images[prop].id}'>${images[prop].code}</option>`

    selectImages.innerHTML = html;
}

const saveStructure = (e) => {
    e.preventDefault();
    let validateSave = true;
    for (let [key, d] of Object.entries(blocks)) {
        if(key !== 'Head' && key !== 'Left' && key !== 'Footer') {
            if(d.data.length === 0) {
                validateSave = false;
            }
        }
    }
    

    if(news && (title.value =='' || description.value =='' || keywords.value =='' || url.value =='')){
        alert('Заполните пожалуйста все поля!');
    } else if(validateSave){
        if(validate || !stre) {
            structure.value = JSON.stringify(blocks);
            document.getElementById("form").submit();
        } else{
           alert('Обязательно наличие блока основной информации!');  
        }
        
    } else {
        alert('Все новые блоки должны содержать материал!');
    }
    
}

const changeImages = () => {
    modalImgBlock.innerHTML = `<img src="${images[selectImages.value].url}"/>`;
}

buttonTextarea.addEventListener("click", saveTextarearBlock);
button.addEventListener("click", addBlock);
buttonHeader.addEventListener("click", saveHeaderBlock);
buttonImage.addEventListener("click", saveImageBlock);
btnSave.addEventListener("click", saveStructure);
selectImages.addEventListener("change", changeImages);
createSelectBlocks();
createSelectImages();
createMakets();