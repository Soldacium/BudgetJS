var budgetController = (function(){
    
    //private

})();


var UIController = (function(){

    var DOMstrings = {
        inputType: 'add__type',
        inputDescription: '.add__description',
        inputValue: 'add__value',
        inputBtn: '.add__btn'
    };

    return {
        getinput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, //will be inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value                
            };

        },

        getDOMstrings: function(){
            return DOMstrings;
        }

    };

})();

var controller = (function(budgetCtrl, UICtrl){

    var DOM = UICtrl.getDOMstrings();

    var ctrlAddItem = function() {
        // 1 get input
        var input = UICtrl.getinput();
        console.log(input);
        // 2 add the item to budget controller

        // 3 add the idem to the UI

        // 4 calculate the budget

        // 5 display the budget
    }
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem());

    document.addEventListener('keypress', function(event){

        if (event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
})(budgetController,UIController);