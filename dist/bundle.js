(function () {
  'use strict';

  /**
   * Úr sýnilausn fyrir verkefni 7.
   */
  var operators = ['+', '-', '*', '/'];
  /**
  * Skilar tölu af handahófi á bilinu [min, max]
  */

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  /**
  * Útbýr spurningu og skilar sem hlut:
  * { problem: strengur með spurningu, answer: svar við spurningu sem tala }
  */


  function Question() {
    var operator = operators[randomNumber(0, operators.length - 1)];
    var a = null;
    var b = null;
    var answer = null;

    switch (operator) {
      case '+':
        a = randomNumber(10, 100);
        b = randomNumber(10, 100);
        answer = a + b;
        break;

      case '-':
        a = randomNumber(10, 100);
        b = randomNumber(10, a);
        answer = a - b;
        break;

      case '*':
        a = randomNumber(1, 10);
        b = randomNumber(1, 10);
        answer = a * b;
        break;

      case '/':
        b = randomNumber(2, 10);
        a = randomNumber(2, 10) * b;
        answer = a / b;
        break;

      default:
        break;
    }

    return {
      problem: "".concat(a, " ").concat(operator, " ").concat(b),
      answer: answer
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * Sækir og vistar í localStorage
   */
  // Fast sem skilgreinir heiti á lykli sem vistað er undir í localStorage
  var LOCALSTORAGE_KEY = 'calc_game_scores';
  /**
   * Sækir gögn úr localStorage. Skilað sem röðuðum lista á forminu:
   * { points: <stig>, name: <nafn> }
   *
   * @returns {array} Raðað fylki af svörum eða tóma fylkið ef ekkert vistað.
   */

  function addToJSON(olddata, newdata) {
    var oldstring = olddata.substring(0, olddata.length - 1);
    var newstring = newdata.substring(1, newdata.length - 1);
    var jsonfy = "".concat(oldstring, ",").concat(newstring, "]");
    return jsonfy;
  }

  function load() {
    var gameScores = window.localStorage.getItem(LOCALSTORAGE_KEY);

    if (gameScores) {
      var parsed = JSON.parse(gameScores);
      return parsed;
    }

    return [];
  }
  /**
   * Vista stig
   *
   * @param {string} name Nafn þess sem á að vista
   * @param {number} points Stig sem á að vista
   */

  function save(name, points) {
    var data = [{
      name: name,
      points: points
    }];
    var gameScores = localStorage.getItem(LOCALSTORAGE_KEY);

    if (gameScores) {
      data = JSON.parse(addToJSON(gameScores, JSON.stringify(data)));
    }

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
  }
  /**
   * Hreinsa öll stig úr localStorage
   */

  function clear() {
    // todo útfæra
    window.localStorage.removeItem(LOCALSTORAGE_KEY);
  }

  /*eslint-disable-line*/

  /**
   * Reikna út stig fyrir svör út frá heildarfjölda svarað á tíma.
   * Ekki þarf að gera ráð fyrir hversu lengi seinasta spurning var sýnd. Þ.e.a.s.
   * stig verða alltaf reiknuð fyrir n-1 af n spurningum.
   *
   * @param {number} total Heildarfjöldi spurninga
   * @param {number} correct Fjöldi svarað rétt
   * @param {number} time Tími sem spurningum var svarað á í sekúndum
   *
   * @returns {number} Stig fyrir svör
   */

  function score(total, correct, time) {
    // todo útfæra
    var number = Math.round(((Math.pow(correct / total - 1, 2) + correct) * total - 1) / time) * 100;

    if (isNaN(number) || correct === 0) {
      /*eslint-disable-line*/
      number = 0;
    }

    return number;
  }

  function sortByScore(data) {
    for (var i = 0; i < data.length; i += 1) {
      for (var k = data.length - 1; k > 0; k -= 1) {
        if (data[k - 1].points < data[k].points) {
          var temp = data[k - 1];
          data[k - 1] = data[k];
          /*eslint-disable-line*/

          data[k] = temp;
          /*eslint-disable-line*/
        }
      }
    }

    return data;
  }
  /**
   * Útbúa stigatöflu, sækir gögn í gegnum storage.js
   */


  var Highscore =
  /*#__PURE__*/
  function () {
    function Highscore() {
      _classCallCheck(this, Highscore);

      this.scores = document.querySelector('.highscore__scores');
      this.button = document.querySelector('.highscore__button');
      this.button.addEventListener('click', this.clear.bind(this));
    }
    /**
     * Hlaða stigatöflu inn
     */


    _createClass(Highscore, [{
      key: "load",
      value: function load$$1() {
        // todo útfæra
        var data = load();
        data = sortByScore(data);

        if (data.length !== 0) {
          while (this.scores.firstChild) {
            this.scores.removeChild(this.scores.firstChild);
          }

          this.button.classList.remove('highscore__button--hidden');
          data = Object.values(data);
          var ol = document.createElement('ol');

          for (var i = 0; i < data.length; i += 1) {
            var li = document.createElement('li');
            var span = document.createElement('span');
            span.classList.add('highscore__number');
            span.appendChild(document.createTextNode("".concat(data[i].points, " stig ")));
            var namespan = document.createElement('span');
            namespan.appendChild(document.createTextNode("".concat(data[i].name)));
            namespan.classList.add('highscore__name');
            li.appendChild(span);
            li.appendChild(namespan);
            ol.appendChild(li);
          }

          this.scores.appendChild(ol);
        } else {
          this.button.classList.add('highscore__button--hidden');
        }
      }
      /**
       * Hreinsa allar færslur úr stigatöflu, tengt við takka .highscore__button
       */

    }, {
      key: "clear",
      value: function clear$$1() {
        clear();

        while (this.scores.firstChild) {
          this.scores.removeChild(this.scores.firstChild);
        }

        this.button.classList.add('highscore__button--hidden');
        var text = 'Engin stig skráð';
        var p = document.createElement('p');
        p.appendChild(document.createTextNode(text));
        this.scores.appendChild(p);
      }
      /**
       * Hlaða inn stigatöflu fyrir gefin gögn.
       *
       * @param {array} data Fylki af færslum í stigatöflu
       */

    }, {
      key: "highscore",
      value: function highscore() {
        this.load();
      }
    }]);

    return Highscore;
  }();

  // todo vísa í rétta hluti með import

  var startButton = document.querySelector('.start'); // takki sem byrjar leik

  var problem = document.querySelector('.problem'); // element sem heldur utan um verkefni, sjá index.html

  var result = document.querySelector('.result'); // element sem heldur utan um niðurstöðu, sjá index.html

  var playTime; // hversu lengi á að spila? Sent inn gegnum init()

  var total = 0; // fjöldi spurninga í núverandi leik

  var correct = 0; // fjöldi réttra svara í núverandi leik

  var currentProblem; // spurning sem er verið að sýna

  var timer = document.querySelector('.problem__timer');
  var problemform = document.querySelector('.problem__answer');
  var problemInput = document.querySelector('.problem__input');
  var textcontent = document.querySelector('.result__text');
  var nameInput = document.querySelector('.result__input');
  var resultForm = document.querySelector('.result__form');
  var points;
  var hs = new Highscore();
  /**
   * Klárar leik. Birtir result og felur problem. Reiknar stig og birtir í result.
   */

  function nullStillaLeik() {
    total = 0;
    correct = 0;
    points = 0;
    nameInput.value = '';
  }

  function finish() {
    while (textcontent.firstChild) {
      textcontent.removeChild(textcontent.firstChild);
    }

    if (correct === 0) {
      points = 0;
    } else {
      points = score(total, correct, playTime);
    }

    var pre = document.createElement('span');
    var text = "\xDE\xFA svara\xF0ir ".concat(correct, " r\xE9tt af ").concat(total, " spurningum og f\xE9kkst ").concat(points, " stig fyrir. Skr\xE1\xF0u \xFEig \xE1 stigat\xF6fluna!");
    pre.appendChild(document.createTextNode(text));
    textcontent.appendChild(pre);
    problem.classList.add('problem--hidden');
    result.classList.remove('result--hidden'); // todo útfæra
  }
  /**
   * Keyrir áfram leikinn. Telur niður eftir því hve langur leikur er og þegar
   * tími er búinn kallar í finish().
   *
   * Í staðinn fyrir að nota setInterval köllum við í setTimeout á sekúndu fresti.
   * Þurfum þá ekki að halda utan um id á intervali og skilum falli sem lokar
   * yfir fjölda sekúnda sem eftir er.
   *
   * @param {number} current Sekúndur eftir
   */


  function tick(current) {
    // todo uppfæra tíma á síðu
    if (timer.firstChild) {
      timer.removeChild(timer.firstChild);
    }

    timer.appendChild(document.createTextNode(current));
    setTimeout(function () {
      if (current <= 1) {
        timer.removeChild(timer.firstChild);
        return finish();
      }

      return tick(current - 1);
    }, 1000);
  }
  /**
   * Býr til nýja spurningu og sýnir undir .problem__question
   */


  function showQuestion() {
    var probQuestion = problem.querySelector('.problem__question');
    currentProblem = new Question();
    total += 1;

    if (probQuestion.firstChild) {
      probQuestion.removeChild(probQuestion.firstChild);
    }

    var span = document.createElement('span');
    span.appendChild(document.createTextNode(currentProblem.problem));
    probQuestion.appendChild(span); // todo útfæra
  }
  /**
   * Byrjar leik
   *
   * - Felur startButton og sýnir problem
   * - Núllstillir total og correct
   * - Kallar í fyrsta sinn í tick()
   * - Sýnir fyrstu spurningu
   */


  function start() {
    nullStillaLeik();
    tick(playTime);
    showQuestion();
    problem.classList.remove('problem--hidden');
    startButton.classList.add('button--hidden');
  }
  /**
   * Event handler fyrir það þegar spurningu er svarað. Athugar hvort svar sé
   * rétt, hreinsar input og birtir nýja spurningu.
   *
   * @param {object} e Event þegar spurningu svarað
   */


  function onSubmit(e) {
    e.preventDefault();

    if (problemInput.value.trim() !== '') {
      if (parseInt(problemInput.value, 10) === currentProblem.answer) {
        correct += 1;
      } // todo útfæra


      showQuestion();
      problemInput.value = '';
    }
  }
  /**
   * Event handler fyrir þegar stig eru skráð eftir leik.
   *
   * @param {*} e Event þegar stig eru skráð
   */


  function onSubmitScore(e) {
    e.preventDefault();
    e.stopPropagation();
    var name = nameInput.value;

    if (name.trim() !== '') {
      save(name, points);
      hs.load();
    }

    nameInput.value = '';
    problemInput.value = ''; // todo útfæra

    result.classList.add('result--hidden');
    problem.classList.add('problem--hidden');
    startButton.classList.remove('button--hidden');
  }
  /**
   * Finnur öll element DOM og setur upp event handlers.
   *
   * @param {number} _playTime Fjöldi sekúnda sem hver leikur er
   */


  function init(_playTime) {
    playTime = _playTime;
    startButton = document.querySelector('.start');
    startButton.addEventListener('click', start);
    problemform.addEventListener('submit', onSubmit);
    resultForm.addEventListener('submit', onSubmitScore); // todo útfæra
  }

  var PLAY_TIME = 10;
  document.addEventListener('DOMContentLoaded', function () {
    init(PLAY_TIME);
    var highscore = new Highscore();
    highscore.load();
  });

}());
//# sourceMappingURL=bundle.js.map
