var budgetController = (function(){
    
    //tu określamy jak ma wyglądać obiekt 'wydatek'
    var Expense = function(id, description, value){
        this.id =id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome >0){
            this.percentage = Math.round((this.value / totalIncome)*100)            
        } else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };


    //tu określamy jak ma wyglądać obiekt 'przychod'
    var Income = function(id, description, value){
        this.id =id;
        this.description = description;
        this.value = value;
    };
    
    
    //funkcja pozwalająca nam operawać na całkowitej liczbie naszych wydatków i przychodów
    var calculateTotal = function(type){
        var sum = 0;
        /*wybieramy array w zależności od jej typu tj. albo exp[] albo inc[],
        po czym dajemy funkcje forEach loopojąca przez wszystkie wartości w array.
        choc funkcja przyjmuje wartosci current, index i array, zależy nam jedynie
        na wartości aktualnie przeglądanego miejsca array'u, więc wystarczy nam 
        odwołanie się do current.value */


        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    }

    //tu przechowujemy wszystkie wydatkie i przychody, na których mozemy operować
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        bugdet: 0,
        percentage: -1
    };
    //funkcja która zwraca funkcję dodającą nowy obiekt(newItem = id,des,val) do array a także sam nowy obiekt
    // po tym jak otrzyma wartości z pól tekstowych i pól wyboru
    return{
        addItem: function(type, des, val){
            var newItem, ID;
            
            //create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id +1
            }else{
                ID =0;
            };
            

            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID,des,val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //fush into data structure
            data.allItems[type].push(newItem)

            //return new element
            return newItem;
        },

        //usuwanie przedmiotów
        deleteItem: function(type, id) {
            var ids,index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1)
            }
        },

        //funkcja na wszelkie obliczania wartości pieniężnej
        calculateBudget: function() {

            //calculace total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')
            
            //calculate the budget: income - expenses
            data.bugdet = data.totals.inc - data.totals.exp;
            
            //calc the percentage of income that we spent
            if (data.totals.inc >0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }


        },
        calculatePercentages: function(type){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentage: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },
        //
        getBudget: function(){
            return {
                budget: data.bugdet,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }
    };
})();


//zbiór funkcji kontrolujących wygląd strony
var UIController = (function(){

    //deklaracja elementów które będą modyfikowane
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercLabel: '.item__percentage'


    };


    //przekazanie wartości pól tekstowych i listy (+ or -) do obiektu 'pobierz input'
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        //funkcja dodająca nowe wydatki/przychody jako elementy div
        addListItem: function(obj, type){
            var html, newHtml, element;
            //create HTML sting with placeholder text**********

            // sprawdzenie czy dodajemy następny przedmiot w przychodach czy w wydatkach,
            // a następnie utworzenie nowego diva z "pustymi" miejscami, gotowymi do zastąpienia w niedalekiej przyszłości

            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //zmiana miejsc oznaczonych "id,discription, value" przez wartości 
            //z przedmiotu dodanego przez potwierdzenie zawartosci pól tekstowych
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value)

            //dodanie nowego diva z zastąpionymi wartościami do odpowiedniej kolumny wydatkow/przychodow
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);


        },

        //delete item: podajemy id obiektu do usunięcia i usuwamy
        //jedyną komplikacją jest to, że nie mozemy bezpośrednio usuniąc zaznaczonego elementu,
        // zamiast tego, odnosimy się do elementu wyżej i usuwamy jego dziecko(??)
        daleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },
        
        
        //clearing fields/ czyszzczenie pól w które wpisywaliśmy wartości naszego obiektu
        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            /* Tłumaczenie: 'fields' są listą,a potrzebujemy array, 
            nie mozemy jednak uzyć 'slice' na niej gdyz 'slice' jest
            częścią prototypu 'Array', czym 'fields' nie jest. 
            Co mozemy jednak, to odwołać się do prototypu Array, wywołać z 
            niego pojedyńczą funkcję(call), i użyć jej na czymś innym niż array */

            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";

            });

            fieldsArr[0].focus();
        },

        //prosta funkcja, pozwająca nam na wyświetlenie i zaktualizowanie wcześniej obliczonych
        // wartości: obecny budżet, wydatki, przychody i procent budżetu wydany
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            
            
            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage +'%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },


        //do pokazywania procentow
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };
            nodeListForEach(fields, function(current, index){
                
                if (percentages[index] > 0){
                    current.textContent = percentages[index]+ '%';
                }else {
                    current.textContent = '---';
                }
            });

        },

        //funkcja pozwalająca wziąć z "UIController" wszystkie nazwy DOM jakie im przypisaliśmy
        getDOMstrings: function(){
            return DOMstrings;
        }
    };
})();

//kontrolowanie wszystkich pozostałych części programu
var controller = (function(budgetCtrl, UICtrl){

    //essencial: ustawienie by strona wyczekiwała na nasze kliknięcia w odpowiednich miejscach, a tazke generalne zalozenie
    // na co ma reagować
   var setupEventListeners = function() {

        //dodawanie przedmiotu
            var DOM = UICtrl.getDOMstrings();
            document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

            document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
        
        //usuwanie przedniotu
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function(){
        //update salary
        budgetCtrl.calculateBudget();

        //return budget
        var budget = budgetCtrl.getBudget();
        
        //display
        UICtrl.displayBudget(budget);

    };

    
    var updatePercentages = function() {
        //calc percentage
        budgetCtrl.calculatePercentages();

        //read from budget controller
        var percentages = budgetCtrl.getPercentage();

        //update the UI
        UICtrl.displayPercentages(percentages);

    };


    var ctrlAddItem = function(){
        var input, newItem;

        //get input
        var input = UICtrl.getInput();
        console.log(input);

        if (input.descriptionescription !== "" && !isNaN(input.value) && input.value>0){
                //2.add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3.Add item to the ui
        
            UICtrl.addListItem(newItem, input.type);

            //4. clear
            UICtrl.clearFields();

            //5. calc & update budget
            updateBudget();

            //Calc and update percentages
            updatePercentages();


            console.log(newItem)    
        }






        console.log('it works');
    };
    
    //tutaj mozemy usunąć dany przedmiot z wyświetlanej listy, a takze jago wartosci z wydatkow/przychodow
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        //event bubbling - nasze kliknięcie idze po wszystkich elementach strony w górę,
        // od miejsca ktore kliknelismy - mozemy wiec je przechwycic na innym poziomie, niz
        // bezposrednio tam gzdzie było kliknięte. w tym przypadku szukamy elemantu, który
        // jest czwartym od końca, a w którym zawiera się nasz przycisk 'X'(usuń obiekt)
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            //po znalezieniu szukanego ID, rozdziel je na typ i ID, ktore moga być uzyte pozniej

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            console.log(splitID)

            //1.delete the item from the data structure
            budgetCtrl.deleteItem(type, ID)
            //2.Delete the item from the UI

            UICtrl.daleteListItem(itemID)

            //3.update and show new budget
            updateBudget();

            //update percentages
            updatePercentages();


        }

    };
    

    //funkcja określająca jak zacząć nasz program, i co wykonać na samym poczatku
    return {
        init: function(){
            console.log('App has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };


})(budgetController, UIController);

//rzeczywiste rozpoczęcie programu
controller.init();