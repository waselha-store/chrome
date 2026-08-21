// ... (الوظائف القديمة كما هي، أضف هذه الوظائف الجديدة)

function login() {
    if(document.getElementById('email').value === "ali_haider123321@gmail.com" && document.getElementById('pass').value === "admin ali haider") {
        localStorage.setItem('isLoggedIn', 'true');
        location.reload();
    } else { alert("بيانات خاطئة!"); }
}

function renderTable() {
    const products = JSON.parse(localStorage.getItem('waselha_products') || '[]');
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';
    products.forEach((p, index) => {
        tbody.innerHTML += `<tr>
            <td>${index + 1}</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${index})">تعديل</button>
                <button class="btn-del" onclick="deleteProduct(${index})">حذف</button>
            </td>
        </tr>`;
    });
}

function saveProduct() {
    const editId = document.getElementById('editId').value;
    const products = JSON.parse(localStorage.getItem('waselha_products') || '[]');
    const file = document.getElementById('pImg').files[0];
    
    if (editId !== "") {
        // تحديث منتج موجود
        const p = products[editId];
        p.name = document.getElementById('pName').value;
        p.desc = document.getElementById('pDesc').value;
        p.price = document.getElementById('pPrice').value;
        if(file) { /* تحديث الصورة منطق إضافي */ }
        products[editId] = p;
        document.getElementById('saveBtn').innerText = "حفظ المنتج";
        document.getElementById('editId').value = "";
    } else {
        // إضافة جديد
        const reader = new FileReader();
        reader.onload = function(e) {
            products.push({name: document.getElementById('pName').value, desc: document.getElementById('pDesc').value, price: document.getElementById('pPrice').value, img: e.target.result});
            localStorage.setItem('waselha_products', JSON.stringify(products));
            location.reload();
        };
        reader.readAsDataURL(file);
        return;
    }
    localStorage.setItem('waselha_products', JSON.stringify(products));
    location.reload();
}

function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem('waselha_products'));
    products.splice(index, 1);
    localStorage.setItem('waselha_products', JSON.stringify(products));
    renderTable();
}

function editProduct(index) {
    const products = JSON.parse(localStorage.getItem('waselha_products'));
    const p = products[index];
    document.getElementById('pName').value = p.name;
    document.getElementById('pDesc').value = p.desc;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('editId').value = index;
    document.getElementById('saveBtn').innerText = "تحديث المنتج";
    document.getElementById('formTitle').innerText = "تعديل بيانات المنتج";
}
