const cartLength = () => {
  const cart = getDataOnLocalStorage();
  const itemsArray = Object.keys(cart);
  totalCart.textContent = itemsArray.length;
};
cartLength()
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
let cartItems = []
//load data
async function loadData(){
  const res = await fetch('../data/allCategories.json');
  const {meals}= await res.json();
  const cart = getDataOnLocalStorage();
  const itemsArray = Object.keys(cart);
  itemsArray.forEach(id=>{
    meals.forEach(food=>{
      if(food.idMeal === id){
        food.quantity = cart[id];
        food.subTotal = food.price * food.quantity;
        cartItems.push(food);
      }
    })
  })
  displayCartItems()
}
loadData();

function displayCartItems(){
  const cart = getDataOnLocalStorage();
  cartItems.forEach(food=>{
    console.log(food);
  })
}