window.onload = function () {
  getTotalItems();
  getCategories();
};

const totalItems = document.querySelector("#totalItems");

const tBody = document.querySelector("#cartItem");
const totals = document.querySelector("#total");
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

function getTotalItems() {
  const cart = getDataFromLocalStorage();
  const itemsArray = Object.keys(cart);

  totalItems.innerText = itemsArray.length;
}

//Store Data
let cartItems = [];
async function getCategories() {
  const res = await fetch("../data/allCategories.json");
  const { meals } = await res.json();
  setDataCartItems(meals);
}

function setDataCartItems(meals) {
  const cart = getDataFromLocalStorage();
  const itemsArray = Object.keys(cart);
  meals.forEach((food) => {
    itemsArray.forEach((id) => {
      if (food.idMeal === id) {
        food.quantity = cart[id];
        food.subTotal = food.price * food.quantity;
        cartItems.push(food);
      }
    });
  });
  displayingCartItems(cartItems);
  totalsAmount();
}

function displayingCartItems(items) {
  items.forEach(
    ({ category, price, quantity, subTotal, strMealThumb, idMeal }) => {
      const tr = document.createElement("tr");
      tr.addEventListener("click", function (e) {
        const tr = this;
        changeItem(e, tr, idMeal, price);
      });
      tr.innerHTML = `
        
            <td>${category}</td>
            <td id="cartImg"><img src=${strMealThumb}></td>
            <td id="quantity">
              <button id="increment">+</button>
              <input value=${quantity} type="text" readonly />
              <button id="decrement">
                -
              </button>
            </td>
            <td><span id='subtotal'>${subTotal} Taka</span></td>
            <td id="removeItem"><i id="remove" class="fa-solid fa-xmark"></i></td>
          
        `;
      tBody.appendChild(tr);
    }
  );
}

function totalsAmount() {
  let total = 0;
  cartItems.forEach(({ subTotal }) => {
    totals.innerHTML = `${(total += subTotal)} Taka`;
  });
}

//remove,increment,decrement
function changeItem(e, tr, id, price) {
  const input = [...e.target.parentElement.children].find(
    (item) => item.type === "text"
  );

  const cart = getDataFromLocalStorage();
  if (e.target.id === "remove") {
    delete cart[id];
    let newArray = [];
    cartItems.filter((food) => {
      if (food.idMeal !== id) {
        newArray.push(food);
      }
    });
    cartItems = newArray;

    getTotalItems();
    totalsAmount();
    tr.remove();
  } else if (e.target.id === "increment") {
    input.value = Number(input.value) + 1;
    const subTotal = input.value * price;
    const sub = tr.querySelector("#subtotal");
    ++cart[id];
    sub.innerHTML = `${subTotal} Taka`;
    updateTotalAmount(id,subTotal)
  } else if (e.target.id === "decrement") {
    if (input.value === "1") return;
    input.value = Number(input.value) - 1;
    const subTotal = input.value * price;
    const sub = tr.querySelector("#subtotal");
    --cart[id];
    sub.innerHTML = `${subTotal} Taka`;
    updateTotalAmount(id,subTotal)
  }
  setDataOnLocalStorage(cart);
}

function updateTotalAmount(id,subTotal){
  cartItems.forEach((food) => {
    if (food.idMeal === id) {
      food.subTotal = subTotal;
      totalsAmount();
    }
  });
}