"use strict";

window.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = require('./modules/tabs'),
          modalWindow = require('./modules/modalWindow'),
          timer = require('./modules/timer'),
          cards = require('./modules/cards'),
          formToServer = require('./modules/formToServer'),
          slider = require('./modules/slider'),
          calculator = require('./modules/calculator');

    tabs();
    modalWindow();
    timer();
    cards();
    formToServer();
    slider();
    calculator();


});
//npx json-server --watch db.json