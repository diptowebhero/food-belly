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
        console.log(cartItems);
      }
    });
  });
  displayCartData()
}
function displayCartData(){
    cartItems.forEach(({strMeal,subTotal,quantity})=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${strMeal}</td>
            <td>
                <button class="increment"><i class="fas fa-plus"></i></button>
                <input value='${quantity}'type="text" readonly>
                <button class="decrement"><i class="fa-solid fa-minus"></i></button>
            </td>
            <td><span>${subTotal} Taka</span></td>
        `
        cartItemEl.appendChild(tr)
    })
}