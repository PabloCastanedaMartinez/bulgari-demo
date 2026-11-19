import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PRODUCTS } from './data/products.js';
import {
  formatGTQ,
  generateOrderFolio
} from './utils/currency.js';
import {
  TRACKING_STEP_MS,
  getOrderTrackingState,
  normalizeOrderTracking
} from './utils/tracking.js';
import Header from './components/Header.jsx';
import StoreView from './components/StoreView.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CheckoutView from './components/CheckoutView.jsx';
import ConfirmationView from './components/ConfirmationView.jsx';
import ProductModal from './components/ProductModal.jsx';
import HistoryModal from './components/HistoryModal.jsx';

const STORAGE_CART_KEY = 'bulgari_gtq_cart_v1';
const STORAGE_ORDERS_KEY = 'bulgari_gtq_reservations_v2';

function readStoredCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_CART_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => PRODUCTS.some((p) => p.id === item.productId) && Number(item.qty) > 0
    );
  } catch {
    return [];
  }
}

function readStoredOrders() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_ORDERS_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    return parsed
      .filter((order) => order && typeof order === 'object')
      .map((order) => normalizeOrderTracking(order, now));
  } catch {
    return [];
  }
}

function getDefaultVariants() {
  const map = {};
  for (const product of PRODUCTS) {
    map[product.id] = product.variants[0];
  }
  return map;
}

export default function App() {
  const [view, setView] = useState('vista-tienda');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [onlyToday, setOnlyToday] = useState(false);
  const [sortBy, setSortBy] = useState('destacados');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariants, setSelectedVariants] = useState(getDefaultVariants);

  const [cart, setCart] = useState(readStoredCart);
  const [orders, setOrders] = useState(readStoredOrders);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productModalId, setProductModalId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [demoCheckoutOpts, setDemoCheckoutOpts] = useState(null);

  const [toastMsg, setToastMsg] = useState('');
  const [srAnnouncement, setSrAnnouncement] = useState('');
  const toastTimerRef = useRef(null);
  const cartButtonRef = useRef(null);
  const activeOrderIdRef = useRef(activeOrderId);
  const viewRef = useRef(view);

  useEffect(() => {
    activeOrderIdRef.current = activeOrderId;
  }, [activeOrderId]);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setSrAnnouncement('');
    requestAnimationFrame(() => setSrAnnouncement(msg));
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg('');
    }, 3000);
  }, []);

  // Persistencia de carrito y órdenes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // Ignorar si almacenamiento no está disponible
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // Ignorar si almacenamiento no está disponible
    }
  }, [orders]);

  // Soporte de ?demo=... para verificación e inspección rápida
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demo = params.get('demo');
    if (!demo) return;

    const ensureDemoCart = () => {
      setCart((prev) => {
        if (prev.length > 0) return prev;
        return [
          { productId: 'kit-lettering-pelikan', variant: PRODUCTS[0].variants[0], qty: 1 },
          { productId: 'colores-bozetto-24', variant: PRODUCTS[1].variants[0], qty: 2 }
        ];
      });
    };

    if (demo === 'carrito') {
      ensureDemoCart();
      setIsCartOpen(true);
    } else if (demo === 'checkout' || demo === 'reserva') {
      ensureDemoCart();
      setDemoCheckoutOpts({
        fill: params.get('fill') === '1',
        cashBill: 200
      });
      setView('vista-checkout');
    } else if (demo === 'confirmacion') {
      setOrders((prev) => {
        if (prev.length > 0) {
          setActiveOrderId(prev[0].id);
          return prev;
        }

        const demoCreatedAtMs = Date.now() - 2 * TRACKING_STEP_MS;
        const demoOrder = {
          id: 'BLG-4821',
          createdAt: new Date(demoCreatedAtMs).toLocaleString('es-GT', {
            dateStyle: 'medium',
            timeStyle: 'short'
          }),
          createdAtMs: demoCreatedAtMs,
          trackingIndex: 2,
          pickup: {
            nombre: 'Andrea Morales Argueta',
            telefono: '4558 9615',
            email: 'andrea.morales@ejemplo.com',
            horario: 'Hoy, en 1 – 2 horas (express)',
            notas: 'Pasaré después de las 16:00 h; favor empacar en bolsa resistente'
          },
          payment: {
            method: 'efectivo',
            label: 'Efectivo en mostrador al recoger',
            paidWith: 200,
            changeDue: 42,
            statusText: 'Pagas en tienda con Q200.00 · Vuelto preparado en caja: Q42.00'
          },
          items: [
            {
              id: 'kit-lettering-pelikan',
              name: 'Marcadores Pelikan Lettering Punta Pincel',
              image: '/assets/img/bulgari-pelikan.jpg',
              alt: PRODUCTS[0].alt,
              variant: PRODUCTS[0].variants[0],
              qty: 1,
              lineTotal: 68
            },
            {
              id: 'colores-bozetto-24',
              name: 'Lápices de Color Bozetto 24 Colores Mina 4 mm',
              image: '/assets/img/bulgari-bozetto.jpg',
              alt: PRODUCTS[1].alt,
              variant: PRODUCTS[1].variants[0],
              qty: 2,
              lineTotal: 90
            }
          ],
          subtotal: 158,
          total: 158
        };
        setActiveOrderId(demoOrder.id);
        return [demoOrder];
      });
      setView('vista-confirmacion');
    }
  }, []);

  const availableStockByProduct = useMemo(() => {
    const reservedByProduct = {};
    for (const order of orders) {
      if (!Array.isArray(order?.items)) continue;
      for (const item of order.items) {
        if (!item?.id) continue;
        reservedByProduct[item.id] = (reservedByProduct[item.id] || 0) + (Number(item.qty) || 0);
      }
    }

    const map = {};
    for (const product of PRODUCTS) {
      const baseStock = Number(product.stock) || 0;
      const reservedQty = reservedByProduct[product.id] || 0;
      map[product.id] = Math.max(0, baseStock - reservedQty);
    }
    return map;
  }, [orders]);

  const getAvailableStock = useCallback(
    (productId) => availableStockByProduct[productId] ?? 0,
    [availableStockByProduct]
  );

  const getProductCartQty = useCallback(
    (productId) =>
      cart.reduce(
        (sum, item) => (item.productId === productId ? sum + (Number(item.qty) || 0) : sum),
        0
      ),
    [cart]
  );

  const cartMetrics = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    const items = [];
    const qtyByProduct = {};

    for (const entry of cart) {
      qtyByProduct[entry.productId] = (qtyByProduct[entry.productId] || 0) + (Number(entry.qty) || 0);
    }

    const stockErrorMessagesByProduct = {};

    for (const entry of cart) {
      const product = PRODUCTS.find((p) => p.id === entry.productId);
      if (!product) continue;
      const lineTotal = product.price * entry.qty;
      const availableStock = getAvailableStock(product.id);
      const productCartQty = qtyByProduct[product.id] || 0;
      const remainingStock = Math.max(0, availableStock - productCartQty);
      const atMaxStock = productCartQty >= availableStock;
      const exceedsStock = productCartQty > availableStock || availableStock <= 0;

      if (exceedsStock && !stockErrorMessagesByProduct[product.id]) {
        stockErrorMessagesByProduct[product.id] =
          availableStock <= 0
            ? `Sin stock disponible para "${product.name}".`
            : `Stock insuficiente para "${product.name}". Solo hay ${availableStock} ${
                availableStock === 1 ? 'unidad disponible' : 'unidades disponibles'
              } (tienes ${productCartQty} en reserva).`;
      }

      count += entry.qty;
      subtotal += lineTotal;
      items.push({
        product,
        variant: entry.variant,
        qty: entry.qty,
        lineTotal,
        availableStock,
        productCartQty,
        remainingStock,
        atMaxStock,
        exceedsStock
      });
    }

    const stockErrors = Object.values(stockErrorMessagesByProduct);
    const hasStockErrors = stockErrors.length > 0;
    const total = subtotal;
    return { count, subtotal, total, items, hasStockErrors, stockErrors };
  }, [cart, getAvailableStock]);

  const showMobileBar = cartMetrics.count > 0 && view === 'vista-tienda';

  useEffect(() => {
    document.body.classList.toggle('has-mobile-bar', showMobileBar);
    return () => document.body.classList.remove('has-mobile-bar');
  }, [showMobileBar]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (selectedCategory !== 'todos' && p.category !== selectedCategory) return false;
      if (onlyToday && !p.today) return false;
      if (query) {
        const haystack = `${p.name} ${p.categoryLabel} ${p.description} ${p.variants.join(' ')}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    if (sortBy === 'precio-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'precio-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedCategory, onlyToday, searchQuery, sortBy]);

  const getCartQty = useCallback(
    (productId, variant) => {
      const found = cart.find((item) => item.productId === productId && item.variant === variant);
      return found ? found.qty : 0;
    },
    [cart]
  );

  const handleSelectVariant = useCallback((productId, variant) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  }, []);

  const handleAddToCart = useCallback(
    (productId, variant, qty = 1) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return false;

      const availableStock = getAvailableStock(productId);
      const currentProductQty = getProductCartQty(productId);

      if (availableStock <= 0) {
        showToast(`Sin stock disponible para "${product.name}".`);
        return false;
      }

      if (currentProductQty + qty > availableStock) {
        showToast(
          `Stock insuficiente para "${product.name}". Solo hay ${availableStock} ${
            availableStock === 1 ? 'unidad disponible' : 'unidades disponibles'
          }.`
        );
        return false;
      }

      const chosenVariant = variant || product.variants[0];

      setCart((prev) => {
        const idx = prev.findIndex(
          (item) => item.productId === productId && item.variant === chosenVariant
        );
        if (idx === -1) {
          return [...prev, { productId, variant: chosenVariant, qty }];
        }
        return prev.map((item, i) =>
          i === idx ? { ...item, qty: item.qty + qty } : item
        );
      });

      showToast(`Agregado a reserva: ${product.name} (${chosenVariant})`);
      return true;
    },
    [getAvailableStock, getProductCartQty, showToast]
  );

  const handleUpdateQty = useCallback(
    (productId, variant, delta) => {
      if (delta > 0) {
        const product = PRODUCTS.find((p) => p.id === productId);
        const availableStock = getAvailableStock(productId);
        const currentProductQty = getProductCartQty(productId);
        if (currentProductQty + delta > availableStock) {
          const name = product ? product.name : 'este producto';
          showToast(
            `Alcanzaste el límite de stock disponible para "${name}" (${availableStock} ${
              availableStock === 1 ? 'unidad' : 'unidades'
            }).`
          );
          return;
        }
      }

      setCart((prev) => {
        const next = prev
          .map((item) =>
            item.productId === productId && item.variant === variant
              ? { ...item, qty: item.qty + delta }
              : item
          )
          .filter((item) => item.qty > 0);

        if (next.length === 0 && view === 'vista-checkout') {
          setView('vista-tienda');
          showToast('Tu lista de reserva quedó vacía; volviste al catálogo.');
        }
        return next;
      });
    },
    [getAvailableStock, getProductCartQty, view, showToast]
  );

  const handleRemoveItem = useCallback(
    (productId, variant) => {
      setCart((prev) => {
        const next = prev.filter(
          (item) => !(item.productId === productId && item.variant === variant)
        );
        if (next.length === 0 && view === 'vista-checkout') {
          setView('vista-tienda');
          showToast('Tu lista de reserva quedó vacía; volviste al catálogo.');
        }
        return next;
      });
    },
    [view, showToast]
  );

  const handleClearCart = useCallback(() => {
    setCart([]);
    showToast('Lista de reserva vaciada');
  }, [showToast]);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory('todos');
    setOnlyToday(false);
    setSortBy('destacados');
    setSearchQuery('');
  }, []);

  const switchView = useCallback((nextView, anchorSelector = null) => {
    setView(nextView);
    if (nextView === 'vista-checkout' || nextView === 'vista-confirmacion') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else if (anchorSelector) {
      requestAnimationFrame(() => {
        document.querySelector(anchorSelector)?.scrollIntoView();
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const handleGoToCheckout = useCallback(() => {
    if (cartMetrics.count === 0) {
      showToast('Agrega al menos un producto antes de continuar con tu reserva.');
      return;
    }
    if (cartMetrics.hasStockErrors) {
      showToast(
        cartMetrics.stockErrors[0] ||
          'Ajusta las cantidades que superan el stock disponible antes de continuar.'
      );
      return;
    }
    setIsCartOpen(false);
    switchView('vista-checkout');
  }, [cartMetrics.count, cartMetrics.hasStockErrors, cartMetrics.stockErrors, showToast, switchView]);

  const handleOrderConfirmed = useCallback(
    ({ id, createdAt, createdAtMs, pickup, payment }) => {
      if (cartMetrics.items.length === 0) {
        showToast('Tu lista de reserva está vacía.');
        return false;
      }
      if (cartMetrics.hasStockErrors) {
        showToast(
          cartMetrics.stockErrors[0] ||
            'No hay stock suficiente para completar tu reserva.'
        );
        return false;
      }

      const qtyByProduct = {};
      for (const item of cartMetrics.items) {
        qtyByProduct[item.product.id] = (qtyByProduct[item.product.id] || 0) + item.qty;
      }
      for (const [productId, totalQty] of Object.entries(qtyByProduct)) {
        const available = getAvailableStock(productId);
        if (totalQty > available) {
          const product = PRODUCTS.find((p) => p.id === productId);
          showToast(
            `Stock insuficiente para "${product?.name || productId}". Solo hay ${available} ${
              available === 1 ? 'unidad disponible' : 'unidades disponibles'
            }.`
          );
          return false;
        }
      }

      const resolvedCreatedAtMs =
        typeof createdAtMs === 'number' && Number.isFinite(createdAtMs) ? createdAtMs : Date.now();

      const order = {
        id: id || generateOrderFolio(),
        createdAt:
          createdAt ||
          new Date(resolvedCreatedAtMs).toLocaleString('es-GT', {
            dateStyle: 'medium',
            timeStyle: 'short'
          }),
        createdAtMs: resolvedCreatedAtMs,
        trackingIndex: 0,
        pickup,
        payment,
        items: cartMetrics.items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          alt: item.product.alt,
          variant: item.variant,
          qty: item.qty,
          lineTotal: item.lineTotal
        })),
        subtotal: cartMetrics.subtotal,
        total: cartMetrics.total
      };

      setOrders((prev) => [order, ...prev]);
      setActiveOrderId(order.id);
      setCart([]);
      switchView('vista-confirmacion');
      showToast(`Reserva ${order.id} registrada para recoger en tienda (${formatGTQ(order.total)})`);
      return true;
    },
    [cartMetrics, getAvailableStock, showToast, switchView]
  );

  // Sincronización cronometrada del estado del pedido en incrementos de 15 minutos
  useEffect(() => {
    if (orders.length === 0) return undefined;

    let timerId = null;
    let disposed = false;

    const syncOrders = () => {
      if (disposed) return;
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }

      const now = Date.now();
      let changed = false;
      let minRemainingMs = Infinity;
      let activeAdvancedTitle = null;
      const targetActiveId =
        (orders.find((o) => o.id === activeOrderIdRef.current) || orders[0])?.id || null;

      const nextOrders = orders.map((order) => {
        const state = getOrderTrackingState(order, now);
        if (!state.isCompleted) {
          minRemainingMs = Math.min(minRemainingMs, state.remainingMs);
        }
        if (state.trackingIndex !== order.trackingIndex || state.createdAtMs !== order.createdAtMs) {
          changed = true;
          if (order.id === targetActiveId && state.trackingIndex > (Number(order.trackingIndex) || 0)) {
            activeAdvancedTitle = state.currentStep.title;
          }
          return {
            ...order,
            createdAtMs: state.createdAtMs,
            trackingIndex: state.trackingIndex
          };
        }
        return order;
      });

      if (changed) {
        setOrders(nextOrders);
        if (activeAdvancedTitle && viewRef.current === 'vista-confirmacion') {
          showToast(`Estado del pedido actualizado: ${activeAdvancedTitle}`);
        }
        return;
      }

      if (Number.isFinite(minRemainingMs)) {
        const delay = Math.min(Math.max(250, minRemainingMs + 100), 60_000);
        timerId = setTimeout(syncOrders, delay);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncOrders();
      }
    };

    syncOrders();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      disposed = true;
      if (timerId) clearTimeout(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [orders, showToast]);

  const modalProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === productModalId) || null,
    [productModalId]
  );

  const activeOrder = useMemo(
    () => orders.find((o) => o.id === activeOrderId) || orders[0] || null,
    [orders, activeOrderId]
  );

  return (
    <>
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido principal
      </a>

      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (view !== 'vista-tienda') {
            switchView('vista-tienda', '#catalogo');
          }
        }}
        ordersCount={orders.length}
        cartCount={cartMetrics.count}
        isCartOpen={isCartOpen}
        onGoHome={() => switchView('vista-tienda')}
        onNavigateAnchor={(anchor) => switchView('vista-tienda', anchor)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartButtonRef={cartButtonRef}
      />

      <main id="contenido-principal">
        {view === 'vista-tienda' && (
          <StoreView
            filteredProducts={filteredProducts}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onlyToday={onlyToday}
            onToggleToday={setOnlyToday}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
            selectedVariants={selectedVariants}
            onSelectVariant={handleSelectVariant}
            getCartQty={getCartQty}
            getAvailableStock={getAvailableStock}
            getProductCartQty={getProductCartQty}
            onAddToCart={handleAddToCart}
            onUpdateQty={handleUpdateQty}
            onOpenProductModal={(id) => setProductModalId(id)}
            onHeroQuickAdd={() => {
              const kit = PRODUCTS.find((p) => p.id === 'kit-escolar-bulgari') || PRODUCTS[0];
              const added = handleAddToCart(kit.id, kit.variants[0], 1);
              if (added) {
                setIsCartOpen(true);
              }
            }}
          />
        )}

        {view === 'vista-checkout' && (
          <CheckoutView
            metrics={cartMetrics}
            demoOptions={demoCheckoutOpts}
            onBackToStore={() => switchView('vista-tienda', '#catalogo')}
            onOrderConfirmed={handleOrderConfirmed}
            onShowToast={showToast}
          />
        )}

        {view === 'vista-confirmacion' && (
          <ConfirmationView
            order={activeOrder}
            onBackToCatalog={() => switchView('vista-tienda', '#catalogo')}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        )}
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <div className="footer-brand">
            <span className="brand-name">Librería Bulgari (Comercial Bulgari)</span>
            <p className="footer-address">
              Interplaza Escuintla, Km. 60 Autopista Palín-Escuintla, Segundo Nivel, Locales L-259 y L-260 · Tel. 7764-1568 · WhatsApp 4558-9615
            </p>
          </div>
          <div className="footer-meta">
            <p>
              Catálogo en Quetzales guatemaltecos (GTQ) —{' '}
              <a href="https://www.facebook.com/libreriabulgari" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>{' '}
              ·{' '}
              <a href="https://instagram.com/libreriabulgari" target="_blank" rel="noopener noreferrer">
                Instagram (@libreriabulgari)
              </a>
            </p>
            <p className="credits-line">
              Activos propios de Librería Bulgari y fotografías complementarias vía Unsplash
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        metrics={cartMetrics}
        showMobileBar={showMobileBar}
        onClose={() => setIsCartOpen(false)}
        onOpenCart={() => setIsCartOpen(true)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onGoToCheckout={handleGoToCheckout}
        onBrowseCatalog={() => {
          setIsCartOpen(false);
          switchView('vista-tienda', '#catalogo');
        }}
        returnFocusToRef={cartButtonRef}
      />

      <ProductModal
        product={modalProduct}
        selectedVariant={modalProduct ? selectedVariants[modalProduct.id] : ''}
        availableStock={modalProduct ? getAvailableStock(modalProduct.id) : 0}
        productCartQty={modalProduct ? getProductCartQty(modalProduct.id) : 0}
        onSelectVariant={handleSelectVariant}
        onAddToCart={handleAddToCart}
        onClose={() => setProductModalId(null)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        orders={orders}
        onSelectOrder={(orderId) => {
          setActiveOrderId(orderId);
          setIsHistoryOpen(false);
          switchView('vista-confirmacion');
        }}
        onClose={() => setIsHistoryOpen(false)}
      />

      <div className="sr-only" aria-live="polite">
        {srAnnouncement}
      </div>

      {toastMsg && (
        <div className="toast" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </>
  );
}
