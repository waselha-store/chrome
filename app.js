function toggleMenu() { document.getElementById('dropdownMenu').classList.toggle('show'); }
function toggleSubmenu(e) { e.stopPropagation(); document.getElementById('contactSubmenu').classList.toggle('show'); }
function orderProduct(name) { window.open(`https://wa.me/9647850281586?text=مرحباً، أود طلب المنتج: ${name}`, '_blank'); }

// منطق الأدمن
function login() {
    if(document.getElementById('email')?.value === "ali_haider123321@gmail.com" && document.getElementById('pass')?.value === "admin ali haider") {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('panel').style.display = 'block';
    } else { alert("خطأ!"); }
}

function addP() {
    const fileInput = document.getElementById('pImg');
    const reader = new FileReader();
    reader.onload = function(e) {
        const products = JSON.parse(localStorage.getItem('waselha_products') || '[]');
        products.push({name: document.getElementById('pName').value, desc: document.getElementById('pDesc').value, price: document.getElementById('pPrice').value, img: e.target.result});
        localStorage.setItem('waselha_products', JSON.stringify(products));
        alert('تمت الإضافة بنجاح');
    };
    reader.readAsDataURL(fileInput.files[0]);
}

// عرض المنتجات
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    const products = JSON.parse(localStorage.getItem('waselha_products') || '[]');
    grid.innerHTML = products.length === 0 ? '<p style="text-align:center; color:#aaa;">لا توجد منتجات حالياً.</p>' : '';
    products.forEach(p => {
        grid.innerHTML += `<div class="product-card"><img src="${p.img}"><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><p>${p.price}</p><button class="btn-gold" onclick="orderProduct('${p.name}')">طلب المنتج</button></div></div>`;
    });
}