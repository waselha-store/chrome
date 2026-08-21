// Default initial items so store is never empty
const initialProducts = [
    {
        name: "ستاند أكريليك NFC للمطاعم",
        price: "15,000 IQD",
        desc: "ستاند أكريليك فاخر لعرض المنيو وتقييمات Google بحجم مثالي لطاولات المطاعم.",
        img: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&q=80"
    },
    {
        name: "ستاند أستيل NFC الفاخر",
        price: "25,000 IQD",
        desc: "ستاند مقاوم للصدأ بتصميم أنيق يناسب الفنادق والمطاعم الراقية.",
        img: "https://images.unsplash.com/photo-1556742049-0a670f4a45a1?w=500&q=80"
    }
];

// Dropdown menu toggle
function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    if (menu) {
        menu.classList.toggle("show");
    }
}

// Close menu when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.three-dots-btn')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Load and display products in Home Page
function initStore() {
    const container = document.getElementById("productsGrid");
    if (!container) return;

    let products = JSON.parse(localStorage.getItem("waselha_products"));
    
    if (!products || products.length === 0) {
        localStorage.setItem("waselha_products", JSON.stringify(initialProducts));
        products = initialProducts;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.desc || 'منتج NFC عالي الجودة'}</p>
                <div class="product-price">${product.price}</div>
                <a href="https://wa.me/9647850281586?text=${encodeURIComponent('مرحباً، أريد طلب: ' + product.name)}" target="_blank" class="btn-primary">اطلب الآن</a>
            </div>
        </div>
    `).join('');
}

// Auth Login Function
function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (user === "admin" && pass === "123") {
        localStorage.setItem("waselha_auth", "true");
        checkAuthStatus();
    } else {
        alert("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
}

// Check Login Status on admin page
function checkAuthStatus() {
    const isAuth = localStorage.getItem("waselha_auth") === "true";
    const loginSec = document.getElementById("loginSection");
    const dashSec = document.getElementById("dashboardSection");

    if (loginSec && dashSec) {
        if (isAuth) {
            loginSec.style.display = "none";
            dashSec.style.display = "flex";
            renderAdminTable();
        } else {
            loginSec.style.display = "flex";
            dashSec.style.display = "none";
        }
    }
}

// Render Table in Admin Panel
function renderAdminTable() {
    const tbody = document.getElementById("adminTableBody");
    if (!tbody) return;

    let products = JSON.parse(localStorage.getItem("waselha_products")) || [];
    tbody.innerHTML = products.map((p, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>
                <button class="btn-danger" onclick="deleteProduct(${index})">حذف</button>
            </td>
        </tr>
    `).join('');
}

// Add New Product
function addNewProduct() {
    const name = document.getElementById("pName").value.trim();
    const price = document.getElementById("pPrice").value.trim();
    const desc = document.getElementById("pDesc").value.trim();
    const fileInput = document.getElementById("pImg");

    if (!name || !price) {
        alert("يرجى إدخال اسم المنتج والسعر");
        return;
    }

    const save = (imgData) => {
        let products = JSON.parse(localStorage.getItem("waselha_products")) || [];
        products.push({
            name: name,
            price: price,
            desc: desc,
            img: imgData || "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&q=80"
        });
        localStorage.setItem("waselha_products", JSON.stringify(products));
        renderAdminTable();
        alert("تمت إضافة المنتج بنجاح");
        document.getElementById("pName").value = '';
        document.getElementById("pPrice").value = '';
        document.getElementById("pDesc").value = '';
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            save(e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        save(null);
    }
}

// Delete Product
function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("waselha_products")) || [];
    products.splice(index, 1);
    localStorage.setItem("waselha_products", JSON.stringify(products));
    renderAdminTable();
}

// Logout
function handleLogout() {
    localStorage.removeItem("waselha_auth");
    checkAuthStatus();
}
