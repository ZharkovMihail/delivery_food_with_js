const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

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

    if ( login !== '' ){
      localStorage.setItem('gloDelivery', login);

      toggleModalAuth();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = 'red';
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

checkAuth();

// day 2

function createCardRestaurant() {

  const card = `
  <a class="card card-restaurant">
    <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">Тануки</h3>
        <span class="card-tag tag">60 мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          4.5
        </div>
        <div class="price">От 1 200 ₽</div>
        <div class="category">Суши, роллы</div>
      </div>
    </div>
  </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card)

}

createCardRestaurant();

function openGoods(event) {

  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  console.log('restaurant: ', restaurant);

  if (restaurant) {
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
  }

}

cardsRestaurants.addEventListener('click', openGoods);