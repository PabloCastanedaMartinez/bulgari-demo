import React, { useEffect, useRef } from 'react';
import { formatGTQ } from '../utils/currency.js';

export default function ProductModal({
  product,
  selectedVariant,
  onSelectVariant,
  onAddToCart,
  onClose
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (product && !dialog.open) {
      dialog.showModal();
    } else if (!product && dialog.open) {
      dialog.close();
    }
  }, [product]);

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
              <strong className="product-price tabular">{formatGTQ(product.price)}</strong>
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
              <button
                type="button"
                className="btn btn--primary btn--full"
                onClick={() => {
                  onAddToCart(product.id, selectedVariant, 1);
                  onClose();
                }}
              >
                Agregar a reserva — {formatGTQ(product.price)}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
