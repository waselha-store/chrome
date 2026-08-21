// القائمة المنسدلة
function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    if (menu) menu.classList.toggle("show");
}

// التحقق من بيانات الدخول
function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    // التحقق من يوزر وباسورد الأدمن
    if (user === "admin123" && pass === "123321") {
        localStorage.setItem("waselha_auth", "true");
        checkAuthStatus();
    } else {
        // أي حساب آخر يسجل كـ زبون فقط
        alert("مرحباً بك عزيزي الزبون! تم تسجيل دخولك بنجاح في متجر وصلها.");
        window.location.href = "index.html";
    }
}

// تسجيل الدخول عبر جوجل
function handleGoogleLogin() {
    alert("تم تسجيل الدخول بحساب Google بنجاح! مرحباً بك في وصلها ستور.");
    window.location.href = "index.html";
}

// إدارة حالة الجلسة
function checkAuthStatus() {
    const isAuth = localStorage.getItem("waselha_auth") === "true";
    const loginCard = document.getElementById("loginCard");
    const dashCard = document.getElementById("dashboardCard");

    if (loginCard && dashCard) {
        if (isAuth) {
            loginCard.style.display = "none";
            dashCard.style.display = "block";
        } else {
            loginCard.style.display = "block";
            dashCard.style.display = "none";
        }
    }
}

function handleLogout() {
    localStorage.removeItem("waselha_auth");
    checkAuthStatus();
}
