import React, { useEffect, useRef } from 'react';
import { TRACKING_LABELS } from '../data/products.js';
import { formatGTQ } from '../utils/currency.js';

export default function HistoryModal({
  isOpen,
  orders,
  onSelectOrder,
  onClose
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      id="historial-modal"
      aria-labelledby="modal-hist-titulo"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="modal-card modal-card--narrow">
        <div className="modal-header">
          <h2 id="modal-hist-titulo">Reservas recientes</h2>
          <button
            type="button"
            className="icon-btn"
            aria-label="Cerrar historial"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {orders.length === 0 ? (
            <div className="cart-empty">
              <p className="empty-title">Aún no hay reservas registradas en este navegador</p>
              <p className="empty-desc">
                Aparta artículos desde tu lista de reserva para consultar aquí su código de retiro, horario en Interplaza y estado de preparación.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const pickup = order.pickup || order.address || {};
              return (
                <article key={order.id} className="history-card">
                  <div className="history-card-head">
                    <strong className="tabular">
                      {order.id} · {formatGTQ(order.total)}
                    </strong>
                    <span className="meta-tag">
                      {TRACKING_LABELS[order.trackingIndex]?.title || 'Reserva registrada'}
                    </span>
                  </div>
                  <div>
                    {order.payment.label} — {order.payment.statusText}
                  </div>
                  <div>
                    Retiro en tienda: Interplaza L-259/260 · {pickup.horario || 'Por coordinar'}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => onSelectOrder(order.id)}
                    >
                      Ver comprobante de reserva
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </dialog>
  );
}
