
//Дэлгэцтэй ажиллах 
var uiController = (function()
{
      var DOMstrings = {
        inputType: ".add__type", 
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn"
      };
      return {
        getInput: function(){
         return{
           type: document.querySelector(DOMstrings.inputType).value,
           description: document.querySelector(DOMstrings.inputDescription).value,
           value: document.querySelector(DOMstrings.inputValue).value
         }
        },
        getDOMstrings: function(){
          return DOMstrings;
        }
      }
})(); 


//Санхүүтай ажиллах
var financeController = (function(){
  
})();

//eventListner bolon zavsriin code
var appController = (function(uiController, financeController)
{
  
  var controllerAddItem = function(){
      // 1. oruulah ugugdliih delgetsees olj avna.
      console.log(uiController.getInput());
      // 2. Olj avsan ugugdluuddee sankhuugiin controllert damjuulj tend khadgalna.

      // 3. Olj avsan ugugdluudee veb deerkh tokhirokh khesegt n gargana.

      // 4. Tusviig tootsoolno/
    
      // 5. Etssiin uldegdel, tootsoog delgetseng gargana.
      
  }

   var  setupEventListeners = function(){
      var DOM = uiController.getDOMstrings();
      document.querySelector(DOM.addBtn).addEventListener('click', function(){
        controllerAddItem();
      });

      document.addEventListener('keypress', function(event){
        if(event.keyCode == 13 || event.which == 13){
          controllerAddItem();
      }
      });
   }
   return {
     init: function(){
      setupEventListeners();
     }
   }

})(uiController, financeController); 

appController.init();