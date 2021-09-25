function calculator() {
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
}
module.exports = calculator;