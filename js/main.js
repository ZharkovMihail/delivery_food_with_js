'use strict';


const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

// day 1

let login = localStorage.getItem('gloDelivery');
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo')
const restaurants = document.querySelector('.restaurants')
const menu = document.querySelector('.menu')
const logo = document.querySelector('.logo')
const cardsMenu = document.querySelector('.cards-menu')

const restaurantTitle = document.querySelector('.restaurant-title')
const rating = document.querySelector('.rating')
const minPrice = document.querySelector('.price')
const category = document.querySelector('.category')
const inputSearch = document.querySelector('.input-search')

const valid = function(str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str)
}

const getData = async function(url) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, код ошибки ${response.status}`)
  }

  return await response.json();

};


function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open"); // навешивает или удаляет класс
  loginInput.style.borderColor = ''; // если пользователь не ввёл логин то крашу дальше в красный, а сдесь перекрашываю обратно
}

function authorized() {
  console.log("Авторизован");

  function logOut() {
    login = null;
    
    localStorage.removeItem('gloDelivery');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    
    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = 'none'; // скрываю кнопку
  userName.style.display = "inline";
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log("Не авторизован");

  function logIn(event) { 
    event.preventDefault();
    login = loginInput.value.trim();

    if ( valid(login) ){
      localStorage.setItem('gloDelivery', login);

      toggleModalAuth();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = 'red';
      loginInput.value = '';
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth); //добавляет отслеживание по действию click и вызывает функцию toggleModalAuth()
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}


// day 2

function createCardRestaurant(restaurant) {
  console.log('restaurant: ', restaurant);

  const {
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery: timeOfDelivery
  } = restaurant;

  const card = `
  <a class="card card-restaurant" data-products="${products}" data-info="${[name, price, stars, kitchen]}">
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card)

}

function createCardGood({
    description,
    id,
    image,
    name,
    price
  }) 
  {

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
  <img src="${image}" alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title card-title-reg">${name}</h3>
    </div>
    <div class="card-info">
      <div class="ingredients">
        ${description}
      </div>
    </div>
    <div class="card-buttons">
      <button class="button button-primary button-add-cart">
        <span class="button-card-text">В корзину</span>
        <span class="button-cart-svg"></span>
      </button>
      <strong class="card-price-bold">${price} ₽</strong>
    </div>
  </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card)
}

function openGoods(event) {

    const target = event.target;
    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
      if (login) {
        console.log(restaurant.dataset.products);
        console.log(restaurant.dataset.info.split(','));
        const info = restaurant.dataset.info.split(',');
        const [name, price, stars, kitchen] = info;

        restaurantTitle.textContent = name;
        rating.textContent = stars;
        minPrice.textContent = `от ${price} ₽`;
        category.textContent = kitchen;

        cardsMenu.textContent = '';
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');

        getData(`db/${restaurant.dataset.products}`).then(function(data) {
          data.forEach(createCardGood);
        });
      } else {
        toggleModalAuth();
      }
  }
}

function init() {
  getData('db/partners.json').then(function(data) {
    data.forEach(createCardRestaurant);
  });
  
  cartButton.addEventListener("click", toggleModal);
  
  close.addEventListener("click", toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  inputSearch.addEventListener('keydown', function(event){ //поиск блюд
    if (event.keyCode == 13) {
      const target = event.target;
      const value = target.value.toLowerCase().trim();

      if (!value || value.length <= 2) {
        target.style.backgroundColor = 'tomato';
        setTimeout(function(){
          target.style.backgroundColor = '';
        }, 2000);
        return;
      }

      target.value = '';

      const goods = [];

      getData('db/partners.json').then(function(data) {

        const products = data.map(function(item){
          return item.products;
        });
        
        products.forEach(function(product){
          getData(`db/${product}`).then(function(data){
            goods.push(...data);

            const searchGoods = goods.filter(function(item){
              return item.name.toLowerCase().includes(value)
            })

            console.log('goods: ', goods);

            restaurantTitle.textContent = 'Результат поиска';
            rating.textContent = '';
            minPrice.textContent = '';
            category.textContent = '';

            cardsMenu.textContent = '';
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');

            return searchGoods;
          }).then(function(data){
            data.forEach(createCardGood)
          })
        });

      });

    }
  });
  
  checkAuth();
  
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true
  });
}

init();