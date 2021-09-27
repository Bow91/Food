import { modalOpen, modalClose } from "./modalWindow";
import {postData} from '../services/services';

function formToServer(modalTimeOpen) {
    const forms = document.querySelectorAll('form'),
          message = {
              loading: 'img/form/spinner.svg',
              success: 'Спасибо! Скоро мы с вами свяжемся',
              failure: 'Произошла ошибка...'
          };

    forms.forEach(item => {
        bindData(item);
    });

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
                // console.log(data);
                showThanksModal(message.success);                  
                statusMessage.remove();
            }).catch(() => showThanksModal(message.failure))
            .finally(() => form.reset());
        });
    }

    function showThanksModal(message) {
        const modalDialog = document.querySelector('.modal__dialog');
        modalDialog.classList.add('hide');
        modalOpen('.modal', modalTimeOpen);

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
            modalClose('.modal');
        },4000);
    }
}
export default formToServer;