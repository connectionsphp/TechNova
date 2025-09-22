const products = [
  { id:1, name:"Laptop MSI Gaming", price:35999, stock:5, img:"https://via.placeholder.com/250x180" },
  { id:2, name:"Motherboard ASUS ROG", price:8499, stock:8, img:"https://via.placeholder.com/250x180" },
  { id:3, name:"GPU MSI RTX 4070", price:18999, stock:3, img:"https://via.placeholder.com/250x180" },
];

const productList = document.getElementById("productList");
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
let cart = [];

function renderProducts(){
  if(!productList) return;
  productList.innerHTML="";
  products.forEach(p=>{
    const div=document.createElement("div");
    div.className="product";
    div.innerHTML=`
      <img src="${p.img}">
      <h4>${p.name}</h4>
      <p>Stock: <strong id="stock-${p.id}">${p.stock}</strong></p>
      <p class="price">$${p.price.toLocaleString()} MXN</p>
      <button id="add-${p.id}" ${p.stock===0?"disabled":""}>Agregar</button>`;
    div.querySelector("button").addEventListener("click",()=>addToCart(p.id));
    productList.appendChild(div);
  });
}
function addToCart(id){
  const product = products.find(x=>x.id===id);
  if(!product || product.stock<=0) return;
  const item = cart.find(i=>i.id===id);
  if(item){
    if(item.qty<product.stock+item.qty){
      item.qty++; product.stock--;
    }
  }else{
    cart.push({...product,qty:1}); product.stock--;
  }
  updateCart(); renderProducts();
}
function removeFromCart(id){
  const idx = cart.findIndex(i=>i.id===id);
  if(idx>=0){
    products.find(p=>p.id===id).stock += cart[idx].qty;
    cart.splice(idx,1);
  }
  updateCart(); renderProducts();
}
function updateCart(){
  if(!cartItems) return;
  cartItems.innerHTML="";
  let total=0;
  cart.forEach(item=>{
    total += item.price*item.qty;
    const row=document.createElement("div");
    row.className="cart-row";
    row.innerHTML=`<p>${item.name} x${item.qty}</p>
                   <p>$${(item.price*item.qty).toLocaleString()}
                   <button class="close">&times;</button></p>`;
    row.querySelector("button").addEventListener("click",()=>removeFromCart(item.id));
    cartItems.appendChild(row);
  });
  if(cartTotal) cartTotal.textContent = total.toLocaleString();
  if(cartCount) cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
}
if(cartBtn) cartBtn.onclick=()=>cartModal.classList.remove("hidden");
if(closeCart) closeCart.onclick=()=>cartModal.classList.add("hidden");
renderProducts();