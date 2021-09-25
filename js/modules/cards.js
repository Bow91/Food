function cards() {
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
     
}
module.exports = cards;