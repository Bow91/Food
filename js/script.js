"use strict";
    require('es6-promise').polyfill();
    import 'nodelist-foreach-polyfill';

    import  tabs  from './modules/tabs';
    import  modalWindow  from './modules/modalWindow';
    import  timer  from './modules/timer';
    import  cards  from './modules/cards';
    import  formToServer  from './modules/formToServer';
    import  slider  from './modules/slider';
    import  calculator  from './modules/calculator';
    import {modalOpen} from './modules/modalWindow';

window.addEventListener('DOMContentLoaded', () => {

    const modalTimeOpen = setTimeout(() => modalOpen('.modal', modalTimeOpen, modalByScroll), 15000);

    function modalByScroll(modalTimeOpen)  {
        const ddE = document.documentElement; 
        if (ddE.scrollTop == (ddE.scrollHeight - ddE.clientHeight)) {
            modalOpen('.modal', modalTimeOpen);
            window.removeEventListener('scroll', modalByScroll);
        }
    }

    tabs('.tabheader__item', '.tabcontent', '.tabheader__items','tabheader__item_active');
    modalWindow('[data-openmodal]', '.modal', modalTimeOpen, modalByScroll);
    timer('.timer', '2021-12-31');
    cards();
    formToServer(modalTimeOpen);
    slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-iner'
    });
    calculator();

});
//npx json-server --watch db.json