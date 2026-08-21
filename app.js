function addProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const file = document.getElementById('pImg').files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        let prods = JSON.parse(localStorage.getItem('my_prods') || '[]');
        prods.push({name, price, img: e.target.result});
        localStorage.setItem('my_prods', JSON.stringify(prods));
        location.reload();
    };
    reader.readAsDataURL(file);
}

function displayProducts() {
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    let prods = JSON.parse(localStorage.getItem('my_prods') || '[]');
    grid.innerHTML = prods.map(p => `
        <div class="card">
            <img src="${p.img}">
            <div class="card-body">
                <p><b>${p.name}</b></p>
                <p style="color:var(--accent)">${p.price} IQD</p>
                <button class="btn-order" onclick="window.open('https://wa.me/9647850281586')">اطلب الآن</button>
            </div>
        </div>
    `).join('');
}

function renderAdminTable() {
    const tbody = document.getElementById('tableBody');
    if(!tbody) return;
    let prods = JSON.parse(localStorage.getItem('my_prods') || '[]');
    tbody.innerHTML = prods.map((p, i) => `
        <tr><td>${i+1}</td><td>${p.name}</td><td>${p.price}</td>
        <td><button onclick="deleteP(${i})" style="color:red; background:none; border:none;">حذف</button></td></tr>
    `).join('');
}

function deleteP(i) {
    let prods = JSON.parse(localStorage.getItem('my_prods'));
    prods.splice(i, 1);
    localStorage.setItem('my_prods', JSON.stringify(prods));
    renderAdminTable();
}

function login() {
    if(document.getElementById('email').value === "admin" && document.getElementById('pass').value === "123") {
        localStorage.setItem('isLogged', 'true');
        location.reload();
    }
}

if(location.pathname.includes('admin.html') && localStorage.getItem('isLogged') === 'true') {
    document.getElementById('loginArea').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderAdminTable();
}
