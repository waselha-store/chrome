// نظام بسيط لعرض المنتجات من التخزين المحلي
function loadProducts() {
    const container = document.getElementById('product-container');
    if(!container) return;
    
    // بيانات تجريبية إذا كان المتجر فارغاً
    let products = JSON.parse(localStorage.getItem('my_products') || '[]');
    
    if(products.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding:50px;'>لا توجد منتجات حالياً.</p>";
        return;
    }

    container.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.img}" alt="منتج">
            <h3>${p.name}</h3>
            <p style="color:var(--accent); font-weight:bold;">${p.price} IQD</p>
            <button class="btn-action" onclick="window.open('https://wa.me/9647850281586')">اطلب الآن</button>
        </div>
    `).join('');
}

function login() {
    let u = document.getElementById('user').value;
    let p = document.getElementById('pass').value;
    // استبدل ببياناتك الحقيقية
    if(u === "admin" && p === "123") {
        alert("تم الدخول بنجاح");
        window.location.href = "dashboard.html"; // توجه لصفحة التحكم
    } else {
        alert("خطأ في البيانات");
    }
}

// تنفيذ عند التحميل
window.onload = loadProducts;
