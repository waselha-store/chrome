// Default initial products
const defaultProducts = [
    {
        name: "ستاند أكريليك NFC للمطاعم",
        price: "15,000 IQD",
        desc: "ستاند فاخر لعرض المنيو وتقييمات Google بحجم مثالي لطاولات المطاعم.",
        img: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&q=80"
    },
    {
        name: "ستاند أستيل NFC الفاخر",
        price: "25,000 IQD",
        desc: "ستاند مقاوم للصدأ بتصميم أنيق يناسب الفنادق والمطاعم الراقية.",
        img: "https://images.unsplash.com/photo-1556742049-0a670f4a45a1?w=500&q=80"
    }
];

// Menu Toggle
function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    if (menu) menu.classList.toggle("show");
}

// Store Initializer
function initStore() {
    const container = document.getElementById("productsGrid");
    if (!container) return;

    let products = JSON.parse(localStorage.getItem("waselha_products"));
    if (!products || products.length === 0) {
        localStorage.setItem("waselha_products", JSON.stringify(defaultProducts));
        products = defaultProducts;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div>
                <img src="${product.img}" class="product-img" alt="${product.name}">
                <div class="product-title">${product.name}</div>
                <div class="product-desc">${product.desc || 'منتج NFC ممتاز للمطاعم والكافيهات'}</div>
            </div>
            <div>
                <div class="product-price">${product.price}</div>
                <a href="https://wa.me/9647850281586?text=${encodeURIComponent('مرحباً، أريد طلب: ' + product.name)}" target="_blank" class="btn-primary">اطلب الآن</a>
            </div>
        </div>
    `).join('');
}

// Login Handling
function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (user === "admin123" && pass === "123321") {
        localStorage.setItem("waselha_auth", "true");
        checkAuthStatus();
    } else {
        alert("اسم المستخدم أو كلمة المرور غير صحيحة!");
    }
}

// Auth Status Checking
function checkAuthStatus() {
    const isAuth = localStorage.getItem("waselha_auth") === "true";
    const loginCard = document.getElementById("loginCard");
    const dashCard = document.getElementById("dashboardCard");

    if (loginCard && dashCard) {
        if (isAuth) {
            loginCard.style.display = "none";
            dashCard.style.display = "block";
            renderAdminTable();
        } else {
            loginCard.style.display = "block";
            dashCard.style.display = "none";
        }
    }
}

// Add New Product with Image Reader
function addNewProduct() {
    const name = document.getElementById("pName").value.trim();
    const price = document.getElementById("pPrice").value.trim();
    const desc = document.getElementById("pDesc").value.trim();
    const fileInput = document.getElementById("pImgFile");

    if (!name || !price) {
        alert("يرجى كتابة اسم المنتج والسعر على الأقل!");
        return;
    }

    const saveAndRefresh = (imgSrc) => {
        let products = JSON.parse(localStorage.getItem("waselha_products")) || [];
        products.push({
            name: name,
            price: price,
            desc: desc,
            img: imgSrc || "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&q=80"
        });
        localStorage.setItem("waselha_products", JSON.stringify(products));
        renderAdminTable();
        alert("تمت إضافة المنتج بنجاح!");

        // Reset Inputs
        document.getElementById("pName").value = '';
        document.getElementById("pPrice").value = '';
        document.getElementById("pDesc").value = '';
        if (fileInput) fileInput.value = '';
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveAndRefresh(e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveAndRefresh(null);
    }
}

// Render Table in Admin
function renderAdminTable() {
    const tbody = document.getElementById("adminTableBody");
    if (!tbody) return;

    let products = JSON.parse(localStorage.getItem("waselha_products")) || [];

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-secondary);">لا توجد منتجات حالياً</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map((p, index) => `
        <tr>
            <td><img src="${p.img}" class="table-thumb" alt="صورة"></td>
            <td><strong>${p.name}</strong></td>
            <td style="color: var(--text-secondary); font-size: 13px;">${p.desc || '-'}</td>
            <td>
                <input type="text" id="price-input-${index}" class="price-input" value="${p.price}">
                <br>
                <button onclick="updatePrice(${index})" class="btn-update">تحديث السعر</button>
            </td>
            <td>
                <button onclick="deleteProduct(${index})" class="btn-danger">حذف</button>
            </td>
        </tr>
    `).join('');
}

// Update Price Action
function updatePrice(index) {
    const newPrice = document.getElementById(`price-input-${index}`).value.trim();
    if (!newPrice) {
        alert("يرجى إدخال السعر الجديد!");
        return;
    }

    let products = JSON.parse(localStorage.getItem("waselha_products")) || [];
    products[index].price = newPrice;
    localStorage.setItem("waselha_products", JSON.stringify(products));
    alert("تم تحديث السعر بنجاح!");
    renderAdminTable();
}

// Delete Product Action
function deleteProduct(index) {
    if (confirm("هل أنت تأكد من رغبتك في حذف هذا المنتج؟")) {
        let products = JSON.parse(localStorage.getItem("waselha_products")) || [];
        products.splice(index, 1);
        localStorage.setItem("waselha_products", JSON.stringify(products));
        renderAdminTable();
    }
}

// Logout
function handleLogout() {
    localStorage.removeItem("waselha_auth");
    checkAuthStatus();
}
