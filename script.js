const products = [
 {id:1,name:"Studio Wireless Headphones",category:"Electronics",price:2499,old:3299,rating:4.8,badge:"BESTSELLER",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30b?w=700"},
 {id:2,name:"Everyday Canvas Tote",category:"Fashion",price:699,old:899,rating:4.6,badge:"NEW",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=700"},
 {id:3,name:"Minimal Ceramic Vase",category:"Home",price:899,old:1199,rating:4.7,badge:"",image:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=700"},
 {id:4,name:"Classic Timepiece",category:"Accessories",price:1899,old:2499,rating:4.5,badge:"POPULAR",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"},
 {id:5,name:"Smart Fitness Watch",category:"Electronics",price:3299,old:4299,rating:4.7,badge:"SALE",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"},
 {id:6,name:"Soft Knit Sweater",category:"Fashion",price:1499,old:1899,rating:4.6,badge:"",image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700"},
 {id:7,name:"Modern Desk Lamp",category:"Home",price:1299,old:1699,rating:4.4,badge:"",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700"},
 {id:8,name:"Everyday Sunglasses",category:"Accessories",price:999,old:1399,rating:4.8,badge:"TRENDING",image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700"}
];
// Replace a deliberately invalid image URL with a reliable product photo.
products[6].image = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700";

const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
let activeCategory = "All";
let searchTerm = "";
let cart = JSON.parse(localStorage.getItem("nexstore-cart") || "[]");

const grid = document.getElementById("productGrid");
const empty = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function visibleProducts(){
 let list = products.filter(p => (activeCategory==="All" || p.category===activeCategory) && (p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm)));
 const sort = document.getElementById("sortSelect").value;
 if(sort==="low") list.sort((a,b)=>a.price-b.price);
 if(sort==="high") list.sort((a,b)=>b.price-a.price);
 if(sort==="rating") list.sort((a,b)=>b.rating-a.rating);
 return list;
}
function renderProducts(){
 const list = visibleProducts();
 resultCount.textContent = `Showing ${list.length} product${list.length===1?"":"s"}`;
 empty.hidden = list.length>0;
 grid.innerHTML = list.map(p=>`
  <article class="product-card">
   <div class="product-image">
    <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/600x600/f2f5ed/52634b?text=NexStore'">
    ${p.badge?`<span class="product-badge">${p.badge}</span>`:""}
    <button class="quick-add" onclick="addToCart(${p.id})">＋ Add to cart</button>
   </div>
   <div class="product-info"><div class="product-category">${p.category}</div><h3>${p.name}</h3>
    <div class="rating">★★★★★ <span>${p.rating} / 5</span></div>
    <div class="price-row"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span></div>
   </div>
  </article>`).join("");
}
function saveCart(){localStorage.setItem("nexstore-cart",JSON.stringify(cart));renderCart();}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();showToast("Added to your cart");}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart();}
function renderCart(){
 const count=cart.reduce((sum,x)=>sum+x.qty,0);
 document.getElementById("cartCount").textContent=count;
 document.getElementById("drawerCount").textContent=`(${count})`;
 const total=cart.reduce((sum,x)=>sum+products.find(p=>p.id===x.id).price*x.qty,0);
 document.getElementById("subtotal").textContent=money(total);
 const holder=document.getElementById("cartItems");
 if(!cart.length){holder.innerHTML='<div class="cart-empty">Your cart is taking a little break.<br><br>Find something you love and add it here.</div>';return;}
 holder.innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-line">
  <img src="${p.image}" alt="${p.name}">
  <div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="qty"><button onclick="changeQty(${p.id},-1)" aria-label="Decrease quantity">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)" aria-label="Increase quantity">+</button></div><button class="remove" onclick="removeItem(${p.id})">Remove</button></div>
  <span class="line-price">${money(p.price*x.qty)}</span>
 </div>`}).join("");
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show");cartDrawer.setAttribute("aria-hidden","false");}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show");cartDrawer.setAttribute("aria-hidden","true");}
let toastTimer;
function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200);}

document.getElementById("categories").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(!btn)return;activeCategory=btn.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===btn));renderProducts();});
document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();searchTerm=document.getElementById("searchInput").value.trim().toLowerCase();renderProducts();document.getElementById("shop").scrollIntoView({behavior:"smooth"});});
document.getElementById("searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts();});
document.getElementById("sortSelect").addEventListener("change",renderProducts);
document.getElementById("resetBtn").addEventListener("click",()=>{activeCategory="All";searchTerm="";document.getElementById("searchInput").value="";document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));renderProducts();});
document.getElementById("cartBtn").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("continueShopping").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!cart.length){showToast("Your cart is empty");return;}showToast("Demo checkout: connect a payment gateway to accept orders.");});
document.getElementById("accountBtn").addEventListener("click",()=>showToast("Account sign-in can be added in the next version."));
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("newsletterMessage").textContent="You're on the list — thanks for joining!";document.getElementById("emailInput").value="";});
renderProducts();renderCart();
