//element selector function
function elementById(id) {
  return document.querySelector(id);
}
const toggler = elementById(".toggler");
const nav = elementById("#nav");
const foodDisplay = elementById(".food_display_container");
const food_detailsA = elementById(".food_detailsA");
const modal = elementById(".modal");
const overlay = elementById(".overlay");
const closeBtn = elementById("#close_btn");
const totalItems = elementById("#totalItems");

//for modal
overlay.onclick = close;
closeBtn.onclick = close;
function close() {
  return (modal.style.display = "none");
}

toggler.onclick = () => {
  nav.classList.toggle("show");
};

//onload function
window.onload = function () {
  getData();
  getTotalItems();
};

//Store categories
let categories = [];

//get data
async function getData() {
  const res = await fetch("../data/categories.json");
  const data = await res.json();
  categories = data.categories;
  displayingData();
}

// displaying data
function displayingData() {
  categories.forEach(
    ({ idCategory, strCategory, strCategoryThumb, strCategoryDescription }) => {
      const div = document.createElement("div");
      div.innerHTML = `
      <div class="single_food_card">
            <div class="food_img">
              <img src=${strCategoryThumb} alt="" />
            </div>
            <div class="food_details">
              <h3>${strCategory}</h3>
              <p>${strCategoryDescription.slice(0, 100)}</p>
            </div>
            <div class="food_button">
              <button id="details_btn" onclick="getCategory('${strCategory}')">See Category</button>
              <button id="details_btn" onclick="getDetails('${idCategory}')">See Details</button>
            </div>
          </div>
      `;
      foodDisplay.appendChild(div);
    }
  );
}

//get details
function getDetails(id) {
  food_detailsA.innerHTML = "";
  const selectedCategories = categories.find(
    (category) => category.idCategory === id
  );
  const { strCategory, strCategoryThumb, strCategoryDescription } =
    selectedCategories;
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="modal-content">
  <div class="food_img">
    <img src=${strCategoryThumb} alt="">
  </div>
  <h4>${strCategory}</h4>
  <p>${strCategoryDescription.slice(0, 200)}</p>
    </div>`;
  food_detailsA.appendChild(div);
  modal.style.display = "block";
}

//get category food
async function getCategory(category) {
  const res = await fetch("../data/allCategories.json");
  const { meals } = await res.json();
  const filterCategories = meals.filter((meal) => meal.category === category);
  displayCategories(filterCategories);
}

//displaying all categories
function displayCategories(food) {
  foodDisplay.innerHTML = "";
  food.forEach(({ idMeal, category, price, strMeal, strMealThumb }) => {
    const div = document.createElement("div");
    div.innerHTML = `
  <div class="single_food_card">
  <div class="food_img">
    <img src=${strMealThumb} alt="" />
  </div>
  <div class="food_details">
    <h3>${category}</h3>
    <p>${price} Taka</p>
    <p>${strMeal}</p>
  </div>
  <div class="food_button">
    <button id="details_btn" class='addToCart' onclick="addToCart('${idMeal}')">Add To Cart</button>
  </div>
</div>
  `;
    foodDisplay.appendChild(div);
  });
}

function addToCart(id) {
  const cart = getDataFromLocalStorage();
  const itemsArray = Object.keys(cart);
  const isExist = itemsArray.find((item) => item === id);

  if (isExist) {
    cart[id] += 1;
  } else {
    cart[id] = 1;
    totalItems.innerText = itemsArray.length + 1;
  }

  setDataOnLocalStorage(cart);
}

function getTotalItems() {
  const cart = getDataFromLocalStorage();
  const itemsArray = Object.keys(cart);
  totalItems.innerText = itemsArray.length;
}

//local storage
function getDataFromLocalStorage() {
  let cart = {};
  const data = localStorage.getItem("carts");
  if (data) {
    cart = JSON.parse(data);
  }
  return cart;
}
function setDataOnLocalStorage(cart) {
  localStorage.setItem("carts", JSON.stringify(cart));
}


