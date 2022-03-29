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

overlay.onclick = close;
closeBtn.onclick = close;

function close(){
    modal.style.display ="none";
}

toggler.onclick = function () {
  nav.classList.toggle("show");
};

window.onload = getCategoryFood;
let categories;

async function getCategoryFood() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const data = await response.json();
  categories = data.categories;
  showCategoryFoodUi();
}

function showCategoryFoodUi() {
  categories.forEach(
    ({idCategory, strCategory, strCategoryThumb, strCategoryDescription }) => {
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
              <button id="details_btn">See Category</button>
              <button id="details_btn" onclick="getDetails('${idCategory}')">See Details</button>
            </div>
        `;
        foodDisplay.appendChild(div);
    }
  );
}

function getDetails(names){
  foodDetailsA.textContent = ""
    const {strCategory,strCategoryDescription,strCategoryThumb} = categories[names-1];
    const div = document.createElement('div');
    div.innerHTML = `<div class="modal-content">
    <div class="food_img">
      <img src=${strCategoryThumb} alt="">
    </div>
    <h4>${strCategory}</h4>
    <p>${strCategoryDescription.slice(0,300)}</p>
  </div>`
  foodDetailsA.appendChild(div);
  modal.style.display = "block";
  
}