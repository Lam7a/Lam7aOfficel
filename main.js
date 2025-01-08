
‎// تهيئة Supabase
const supabase = createClient(
'https://jocgtfekndsdcfftmlhs.supabase.co',
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvY2d0ZmVrbmRzZGNmZnRtbGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzMyNzUsImV4cCI6MjA1MTkwOTI3NX0.tTW9sM6cVknt7N01AWTEJwyzxlxZdIksc0pxyLptLSk'
);

‎// بيانات المنتجات
const products = [
    {
        id: 1,
        name: "تصميم شعار احترافي",
        price: 299,
        image: "https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Logo+Design",
        description: "تصميم شعار مميز يعكس هوية علامتك التجارية"
    },
    {
        id: 2,
        name: "تصميم هوية بصرية",
        price: 599,
        image: "https://via.placeholder.com/400x300/7C3AED/FFFFFF?text=Brand+Identity",
        description: "هوية بصرية متكاملة تشمل كافة العناصر الأساسية"
    },
    {
        id: 3,
        name: "تصميم سوشيال ميديا",
        price: 199,
        image: "https://via.placeholder.com/400x300/A78BFA/FFFFFF?text=Social+Media",
        description: "تصاميم احترافية لمنصات التواصل الاجتماعي"
    },
    {
        id: 4,
        name: "تصميم موشن جرافيك",
        price: 899,
        image: "https://via.placeholder.com/400x300/6D28D9/FFFFFF?text=Motion+Graphics",
        description: "تصميم فيديوهات موشن جرافيك احترافية"
    },
    {
        id: 5,
        name: "تصميم منشورات",
        price: 149,
        image: "https://via.placeholder.com/400x300/5B21B6/FFFFFF?text=Posts+Design",
        description: "تصميم منشورات جذابة لمواقع التواصل"
    },
    {
        id: 6,
        name: "تصميم مطبوعات",
        price: 399,
        image: "https://via.placeholder.com/400x300/4C1D95/FFFFFF?text=Print+Design",
        description: "تصميم مطبوعات متنوعة عالية الجودة"
    }
];

‎// إخفاء Loading عند اكتمال تحميل الصفحة
window.addEventListener('load', () => {
    document.getElementById('loader').style.display = 'none';
});

‎// عرض المنتجات
function displayProducts() {

const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(product => `
        <div class="col-md-4 mb-4">
            <div class="product-card animate-fade-in">
                <img src="${product.image}" class="product-image" alt="${product.name}">
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="text-muted">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price">${product.price} ريال</span>
                        <button class="btn btn-custom" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart me-2"></i>إضافة للسلة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// إضافة للسلة
function addToCart(productId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showToast('error', 'الرجاء تسجيل الدخول أولاً');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const product = products.find(p => p.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        showToast('success', `تمت إضافة ${product.name} إلى السلة`);
    }
}

// تحديث شارة السلة
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const badge = document.getElementById('cartBadge');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

badge.textContent = total;
}

// عرض السلة
function showCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <p class="lead">السلة فارغة</p>
                <a href="#products" class="btn btn-custom" data-bs-dismiss="modal">تصفح المنتجات</a>
            </div>
        `;
        cartTotal.textContent = '0 ريال';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${item.price} ريال × ${item.quantity}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-danger me-2" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-success ms-2" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `${total} ريال`;
    }

    new bootstrap.Modal(document.getElementById('cartModal')).show();
}

// تحديث الكمية
function updateQuantity(id, newQuantity) {

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (newQuantity < 1) {
        cart = cart.filter(item => item.id !== id);
    } else {
        const item = cart.find(item => item.id === id);
        if (item) item.quantity = newQuantity;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showCart();
}

// إتمام الطلب
async function checkout() {
    const user = JSON.parse(localStorage.getItem('user'));
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (!user || cart.length === 0) {
        showToast('error', 'الرجاء تسجيل الدخول وإضافة منتجات للسلة');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                user_id: user.id,
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                status: 'pending',
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;

        localStorage.removeItem('cart');
        updateCartBadge();
        bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
        showToast('success', 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً');
    } catch (error) {
        console.error('Error:', error);
        showToast('error', 'حدث خطأ أثناء إتمام الطلب');
    }
}

// عرض رسائل Toast
function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = type === 'success' ? '#10B981' : '#EF4444';
    toast.style.color = 'white';
    toast.style.padding = '1rem';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.innerHTML = message;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// التحقق من حالة تسجيل الدخول
async function checkAuthStatus() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (user) {
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('loginBtn').classList.add('d-none');
            document.getElementById('logoutBtn').classList.remove('d-none');
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            document.getElementById('userEmail').textContent = '';
            document.getElementById('loginBtn').classList.remove('d-none');
            document.getElementById('logoutBtn').classList.add('d-none');
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

// تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await supabase.auth.signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error:', error);
        showToast('error', 'حدث خطأ أثناء تسجيل الخروج');
    }
});

// التمرير السلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartBadge();
    checkAuthStatus();

    document.getElementById('cartBtn').addEventListener('click', showCart);
    document.getElementById('loginBtn').addEventListener('click', () => {
        window.location.href = 'login.html';
    });
});
