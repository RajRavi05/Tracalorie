// Storage controller
const StorageCtrl = (function(){
    // public methods
    return{
        storeItem:function(item){
            let items;

            // check if any items in lS
            if(localStorage.getItem('items') === null){
                items = [];

                // push new item
                items.push(item);
                // set in lS
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));

                // new items
                items.push(item);

                // re set ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        getItemsFromStorage:function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },

        updateItemStorage:function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index,1,updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteFromStroage:function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index,1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromLS:function(){
            localStorage.removeItem('items');
        }
    }
})();


// Item Controller
const ItemCtrl = (function(){
    // Item constructor
    const Item = function(id,name,calorie){
        this.id = id;
        this.name = name;
        this.calorie = calorie;
    }

    // data structures / state
    const data = {
        // items:[
        //     // {id:0,name:'steak dinner',calorie:1200},
        //     // {id:1,name:'steak dinner',calorie:1200},
        //     // {id:2,name:'steak dinner',calorie:1200}
        // ],
        items:StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalorie:0
    }

    // Public method
    return {
        getItems:function(){
            return data.items;
        },

        addItem:function(name,calorie){
            let ID;

            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            // calories to number
            calories = parseInt(calorie);

            // new item
            newItem = new Item(ID,name,calories);

            // add to items array
            data.items.push(newItem);

            return newItem;
        },

        // deleting items
        deleteItem:function(id){
            // get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            // get index
            const index = ids.indexOf(id);

            // remove item
            data.items.splice(index,1);
        },

        // clear items
        clearAllItems:function(){
            data.items = [];
        },

        // set current item
        setCurrentItem:function(item){
            data.currentItem = item;
        },

        // set current item
        getCurrentItem:function(){
            return data.currentItem;
        },

        // get item by id
        getItemById:function(id){
            let found = null;

            // loop through the items
            data.items.forEach(function(item){
                if(item.id === id){
                    found =  item;
                }
            })
            return found;
        },

        // update item
        updateItem:function(name,calorie){
            calories = parseInt(calorie);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calorie = calories;
                    found = item
                }
            });
            return found;
        },

        // total calories
        getTotalCalories:function(){
            let total = 0;

            // loop through items and add cals
            data.items.forEach(function(item){
                total += item.calorie;
            });

            // set total cal
            data.totalCalorie = total;

            // return total cals
            return data.totalCalorie;
        },

        logdata:function(){
            return data;
        }
    }
})();


// UI Controller
const UICtrl = (function(){
    // UI selectors
    const UISelectors = {
        itemList:'#item-list',
        listItems:'#item-list li',
        addBtn:'.add-btn',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        clearBtn:'.clear-btn',
        itemInputName:'#item-name',
        itemInputCalorie:'#item-calorie',
        totalCalorie:'.total-calories'
    }
    return{
        // public method
        populateItems:function(items){
            let html ='';

            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong><em>${item.calorie} caloreies</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pen"></i></a>
            </li>
                `
            });

            // Insert list items to UI
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
      
        
        // add list item to UI
        addListItem:function(item){
            // show list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            // create li
            const li = document.createElement('li');
            // add class
            li.classList = 'collection-item';
            // add id
            li.id = `item-${item.id}`;

            // add html
            li.innerHTML = `
                <strong>${item.name}:</strong><em>${item.calorie} caloreies</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pen"></i></a>
            `;
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        // get item input
        getItemInput:function(){
            return{
                name :document.querySelector(UISelectors.itemInputName).value,
                calorie:document.querySelector(UISelectors.itemInputCalorie).value
            }
        },

        // update list item
        updateListItem:function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}:</strong><em>${item.calorie} caloreies</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pen"></i></a>
                    `;
                }
            });
        },

        // delete list item
        deleteListItem:function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        // clear fields
        clearInput:function(){
            document.querySelector(UISelectors.itemInputName).value = '';
            document.querySelector(UISelectors.itemInputCalorie).value = '';
        },

        // add item to edit
        addItemToForm:function(){
            document.querySelector(UISelectors.itemInputName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemInputCalorie).value = ItemCtrl.getCurrentItem().calorie;

            UICtrl.showEditState();
        },

        // clear all items from the UI
        removeItems:function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // turn into an array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },

        hideList:function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },


        // total cals inUI
        showTotalCalories:function(totalCalorie){
            document.querySelector(UISelectors.totalCalorie).textContent = totalCalorie;
        },

        // Clear edit state
        clearEditState:function(){
            UICtrl.clearInput();

            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        // show edit state
        showEditState:function(){
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },


        getSelectors:function(){
            return UISelectors;
        },
    }
})();


// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners =  function(){
        // get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        // disabling the enter key
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })

        // update item list
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

        // item update submit
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        // delete item
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        // clear items
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

        // back
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);
    }

    // item add submit
    const itemAddSubmit = function(e){
        // get input from UI controller
        const input = UICtrl.getItemInput();
        
        // check for name and calorie input
        if(input.name !== '' && input.calorie !== ''){
            // add item
           const newItem = ItemCtrl.addItem(input.name, input.calorie);

            //add item to UI list
            UICtrl.addListItem(newItem); 

            // get total calorie
            const totalCalorie = ItemCtrl.getTotalCalories();

            // show total cals
            UICtrl.showTotalCalories(totalCalorie);

            // store in LS
            StorageCtrl.storeItem(newItem);
            
            // clear input fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Item edit click
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // get list item ID
            const listId = e.target.parentNode.parentNode.id;

            // break into an array
            const listIdArr = listId.split('-');

            // split to actual id
            const id = parseInt(listIdArr[1]);

            // get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to edit in form
            UICtrl.addItemToForm();
            
        }
    }

    // update items
    itemUpdateSubmit = function(e){
        // get item input
        const input = UICtrl.getItemInput();

        // update item
        const updatedItem = ItemCtrl.updateItem(input.name,input.calorie);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // get total calorie
        const totalCalorie = ItemCtrl.getTotalCalories();

        // show total cals
        UICtrl.showTotalCalories(totalCalorie);

        // Update LS
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();
    }

    // delete item
    const itemDeleteSubmit = function(e){
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // delete from DS
        ItemCtrl.deleteItem(currentItem.id);

        // delete from UI
        UICtrl.deleteListItem(currentItem.id);

         // get total calorie
         const totalCalorie = ItemCtrl.getTotalCalories();

         // show total cals
         UICtrl.showTotalCalories(totalCalorie);

        //  delete from LS
        StorageCtrl.deleteFromStroage(currentItem.id);
 
         UICtrl.clearEditState();

        e.preventDefault()
    }

    // clear all items
    const clearAllItemsClick = function(){
        // delete items from DS
        ItemCtrl.clearAllItems();

         // get total calorie
         const totalCalorie = ItemCtrl.getTotalCalories();

         // show total cals
         UICtrl.showTotalCalories(totalCalorie);

        // remove from UI
        UICtrl.removeItems();

        // clear from lS
        StorageCtrl.clearItemsFromLS();

        // hide list
        UICtrl.hideList();
    }

    // Public method
    return {
        init:function(){
            console.log('Initiallizing App...');
            // clear edit state / initial state
            UICtrl.clearEditState();

            // Fetching data from DS
            const items = ItemCtrl.getItems();

            // hide list
           if(items.length === 0){
               UICtrl.hideList();
           }else{
               // Populate list items
               UICtrl.populateItems(items);
           }

           // get total calorie
           const totalCalorie = ItemCtrl.getTotalCalories();

           // show total cals
           UICtrl.showTotalCalories(totalCalorie);

           
            // load event listeners
            loadEventListeners();

        }
    }
})(ItemCtrl,StorageCtrl,UICtrl);

// Initializing app
App.init();