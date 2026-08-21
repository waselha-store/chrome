// القائمة المنسدلة
function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    if (menu) menu.classList.toggle("show");
}

// الحصول على رابط قاعدة البيانات إن وجد
function getDbUrl() {
    let url = localStorage.getItem("waselha_db_url") || "";
    if (url && !url.endsWith("/")) url += "/";
    return url;
}

function saveDbUrl() {
    const input = document.getElementById("dbUrlInput").value.trim();
    localStorage.setItem("waselha_db_url", input);
    alert("تم حفظ رابط قاعدة البيانات السحابية بنجاح!");
    initStore();
    if (typeof renderAdminTable === "function") renderAdminTable();
}

// جلب المنتجات (من السيرفر أو المحرز المحلي)
async function fetchProducts() {
    const dbUrl = getDbUrl();
    if (dbUrl) {
        try {
            const res = await fetch(dbUrl + "products.json");
            const data = await res.json();
            if (!data) return [];
            // تحويل الكائن إلى مصفوفة مع الإبقاء على المعرف ID
            return Object.keys(data).map(key => ({ id: key, ...data[key] }));
        } catch (e) {
            console.error("Firebase Error:", e);
        }
    }
    // في حال عدم وجود سيرفر سحابي
    return JSON.parse(localStorage.getItem("waselha_products")) || [];
}

// حفظ المنتجات محلياً فقط في حال عدم وجود سيرفر
function saveLocalProducts(products) {
    localStorage.setItem("waselha_products", JSON.stringify(products));
}

// عرض المنتجات في الواجهة الرئيسية
async function initStore() {
    const container = document.getElementById("productsGrid");
    if (!container) return;

    container.innerHTML = `<p style="color: var(--text-secondary); text-align:center; grid-column: 1/-1;">جاري تحميل المنتجات...</p>`;

    const products = await fetchProducts();

    if (products.length === 0) {
        container.innerHTML = `<p style="color: var(--text-secondary); text-align:center; grid-column: 1/-1;">لا توجد منتجات معروضة حالياً.</p>`;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div>
                <img src="${product.img || 'https://via.placeholder.com/300x200?text=No+Image'}" class="product-img" alt="${product.name}">
                <div class="product-title">${product.name}</div>
                <div class="product-desc">${product.desc || '-'}</div>
            </div>
            <div>
                <div class="product-price">${product.price}</div>
                <a href="https://wa.me/9647850281586?text=${encodeURIComponent('مرحباً، أريد طلب: ' + product.name)}" target="_blank" class="btn-primary">اطلب الآن</a>
            </div>
        </div>
    `).join('');
}

// تسجيل الدخول
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

// ضغط الصورة تلقائياً لحل مشكلة التعليق والبطء
function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 500;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// إضافة منتج جديد
async function addNewProduct() {
    const name = document.getElementById("pName").value.trim();
    const price = document.getElementById("pPrice").value.trim();
    const desc = document.getElementById("pDesc").value.trim();
    const fileInput = document.getElementById("pImgFile");
    const addBtn = document.getElementById("addBtn");

    if (!name || !price) {
        alert("يرجى كتابة اسم المنتج والسعر!");
        return;
    }

    addBtn.innerText = "جاري الحفظ...";
    addBtn.disabled = true;

    const processSave = async (imgSrc) => {
        const newProduct = {
            name: name,
            price: price,
            desc: desc,
            img: imgSrc || "https://via.placeholder.com/300x200?text=Waselha+NFC"
        };

        const dbUrl = getDbUrl();
        if (dbUrl) {
            try {
                await fetch(dbUrl + "products.json", {
                    method: "POST",
                    body: JSON.stringify(newProduct),
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e) {
                console.error("Firebase save error:", e);
            }
        } else {
            let products = JSON.parse(localStorage.getItem("waselha_products")) || [];
            products.push({ id: Date.now().toString(), ...newProduct });
            saveLocalProducts(products);
        }

        alert("تمت إضافة المنتج بنجاح!");
        document.getElementById("pName").value = '';
        document.getElementById("pPrice").value = '';
        document.getElementById("pDesc").value = '';
        if (fileInput) fileInput.value = '';

        addBtn.innerText = "إضافة المنتج إلى المتجر";
        addBtn.disabled = false;
        renderAdminTable();
    };

    if (fileInput && fileInput.files && fileInput.files[0]) {
        compressImage(fileInput.files[0], (compressedData) => {
            processSave(compressedData);
        });
    } else {
        processSave(null);
    }
}

// عرض الجدول في لوحة الأدمن
async function renderAdminTable() {
    const tbody = document.getElementById("adminTableBody");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">جاري جلب المنتجات...</td></tr>`;

    const products = await fetchProducts();

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-secondary);">لا توجد منتجات حالياً. أضف منتجك الأول من الأعلى!</td></tr>`;
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
                <button onclick="updatePrice('${p.id || index}', ${index})" class="btn-update">تحديث السعر</button>
            </td>
            <td>
                <button onclick="deleteProduct('${p.id || index}', ${index})" class="btn-danger">حذف</button>
            </td>
        </tr>
    `).join('');
}

// تحديث السعر
async function updatePrice(id, index) {
    const newPrice = document.getElementById(`price-input-${index}`).value.trim();
    if (!newPrice) return alert("يرجى إدخال السعر!");

    const dbUrl = getDbUrl();
    if (dbUrl && id) {
        await fetch(`${dbUrl}products/${id}.json`, {
            method: "PATCH",
            body: JSON.stringify({ price: newPrice }),
            headers: { "Content-Type": "application/json" }
        });
    } else {
        let products = JSON.parse(localStorage.getItem("waselha_products")) || [];
        if (products[index]) {
            products[index].price = newPrice;
            saveLocalProducts(products);
        }
    }
    alert("تم تحديث السعر بنجاح!");
    renderAdminTable();
}

// حذف المنتج بشكل نهائي وفعال
async function deleteProduct(id, index) {
    if (!confirm("هل أنت تأكد من حذف هذا المنتج بشكل نهائي؟")) return;

    const dbUrl = getDbUrl();
    if (dbUrl && id) {
        await fetch(`${dbUrl}products/${id}.json`, { method: "DELETE" });
    } else {
        let products = JSON.parse(localStorage.getItem("waselha_products")) || [];
        products.splice(index, 1);
        saveLocalProducts(products);
    }

    alert("تم الحذف بنجاح!");
    renderAdminTable();
}

function handleLogout() {
    localStorage.removeItem("waselha_auth");
    checkAuthStatus();
}
