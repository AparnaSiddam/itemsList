const form = document.querySelector('form');
const formBtn = form.querySelector('button');
const inPut = document.querySelector('input');
const filter = document.querySelector('#filter');
const ulList = document.querySelector('#ulList');
const clear = document.querySelector('#clear');
let edit = false;

//add
function addItems(e){
    e.preventDefault();
    let newValue = inPut.value;
    if(newValue === ''){
        alert('Please enter item to cart');
        return;
    }

    if(edit){
        const item = ulList.querySelector('.edit');
        removeItemFromStorage(item.textContent);
        item.classList.remove('edit');
        item.remove();
        edit = false;
    }else {
        if(checkItemExists(newValue)){
             alert('Item already in Cart');
             return;
        }
    }

    addItemToDom(newValue);
    addItemToStorage(newValue);
    checkUI();
    inPut.value = '';
}

function checkItemExists(item){
    let items = getItems();
        return items.includes(item);
}

function addItemToDom(item){
    const list = document.createElement('li');
          list.appendChild(document.createTextNode(item));
    const icon = createIcon('fa fa-close text-red');
          list.appendChild(icon);
    ulList.appendChild(list);
}

function createIcon(classes){
    const icon = document.createElement('i');
          icon.className = classes;
          return icon;
}

//localStorage

function getItems(){
    let items;
    if(localStorage.getItem('items') === null){
        items = [];
    }else{
        items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
}

function displayItems(){
  let items = getItems();
      items.forEach(function(item){
          addItemToDom(item);
      });
      checkUI();
}


function addItemToStorage(item){
    let items = getItems();
     items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
}
//editItems

function editItems(item){
    edit = true;
    ulList.querySelectorAll('li').forEach(function(li){
        li.classList.remove('edit');
    })
    item.classList.add('edit');
    inPut.value = item.textContent;
    formBtn.innerHTML = `<i class="fa fa-edit"></i> Edit Item`;
    formBtn.style.backgroundColor = 'green'; 
    
}

//remove

function removeItems(e){
    if(e.target.classList.contains('text-red')){
        removeItemFromDom(e.target.parentElement);
    }else{
        editItems(e.target);
    }
}

function removeItemFromDom(item){
    if(confirm('Do you want to delete?')){
        item.remove();
        removeItemFromStorage(item.textContent);
        checkUI();

    }
}

function removeItemFromStorage(item){
    let items = getItems();
        items.forEach(function(product, index){
            if(item === product){
                items.splice(index, 1);
            }
        });

        localStorage.setItem('items', JSON.stringify(items));
    
}


//clear

function clearItems(){
    while(ulList.firstChild){
        ulList.removeChild(ulList.firstChild);
    }
 
    clearItemsFromStorage();
    checkUI();
}

function clearItemsFromStorage(){
    localStorage.removeItem('items');
}

//filter

function filterItems(e){
    let checkValue = e.target.value.toLowerCase();

    const lists = ulList.querySelectorAll('li');
          lists.forEach(function(list){
              const originalValue = list.firstChild.textContent.toLowerCase();
              if(originalValue.indexOf(checkValue) !== -1){
                  list.style.display = 'flex';
              }else{
                  list.style.display = 'none';
              }
          });

}


function checkUI(){
    inPut.value = '';
    const items = ulList.querySelectorAll('li');
     
    if(items.length === 0){
        filter.style.display = 'none';
        clear.style.display = 'none';
    }else{
        filter.style.display = 'block';
        clear.style.display = 'block';

    }
    formBtn.innerHTML = '<i class="fa fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = 'black';
    edit = false;
}

document.addEventListener('DOMContentLoaded', displayItems);
form.addEventListener('submit', addItems);
ulList.addEventListener('click', removeItems);
clear.addEventListener('click', clearItems);
filter.addEventListener('input', filterItems);
checkUI();
