
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
    containerDiv: ".container",
    expencePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  var formatMoney = function (number, type) {
    number = "" + number;
    var x = number
      .split("")
      .reverse()
      .join("");
    var y = "";
    var count = 1;
    for (var i = 0; i < x.length; i++) {
      y = y + x[i];
      if (count % 3 === 0) y = y + ",";
      count++;
    }
    var z = y
      .split("")
      .reverse()
      .join("");

    if (z[0] === ",") {
      z = z.substr(1, z.length - 1);
    }
    if (type === "inc") {
      z = "+ " + z;
    }
    else {
      z = "- " + z;
    }
    return z;
  }
  return {
    displayDate: function () {
      var today = new Date();
      document.querySelector(DOMstrings.dateLabel).textContent = today.getFullYear() + " оны " + (today.getMonth() + 1) + "-р сарын өрхийн санхүү";
      // const options = { year: "numeric", month: "long" };
      // const formattedDate = new Intl.DateTimeFormat("mn-MN", options).format(new Date());
      // document.querySelector(DOMstrings.dateLabel).textContent = `${formattedDate} өрхийн санхүү`;
    },
    changeType: function () {
      var fields = document.querySelectorAll(DOMstrings.inputType + ', ' + DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      nodeListForEach(fields, function (el) {
        el.classList.toggle('red-focus');
      });
      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value)
      }
    },

    displayPercentages: function (allPercentages) {
      //Zarlagiin NodeList-iig olokh
      var elements = document.querySelectorAll(DOMstrings.expencePercentageLabel);

      // element bolgonii khuvid zarlagiin khuviig massivaas avch shivj oruulakh
      nodeListForEach(elements, function (el, index) {
        el.textContent = allPercentages[index] + "%";
      });
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
      var type;
      if (tusuv.tusuv > 0) type = 'inc';
      else type = 'exp';
      document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(tusuv.tusuv, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(tusuv.totalInc, 'inc');
      document.querySelector(DOMstrings.expeseLabel).textContent = formatMoney(tusuv.totalExp, 'exp');
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + "%";
      }
      else {
        document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi;
      }
    },

    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    addListItem: function (item, type) {
      //Orlogo zarlagiin elementiig aguulsam HTML-iig beltgene.
      var html, list;
      if (type == 'inc') {
        list = DOMstrings.incomeList;
        html = '<div class="item clearfix" id="inc-%id%"><div div class="item__description" >%description%</div><div div class="right clearfix" ><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
      } else {
        list = DOMstrings.expenseList;
        html = '<div class="item clearfix" id="exp-%id%"><div div class="item__description" >%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> ';
      }
      //Ter HTM dotroo orlogo zarlagiin utguudiig replace ashiglan uurchulj ugnu.

      html = html.replace('%id%', item.id);
      html = html.replace('%description%', item.description);
      html = html.replace('%value%', formatMoney(item.value, type));

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
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }
  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  };
  return {
    tusuvTootsooloh: function () {
      //Niit orlogo, zarlagiig tootsoolno
      calculateTotal('inc');
      calculateTotal('exp');
      //Tusviig shineer tootsoolno
      data.tusuv = data.totals.inc - data.totals.exp;
      // Orlogo zarlagiin huviig tootsoolno
      if (data.totals.inc > 0) data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huvi = 0;


    },
    calculatePercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function () {
      var allPercentages = data.items.exp.map(function (el) {
        return el.getPercentage();
      });
      return allPercentages;
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
      //Tusviig shineer tootsoolood delgetsend uzuulne.
      updateTusuv();

    }
  };
  var updateTusuv = function () {
    // 4. Tusviig tootsoolno/
    financeController.tusuvTootsooloh();

    // 5. Etssiin uldegdel, tootsoog delgetseng gargana.
    var tusuv = financeController.tusviigAvah();

    // 6. Tusviin tootsoog delgetsend gargana.  
    uiController.tusviigUzuuleh(tusuv);

    // 7. Khuviig tootsoolno
    financeController.calculatePercentages();

    // 8. elementuudiin khuviig khuleej avna.
    var allPercentages = financeController.getPercentages();

    // 9. Edgeer khuviig delgetsend kharuulna.
    uiController.displayPercentages(allPercentages);
  };



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
    document.querySelector(DOM.inputType).addEventListener('change', uiController.changeType);

    document.querySelector(DOM.containerDiv).addEventListener('click', function (event) {
      var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
      if (id) {
        var arr = id.split("-");
        var type = arr[0];
        var itemId = parseInt(arr[1]);
        // 1.Sankhuugiin modulaas type, id-g ashiglaad ustgana.
        financeController.deleteItem(type, itemId);
        // 2.Delgets deerees tuhain id-tai elemtiig ustana.
        uiController.deleteListItem(id);
        // 3.Uldegdel tootsoog shinechilj haruulna.
        updateTusuv();
      }

    });
  }
  return {
    init: function () {
      uiController.displayDate()
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
