
//Дэлгэцтэй ажиллах 
var uiController = (function()
{

})(); 


//Санхүүтай ажиллах
var financeController = (function(){
  
})();

//eventListner bolon zavsriin code
var appController = (function(uiController, financeController)
{
    var controllerAddItem = function(){
        // 1. oruulah ugugdliih delgetsees olj avna.

      // 2. Olj avsan ugugdluuddee sankhuugiin controllert damjuulj tend khadgalna.

      // 3. Olj avsan ugugdluudee veb deerkh tokhirokh khesegt n gargana.

      // 4. Tusviig tootsoolno/
    
      // 5. Etssiin uldegdel, tootsoog delgetseng gargana.
      console.log('klsdhkha');
    }
  document.querySelector('.add__btn').addEventListener('click', function(){
      controllerAddItem();
  });

  document.addEventListener('keypress', function(event){
    if(event.keyCode == 13 || event.which == 13){
        controllerAddItem();
    }
  });

})(uiController, financeController); 
