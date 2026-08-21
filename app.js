// حفظ المنتجات
function saveProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const desc = document.getElementById('pDesc').value;
    const file = document.getElementById('pImg').files[0];
    
    if(!name || !price) return alert("يرجى ملء البيانات");

    const reader = new FileReader();
    reader.onload = function(e) {
        let products = JSON.parse(localStorage.getItem('waselha_products') || '[]');
        products.push({name, price, desc, img: e.target.result});
        localStorage.setItem('waselha_products', JSON.stringify(products));
        alert('تمت الإضافة!');
        location.reload();
    };
    reader.readAsDataURL(file);
}

// عرض المنتجات في المتجر
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    const products = JSON.parse(localStorage.getItem('waselha_products') || '[]');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}">
            <div class="info">
                <div class="title">${p.name}</div>
                <div class="price">${p.price} IQD</div>
                <button class="btn-buy" onclick="window.open('https://wa.me/9647850281586?text=مرحباً، أريد طلب: ${p.name}')">طلب عبر الواتساب</button>
            </div>
        </div>
    `).join('');
}

// عرض الجدول في الأدمن
function renderTable() {
    const tbody = document.getElementById('productTableBody');
    if(!tbody) return;
    let products = JSON.parse(localStorage.getItem('waselha_products') || '[]');
    tbody.innerHTML = products.map((p, i) => `
        <tr>
            <td>${i+1}</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td class="actions">
                <button style="background:#e74c3c" onclick="deleteProduct(${i})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function deleteProduct(i) {
    let products = JSON.parse(localStorage.getItem('waselha_products'));
    products.splice(i, 1);
    localStorage.setItem('waselha_products', JSON.stringify(products));
    renderTable();
}

function login() {
    if(document.getElementById('email').value === "ali@admin.com" && document.getElementById('pass').value === "1234") {
        localStorage.setItem('logged', 'true');
        location.reload();
    } else { alert("خطأ!"); }
}

// التحقق من الدخول
if(window.location.pathname.includes('admin.html')) {
    if(localStorage.getItem('logged') === 'true') {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('panel').style.display = 'block';
        renderTable();
    }
}
