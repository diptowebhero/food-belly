function getId(selector) {
  return document.querySelector(selector);
}

const nav = getId("#nav");
const toggler = getId(".toggler");
const foodDisplay = getId(".food_display_container");
const modal = getId(".modal");
const overlay = getId(".overlay");
const innerModal = getId(".inner_modal");
const foodDetailsA = getId(".food_detailsA");
const closeBtn = getId("#close_btn");
const searchBtn = getId("#search_btn");
const input = getId("input");
const error = getId("#error");
const spinner = getId("#spinner");
const error_msg = getId(".error");
const totalCart = getId("#totalCart");
toggler.onclick = function () {
  nav.classList.toggle("show");
};

//cleaner function
const cleanUp = () => {
  error.textContent = "";
  input.value = "";
  foodDetailsA.textContent = "";
};

//search functionality
searchBtn.addEventListener("click", async function () {
  if (input.value == "") {
    error.style.display = "block";
  } else {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${input.value}`
    );
    const data = await response.json();
    spinner.style.display = "block";
    showSearchResult(data);
  }
});
// //show search result
function showSearchResult(data) {
  foodDisplay.innerHTML = "";

  const foodArray = data.meals;
  if (foodArray) {
    foodArray.forEach(({ strMeal, strMealThumb, strInstructions, idMeal }) => {
      const div = document.createElement("div");
      div.classList.add("single_food_card");
      div.innerHTML = `
        <div class="food_img">
              <img src=${strMealThumb} alt="" />
            </div>
            <div class="food_details">
              <h3>${strMeal}</h3>
              <p>${strInstructions.slice(0, 100)}</p>
            </div>
            <div class="food_button">
              <button id="details_btn">See Category</button>
              <button id="details_btn" onclick="getDetails('${idMeal}')">See Details</button>
            </div>
        `;

      foodDisplay.appendChild(div);
      spinner.style.display = "none";
      error_msg.style.display = "none";
      cleanUp();
    });
  } else {
    error_msg.style.display = "block";
  }
}

//modal close functionality
overlay.onclick = close;
closeBtn.onclick = close;

function close() {
  modal.style.display = "none";
}

//showing display api data
window.onload = () => {
  getCategoryFood();
  cartLength();
};
let categories;

async function getCategoryFood() {
  const response = await fetch("../data/categories.json");
  const data = await response.json();

  categories = data.categories;

  showCategoryFoodUi();
}

function showCategoryFoodUi() {
  categories.forEach(
    ({ idCategory, strCategory, strCategoryThumb, strCategoryDescription }) => {
      const div = document.createElement("div");
      div.classList.add("single_food_card");
      div.innerHTML = `
        <div class="food_img">
              <img src=${strCategoryThumb} alt="" />
            </div>
            <div class="food_details">
              <h3>${strCategory}</h3>
              <p>${strCategoryDescription.slice(0, 100)}</p>
            </div>
            <div class="food_button">
              <button id="details_btn" onclick="getAllCategories('${strCategory}')">See Category</button>
              <button id="details_btn" onclick="getDetails('${idCategory}')">See Details</button>
            </div>
        `;
      foodDisplay.appendChild(div);
    }
  );
}
//showing details
function getDetails(id) {
  cleanUp();
  const { strCategory, strCategoryDescription, strCategoryThumb } =
    categories[id - 1];

  //Another way
  // const selectedCategories = categories.find(
  //   (category) => category.idCategory === id
  // );
  // const { strCategory, strCategoryDescription, strCategoryThumb } =
  //   selectedCategories;
  // console.log(selectedCategories);
  const div = document.createElement("div");
  div.innerHTML = `<div class="modal-content">
    <div class="food_img">
      <img src=${strCategoryThumb} alt="">
    </div>
    <h4>${strCategory}</h4>
    <p>${strCategoryDescription.slice(0, 300)}</p>
  </div>`;
  foodDetailsA.appendChild(div);
  modal.style.display = "block";
}

//show data with filter categories
const getAllCategories = async (categories) => {
  cleanUp();
  const res = await fetch("../data/allCategories.json");
  const { meals } = await res.json();
  const filterCategories = meals.filter((meal) => meal.category === categories);

  foodDisplay.innerHTML = "";
  if (!filterCategories) {
    alert("data not found");
  } else {
    filterCategories.forEach(({ price, strMealThumb, strMeal, idMeal }) => {
      const div = document.createElement("div");
      div.classList.add("single_food_card");
      div.innerHTML = `
          <div class="food_img">
                <img src=${strMealThumb} alt="" />
              </div>
              <div class="food_details">
                <h3>${strMeal}</h3>
                <p class="price">Price: ${price} Taka</p>
               
              </div>
              <div class="food_button">
                <button onclick="addToCart('${idMeal}')" id="details_btn" class="addToCart">Add to cart</button>
              </div>
          `;
      foodDisplay.appendChild(div);
    });
  }
};

// Add to cart function
const addToCart = (id) => {
  const cart = getDataOnLocalStorage();
  const itemsArray = Object.keys(cart);

  const isExist = itemsArray.find((item) => item === id);
  if (isExist) {
    cart[id] += 1;
  } else {
    cart[id] = 1;
    totalCart.textContent = itemsArray.length + 1;
  }

  setDataLocalStorage(cart);
};

const cartLength = () => {
  const cart = getDataOnLocalStorage();
  const itemsArray = Object.keys(cart);
  totalCart.textContent = itemsArray.length;
};

// localStorage function
function getDataOnLocalStorage() {
  let cart = {};
  const data = localStorage.getItem("carts");
  if (data) {
    cart = JSON.parse(data);
  }
  return cart;
}

const setDataLocalStorage = (data) => {
  localStorage.setItem("carts", JSON.stringify(data));
};
