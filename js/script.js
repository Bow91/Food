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
              hours = Math.floor((time / (1000 * 60 *60)-3) % 24),
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
          modal = document.querySelector('.modal');

    function modalOpen() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; 
        clearInterval(modalTimeOpen);
        window.removeEventListener('scroll', modalByScroll);
    }   

    function modalClose() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    modalOpenBtns.forEach(btn  => {
        btn.addEventListener('click', modalOpen);
    });

    modal.addEventListener('click', event => {
        if (event.target === modal || event.target.classList.contains('modal__close')) {
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

    //  Cards menu class

    class AddNewCards {
        constructor(imgSrc, altText, menuSubtitle, menuDescr, menuPrice, parent, ...classes) {
            this.imgSrc = imgSrc;
            this.altText = altText;
            this.menuSubtitle = menuSubtitle;
            this.menuDescr = menuDescr;
            this.menuPrice = menuPrice;
            this.classes = classes;
            this.parent = document.querySelector(parent);
            this.transfer = 70;
            this.changeToRUB();
        }

        changeToRUB() {
            this.menuPrice *= this.transfer;
        }
        
        cardsAdd(){
            const element = document.createElement('div');
            if (this.classes.length < 1) {
                this.classes = ['menu__item'];
            }
            this.classes.forEach(className => element.classList.add(className));
            element.innerHTML += `
                <img src=${this.imgSrc} alt=${this.altText}>
                <h3 class="menu__item-subtitle">${this.menuSubtitle}</h3>
                <div class="menu__item-descr">${this.menuDescr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.menuPrice}</span> руб/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    axios.get('http://localhost:3000/menu')
    .then(result => result.data.forEach(item => new AddNewCards(
      item.img, 
      item.altimg, 
      item.title, 
      item.descr, 
      item.price, 
      '.menu .container'       
    ).cardsAdd()));
     

    // Form for sending to the server

    const forms = document.querySelectorAll('form'),
          message = {
              loading: 'img/form/spinner.svg',
              success: 'Спасибо! Скоро мы с вами свяжемся',
              failure: 'Произошла ошибка...'
          };

    forms.forEach(item => {
        bindData(item);
    });

    const postData = async (url, data) => {
        const result = await fetch(url, {
            method: 'POST',               
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data)
        });

        return await result.json();
    };

    function bindData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto
                `;
            form.insertAdjacentElement('afterend', statusMessage);
          
            const formData = new FormData(form);

            const object = Object.fromEntries(formData.entries());
            
            postData('http://localhost:3000/requests', object)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);                  
                statusMessage.remove();
            }).catch(() => showThanksModal(message.failure))
            .finally(() => form.reset());
        });
    }

    function showThanksModal(message) {
        const modalDialog = document.querySelector('.modal__dialog');
        modalDialog.classList.add('hide');
        modalOpen();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-closemodal>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {            
            thanksModal.remove();
            modalDialog.classList.add('show');
            modalDialog.classList.remove('hide');
            modalClose();
        },4000);
    }

    // Sliders

    const buttonsSliderLeft = document.querySelector('.offer__slider-prev'),
          buttonsSliderRight = document.querySelector('.offer__slider-next'),
          slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          currentSlider = document.querySelector('#current'),
          totalSlides = document.querySelector('#total'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = slidesWrapper.querySelector('.offer__slider-iner'),
          width = window.getComputedStyle(slidesWrapper).width;
    
    let offset = 0;
    const widthNumber = +width.replace(/\D/g, '');
    currentSlider.textContent = '01';

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.6s ';
    slidesWrapper.style.overflow = 'hidden';
    
    slider.style.position = 'relative';

    slides.forEach(slide => {
        slide.style.width = width;
    });   

    buttonsSliderRight.addEventListener('click', () => {
        if (offset == widthNumber * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += widthNumber;
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        flipSlide(1);
    });

    buttonsSliderLeft.addEventListener('click', () => {
        if (offset == 0) {
            offset = widthNumber * (slides.length - 1);
        } else {
            offset -= widthNumber;
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        flipSlide(-1);
    });
    
    if (slides.length < 10) {
        totalSlides.textContent = `0${slides.length}`;
    } else {
        totalSlides.textContent = slides.length;
    }
    
    function flipSlide(n){
        currentSlider.textContent = +currentSlider.textContent + n;
        if (currentSlider.textContent > slides.length) {
            currentSlider.textContent = 1;
        }
        if (currentSlider.textContent < 1) {
            currentSlider.textContent = slides.length;
        }
        tapSlide();
    }

    function tapSlide() {
        if (currentSlider.textContent < 10 && currentSlider.textContent.length < 2) {
            currentSlider.textContent = `0${currentSlider.textContent}`;
        }
        dotsArr.forEach(dot => dot.style.opacity = 0.5);
        dotsArr[+currentSlider.textContent - 1].style.opacity = 1;
    }

    const indicators = document.createElement('ol'),
          dotsArr = [];
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 1; i <= slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i);
        dot.classList.add('dot');
        if (i == +currentSlider.textContent) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dotsArr.push(dot);
    }

    dotsArr.forEach(dot => {
        dot.addEventListener('click', event => {
            offset = (event.target.getAttribute('data-slide-to') - 1) * widthNumber;
            slidesField.style.transform = `translateX(-${offset}px)`;
            
            currentSlider.textContent = event.target.getAttribute('data-slide-to');
            tapSlide();
        });
    });

//  Calculator

    const result = document.querySelector('.calculating__result span');
    let sex, ratio,
        height = localStorage.getItem('height'), 
        weight = localStorage.getItem('weight'), 
        age = localStorage.getItem('age');
    
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', sex);
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', ratio);
    }
     
    function showStaticData(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('data-ratio') === ratio) {
                elem.classList.add(activeClass);
            } 
            if (elem.getAttribute('id') === sex) {
                elem.classList.add(activeClass);
            }
        });
    }

    function showDinamicData() {
        const input = document.querySelectorAll('input');

        input.forEach(elem => {
            switch(elem.getAttribute('id')) {
                case 'height':
                     elem.value = height;
                    break;
                case 'weight':
                     elem.value = weight;
                    break;
                case 'age':
                     elem.value = age;
                    break;
            }
        });
    }

    showStaticData('.calculating__choose-item', 'calculating__choose-item_active');
    showDinamicData();

    

    function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio) {
            result.textContent = 'Нет данных';
            return;
        }

        if(sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);
        
        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
                
                calcTotal();
            });
        });
    }

    function getDinamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '2px solid red';
            } else {
                input.style.border = '2px solid #54ed39';
            }
            if (!input.value) {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    localStorage.setItem('height', height);
                    break;
                case 'weight':
                    weight = +input.value;
                    localStorage.setItem('weight', weight);
                    break;
                case 'age':
                    age = +input.value;
                    localStorage.setItem('age', age);
                    break;
            }
            calcTotal();
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');
    getDinamicInformation('#height');
    getDinamicInformation('#weight');
    getDinamicInformation('#age');

});
//npx json-server --watch db.json