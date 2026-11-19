import React, { useEffect, useRef } from 'react';
import { formatGTQ } from '../utils/currency.js';

export default function CartDrawer({
  isOpen,
  metrics,
  showMobileBar,
  onClose,
  onOpenCart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onGoToCheckout,
  onBrowseCatalog,
  returnFocusToRef
}) {
  const closeBtnRef = useRef(null);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      closeBtnRef.current?.focus();
    } else if (!isOpen && prevOpenRef.current) {
      returnFocusToRef.current?.focus();
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, returnFocusToRef]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="drawer-backdrop"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {isOpen && (
        <aside
          className="cart-drawer"
          id="carrito-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="carrito-titulo"
        >
          <div className="drawer-header">
            <h2 id="carrito-titulo">Tu lista de reserva</h2>
            <button
              ref={closeBtnRef}
              type="button"
              className="icon-btn"
              aria-label="Cerrar lista de reserva"
              onClick={onClose}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="shipping-meter">
            <p className="shipping-meter-text">
              Retiro sin costo en Interplaza Escuintla (2.º Nivel, Locales L-259 y L-260). Sin compra ni pagos online.
            </p>
          </div>

          <div className="drawer-body">
            {metrics.items.length === 0 ? (
              <div className="cart-empty">
                <p className="empty-title">Tu lista de reserva está vacía</p>
                <p className="empty-desc">
                  Agrega útiles escolares, marcadores Pelikan, colores Bozetto o artículos de oficina para apartarlos y recogerlos en tienda.
                </p>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={onBrowseCatalog}
                >
                  Explorar catálogo
                </button>
              </div>
            ) : (
              <ul className="cart-list">
                {metrics.items.map((item) => (
                  <li key={`${item.product.id}__${item.variant}`} className="cart-item">
                    <img className="cart-item-img" src={item.product.image} alt={item.product.alt} />
                    <div className="cart-item-main">
                      <div className="cart-item-head">
                        <div>
                          <p className="cart-item-title">{item.product.name}</p>
                          <p className="cart-item-variant">{item.variant}</p>
                          {item.exceedsStock ? (
                            <p className="cart-item-stock cart-item-stock--error tabular">
                              Supera el stock disponible ({item.availableStock} disp.)
                            </p>
                          ) : item.atMaxStock ? (
                            <p className="cart-item-stock cart-item-stock--limit tabular">
                              Límite de stock alcanzado ({item.availableStock} disp.)
                            </p>
                          ) : (
                            <p className="cart-item-stock tabular">
                              Stock disponible: {item.availableStock} uds.
                            </p>
                          )}
                        </div>
                        <strong className="tabular">{formatGTQ(item.lineTotal)}</strong>
                      </div>
                      <div className="cart-item-controls">
                        <div className="qty-stepper">
                          <button
                            type="button"
                            aria-label={`Disminuir cantidad de ${item.product.name}`}
                            onClick={() => onUpdateQty(item.product.id, item.variant, -1)}
                          >
                            −
                          </button>
                          <span className="tabular">{item.qty}</span>
                          <button
                            type="button"
                            className={item.atMaxStock ? 'qty-stepper-btn--limit' : undefined}
                            aria-label={`Aumentar cantidad de ${item.product.name}`}
                            aria-disabled={item.atMaxStock ? 'true' : 'false'}
                            onClick={() => onUpdateQty(item.product.id, item.variant, 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => onRemoveItem(item.product.id, item.variant)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {metrics.items.length > 0 && (
            <div className="drawer-footer">
              <dl className="drawer-totals">
                <div className="total-row">
                  <dt>Subtotal</dt>
                  <dd className="tabular">{formatGTQ(metrics.subtotal)}</dd>
                </div>
                <div className="total-row">
                  <dt>Retiro en tienda</dt>
                  <dd className="tabular">Sin costo (Interplaza)</dd>
                </div>
                <div className="total-row total-row--grand">
                  <dt>Total a pagar al recoger</dt>
                  <dd className="tabular">{formatGTQ(metrics.total)}</dd>
                </div>
              </dl>
              {metrics.hasStockErrors && (
                <div className="stock-alert" role="alert">
                  Ajusta las cantidades que superan el stock disponible antes de continuar con tu reserva.
                </div>
              )}
              <p className="drawer-address-reminder">
                Sin compra online: en el siguiente paso ingresarás tu nombre y horario de retiro para reservar y pagar únicamente en efectivo en mostrador al recoger.
              </p>
              <div className="drawer-actions">
                <button
                  type="button"
                  className="btn btn--primary btn--full"
                  disabled={metrics.hasStockErrors}
                  onClick={onGoToCheckout}
                >
                  Continuar a datos de reserva
                </button>
                <button
                  type="button"
                  className="btn btn--quiet btn--full"
                  onClick={onClearCart}
                >
                  Vaciar lista
                </button>
              </div>
            </div>
          )}
        </aside>
      )}

      {showMobileBar && (
        <div className="mobile-cart-bar">
          <div className="mobile-cart-info">
            <span className="mobile-cart-count tabular">
              {metrics.count === 1 ? '1 artículo para reservar' : `${metrics.count} artículos para reservar`}
            </span>
            <strong className="mobile-cart-total tabular">{formatGTQ(metrics.total)}</strong>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onOpenCart}
          >
            Ver reserva
          </button>
        </div>
      )}
    </>
  );
}
