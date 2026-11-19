import React, { useEffect, useRef, useState } from 'react';
import { formatGTQ } from '../utils/currency.js';

export default function ProductModal({
  product,
  selectedVariant,
  availableStock = 0,
  productCartQty = 0,
  onSelectVariant,
  onAddToCart,
  onClose
}) {
  const dialogRef = useRef(null);
  const [stockNotice, setStockNotice] = useState('');

  useEffect(() => {
    setStockNotice('');
  }, [product?.id, availableStock, productCartQty]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (product && !dialog.open) {
      dialog.showModal();
    } else if (!product && dialog.open) {
      dialog.close();
    }
  }, [product]);

  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;
  const atMaxStock = productCartQty >= availableStock;

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      id="producto-modal"
      aria-labelledby="modal-prod-titulo"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      {product && (
        <div className="modal-card">
          <div className="modal-header">
            <h2 id="modal-prod-titulo">{product.name}</h2>
            <button
              type="button"
              className="icon-btn"
              aria-label="Cerrar ficha de producto"
              onClick={onClose}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="product-modal-grid">
            <img className="product-modal-img" src={product.image} alt={product.alt} />
            <div className="product-modal-info">
              <div className="modal-stock-row">
                <strong className="product-price tabular">{formatGTQ(product.price)}</strong>
                {isOutOfStock ? (
                  <span className="meta-tag meta-tag--stock-out">Agotado</span>
                ) : isLowStock ? (
                  <span className="meta-tag meta-tag--stock-low tabular">
                    {availableStock === 1
                      ? '¡Última 1 unidad!'
                      : `¡Últimas ${availableStock} unidades!`}
                  </span>
                ) : (
                  <span className="meta-tag meta-tag--stock-ok tabular">
                    Stock disponible: {availableStock} unidades
                  </span>
                )}
              </div>
              {productCartQty > 0 && (
                <p className="modal-reserved-note tabular">
                  En tu reserva: {productCartQty} de {availableStock}{' '}
                  {availableStock === 1 ? 'unidad' : 'unidades'}
                  {atMaxStock ? ' (límite alcanzado)' : ''}
                </p>
              )}
              <p className="product-desc">{product.description}</p>
              <div className="variant-group">
                <span className="variant-label">Presentación</span>
                <div className="variant-pills">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      className="variant-btn"
                      aria-pressed={variant === selectedVariant ? 'true' : 'false'}
                      onClick={() => onSelectVariant(product.id, variant)}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
              <dl className="spec-list">
                {product.specs.map(([key, val]) => (
                  <div key={key} className="spec-row">
                    <dt>{key}</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>
              {stockNotice && (
                <div className="stock-alert" role="alert">
                  {stockNotice}
                </div>
              )}
              <button
                type="button"
                className="btn btn--primary btn--full"
                disabled={isOutOfStock}
                aria-disabled={!isOutOfStock && atMaxStock ? 'true' : undefined}
                onClick={() => {
                  const added = onAddToCart(product.id, selectedVariant, 1);
                  if (added) {
                    onClose();
                  } else {
                    setStockNotice(
                      `Stock insuficiente para "${product.name}". Solo hay ${availableStock} ${
                        availableStock === 1 ? 'unidad disponible' : 'unidades disponibles'
                      }.`
                    );
                  }
                }}
              >
                {isOutOfStock
                  ? 'Sin stock disponible'
                  : atMaxStock
                    ? `Stock máximo en reserva (${availableStock})`
                    : `Agregar a reserva — ${formatGTQ(product.price)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
