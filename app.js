// ==========================================
// Waselha Store - وصلها ستور
// Full Firebase Integration & Product Management
// ==========================================

// 1. رابط قاعدة البيانات الافتراضي (Firebase Realtime Database)
const DEFAULT_FIREBASE_URL = 'https://waselha-store-default-rtdb.firebaseio.com/';

// الحصول على الرابط المحفوظ أو استخدام الرابط الافتراضي دائمًا
function getFirebaseUrl() {
    let savedUrl = localStorage.getItem('waselha_db_url');
    if (!savedUrl || savedUrl.trim() === '' || savedUrl.includes('null')) {
        savedUrl = DEFAULT_FIREBASE_URL;
        localStorage.setItem('waselha_db_url', savedUrl);
    }
    savedUrl = savedUrl.trim().replace(/^[|/\\s]+/, '');
    if (!savedUrl.startsWith('http://') && !savedUrl.startsWith('https://')) {
        savedUrl = 'https://' + savedUrl;
    }
    if (!savedUrl.endsWith('/')) {
        savedUrl += '/';
    }
    return savedUrl;
}

// 2. تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const firebaseUrl = getFirebaseUrl();
    
    const dbUrlInput = document.getElementById('db-url-input') || document.querySelector('input[type="text"]');
    const saveUrlBtn = document.getElementById('save-url-btn');
    
    if (dbUrlInput) {
        dbUrlInput.value = firebaseUrl;
    }

    if (saveUrlBtn) {
        saveUrlBtn.addEventListener('click', () => {
            let inputVal = dbUrlInput.value.trim();
            if (inputVal) {
                localStorage.setItem('waselha_db_url', inputVal);
                alert('تم حفظ رابط قاعدة البيانات بنجاح!');
                loadProducts();
            } else {
                localStorage.setItem('waselha_db_url', DEFAULT_FIREBASE_URL);
                alert('تم الاستعادة للرابط الافتراضي.');
                loadProducts();
            }
        });
    }

    // تحميل المنتجات
    loadProducts();

    // إعداد نموذج إضافة منتج جديد
    setupProductForm();
});

// 3. جلب وقراءة المنتجات من Firebase Realtime Database
async function loadProducts() {
    const firebaseUrl = getFirebaseUrl();
    const productsContainer = document.getElementById('products-container') || 
                              document.getElementById('productsList') || 
                              document.querySelector('.products-grid') ||
                              document.querySelector('.products-list');

    if (!productsContainer) return;

    try {
        productsContainer.innerHTML = '<p style="text-align:center; color:#888; width:100%;">جاري تحميل المنتجات...</p>';
        
        const response = await fetch(`${firebaseUrl}products.json`);
        if (!response.ok) {
            throw new Error('فشل في الاتصال بقاعدة البيانات');
        }

        const data = await response.json();
        productsContainer.innerHTML = '';

        if (!data || Object.keys(data).length === 0) {
            productsContainer.innerHTML = '<p style="text-align:center; color:#888; width:100%;">لا توجد منتجات حالياً.</p>';
            return;
        }

        Object.keys(data).forEach(id => {
            const product = data[id];
            if (product) {
                const card = createProductCard(id, product);
                productsContainer.appendChild(card);
            }
        });

    } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        productsContainer.innerHTML = '<p style="text-align:center; color:#ff4d4d; width:100%;">حدث خطأ أثناء تحميل البيانات.</p>';
    }
}

// 4. إنشاء كارت المنتج (لالمتجر ولوحة التحكم)
function createProductCard(id, product) {
    const isAdmin = window.location.pathname.includes('admin');
    const div = document.createElement('div');
    div.className = 'product-card';
    div.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid rgba(0,242,254,0.2); border-radius: 12px; padding: 15px; margin: 10px; text-align: right; position: relative; color: #fff; display: flex; flex-direction: column; justify-content: space-between;';

    const imgUrl = product.image || 'https://via.placeholder.com/300x200?text=Waselha+Store';
    const priceText = typeof product.price === 'number' ? product.price.toLocaleString() + ' IQD' : product.price;

    div.innerHTML = `
        <div style="width:100%; height:180px; overflow:hidden; border-radius:8px; margin-bottom:12px; background:#000;">
            <img src="${imgUrl}" alt="${product.name || product.title}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <h3 style="margin: 5px 0; font-size:1.2rem; color:#00f2fe;">${product.name || product.title || 'منتج بدون اسم'}</h3>
        <p style="color:#aaa; font-size:0.9rem; margin-bottom:10px;">${product.description || ''}</p>
        <div style="font-weight:bold; font-size:1.1rem; color:#4facfe; margin-bottom:12px;">${priceText}</div>
    `;

    if (isAdmin) {
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'حذف المنتج 🗑️';
        deleteBtn.style.cssText = 'background: #ff4d4d; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: auto;';
        deleteBtn.onclick = () => deleteProduct(id);
        div.appendChild(deleteBtn);
    } else {
        const orderBtn = document.createElement('a');
        orderBtn.innerText = 'اطلب الآن 🛒';
        orderBtn.href = `https://wa.me/?text=${encodeURIComponent('أود طلب منتج: ' + (product.name || product.title))}`;
        orderBtn.target = '_blank';
        orderBtn.style.cssText = 'background: linear-gradient(45deg, #00f2fe, #4facfe); color: #000; text-decoration: none; text-align: center; padding: 10px; border-radius: 6px; font-weight: bold; margin-top: auto; display: block;';
        div.appendChild(orderBtn);
    }

    return div;
}

// 5. إضافة منتج جديد إلى Firebase
function setupProductForm() {
    const form = document.getElementById('add-product-form') || document.getElementById('product-form') || document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('product-name') || form.querySelector('input[placeholder*="اسم"]') || form.querySelectorAll('input')[0];
        const priceInput = document.getElementById('product-price') || form.querySelector('input[placeholder*="السعر"]') || form.querySelectorAll('input')[1];
        const descInput = document.getElementById('product-desc') || form.querySelector('textarea') || form.querySelector('input[placeholder*="وصف"]');
        const imageInput = document.getElementById('product-image') || form.querySelector('input[type="file"]');

        if (!nameInput || !priceInput) {
            alert('يرجى ملء كافة الخانات المطلوبة!');
            return;
        }

        const name = nameInput.value.trim();
        const price = priceInput.value.trim();
        const description = descInput ? descInput.value.trim() : '';

        if (!name || !price) {
            alert('يرجى كتابة اسم المنتج والسعر!');
            return;
        }

        let imageUrl = 'https://via.placeholder.com/300x200?text=Waselha+Store';

        if (imageInput && imageInput.files && imageInput.files[0]) {
            const file = imageInput.files[0];
            imageUrl = await convertFileToBase64(file);
        }

        const newProduct = {
            name: name,
            title: name,
            price: price,
            description: description,
            image: imageUrl,
            createdAt: new Date().toISOString()
        };

        const firebaseUrl = getFirebaseUrl();

        try {
            const response = await fetch(`${firebaseUrl}products.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                alert('تمت إضافة المنتج بنجاح إلى كافة الأجهزة! 🎉');
                form.reset();
                loadProducts();
            } else {
                alert('حدث خطأ أثناء حفظ المنتج في Firebase!');
            }
        } catch (err) {
            console.error('خطأ الإضافة:', err);
            alert('تعذر الاتصال بقاعدة البيانات.');
        }
    });
}

// 6. حذف منتج من Firebase Realtime Database
async function deleteProduct(productId) {
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذا المنتج نهائياً من كافة الأجهزة؟')) {
        return;
    }

    const firebaseUrl = getFirebaseUrl();

    try {
        const response = await fetch(`${firebaseUrl}products/${productId}.json`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('تم حذف المنتج بنجاح! 🗑️');
            loadProducts();
        } else {
            alert('فشل عملية الحذف من قاعدة البيانات.');
        }
    } catch (err) {
        console.error('خطأ الحذف:', err);
        alert('حدث خطأ أثناء الحذف.');
    }
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
