"use strict";

window.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    tabsParent.addEventListener('click', event => {
                
        if(event.target && event.target.classList.contains('tabheader__item')) {
            tabs.forEach((item, index) => {
                if(item.textContent === event.target.innerText) {
                    hideTabContent();
                    showTabContent(index);
                }
            });            
        }
    });
   
    hideTabContent();
    showTabContent();

    // Timer

    const deadLine = '2021-11-31';

    function getTimeRemaining(endtime) {
        const time = Date.parse(endtime) - new Date(),
              days = Math.floor(time / (1000 * 60 * 60 * 24)),
              hours = Math.floor(time / (1000 * 60 *60) % 24),
              minutes = Math.floor(time / (1000 * 60) % 60),
              seconds = Math.floor(time / 1000 % 60);

        return {
            time,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'), 
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
             
        function updateClock() {
            const timeRemaining = getTimeRemaining(endtime);
            
            days.textContent = getZero(timeRemaining.days);
            hours.textContent = getZero(timeRemaining.hours);
            minutes.textContent = getZero(timeRemaining.minutes);
            seconds.textContent = getZero(timeRemaining.seconds);
                       
            if (timeRemaining.total < 0) {
                clearInterval(timeInterval);
            }            
        }
        updateClock();  
    }
 
    setClock('.timer', deadLine);

    // Modal window

    const modalOpenBtns = document.querySelectorAll('[data-openmodal]'),
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-closemodal]');

    function modalOpen() {
        modal.classList.toggle('show');
        document.body.style.overflow = 'hidden'; 
        clearTimeout(modalTimeOpen);
    }   

    function modalClose() {
        modal.classList.toggle('show');
        document.body.style.overflow = '';
    }
    
    modalOpenBtns.forEach(btn  => {
        btn.addEventListener('click', modalOpen);
    });

    modalCloseBtn.addEventListener('click', modalClose);

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            modalClose();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === "Escape" && modal.classList.contains('show')) {
            modalClose();
        }
    });

    const modalTimeOpen = setTimeout(modalOpen, 15000);

    function modalByScroll()  {
        const ddE = document.documentElement; 
        if (ddE.scrollTop == (ddE.scrollHeight - ddE.clientHeight)) {
            modalOpen();
            window.removeEventListener('scroll', modalByScroll);
        }
    }

    window.addEventListener('scroll', modalByScroll);

});