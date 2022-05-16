const cartItemEl = document.getElementById("cartItem");

const cartLength = () => {
  const cart = getDataOnLocalStorage();
  const itemsArray = Object.keys(cart);
  totalCart.textContent = itemsArray.length;
};
cartLength();
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

//Store Array
let cartItems = [];

//get data
async function loadFoodItem() {
  const res = await fetch("../data/allCategories.json");
  const data = await res.json();
  getFoodItem(data);
}
loadFoodItem();

function getFoodItem({ meals }) {
  const cart = getDataOnLocalStorage();

  const itemsArray = Object.keys(cart);
  itemsArray.forEach((id) => {
    meals.forEach((food) => {
      if (food.idMeal === id) {
        food.quantity = cart[id];
        food.subTotal = food.price * food.quantity;
        cartItems.push(food);
      }
    });
  });
  displayCartData();
}
//display cart data
function displayCartData() {
  cartItems.forEach(({ strMeal, subTotal, quantity, idMeal, price }) => {
    const tr = document.createElement("tr");
    tr.addEventListener("click", function (e) {
      const tr = this;
      changeItem(tr, idMeal, e, price);
    });
    tr.innerHTML = `
        <td>${strMeal}</td>
            <td>
                <button id="increment" >+</button>
                <input value='${quantity}'type="text" readonly>
                <button id="decrement">-</button>
            </td>
            <td><span id="subTotalTk">${subTotal}</span> Taka</td>
            <td id="removeItem"><i id="remove" class="fa-solid fa-xmark"></i></td>
        `;
    cartItemEl.appendChild(tr);
  });
  getSubTotal();
}

//total
function getSubTotal() {
  let total = 0;
  cartItems.forEach(({ subTotal }) => {
    total += subTotal;
  });
  document.getElementById("subTotal").innerText = total;
}

//remove, quantity increment, decrement
function changeItem(tr, id, e, price) {
  const input = [...e.target.parentElement.children].find(
    (el) => el.type === "text"
  );
  const cart = getDataOnLocalStorage();
  if (e.target.id === "remove") {
    delete cart[id];
   
    let newArray = [];
    cartItems.filter((food) => {
      if (food.idMeal !== id) {
        newArray.push(food);
      }
    });
    cartItems = newArray;
    cartLength();
    getSubTotal();
    tr.remove();
  } else if (e.target.id === "increment") {
    input.value = Number(input.value) + 1;
    const subTotal = input.value * price;
    
    const sub = tr.querySelector("#subTotalTk");
    ++cart[id];
    cartItems.forEach(food=>{
      if(food.idMeal === id){
        food.subTotal = subTotal;
        getSubTotal()
      }
    })
    sub.innerText = subTotal;
  } else if (e.target.id === "decrement") {
    if (input.value === "1") return;
    input.value = Number(input.value) - 1;
    const subTotal = input.value * price;
    --cart[id]
    const sub = tr.querySelector("#subTotalTk");
    sub.innerText = subTotal;
    --cart[id]
    cartItems.forEach(food=>{
      if(food.idMeal === id){
        food.subTotal = subTotal;
        getSubTotal()
      }
    })
  }
  setDataLocalStorage(cart);
}
