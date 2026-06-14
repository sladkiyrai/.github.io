let productsData = [];
let cart = JSON.parse(localStorage.getItem('sweet_cart')) || [];
let orders = JSON.parse(localStorage.getItem('sweet_orders')) || [];
let currentUser = null;
let currentCategory = "все";
let currentMinPrice = 0;
let currentMaxPrice = 5000;
let currentSort = "default";
let activeSimpleFilter = null;
let currentPage = "home";
let currentOrderFilter = "all";

let db = null;
let auth = null;

const DEFAULT_PRODUCTS = [
    { 
        id: "1", 
        name: "Трюфель Медовый хруст", 
        price: 890, 
        weight: 120,
        category: "конфеты", 
        image: "images/products/truffle-honey.jpg", 
        isNew: false, 
        isHit: true, 
        isGift: false, 
        isDiet: false, 
        description: "Нежный трюфель с медовой начинкой и хрустящей карамельной крошкой.", 
        features: ["Хит"], 
        badge: "Хит", 
        composition: "Мёд, грецкий орех, карамельная крошка, шоколад" 
    },
    { 
        id: "2", 
        name: "Маршмеллоу ванильное", 
        price: 450, 
        weight: 150,
        category: "десерты", 
        image: "images/products/marshmallow.jpg", 
        isNew: false, 
        isHit: false, 
        isGift: false, 
        isDiet: false, 
        description: "Воздушное ванильное маршмеллоу, тающее во рту.", 
        features: [], 
        badge: null, 
        composition: "Сахар, агар-агар, ваниль, яичный белок" 
    },
    { 
        id: "3", 
        name: "Набор «Фруктовый сад»", 
        price: 1650, 
        weight: 350,
        category: "наборы", 
        image: "images/products/fruit-garden-set.jpg", 
        isNew: true, 
        isHit: true, 
        isGift: true, 
        isDiet: false, 
        description: "Легкий и освежающий набор конфет с натуральными фруктовыми и ягодными начинками.", 
        features: ["Хит", "Подарок"], 
        badge: "Хит", 
        composition: "Белый и темный шоколад, фруктовые пюре..." 
    },
    { 
        id: "4", 
        name: "Конфеты без сахара Финик-какао", 
        price: 690, 
        weight: 100,
        category: "конфеты", 
        image: "images/products/date-cacao.jpg", 
        isNew: false, 
        isHit: false, 
        isGift: false, 
        isDiet: true, 
        description: "Натуральные конфеты на основе фиников и какао. Без сахара.", 
        features: ["Диетические"], 
        badge: "Диетические", 
        composition: "Финики, какао-порошок, орехи, без сахара" 
    },
    { 
        id: "5", 
        name: "Печенье Шоколадный фондан", 
        price: 590, 
        weight: 200,
        category: "печенье", 
        image: "images/products/chocolate-fondant.jpg", 
        isNew: false, 
        isHit: false, 
        isGift: false, 
        isDiet: false, 
        description: "Хрустящее печенье с жидкой шоколадной начинкой.", 
        features: [], 
        badge: null, 
        composition: "Мука, шоколад, масло, яйца, сахар" 
    },
    { 
        id: "6", 
        name: "Трюфель с соленой карамелью", 
        price: 890, 
        weight: 120,
        category: "конфеты", 
        image: "images/products/salted-caramel-truffle.jpg", 
        isNew: false, 
        isHit: true, 
        isGift: false, 
        isDiet: false, 
        description: "Изысканный трюфель с соленой карамелью.", 
        features: ["Хит"], 
        badge: "Хит", 
        composition: "Солёная карамель, бельгийский шоколад, морская соль..." 
    },
    { 
        id: "7", 
        name: "Тирамису классический", 
        price: 450, 
        weight: 200,
        category: "десерты", 
        image: "images/products/tiramisu.jpg", 
        isNew: false, 
        isHit: true, 
        isGift: false, 
        isDiet: false, 
        description: "Нежный итальянский десерт с маскарпоне и кофе.", 
        features: ["Хит"], 
        badge: "Хит", 
        composition: "Маскарпоне, кофе, савоярди, какао, яйца, сахар" 
    },
    { 
        id: "8", 
        name: "Печенье «Овсяное с шоколадом и клюквой»", 
        price: 390, 
        weight: 180,
        category: "печенье", 
        image: "images/products/oatmeal-chocolate-cranberry.jpg", 
        isNew: true, 
        isHit: false, 
        isGift: false, 
        isDiet: true, 
        description: "Домашнее овсяное печенье с кусочками тёмного шоколада и сушёной клюквой.", 
        features: ["Новинка", "Диетические"], 
        badge: "Новинка", 
        composition: "Овсяные хлопья, тёмный шоколад, клюква, без муки и сахара" 
    },
    { 
        id: "9", 
        name: "Малиновый облако-мусс", 
        price: 590, 
        weight: 180,
        category: "десерты", 
        image: "images/products/raspberry-cloud-mousse.jpg", 
        isNew: true, 
        isHit: false, 
        isGift: false, 
        isDiet: false, 
        description: "Нежнейший мусс на основе малинового пюре и бельгийского шоколада.", 
        features: ["Новинка"], 
        badge: "Новинка", 
        composition: "Малиновое пюре, бельгийский шоколад, сливки, ваниль" 
    },
    { 
        id: "10", 
        name: "Чизкейк с голубикой без выпечки", 
        price: 520, 
        weight: 200,
        category: "десерты", 
        image: "images/products/blueberry-cheesecake.jpg", 
        isNew: true, 
        isHit: false, 
        isGift: false, 
        isDiet: false, 
        description: "Нежный творожный чизкейк с голубичным топпингом на песочной основе.", 
        features: ["Новинка"], 
        badge: "Новинка", 
        composition: "Творожный сыр, голубика, песочная основа, сливки" 
    }
];

function handleImageError(img) {
    if (!img) return;
    img.onerror = null;
    img.src = 'images/products/placeholder.jpg';
}

function isAdmin(user) {
    return user && user.email === "admin@example.com";
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'warning' ? ' warning' : '');
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function updateCartCounter() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.getElementById('cartCounterHeader');
    if (counter) counter.innerText = total;
    localStorage.setItem('sweet_cart', JSON.stringify(cart));
}

function addToCart(product, quantity = 1) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > 100) {
            showToast('Нельзя добавить больше 100 штук товара "' + product.name + '"', 'warning');
            return;
        }
        existing.quantity = newQuantity;
    } else {
        if (quantity > 100) {
            showToast('Нельзя добавить больше 100 штук товара "' + product.name + '"', 'warning');
            return;
        }
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            weight: product.weight
        });
    }
    updateCartCounter();
    showToast(product.name + " добавлено в корзину");
    if (currentPage === 'cart') renderCartPage();
}

async function saveProductsToFirestore() {
    if (!db) return;
    try {
        for (const product of productsData) {
            await db.collection('products').doc(product.id).set(product);
        }
        console.log('Все товары синхронизированы с Firebase');
    } catch (error) {
        console.error('Ошибка синхронизации с Firebase:', error);
    }
}

async function loadProductsFromFirestore() {
    if (!db) {
        loadProductsFromLocal();
        updateCartCounter();
        return;
    }
    
    try {
        const productsRef = db.collection('products');
        const snapshot = await productsRef.get();
        
        if (!snapshot.empty) {
            productsData = [];
            snapshot.forEach(doc => {
                productsData.push({ id: doc.id, ...doc.data() });
            });
            console.log('Товары загружены из Firestore:', productsData.length);
        } else {
            productsData = [...DEFAULT_PRODUCTS];
            await saveProductsToFirestore();
            console.log('Базовые товары сохранены в Firestore');
        }
        
        renderPopularProducts();
        renderNewProducts();
        renderCategoryLinks();
        if (currentPage === 'catalog') filterAndRenderCatalog();
        if (currentPage === 'admin' && isAdmin(currentUser)) renderAdminProductsList();
        updateCartCounter();
        
    } catch (error) {
        console.error('Ошибка загрузки товаров из Firestore:', error);
        loadProductsFromLocal();
        updateCartCounter();
    }
}

function saveProductsToLocal() {
    localStorage.setItem('sweet_products', JSON.stringify(productsData));
}

function loadProductsFromLocal() {
    const saved = localStorage.getItem('sweet_products');
    if (saved && JSON.parse(saved).length > 0) {
        productsData = JSON.parse(saved);
    } else {
        productsData = [...DEFAULT_PRODUCTS];
        saveProductsToLocal();
    }
}

function saveOrdersToLocal() {
    localStorage.setItem('sweet_orders', JSON.stringify(orders));
}

function loadOrdersFromLocal() {
    const saved = localStorage.getItem('sweet_orders');
    orders = saved ? JSON.parse(saved) : [];
}

async function saveOrder(orderData) {
    const newOrder = { 
        id: Date.now().toString(), 
        ...orderData, 
        createdAt: new Date().toISOString(), 
        status: "новый" 
    };
    
    orders.unshift(newOrder);
    saveOrdersToLocal();
    
    if (db) {
        try {
            await db.collection('orders').doc(newOrder.id).set(newOrder);
            console.log('Заказ сохранён в Firebase:', newOrder.id);
        } catch (error) {
            console.error('Ошибка сохранения заказа в Firebase:', error);
        }
    }
    
    return newOrder.id;
}

async function loadOrdersFromFirestore() {
    if (!db) { loadOrdersFromLocal(); return; }
    
    try {
        const ordersRef = db.collection('orders');
        const snapshot = await ordersRef.orderBy('createdAt', 'desc').get();
        
        orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        
        console.log('Заказы загружены из Firestore:', orders.length);
        saveOrdersToLocal();
        
        if (currentPage === 'admin' && isAdmin(currentUser)) {
            renderOrdersList();
        }
    } catch (error) {
        if (error.code === 'permission-denied' || (error.message && error.message.includes('does not exist'))) {
            loadOrdersFromLocal();
        } else {
            console.error('Ошибка загрузки заказов из Firestore:', error);
            loadOrdersFromLocal();
        }
    }
}

async function registerUserFirebase(name, email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: name
        };
    } catch (error) {
        let message = 'Ошибка регистрации';
        if (error.code === 'auth/email-already-in-use') message = 'Пользователь с таким email уже существует';
        else if (error.code === 'auth/weak-password') message = 'Пароль должен быть не менее 6 символов';
        else if (error.code === 'auth/invalid-email') message = 'Неверный формат email';
        throw new Error(message);
    }
}

async function loginUserFirebase(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const isAdminUser = email === "admin@example.com";
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName || userCredential.user.email.split('@')[0],
            isAdmin: isAdminUser
        };
    } catch (error) {
        let message = 'Ошибка входа';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') message = 'Неверный email или пароль';
        else if (error.code === 'auth/invalid-email') message = 'Неверный формат email';
        throw new Error(message);
    }
}

async function logoutUserFirebase() {
    try {
        await auth.signOut();
        currentUser = null;
        updateAuthUI();
        showToast('Вы вышли из аккаунта');
        showPage('home');
    } catch (error) {
        showToast('Ошибка выхода: ' + error.message);
    }
}

function updateAuthUI() {
    const section = document.getElementById('authSection');
    const adminBtn = document.getElementById('adminNavBtn');
    if (!section) return;
    
    if (currentUser) {
        const admin = isAdmin(currentUser);
        section.innerHTML = '<div class="user-info"><span class="user-name">' + escapeHtml(currentUser.displayName) + (admin ? '<span class="admin-badge">Admin</span>' : '') + '</span><button class="logout-btn-header" id="logoutBtn">Выйти</button></div>';
        document.getElementById('logoutBtn')?.addEventListener('click', () => logoutUserFirebase());
        if (adminBtn) adminBtn.style.display = admin ? 'flex' : 'none';
        if (admin && currentPage === 'admin') { renderAdminProductsList(); renderOrdersList(); }
    } else {
        section.innerHTML = '<div class="auth-buttons"><button class="auth-btn-header" id="loginBtn">Вход</button><button class="auth-btn-header" id="registerBtn">Регистрация</button></div>';
        document.getElementById('loginBtn')?.addEventListener('click', () => openAuthModal());
        document.getElementById('registerBtn')?.addEventListener('click', () => openAuthModal());
        if (adminBtn) adminBtn.style.display = 'none';
    }
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'flex';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    activateAuthTab('login');
}

function activateAuthTab(tabName) {
    const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
    const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
    const loginPane = document.getElementById('authLoginPane');
    const registerPane = document.getElementById('authRegisterPane');
    
    if (tabName === 'login') {
        loginTab?.classList.add('active'); registerTab?.classList.remove('active');
        loginPane?.classList.add('active-pane'); registerPane?.classList.remove('active-pane');
    } else {
        registerTab?.classList.add('active'); loginTab?.classList.remove('active');
        registerPane?.classList.add('active-pane'); loginPane?.classList.remove('active-pane');
    }
}

function initAuthModalTabs() {
    document.querySelector('.auth-tab[data-tab="login"]')?.addEventListener('click', () => activateAuthTab('login'));
    document.querySelector('.auth-tab[data-tab="register"]')?.addEventListener('click', () => activateAuthTab('register'));
    
    document.getElementById('doLoginBtn').onclick = async () => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        if (!email || !password) { showToast('Заполните все поля'); return; }
        
        const btn = document.getElementById('doLoginBtn');
        btn.innerHTML = 'Вход...';
        btn.disabled = true;
        try {
            const user = await loginUserFirebase(email, password);
            currentUser = user;
            updateAuthUI();
            document.getElementById('authModal').style.display = 'none';
            showToast('Добро пожаловать, ' + currentUser.displayName + '!');
            if (currentPage === 'admin' && isAdmin(currentUser)) { renderAdminProductsList(); renderOrdersList(); }
        } catch (e) { showToast('Ошибка: ' + e.message); }
        finally { btn.innerHTML = 'Войти'; btn.disabled = false; }
    };
    
    document.getElementById('doRegisterBtn').onclick = async () => {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        if (!name || !email || !password) { showToast('Заполните все поля'); return; }
        
        const btn = document.getElementById('doRegisterBtn');
        btn.innerHTML = 'Регистрация...';
        btn.disabled = true;
        try {
            const user = await registerUserFirebase(name, email, password);
            currentUser = user;
            updateAuthUI();
            document.getElementById('authModal').style.display = 'none';
            showToast('Добро пожаловать, ' + name + '!');
        } catch (e) { showToast('Ошибка: ' + e.message); }
        finally { btn.innerHTML = 'Зарегистрироваться'; btn.disabled = false; }
    };
}

function showAboutPage() {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    const aboutPage = document.getElementById('aboutPage');
    if (aboutPage) aboutPage.style.display = 'block';
    currentPage = 'about';
}

function showDeliveryPage() {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    const deliveryPage = document.getElementById('deliveryPage');
    if (deliveryPage) deliveryPage.style.display = 'block';
    currentPage = 'delivery';
}

function closeMobileMenu() {
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) mainNav.classList.remove('mobile-open');
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    
    const homePage = document.getElementById('homePage');
    const catalogPage = document.getElementById('catalogPage');
    const cartPage = document.getElementById('cartPage');
    const adminPage = document.getElementById('adminPage');
    const aboutPage = document.getElementById('aboutPage');
    const deliveryPage = document.getElementById('deliveryPage');
    
    if (pageName === 'home' && homePage) homePage.style.display = 'block';
    else if (pageName === 'catalog' && catalogPage) catalogPage.style.display = 'block';
    else if (pageName === 'cart' && cartPage) cartPage.style.display = 'block';
    else if (pageName === 'admin' && adminPage) adminPage.style.display = 'block';
    else if (pageName === 'about' && aboutPage) aboutPage.style.display = 'block';
    else if (pageName === 'delivery' && deliveryPage) deliveryPage.style.display = 'block';
    
    currentPage = pageName;
    
    const featuresRow = document.querySelector('.features-row');
    if (featuresRow) featuresRow.style.display = pageName === 'home' ? 'flex' : 'none';
    
    const aboutSection = document.getElementById('aboutCompanySection');
    if (aboutSection) aboutSection.style.display = pageName === 'home' ? 'block' : 'none';
    
    if (pageName === 'catalog') {
        filterAndRenderCatalog();
        initCategories();
        initSimpleFilters();
        updateActiveFiltersSide();
    } else if (pageName === 'cart') {
        renderCartPage();
    } else if (pageName === 'admin' && isAdmin(currentUser)) {
        renderAdminProductsList();
        renderOrdersList();
    } else if (pageName === 'home') {
        renderPopularProducts();
        renderNewProducts();
        renderCategoryLinks();
    }
}

function renderCartPage() {
    const container = document.getElementById('cartItemsList');
    const totalBlock = document.getElementById('cartTotalBlock');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        if (totalBlock) totalBlock.innerHTML = '';
        // Автоподстановка имени при пустой корзине
        if (currentUser && currentUser.displayName) {
            const orderNameInput = document.getElementById('orderName');
            if (orderNameInput && !orderNameInput.value) {
                orderNameInput.value = currentUser.displayName;
            }
        }
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map((item, idx) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return '<div class="cart-item" data-idx="' + idx + '">' +
            '<div class="cart-item-image">' +
                '<img src="' + (item.image || 'images/products/placeholder.jpg') + '" alt="' + escapeHtml(item.name) + '" onerror="handleImageError(this)">' +
            '</div>' +
            '<div class="cart-item-info">' +
                '<div class="cart-item-name">' + escapeHtml(item.name) + '</div>' +
                '<div class="cart-item-price">' + item.price.toLocaleString() + ' руб / ' + (item.weight || '?') + ' г</div>' +
            '</div>' +
            '<div class="cart-item-actions">' +
                '<button class="cart-qty-btn" data-idx="' + idx + '" data-op="minus">-</button>' +
                '<span class="cart-item-quantity">' + item.quantity + '</span>' +
                '<button class="cart-qty-btn" data-idx="' + idx + '" data-op="plus">+</button>' +
                '<button class="cart-remove-btn" data-idx="' + idx + '" data-product-name="' + escapeHtml(item.name) + '">' +
                    '<i class="fas fa-trash"></i>' +
                '</button>' +
            '</div>' +
            '<div class="cart-item-total">' + itemTotal.toLocaleString() + ' руб</div>' +
        '</div>';
    }).join('');
    
    if (totalBlock) totalBlock.innerHTML = '<div class="cart-total">Итого: ' + total.toLocaleString() + ' руб</div>';
    
    document.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.idx);
            if (btn.dataset.op === 'plus') {
                if (cart[idx].quantity < 100) {
                    cart[idx].quantity++;
                    updateCartCounter();
                    renderCartPage();
                } else {
                    showToast('Нельзя добавить больше 100 штук товара "' + cart[idx].name + '"', 'warning');
                }
            } else if (btn.dataset.op === 'minus' && cart[idx].quantity > 1) {
                cart[idx].quantity--;
                updateCartCounter();
                renderCartPage();
            }
        };
    });
    
    document.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.idx);
            const productName = btn.dataset.productName;
            showConfirmModal('Удалить "' + productName + '" из корзины?', () => {
                cart.splice(idx, 1);
                updateCartCounter();
                renderCartPage();
                showToast('"' + productName + '" удален из корзины');
            });
        };
    });
    
    //  АВТОПОДСТАНОВКА ИМЕНИ ИЗ ПРОФИЛЯ
    if (currentUser && currentUser.displayName) {
        const orderNameInput = document.getElementById('orderName');
        if (orderNameInput && !orderNameInput.value) {
            orderNameInput.value = currentUser.displayName;
        }
    }
    //  КОНЕЦ АВТОПОДСТАНОВКИ
}

function showConfirmModal(message, onConfirm) {
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'confirmModal';
    modal.className = 'confirm-modal';
    modal.innerHTML = '<div class="confirm-modal-content"><div class="confirm-icon"><i class="fas fa-question-circle"></i></div><p class="confirm-message">' + escapeHtml(message) + '</p><div class="confirm-buttons"><button class="confirm-btn confirm-no">Отмена</button><button class="confirm-btn confirm-yes">Удалить</button></div></div>';
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    const closeModal = () => modal.remove();
    modal.querySelector('.confirm-yes').onclick = () => { closeModal(); onConfirm(); };
    modal.querySelector('.confirm-no').onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    document.addEventListener('keydown', function keyHandler(e) { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', keyHandler); } });
}

async function updateOrderStatus(orderId, newStatus) {
    if (!isAdmin(currentUser)) return;
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    order.status = newStatus;
    saveOrdersToLocal();
    
    if (db) {
        try {
            await db.collection('orders').doc(orderId).update({ status: newStatus });
            console.log('Статус заказа обновлён в Firebase:', orderId, newStatus);
        } catch (error) {
            console.error('Ошибка обновления статуса в Firebase:', error);
        }
    }
    
    renderOrdersList();
    showToast('Статус заказа изменен на "' + (newStatus === 'доставлен' ? 'Доставлен' : 'Отменен') + '"');
}

async function deleteOrder(orderId) {
    if (!isAdmin(currentUser)) return;
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    showConfirmModal('Удалить заказ #' + order.id.slice(-6) + '? Это действие нельзя отменить.', async () => {
        orders = orders.filter(o => o.id !== orderId);
        saveOrdersToLocal();
        
        if (db) {
            try {
                await db.collection('orders').doc(orderId).delete();
                console.log('Заказ удалён из Firebase:', orderId);
            } catch (error) {
                console.error('Ошибка удаления заказа из Firebase:', error);
            }
        }
        
        renderOrdersList();
        showToast('Заказ #' + order.id.slice(-6) + ' удалён');
    });
}

function renderOrdersList() {
    if (!isAdmin(currentUser)) return;
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    let filteredOrders = [...orders];
    if (currentOrderFilter !== 'all') {
        filteredOrders = filteredOrders.filter(o => o.status === currentOrderFilter);
    }
    
    const newOrders = filteredOrders.filter(o => o.status === 'новый');
    const deliveredOrders = filteredOrders.filter(o => o.status === 'доставлен');
    const cancelledOrders = filteredOrders.filter(o => o.status === 'отменен');
    const sortedOrders = [...newOrders, ...deliveredOrders, ...cancelledOrders];
    
    if (sortedOrders.length === 0) { 
        ordersList.innerHTML = '<p style="text-align:center; padding: 40px;">Нет заказов</p>'; 
        return; 
    }
    
    ordersList.innerHTML = sortedOrders.map(order => {
        let statusClass = '';
        let statusText = '';
        if (order.status === 'новый') { statusClass = 'status-new'; statusText = 'Новый'; }
        else if (order.status === 'доставлен') { statusClass = 'status-delivered'; statusText = 'Доставлен'; }
        else if (order.status === 'отменен') { statusClass = 'status-cancelled'; statusText = 'Отменен'; }
        
        const showStatusButtons = order.status === 'новый';
        const showDeleteButton = order.status === 'доставлен' || order.status === 'отменен';
        let paymentMethodText = '';
        
        if (order.paymentMethod === 'card') {
            paymentMethodText = 'Оплата картой онлайн';
        } else if (order.paymentMethod === 'cash') {
            if (order.isPickup) {
                paymentMethodText = 'Наличными при самовывозе';
            } else {
                paymentMethodText = 'Наличными курьеру';
            }
        } else {
            paymentMethodText = 'Способ оплаты не указан';
        }
        
        let deliveryInfo = '';
        if (order.paymentMethod === 'cash' && order.deliveryMethod) {
            if (order.isPickup) {
                deliveryInfo = '<div class="order-delivery-info"><i class="fas fa-store"></i> <strong>Самовывоз</strong> <span class="delivery-badge pickup">Самовывоз</span><br> г. Москва, ул. Сладкая, 15 (ежедневно 10:00-21:00)</div>';
            } else {
                deliveryInfo = '<div class="order-delivery-info"><i class="fas fa-truck"></i> <strong>Доставка курьером</strong> <span class="delivery-badge courier">Курьер</span><br> Адрес: ' + escapeHtml(order.userAddress) + '</div>';
            }
        } else if (order.paymentMethod === 'card') {
            deliveryInfo = '<div class="order-delivery-info"><i class="fas fa-truck"></i> <strong>Доставка курьером</strong><br> Адрес: ' + escapeHtml(order.userAddress) + '</div>';
        }
        
        return '<div class="order-card ' + (order.status === 'доставлен' || order.status === 'отменен' ? 'order-completed' : '') + '">' +
            '<div class="order-header">' +
            '<strong>Заказ #' + order.id.slice(-6) + '</strong>' +
            '<div class="order-status-control">' +
            '<span class="order-status ' + statusClass + '">' + statusText + '</span>' +
            '<div class="order-status-buttons">' +
            (showStatusButtons ? '<button class="status-btn deliver-btn" data-order-id="' + order.id + '" data-status="доставлен">Доставлен</button><button class="status-btn cancel-btn" data-order-id="' + order.id + '" data-status="отменен">Отменен</button>' : '') +
            (showDeleteButton ? '<button class="status-btn delete-btn" data-order-id="' + order.id + '">Удалить</button>' : '') +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div><strong>Клиент:</strong> ' + escapeHtml(order.userName) + '</div>' +
            '<div><strong>Телефон:</strong> ' + escapeHtml(order.userPhone) + '</div>' +
            deliveryInfo +
            '<div><strong>Способ оплаты:</strong> ' + paymentMethodText + '</div>' +
            '<div><strong>Сумма:</strong> ' + order.totalAmount.toLocaleString() + ' рублей</div>' +
            (order.userComment ? '<div><strong>Комментарий:</strong> ' + escapeHtml(order.userComment) + '</div>' : '') +
            '<details class="order-items"><summary>Товары в заказе (' + order.items.length + ')</summary>' +
            '<div class="order-items-list">' + order.items.map(item => '<div>' + escapeHtml(item.productName) + ' — ' + item.quantity + ' шт x ' + item.price.toLocaleString() + ' руб = ' + item.total.toLocaleString() + ' руб</div>').join('') +
            '</div></details></div>';
    }).join('');
    
    document.querySelectorAll('.status-btn.deliver-btn, .status-btn.cancel-btn').forEach(btn => {
        btn.onclick = () => {
            const orderId = btn.dataset.orderId;
            const newStatus = btn.dataset.status;
            updateOrderStatus(orderId, newStatus);
        };
    });
    
    document.querySelectorAll('.status-btn.delete-btn').forEach(btn => {
        btn.onclick = () => {
            const orderId = btn.dataset.orderId;
            deleteOrder(orderId);
        };
    });
}

function initOrderStatusFilters() {
    const filters = document.querySelectorAll('.order-status-filter');
    filters.forEach(filter => {
        filter.onclick = () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            currentOrderFilter = filter.dataset.status;
            renderOrdersList();
        };
    });
}

function renderAdminProductsList() {
    const container = document.getElementById('allProductsList');
    if (!container) return;
    if (!productsData || productsData.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 40px;">Нет товаров. Добавьте первый товар!</p>';
        return;
    }
    
    container.innerHTML = productsData.map(product => {
        let badgeHtml = '';
        if (product.badge) {
          let badgeColor = '#8b5cf6';
          if (product.badge === 'Хит') badgeColor = '#dc2626';
          else if (product.badge === 'Подарок') badgeColor = '#16a34a';
          else if (product.badge === 'Диетические') badgeColor = '#8b5cf6';
          else if (product.badge === 'Новинка') badgeColor = '#f59e0b';

          badgeHtml = '<span class="admin-product-badge" style="background: ' + badgeColor + '; color: white;">' + escapeHtml(product.badge) + '</span>';
        }
        
        let statusIcons = [];
        if (product.isNew) statusIcons.push('Новинка');
        if (product.isHit) statusIcons.push('Хит');
        if (product.isGift) statusIcons.push('Подарок');
        if (product.isDiet) statusIcons.push('Диет');
        const statusText = statusIcons.length ? '(' + statusIcons.join(', ') + ')' : '';
        
        return '<div class="admin-product-item">' +
            '<div class="admin-product-info">' +
            '<img src="' + (product.image || 'images/products/placeholder.jpg') + '" class="admin-product-img" onerror="handleImageError(this)">' +
            '<div class="admin-product-details">' +
            '<span class="admin-product-name">' + escapeHtml(product.name) + ' <span style="font-size: 0.7rem; color: #888;">' + statusText + '</span></span>' +
            '<span class="admin-product-price">' + product.price.toLocaleString() + ' руб</span>' +
            '<span class="admin-product-category">' + product.category + '</span>' +
            badgeHtml +
            '</div>' +
            '</div>' +
            '<div class="admin-product-actions">' +
            '<button class="admin-edit-btn" data-id="' + product.id + '">Редактировать</button>' +
            '<button class="admin-delete-btn" data-id="' + product.id + '">Удалить</button>' +
            '</div>' +
            '</div>';
    }).join('');
    
    document.querySelectorAll('.admin-delete-btn').forEach(btn => { 
        btn.onclick = () => deleteProduct(btn.dataset.id); 
    });
    document.querySelectorAll('.admin-edit-btn').forEach(btn => { 
        btn.onclick = () => editProduct(btn.dataset.id); 
    });
}

async function deleteProduct(productId) {
    if (!isAdmin(currentUser)) { showToast('Доступ только для администратора'); return; }
    const productToDelete = productsData.find(p => p.id === productId);
    if (!productToDelete) { showToast('Товар не найден'); return; }
    
    showConfirmModal('Удалить товар "' + productToDelete.name + '"?', async () => {
        productsData = productsData.filter(p => p.id !== productId);
        saveProductsToLocal();
        
        if (db) {
            try {
                await db.collection('products').doc(productId).delete();
                console.log('Товар удалён из Firebase:', productId);
            } catch (error) {
                console.error('Ошибка удаления из Firebase:', error);
                showToast('Ошибка при удалении из базы данных', 'warning');
            }
        }
        
        renderAdminProductsList();
        renderPopularProducts();
        renderNewProducts();
        if (currentPage === 'catalog') filterAndRenderCatalog();
        
        showToast('Товар "' + productToDelete.name + '" удалён');
    });
}

function editProduct(productId) {
    if (!isAdmin(currentUser)) { showToast('Доступ только для администратора'); return; }
    
    const product = productsData.find(p => p.id === productId);
    if (!product) { showToast('Товар не найден'); return; }
    
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductWeight').value = product.weight || '';
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductImage').value = product.image || '';
    document.getElementById('editProductDescription').value = product.description || '';
    document.getElementById('editProductComposition').value = product.composition || '';
    document.getElementById('editFeatureNew').checked = product.isNew || false;
    document.getElementById('editFeatureHit').checked = product.isHit || false;
    document.getElementById('editFeatureGift').checked = product.isGift || false;
    document.getElementById('editFeatureDiet').checked = product.isDiet || false;
    
    const modal = document.getElementById('editProductModal');
    if (modal) modal.style.display = 'flex';
}

async function saveEditedProduct() {
    if (!isAdmin(currentUser)) { showToast('Доступ только для администратора'); return; }
    
    const productId = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value.trim();
    const price = parseInt(document.getElementById('editProductPrice').value);
    const category = document.getElementById('editProductCategory').value;
    const weight = parseInt(document.getElementById('editProductWeight').value);
    let image = document.getElementById('editProductImage').value.trim();
    const description = document.getElementById('editProductDescription').value.trim();
    const composition = document.getElementById('editProductComposition').value.trim();
    const isNew = document.getElementById('editFeatureNew').checked;
    const isHit = document.getElementById('editFeatureHit').checked;
    const isGift = document.getElementById('editFeatureGift').checked;
    const isDiet = document.getElementById('editFeatureDiet').checked;
    
    if (!name) { showToast('Введите название товара'); return; }
    if (!price || isNaN(price) || price <= 0) { showToast('Введите корректную цену'); return; }
    if (!weight || isNaN(weight) || weight <= 0) { showToast('Введите корректный вес'); return; }
    if (!image) image = '';
    
    const features = [];
    let badge = null;
    
    if (isNew) {
        features.push('Новинка');
        badge = 'Новинка';
    } else if (isHit) {
        features.push('Хит');
        badge = 'Хит';
    } else if (isGift) {
        features.push('Подарок');
        badge = 'Подарок';
    } else if (isDiet) {
        features.push('Диетические');
        badge = 'Диетические';
    }
    
    if (isGift && !isNew && !isHit) features.push('Подарок');
    if (isDiet && !isNew && !isHit && !isGift) features.push('Диетические');
    
    const updatedProduct = {
        id: productId, name, price, weight, category, image,
        description: description || 'Изысканные сладости ручной работы',
        composition: composition || '',
        isNew, isHit, isGift, isDiet, features, badge
    };
    
    const index = productsData.findIndex(p => p.id === productId);
    if (index !== -1) { 
        productsData[index] = updatedProduct; 
    }
    
    saveProductsToLocal();
    
    if (db) {
        try {
            await db.collection('products').doc(productId).set(updatedProduct);
            console.log('Товар обновлён в Firebase:', productId);
        } catch (error) {
            console.error('Ошибка обновления в Firebase:', error);
            showToast('Ошибка при сохранении в базу данных', 'warning');
        }
    }
    
    renderAdminProductsList();
    renderPopularProducts();
    renderNewProducts();
    if (currentPage === 'catalog') filterAndRenderCatalog();
    
    const modal = document.getElementById('editProductModal');
    if (modal) modal.style.display = 'none';
    showToast('Товар "' + name + '" обновлён');
}

async function addProduct() {
    if (!isAdmin(currentUser)) { showToast('Доступ только для администратора'); return; }
    
    const name = document.getElementById('productName')?.value.trim();
    const price = parseInt(document.getElementById('productPrice')?.value);
    const category = document.getElementById('productCategory')?.value;
    const weight = parseInt(document.getElementById('productWeight')?.value);
    let image = document.getElementById('productImage')?.value.trim();
    const description = document.getElementById('productDescription')?.value.trim();
    const composition = document.getElementById('productComposition')?.value.trim();
    const isNew = document.getElementById('featureNew')?.checked || false;
    const isHit = document.getElementById('featureHit')?.checked || false;
    const isGift = document.getElementById('featureGift')?.checked || false;
    const isDiet = document.getElementById('featureDiet')?.checked || false;
    
    if (!name) { showToast('Введите название товара'); return; }
    if (!price || isNaN(price) || price <= 0) { showToast('Введите корректную цену'); return; }
    if (!weight || isNaN(weight) || weight <= 0) { showToast('Введите корректный вес'); return; }
    if (!image) image = '';
    
    const features = [];
    let badge = null;
    
    if (isNew) {
        features.push('Новинка');
        badge = 'Новинка';
    } else if (isHit) {
        features.push('Хит');
        badge = 'Хит';
    } else if (isGift) {
        features.push('Подарок');
        badge = 'Подарок';
    } else if (isDiet) {
        features.push('Диетические');
        badge = 'Диетические';
    }
    
    if (isGift && !isNew && !isHit) features.push('Подарок');
    if (isDiet && !isNew && !isHit && !isGift) features.push('Диетические');
    
    const newProductId = Date.now().toString();
    const newProduct = {
        id: newProductId,
        name, price, weight, category, image,
        description: description || 'Изысканные сладости ручной работы',
        composition: composition || '',
        isNew, isHit, isGift, isDiet, features, badge
    };
    
    productsData.push(newProduct);
    saveProductsToLocal();
    
    if (db) {
        try {
            await db.collection('products').doc(newProductId).set(newProduct);
            console.log('Товар добавлен в Firebase:', newProductId);
        } catch (error) {
            console.error('Ошибка добавления в Firebase:', error);
            showToast('Ошибка при сохранении в базу данных', 'warning');
        }
    }
    
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productWeight').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productComposition').value = '';
    document.getElementById('featureNew').checked = false;
    document.getElementById('featureHit').checked = false;
    document.getElementById('featureGift').checked = false;
    document.getElementById('featureDiet').checked = false;
    
    renderAdminProductsList();
    renderPopularProducts();
    renderNewProducts();
    if (currentPage === 'catalog') filterAndRenderCatalog();
    showToast('Товар "' + name + '" добавлен!');
}

function initAdminTabs() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const productsTab = document.getElementById('adminProductsTab');
    const ordersTab = document.getElementById('adminOrdersTab');
    
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.tab === 'products') {
                productsTab?.classList.add('active-tab');
                ordersTab?.classList.remove('active-tab');
                renderAdminProductsList();
            } else if (btn.dataset.tab === 'orders') {
                ordersTab?.classList.add('active-tab');
                productsTab?.classList.remove('active-tab');
                renderOrdersList();
            }
        };
    });
}

function renderCategoryLinks() {
    const container = document.getElementById('homeCategoriesGrid');
    if (!container) return;
    
    const categories = [
        { id: "конфеты", name: "Конфеты", icon: "fa-candy-cane" },
        { id: "наборы", name: "Наборы", icon: "fa-gift" },
        { id: "десерты", name: "Десерты", icon: "fa-cake-candles" },
        { id: "печенье", name: "Печенье", icon: "fa-cookie-bite" }
    ];
    
    container.innerHTML = categories.map(cat => '<div class="category-card" data-category="' + cat.id + '"><i class="fas ' + cat.icon + ' category-icon"></i><div class="category-title">' + cat.name + '</div></div>').join('');
    
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            currentCategory = card.dataset.category;
            showPage('catalog');
            filterAndRenderCatalog();
            initCategories();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function renderPopularProducts() {
    const grid = document.getElementById('popularGrid');
    if (!grid) return;
    const popular = productsData.filter(p => p.isHit === true).slice(0, 6);
    if (popular.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding: 40px;">Хиты скоро появятся</div>';
        return;
    }
    
    grid.innerHTML = popular.map(product => {
        let badgeHtml = '';
        if (product.badge && product.badge !== 'Новинка') {
            let badgeClass = product.badge === 'Хит' ? 'hit' : (product.badge === 'Диетические' ? 'diet' : 'gift');
            badgeHtml = '<div class="card-badge ' + badgeClass + '">' + escapeHtml(product.badge) + '</div>';
        }
        return '<div class="popular-card" data-id="' + product.id + '">' +
            '<div class="card-img">' + badgeHtml +
            '<img src="' + (product.image || 'images/products/placeholder.jpg') + '" alt="' + escapeHtml(product.name) + '" onerror="handleImageError(this)">' +
            '</div>' +
            '<div class="card-info">' +
            '<div class="card-title">' + escapeHtml(product.name) + '</div>' +
            '<div class="product-weight">' + (product.weight || '?') + ' г</div>' +
            '<div class="price">' + product.price.toLocaleString() + ' руб</div>' +
            '<button class="add-to-cart-popular" data-id="' + product.id + '">В корзину</button>' +
            '</div></div>';
    }).join('');
    
    document.querySelectorAll('.add-to-cart-popular').forEach(btn => { 
        btn.onclick = (e) => { e.stopPropagation(); const p = productsData.find(p => p.id === btn.dataset.id); if(p) addToCart(p,1); }; 
    });
    document.querySelectorAll('.popular-card').forEach(card => { 
        card.onclick = (e) => { if(!e.target.closest('.add-to-cart-popular')){ const p = productsData.find(p => p.id === card.dataset.id); if(p) openFullscreenProduct(p); } }; 
    });
}

function renderNewProducts() {
    const container = document.getElementById('newProductsGrid');
    if (!container) return;
    
    const newProducts = productsData.filter(p => p.isNew === true).slice(0, 6);
    
    if (newProducts.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 40px;">Новинки скоро появятся</div>';
        return;
    }
    
    container.innerHTML = newProducts.map(product => {
        let badgeHtml = '';
        if (product.badge === 'Новинка') {
            badgeHtml = '<div class="card-badge" style="background: #f59e0b;">Новинка</div>';
        } else if (product.badge) {
            let badgeClass = product.badge === 'Хит' ? 'hit' : (product.badge === 'Диетические' ? 'diet' : 'gift');
            badgeHtml = '<div class="card-badge ' + badgeClass + '">' + escapeHtml(product.badge) + '</div>';
        }
        
        return '<div class="product-card" data-id="' + product.id + '">' +
            '<div class="card-img">' + badgeHtml +
            '<img src="' + (product.image || 'images/products/placeholder.jpg') + '" alt="' + escapeHtml(product.name) + '" onerror="handleImageError(this)">' +
            '</div>' +
            '<div class="card-info">' +
            '<div class="card-title">' + escapeHtml(product.name) + '</div>' +
            '<div class="product-weight">' + (product.weight || '?') + ' г</div>' +
            '<div class="price">' + product.price.toLocaleString() + ' руб</div>' +
            '<button class="add-to-cart" data-id="' + product.id + '">В корзину</button>' +
            '</div></div>';
    }).join('');
    
    document.querySelectorAll('#newProductsGrid .add-to-cart').forEach(btn => { 
        btn.onclick = (e) => { e.stopPropagation(); const p = productsData.find(p => p.id === btn.dataset.id); if(p) addToCart(p,1); }; 
    });
    document.querySelectorAll('#newProductsGrid .product-card').forEach(card => { 
        card.onclick = (e) => { if(!e.target.closest('.add-to-cart')){ const p = productsData.find(p => p.id === card.dataset.id); if(p) openFullscreenProduct(p); } }; 
    });
}

function filterAndRenderCatalog() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    let filtered = [...productsData];
    if (currentCategory !== "все") filtered = filtered.filter(p => p.category === currentCategory);
    filtered = filtered.filter(p => p.price >= currentMinPrice && p.price <= currentMaxPrice);
    if (activeSimpleFilter === 'hit') filtered = filtered.filter(p => p.features?.includes('Хит') || p.isHit === true);
    else if (activeSimpleFilter === 'gift') filtered = filtered.filter(p => p.features?.includes('Подарок') || p.isGift === true);
    else if (activeSimpleFilter === 'diet') filtered = filtered.filter(p => p.isDiet === true || p.features?.includes('Диетические'));
    if (currentSort === "price_asc") filtered.sort((a,b) => a.price - b.price);
    else if (currentSort === "price_desc") filtered.sort((a,b) => b.price - a.price);
    if (filtered.length === 0) { container.innerHTML = '<div style="text-align:center;padding:60px;">Товаров не найдено</div>'; return; }
    container.innerHTML = filtered.map(product => {
        let badgeHtml = '';
        if (product.badge) {
            let badgeClass = product.badge === 'Хит' ? 'hit' : (product.badge === 'Диетические' ? 'diet' : 'gift');
            if (product.badge === 'Новинка') badgeClass = '';
            badgeHtml = '<div class="card-badge ' + badgeClass + '" style="' + (product.badge === 'Новинка' ? 'background: #f59e0b;' : '') + '">' + escapeHtml(product.badge) + '</div>';
        }
        return '<div class="product-card" data-id="' + product.id + '">' +
            '<div class="card-img">' + badgeHtml +
            '<img src="' + (product.image || 'images/products/placeholder.jpg') + '" alt="' + escapeHtml(product.name) + '" onerror="handleImageError(this)">' +
            '</div>' +
            '<div class="card-info">' +
            '<div class="card-title">' + escapeHtml(product.name) + '</div>' +
            '<div class="product-weight">' + (product.weight || '?') + ' г</div>' +
            '<div class="price">' + product.price.toLocaleString() + ' руб</div>' +
            '<button class="add-to-cart" data-id="' + product.id + '">В корзину</button>' +
            '</div></div>';
    }).join('');
    document.querySelectorAll('.add-to-cart').forEach(btn => { btn.onclick = (e) => { e.stopPropagation(); const p = productsData.find(p => p.id === btn.dataset.id); if(p) addToCart(p,1); }; });
    document.querySelectorAll('.product-card').forEach(card => { card.onclick = (e) => { if(!e.target.closest('.add-to-cart')){ const p = productsData.find(p => p.id === card.dataset.id); if(p) openFullscreenProduct(p); } }; });
}

function openFullscreenProduct(product) {
    let quantity = 1;
    const modal = document.getElementById('fullscreenProductModal');
    const detailInner = document.getElementById('fullscreenDetailInner');
    
    function getSimilarProducts(currentProduct) {
        return productsData
            .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
            .slice(0, 4);
    }
    
    function renderDetail() {
        let description = product.description || 'Изысканные сладости ручной работы из натуральных ингредиентов.';
        const composition = product.composition || "Натуральные ингредиенты высшего качества. Ручная работа.";
        const similarProducts = getSimilarProducts(product);
        
        detailInner.innerHTML = `
            <div class="product-detail-full">
                <div class="detail-image">
                    <img src="${product.image || 'images/products/placeholder.jpg'}" alt="${escapeHtml(product.name)}" onerror="handleImageError(this)">
                </div>
                <div class="detail-info">
                    <div class="detail-name">${escapeHtml(product.name)}</div>
                    <div class="detail-weight">Вес: ${product.weight || '?'} г</div>
                    <div class="detail-price" id="fullPrice">${(product.price * quantity).toLocaleString()} руб</div>
                    <div class="product-description">${escapeHtml(description)}</div>
                    
                    <div class="product-composition">
                        <h4><i class="fas fa-list-ul"></i> Состав</h4>
                        <p>${escapeHtml(composition)}</p>
                    </div>
                    
                    ${similarProducts.length > 0 ? `
                    <div class="similar-products">
                        <h4><i class="fas fa-tags"></i> Похожие товары</h4>
                        <div class="similar-grid">
                            ${similarProducts.map(sim => `
                                <div class="similar-item" data-id="${sim.id}">
                                    <img src="${sim.image || 'images/products/placeholder.jpg'}" alt="${escapeHtml(sim.name)}" class="similar-item-img" onerror="handleImageError(this)">
                                    <span>${escapeHtml(sim.name)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="qty-selector">
                        <button class="qty-btn" id="fullMinus">-</button>
                        <span id="fullQty">${quantity}</span>
                        <button class="qty-btn" id="fullPlus">+</button>
                    </div>
                    <button class="add-to-cart-full" id="fullAddCart">Добавить в корзину</button>
                </div>
            </div>
        `;
        
        document.getElementById('fullMinus').onclick = () => { 
            if (quantity > 1) { 
                quantity--; 
                document.getElementById('fullQty').innerText = quantity; 
                document.getElementById('fullPrice').innerText = (product.price * quantity).toLocaleString() + " руб"; 
            } 
        };
        
        document.getElementById('fullPlus').onclick = () => { 
            quantity++; 
            document.getElementById('fullQty').innerText = quantity; 
            document.getElementById('fullPrice').innerText = (product.price * quantity).toLocaleString() + " руб"; 
        };
        
        document.getElementById('fullAddCart').onclick = () => { 
            addToCart(product, quantity); 
            modal.style.display = 'none'; 
        };
        
        document.querySelectorAll('.similar-item').forEach(item => {
            item.onclick = () => {
                const similarProduct = productsData.find(p => p.id === item.dataset.id);
                if (similarProduct) {
                    modal.style.display = 'none';
                    setTimeout(() => openFullscreenProduct(similarProduct), 100);
                }
            };
        });
    }
    
    renderDetail();
    modal.style.display = 'flex';
}

function initCategories() {
    const categories = [
        { id: "все", name: "Все" },
        { id: "конфеты", name: "Конфеты" },
        { id: "наборы", name: "Наборы" },
        { id: "десерты", name: "Десерты" },
        { id: "печенье", name: "Печенье" }
    ];
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
    container.innerHTML = categories.map(cat => '<div class="category-chip ' + (currentCategory === cat.id ? 'active' : '') + '" data-cat="' + cat.id + '">' + cat.name + '</div>').join('');
    document.querySelectorAll('.category-chip').forEach(el => { el.onclick = () => { currentCategory = el.dataset.cat; filterAndRenderCatalog(); initCategories(); }; });
}

function initSimpleFilters() {
    const filters = [{ id:'hit', label:'Хиты' }, { id:'gift', label:'Подарочные' }, { id:'diet', label:'Диетические' }];
    const container = document.getElementById('simpleFilterButtons');
    if (!container) return;
    container.innerHTML = filters.map(f => '<div class="filter-simple-btn ' + (activeSimpleFilter === f.id ? 'active' : '') + '" data-filter="' + f.id + '">' + f.label + '</div>').join('');
    document.querySelectorAll('.filter-simple-btn').forEach(btn => { btn.onclick = () => { activeSimpleFilter = activeSimpleFilter === btn.dataset.filter ? null : btn.dataset.filter; filterAndRenderCatalog(); initSimpleFilters(); updateActiveFiltersSide(); }; });
}

function updateActiveFiltersSide() {
    const container = document.getElementById('activeFiltersSide');
    if (!container) return;
    if (activeSimpleFilter) {
        let label = activeSimpleFilter === 'hit' ? 'Хиты' : activeSimpleFilter === 'gift' ? 'Подарочные' : 'Диетические';
        container.innerHTML = '<div class="filter-tag-side">' + label + ' <i class="fas fa-times"></i></div>';
        container.querySelector('i').onclick = () => { activeSimpleFilter = null; filterAndRenderCatalog(); initSimpleFilters(); updateActiveFiltersSide(); };
    } else container.innerHTML = '';
}

function initPriceSlider() {
    const minSlider = document.getElementById('priceMinSlider');
    const maxSlider = document.getElementById('priceMaxSlider');
    const rangeFill = document.getElementById('rangeFill');
    const minPriceSpan = document.getElementById('minPriceVal');
    const maxPriceSpan = document.getElementById('maxPriceVal');
    
    if (!minSlider || !maxSlider) return;
    
    const min = parseInt(minSlider.min);
    const max = parseInt(minSlider.max);
    
    function updateFill() {
        const percentMin = ((currentMinPrice - min) / (max - min)) * 100;
        const percentMax = ((currentMaxPrice - min) / (max - min)) * 100;
        if (rangeFill) {
            rangeFill.style.left = percentMin + '%';
            rangeFill.style.right = (100 - percentMax) + '%';
        }
    }
    
    function update() {
        let newMin = parseInt(minSlider.value);
        let newMax = parseInt(maxSlider.value);
        
        if (newMin > newMax) {
            [minSlider.value, maxSlider.value] = [newMax, newMin];
            newMin = parseInt(minSlider.value);
            newMax = parseInt(maxSlider.value);
        }
        
        currentMinPrice = newMin;
        currentMaxPrice = newMax;
        
        if (minPriceSpan) minPriceSpan.innerText = currentMinPrice;
        if (maxPriceSpan) maxPriceSpan.innerText = currentMaxPrice;
        
        updateFill();
        filterAndRenderCatalog();
    }
    
    minSlider.oninput = update;
    maxSlider.oninput = update;
    
    update();
}

function resetFilters() {
    currentMinPrice = 0;
    currentMaxPrice = 5000;
    currentCategory = "все";
    activeSimpleFilter = null;
    
    const minSlider = document.getElementById('priceMinSlider');
    const maxSlider = document.getElementById('priceMaxSlider');
    
    if (minSlider) minSlider.value = 0;
    if (maxSlider) maxSlider.value = 5000;
    
    if (minSlider && maxSlider) {
        minSlider.dispatchEvent(new Event('input'));
        maxSlider.dispatchEvent(new Event('input'));
    }
    
    filterAndRenderCatalog();
    initCategories();
    initSimpleFilters();
    updateActiveFiltersSide();
    
    showToast('Фильтры сброшены');
}

function initSearch() {
    const input = document.getElementById('searchInput');
    const autoList = document.getElementById('autocompleteList');
    if (!input) return;
    
    function highlightMatch(text, searchTerm) {
        if (!searchTerm || !text) return escapeHtml(text);
        const escapedText = escapeHtml(text);
        const escapedTerm = escapeHtml(searchTerm);
        const regex = new RegExp(`(${escapedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    input.oninput = (e) => {
        const value = e.target.value.toLowerCase().trim();
        if (!value) { 
            autoList.style.display = 'none'; 
            return; 
        }
        
        const matches = productsData.filter(p => p.name?.toLowerCase().includes(value));
        
        if (matches.length === 0) { 
            autoList.style.display = 'none'; 
            return; 
        }
        
        autoList.innerHTML = matches.map(p => `
            <div class="autocomplete-item" data-id="${p.id}">
                <img src="${p.image || 'images/products/placeholder.jpg'}" alt="${escapeHtml(p.name)}" class="autocomplete-img" onerror="handleImageError(this)">
                <div class="autocomplete-info">
                    <div class="autocomplete-name">${highlightMatch(p.name, value)}</div>
                    <div class="autocomplete-price">${p.price.toLocaleString()} руб</div>
                </div>
            </div>
        `).join('');
        
        autoList.style.display = 'block';
        
        document.querySelectorAll('.autocomplete-item').forEach(el => { 
            el.onclick = () => { 
                const p = productsData.find(p => p.id === el.dataset.id); 
                if(p) openFullscreenProduct(p); 
                autoList.style.display = 'none'; 
                input.value = ''; 
            }; 
        });
    };
    
    document.addEventListener('click', (e) => { 
        if (!document.querySelector('.search-area')?.contains(e.target)) {
            autoList.style.display = 'none'; 
        }
    });
}

function initMobileSearch() {
    const mobileInput = document.getElementById('mobileSearchInput');
    const mobileAutoList = document.getElementById('mobileAutocompleteList');
    if (!mobileInput || !mobileAutoList) return;
    
    function highlightMatchMobile(text, searchTerm) {
        if (!searchTerm || !text) return escapeHtml(text);
        const escapedText = escapeHtml(text);
        const escapedTerm = escapeHtml(searchTerm);
        const regex = new RegExp(`(${escapedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    mobileInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase().trim();
        if (!value) {
            mobileAutoList.style.display = 'none';
            return;
        }
        
        const matches = productsData.filter(p => p.name?.toLowerCase().includes(value));
        
        if (matches.length === 0) {
            mobileAutoList.style.display = 'none';
            return;
        }
        
        mobileAutoList.innerHTML = matches.map(p => `
            <div class="autocomplete-item" data-id="${p.id}">
                <img src="${p.image || 'images/products/placeholder.jpg'}" alt="${escapeHtml(p.name)}" class="autocomplete-img" onerror="handleImageError(this)">
                <div class="autocomplete-info">
                    <div class="autocomplete-name">${highlightMatchMobile(p.name, value)}</div>
                    <div class="autocomplete-price">${p.price.toLocaleString()} руб</div>
                </div>
            </div>
        `).join('');
        
        mobileAutoList.style.display = 'block';
        
        document.querySelectorAll('#mobileAutocompleteList .autocomplete-item').forEach(el => {
            el.onclick = () => {
                const p = productsData.find(p => p.id === el.dataset.id);
                if (p) openFullscreenProduct(p);
                mobileAutoList.style.display = 'none';
                mobileInput.value = '';
            };
        });
    });
    
    document.addEventListener('click', (e) => {
        const mobileSearchRow = document.querySelector('.mobile-search-row');
        if (mobileSearchRow && !mobileSearchRow.contains(e.target)) {
            mobileAutoList.style.display = 'none';
        }
    });
}

function initScroll() {
    const wrapper = document.getElementById('popularScroll');
    document.querySelector('.scroll-btn-left')?.addEventListener('click', () => wrapper?.scrollBy({ left: -320, behavior: 'smooth' }));
    document.querySelector('.scroll-btn-right')?.addEventListener('click', () => wrapper?.scrollBy({ left: 320, behavior: 'smooth' }));
}

function initPhoneMask() {
    const phoneInput = document.getElementById('orderPhone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function(e) {
        let x = this.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        if (!x) return;
        
        let formattedValue = '';
        if (x[2] !== '' || x[1] !== '') {
            formattedValue = '+' + (x[1] ? x[1] : '7') + (x[2] ? ' (' + x[2] : '');
        }
        if (x[3] !== '') {
            formattedValue += (formattedValue.includes('(') ? ') ' : '') + x[3];
        }
        if (x[4] !== '') {
            formattedValue += '-' + x[4];
        }
        if (x[5] !== '') {
            formattedValue += '-' + x[5];
        }
        
        this.value = formattedValue;
    });

    phoneInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' || 
            e.key === 'Escape' || e.key === 'Enter' || e.key === 'ArrowLeft' || 
            e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            return;
        }
        if (e.key < '0' || e.key > '9') {
            e.preventDefault();
        }
    });
}

function formatCardNumber(value) {
    let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = v.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];
    for (let i = 0; i < match.length; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
        return parts.join(' ');
    } else {
        return value;
    }
}

function formatExpiry(value) {
    let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
        return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
}

function validateCardNumber(number) {
    let clean = number.replace(/\s/g, '');
    return /^\d{16}$/.test(clean);
}

function validateExpiry(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    let [month, year] = expiry.split('/');
    let now = new Date();
    let currentYear = now.getFullYear() % 100;
    let currentMonth = now.getMonth() + 1;
    let expYear = parseInt(year);
    let expMonth = parseInt(month);
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    return true;
}

function validateCvv(cvv) {
    return /^\d{3}$/.test(cvv);
}

function initPaymentForm() {
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvvInput = document.getElementById('cardCvv');
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const cardForm = document.getElementById('cardPaymentForm');
    const deliverySelectGroup = document.getElementById('deliverySelectGroup');
    const pickupInfo = document.getElementById('pickupInfo');
    const addressGroup = document.getElementById('addressGroup');
    const addressInput = document.getElementById('orderAddress');
    const deliverySelect = document.getElementById('deliverySelect');
    
    // Если элементов нет, выходим
    if (!cardNumberInput || !cardForm) return;
    
    cardNumberInput.addEventListener('input', function(e) {
        let formatted = formatCardNumber(this.value);
        this.value = formatted;
    });
    
    cardExpiryInput.addEventListener('input', function(e) {
        let formatted = formatExpiry(this.value);
        this.value = formatted;
    });
    
   function updateDeliveryForm() {
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    const isCash = selectedPayment === 'cash';
    const selectedDelivery = deliverySelect ? deliverySelect.value : 'courier';
    
    // Показываем/скрываем форму оплаты картой
    if (cardForm) {
        cardForm.style.display = selectedPayment === 'card' ? 'block' : 'none';
    }
    
    // Показываем/скрываем выпадающий список для наличных
    if (deliverySelectGroup) {
        deliverySelectGroup.style.display = isCash ? 'block' : 'none';
    }
    
    // Показываем/скрываем информацию о самовывозе с пояснением
    if (pickupInfo) {
        if (selectedDelivery === 'pickup') {
            pickupInfo.style.display = 'flex';
            if (isCash) {
                pickupInfo.innerHTML = `
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <strong>Адрес самовывоза:</strong><br>
                        г. Москва, ул. Сладкая, 15<br>
                        (метро "Сладкая", выход N3, 5 минут пешком)<br>
                        <strong>Режим работы:</strong> ежедневно с 10:00 до 21:00<br>
                        <span style="color: var(--caramel); font-weight: 500;">Оплата наличными при получении</span>
                    </div>
                `;
            } else {
                pickupInfo.innerHTML = `
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <strong>Адрес самовывоза:</strong><br>
                        г. Москва, ул. Сладкая, 15<br>
                        (метро "Сладкая", выход N3, 5 минут пешком)<br>
                        <strong>Режим работы:</strong> ежедневно с 10:00 до 21:00<br>
                        <span style="color: var(--caramel); font-weight: 500;">Оплачено картой онлайн</span>
                    </div>
                `;
            }
        } else {
            pickupInfo.style.display = 'none';
        }
    }
    
    // Управление полем адреса
    if (addressGroup && addressInput) {
        if (selectedDelivery === 'pickup') {
            addressGroup.style.display = 'none';
            addressInput.value = 'Самовывоз (г. Москва, ул. Сладкая, 15)';
            addressInput.readOnly = true;
        } else {
            addressGroup.style.display = 'block';
            if (addressInput.readOnly && addressInput.value === 'Самовывоз (г. Москва, ул. Сладкая, 15)') {
                addressInput.value = '';
                addressInput.readOnly = false;
            }
        }
    }
}
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', updateDeliveryForm);
    });
    
    if (deliverySelect) {
        deliverySelect.addEventListener('change', updateDeliveryForm);
    }
    
    updateDeliveryForm();
}

async function handleOrderSubmitWithPayment() {
    if (!currentUser) { showToast('Войдите в аккаунт для оформления заказа'); openAuthModal(); return; }
    
    const name = document.getElementById('orderName')?.value.trim();
    const phoneRaw = document.getElementById('orderPhone')?.value.trim();
    let address = document.getElementById('orderAddress')?.value.trim();
    const comment = document.getElementById('orderComment')?.value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    let deliveryMethod = null;
    let isPickup = false;
    
    if (paymentMethod === 'cash') {
        const deliverySelect = document.getElementById('deliverySelect');
        deliveryMethod = deliverySelect ? deliverySelect.value : 'courier';
        isPickup = deliveryMethod === 'pickup';
        
        if (isPickup) {
            address = 'Самовывоз (г. Москва, ул. Сладкая, 15)';
        }
    }
    
    const phoneDigits = phoneRaw ? phoneRaw.replace(/\D/g, '') : '';
    
    if (!name || !phoneRaw) { 
        showToast('Заполните имя и телефон'); 
        return; 
    }
    
    if (paymentMethod === 'cash' && !isPickup && !address) {
        showToast('Введите адрес доставки');
        return;
    }
    
    if (paymentMethod === 'card' && !address) {
        showToast('Введите адрес доставки');
        return;
    }
    
    if (phoneDigits.length !== 11) { 
        showToast('Введите корректный номер телефона (11 цифр)'); 
        return; 
    }
    
    if (cart.length === 0) { 
        showToast('Корзина пуста'); 
        return; 
    }
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber')?.value;
        const cardExpiry = document.getElementById('cardExpiry')?.value;
        const cardCvv = document.getElementById('cardCvv')?.value;
        
        if (!validateCardNumber(cardNumber)) {
            showToast('Введите корректный номер карты (16 цифр)');
            return;
        }
        if (!validateExpiry(cardExpiry)) {
            showToast('Введите корректный срок действия карты (ММ/ГГ)');
            return;
        }
        if (!validateCvv(cardCvv)) {
            showToast('Введите корректный CVV код (3 цифры)');
            return;
        }
    }
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const submitBtn = document.getElementById('submitOrderBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Оформление...'; 
    submitBtn.disabled = true;
    
    const cartCopy = [...cart];
    
    const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: name,
        userPhone: phoneDigits,
        userAddress: address,
        userComment: comment || "",
        paymentMethod: paymentMethod,
        deliveryMethod: paymentMethod === 'cash' ? deliveryMethod : null,
        isPickup: isPickup,
        items: cartCopy.map(item => ({ 
            productId: item.id, 
            productName: item.name, 
            quantity: item.quantity, 
            price: item.price, 
            total: item.price * item.quantity 
        })),
        totalAmount: totalAmount
    };
    
    try {
        await saveOrder(orderData);
        
        cart = [];
        updateCartCounter();
        
        document.getElementById('orderName').value = '';
        document.getElementById('orderPhone').value = '';
        document.getElementById('orderAddress').value = '';
        document.getElementById('orderComment').value = '';
        
        if (paymentMethod === 'card') {
            document.getElementById('cardNumber').value = '';
            document.getElementById('cardExpiry').value = '';
            document.getElementById('cardCvv').value = '';
            showToast('Заказ оплачен! Спасибо за покупку!');
        } else {
            if (isPickup) {
                showToast('Заказ оформлен! Ждём вас в нашем магазине для оплаты и получения.');
            } else {
                showToast('Заказ оформлен! Курьер доставит заказ, оплата при получении.');
            }
        }
        
        showPage('home');
        
    } catch (e) { 
        console.error('Ошибка:', e);
        showToast('Ошибка при оформлении заказа: ' + (e.message || 'Неизвестная ошибка')); 
    } finally { 
        submitBtn.innerHTML = originalText; 
        submitBtn.disabled = false; 
    }
}

function initFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyCZs6ujQrkdgjDC8aYmbQaQJzDXNx6IYAw",
        authDomain: "slad3-b157f.firebaseapp.com",
        projectId: "slad3-b157f",
        storageBucket: "slad3-b157f.firebasestorage.app",
        messagingSenderId: "278921497787",
        appId: "1:278921497787:web:3a4ad159a6586418596d9e"
    };
    
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        auth = firebase.auth();
        db = firebase.firestore();
        console.log('Firebase инициализирован');
        
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .catch((error) => console.error('Ошибка установки persistence:', error));
        
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('Пользователь авторизован:', user.email);
                currentUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email.split('@')[0]
                };
                updateAuthUI();
                if (currentPage === 'admin' && isAdmin(currentUser)) {
                    renderAdminProductsList();
                    renderOrdersList();
                }
            } else {
                console.log('Пользователь не авторизован');
                currentUser = null;
                updateAuthUI();
            }
        });
        
        loadProductsFromFirestore();
        loadOrdersFromFirestore();
        
        setTimeout(() => {
            updateCartCounter();
        }, 500);
        
    } else {
        console.warn('Firebase не загружен');
        loadProductsFromLocal();
        loadOrdersFromLocal();
        updateCartCounter();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    initMobileSearch();
    
    document.getElementById('homeNavBtn').onclick = () => { closeMobileMenu(); showPage('home'); };
    document.getElementById('catalogNavBtn').onclick = () => { closeMobileMenu(); showPage('catalog'); };
    document.getElementById('deliveryNavBtn').onclick = () => { closeMobileMenu(); showPage('delivery'); };
    document.getElementById('aboutNavBtn').onclick = () => { closeMobileMenu(); showPage('about'); };
    document.getElementById('adminNavBtn').onclick = () => { closeMobileMenu(); showPage('admin'); };
    document.getElementById('cartNavBtn').onclick = () => { closeMobileMenu(); showPage('cart'); };
    document.getElementById('goToCatalogBtn').onclick = () => { closeMobileMenu(); showPage('catalog'); };
    document.getElementById('logoLink').onclick = () => { closeMobileMenu(); showPage('home'); };
    document.getElementById('backFromCart').onclick = () => { closeMobileMenu(); showPage('catalog'); };
    document.getElementById('aboutMoreBtn').onclick = () => { closeMobileMenu(); showPage('about'); };

    document.getElementById('submitOrderBtn').onclick = handleOrderSubmitWithPayment;
    document.getElementById('addProductBtn').onclick = addProduct;
    document.getElementById('resetFiltersSide').onclick = resetFilters;
    
    document.getElementById('sortSelect').onchange = (e) => { currentSort = e.target.value; filterAndRenderCatalog(); };
    
    document.querySelector('.fullscreen-close').onclick = () => { document.getElementById('fullscreenProductModal').style.display = 'none'; };
    document.querySelector('.auth-modal-close').onclick = () => { document.getElementById('authModal').style.display = 'none'; };
    
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mainNav) mainNav.classList.toggle('mobile-open');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (mainNav && mainNav.classList.contains('mobile-open')) {
            if (!mainNav.contains(e.target) && !menuToggle?.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMobileMenu();
        }
    });
    
    window.onclick = (e) => {
        if (e.target === document.getElementById('fullscreenProductModal')) document.getElementById('fullscreenProductModal').style.display = 'none';
        if (e.target === document.getElementById('authModal')) document.getElementById('authModal').style.display = 'none';
    };
    
    initCategories();
    initSimpleFilters();
    initPriceSlider();
    initSearch();
    initPhoneMask();
    initScroll();
    initAuthModalTabs();
    initAdminTabs();
    initOrderStatusFilters();
    initPaymentForm();
    updateAuthUI();
    
    document.querySelectorAll('.footer-link').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            closeMobileMenu();
            const page = link.dataset.page;
            if (page === 'about') showPage('about');
            if (page === 'delivery') showPage('delivery');
        };
    });
    
    document.querySelectorAll('.footer-category-link').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            closeMobileMenu();
            const category = link.dataset.category;
            if (category) {
                currentCategory = category;
                showPage('catalog');
                filterAndRenderCatalog();
                initCategories();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
    });
    
    const editModal = document.getElementById('editProductModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    
    if (closeEditModal) closeEditModal.onclick = () => { if (editModal) editModal.style.display = 'none'; };
    if (cancelEditBtn) cancelEditBtn.onclick = () => { if (editModal) editModal.style.display = 'none'; };
    if (saveEditBtn) saveEditBtn.onclick = () => saveEditedProduct();
    
    updateCartCounter();
    showPage('home');
});