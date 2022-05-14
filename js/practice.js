function getId(selector) {
  return document.querySelector(selector);
}

const nav = getId("#nav");
const toggler = getId(".toggler");
const foodDisplay = getId(".food_display_container");
const modal = getId(".modal");
const overlay = getId(".overlay");
const closeBtn = getId("#close_btn");
const foodDetails = getId(".food_detailsA");

//modal
const close = () => {
  modal.style.display = "none";
};
overlay.onclick = close;
closeBtn.onclick = close;

toggler.onclick = function () {
  nav.classList.toggle("show");
};

//Globals
let categories;
//create onload function
window.onload = () => {
  getCategories();
};
//get data on api
const getCategories = async () => {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const data = await res.json();
  categories = data.categories;
  displayingCategories();
};

//displaying data
const displayingCategories = () => {
  categories.forEach(
    ({ idCategory, strCategory, strCategoryDescription, strCategoryThumb }) => {
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
              <button id="details_btn">See Category</button>
              <button id="details_btn" onclick="getDetails('${idCategory}')">See Details</button>
            </div>
    </div>
    `;
      foodDisplay.appendChild(div);
    }
  );
};

const getDetails = (id) => {
  foodDetails.textContent = "";
  const { strCategory, strCategoryDescription, strCategoryThumb } =
    categories[id - 1];
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="modal-content">
    <div class="food_img">
      <img src=${strCategoryThumb} alt="">
    </div>
    <h4>${strCategory}</h4>
    <p>${strCategoryDescription.slice(0, 300)}</p>
  </div>
  `;
  foodDetails.appendChild(div);
  modal.style.display = "block";
};
