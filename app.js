
//Дэлгэцтэй ажиллах 
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expeseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container"
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value)
      }
    },
    getDOMstrings: function () {
      return DOMstrings;
    },

    clearFeilds: function () {
      var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

      //list to array
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (el, index, array) {
        el.value = "";
      });

      fieldsArr[0].focus();

      // for(var i = 0; i < fiedlsArr.length; i++){
      //   fiedlsArr[i].value = "";
      // }

    },

    tusviigUzuuleh: function (tusuv) {

      document.querySelector(DOMstrings.tusuvLabel).textContent = tusuv.tusuv;
      document.querySelector(DOMstrings.incomeLabel).textContent = tusuv.totalInc;
      document.querySelector(DOMstrings.expeseLabel).textContent = tusuv.totalExp;
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + "%";
      }
      else {
        document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi;
      }


    },
    addListItem: function (item, type) {
      //Orlogo zarlagiin elementiig aguulsam HTML-iig beltgene.
      var html, list;
      if (type == 'inc') {
        list = DOMstrings.incomeList;
        html = '<div class="item clearfix" id="inc-%id%"><div div class="item__description" >%description%</div><div div class="right clearfix" ><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
      } else {
        list = DOMstrings.expenseList;
        html = '<div class="item clearfix" id="exp-%id%"><div div class="item__description" >%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> ';
      }
      //Ter HTM dotroo orlogo zarlagiin utguudiig replace ashiglan uurchulj ugnu.

      html = html.replace('%id%', item.id);
      html = html.replace('%description%', item.description);
      html = html.replace('%value%', item.value);
      //Beltgesen HTML ee DOM ruu hiij ugnu
      document.querySelector(list).insertAdjacentHTML('beforeend', html);
    }

  }
})();


//Санхүүтай ажиллах
var financeController = (function () {

  var data = {
    items: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    },
    tusuv: 0,
    huvi: 0
  }

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }
  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  }
  return {
    tusuvTootsooloh: function () {
      //Niit orlogo, zarlagiig tootsoolno
      calculateTotal('inc');
      calculateTotal('exp');
      //Tusviig shineer tootsoolno
      data.tusuv = data.totals.inc - data.totals.exp;
      // Orlogo zarlagiin huviig tootsoolno
      data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);

    },
    tusviigAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      }
    },
    // data item dotroos songoson idtei medeelliig ustgana.
    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },
    addItem: function (type, description, value) {
      var item, id;
      if (data.items[type].length === 0) {
        id = 1;
      } else {
        id = (data.items[type][data.items[type].length - 1]).id + 1;
      }

      if (type === 'inc') {
        item = new Income(id, description, value);
      } else {
        item = new Expense(id, description, value);
      }

      data.items[type].push(item);
      return item;
    },
    seeData: function () {
      return data;
    }
  }
})();

//eventListner bolon zavsriin code
var appController = (function (uiController, financeController) {

  var controllerAddItem = function () {
    // 1. oruulah ugugdliih delgetsees olj avna.
    var input = uiController.getInput();
    if (input.description !== "" && input.value !== "") {
      // 2. Olj avsan ugugdluuddee sankhuugiin controllert damjuulj tend khadgalna.
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value);
      // 3. Olj avsan ugugdluudee veb deerkh tokhirokh khesegt n gargana.
      uiController.addListItem(item, input.type);
      uiController.clearFeilds();
    }
    // 4. Tusviig tootsoolno/
    financeController.tusuvTootsooloh();

    // 5. Etssiin uldegdel, tootsoog delgetseng gargana.
    var tusuv = financeController.tusviigAvah();

    // 6. Tusviin tootsoog delgetsend gargana.

    uiController.tusviigUzuuleh(tusuv);

  }

  var setupEventListeners = function () {
    var DOM = uiController.getDOMstrings();
    document.querySelector(DOM.addBtn).addEventListener('click', function () {
      controllerAddItem();
    });

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        controllerAddItem();
      }
    });
    document.querySelector(DOM.containerDiv).addEventListener('click', function (event) {
      var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
      if (id) {
        var arr = id.split("-");
        var type = arr[0];
        var itemId = parseInt(arr[1]);
        // 1.Sankhuugiin modulaas type, id-g ashiglaad ustgana.
        financeController.deleteItem(type, itemId);

        // 2.Delgets deerees tuhain id-tai elemtiig ustana.

        // 3.Uldegdel tootsoog shinechilj haruulna.
      }

    });
  }
  return {
    init: function () {
      uiController.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0
      });
      setupEventListeners();

    }
  }

})(uiController, financeController);

appController.init();