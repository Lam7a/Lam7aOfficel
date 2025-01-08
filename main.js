‎// بيانات التصاميم
const designs = [
{
id: 1,
name: "تصميم صورة شخصية احترافية",
price: "10M",
image: "https://i.imgur.com/design1.jpg",
description: "تصميم صورة بروفايل مميزة تعكس شخصيتك"
},
{
id: 2,
name: "تصميم بنر سيرفر",
price: "15M",
image: "https://i.imgur.com/design2.jpg",
description: "بنر احترافي لسيرفر الديسكورد"
},
{
id: 3,
name: "تصميم لوجو",
price: "20M",
image: "https://i.imgur.com/design3.jpg",
description: "لوجو مميز لمشروعك أو قناتك"
},
{
id: 4,
name: "تصميم غلاف يوتيوب",
price: "25M",
image: "https://i.imgur.com/design4.jpg",
description: "غلاف احترافي لقناة اليوتيوب"
},
{
id: 5,
name: "تصميم ثيم متكامل",
price: "30M",
image: "https://i.imgur.com/design5.jpg",
description: "ثيم كامل يشمل جميع التصاميم الأساسية"
},
{
id: 6,
name: "تصميم خاص",
price: "حسب الطلب",
image: "https://i.imgur.com/design6.jpg",
description: "تصميم مخصص حسب طلبك"
}
];

‎// عرض التصاميم
function displayDesigns() {
const container = document.getElementById('designsContainer');
container.innerHTML = designs.map(design => `
<div class="col-md-4 mb-4">
<div class="product-card">
<img src="${design.image}" class="card-img-top" alt="${design.name}">
<div class="card-body">
<h5 class="card-title">${design.name}</h5>
<p class="card-text text-muted">${design.description}</p>
<div class="d-flex justify-content-between align-items-center">
<span class="price-badge">${design.price} كريدت</span>
<button onclick="orderDesign(${design.id})" class="btn btn-custom">
‎طلب التصميم
</button>
</div>
</div>
</div>
</div>
`).join('');
}

‎// طلب تصميم
async function orderDesign(designId) {
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
showToast('يجب تسجيل الدخول أولاً', 'error');
setTimeout(() => window.location.href = 'login.html', 1500);
return;
}

const design = designs.find(d => d.id === designId);

try {
‎// إرسال الطلب عبر EmailJS
await emailjs.send('service_2kfajbr', 'template_7rsj7wp', {
to_name: "SF DESIGNS",
from_name: user.email,

design_name: design.name,
design_price: design.price,
message: `طلب تصميم جديد: ${design.name}`
});

‎// تسجيل الطلب في Supabase
const { data, error } = await supabase
.from('orders')
.insert([{
user_id: user.id,
design_id: designId,
design_name: design.name,
price: design.price,
status: 'pending'
}]);

if (error) throw error;

showToast('تم إرسال طلبك بنجاح!', 'success');
updateStats();
} catch (err) {
console.error('Error:', err);
showToast('حدث خطأ في إرسال الطلب', 'error');
}
}

‎// تحديث الإحصائيات
async function updateStats() {
try {
const { count: usersCount } = await supabase
.from('profiles')
.select('*', { count: 'exact' });

const { count: ordersCount } = await supabase
.from('orders')
.select('*', { count: 'exact' });

document.getElementById('usersCount').textContent = usersCount || 0;
document.getElementById('ordersCount').textContent = ordersCount || 0;
} catch (error) {
console.error('Error updating stats:', error);
}
}

‎// إظهار رسائل للمستخدم
function showToast(message, type = 'success') {
const toast = document.createElement('div');
toast.className = `toast show position-fixed bottom-0 end-0 m-3`;
toast.style.backgroundColor = type === 'success' ? '#10B981' : '#EF4444';
toast.style.color = 'white';
toast.style.padding = '1rem';
toast.style.borderRadius = '8px';
toast.style.zIndex = '9999';
toast.innerHTML = message;

document.body.appendChild(toast);
setTimeout(() => toast.remove(), 3000);
}

‎// نموذج التواصل
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
e.preventDefault();
const email = document.getElementById('emailInput').value;
const message = document.getElementById('messageInput').value;

try {
await emailjs.send('service_2kfajbr', 'template_7rsj7wp', {
to_name: "SF DESIGNS",
from_name: email,
message: message
});

showToast('تم إرسال رسالتك بنجاح!', 'success');
e.target.reset();

// تكملة main.js

} catch (error) {
console.error('Error:', error);
showToast('حدث خطأ في إرسال الرسالة', 'error');
}
});

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
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
try {
await supabase.auth.signOut();
localStorage.removeItem('user');
window.location.href = 'login.html';
showToast('تم تسجيل الخروج بنجاح', 'success');
} catch (error) {
console.error('Error:', error);
showToast('حدث خطأ أثناء تسجيل الخروج', 'error');
}
});

// إخفاء شاشة التحميل
window.addEventListener('load', () => {
setTimeout(() => {
document.getElementById('loadingScreen').style.display = 'none';
}, 1500);
});

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
displayDesigns();
updateStats();
checkAuthStatus();

document.getElementById('loginBtn')?.addEventListener('click', () => {
window.location.href = 'login.html';
});
});
