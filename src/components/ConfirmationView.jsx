import React from 'react';
import { TRACKING_LABELS } from '../data/products.js';
import { STORE_PICKUP_LOCATION, formatGTQ } from '../utils/currency.js';

export default function ConfirmationView({
  order,
  onAdvanceTracking,
  onBackToCatalog,
  onOpenHistory
}) {
  if (!order) return null;

  const pickup = order.pickup || order.address || {};
  const isDelivered = order.trackingIndex >= TRACKING_LABELS.length - 1;

  return (
    <div id="vista-confirmacion" className="view-panel">
      <section className="confirmation-section" aria-labelledby="conf-titulo">
        <div className="wrap confirmation-wrap">
          <div className="confirmation-card">
            <div className="confirmation-head">
              <h1 id="conf-titulo">Tu reserva quedó registrada para recoger en tienda</h1>
              <div className="confirmation-meta-row">
                <span className="status-badge status-badge--ok">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Reserva confirmada · Pago en efectivo en mostrador
                </span>
                <span className="folio-badge tabular">Código de retiro {order.id}</span>
              </div>
              <p className="section-sub">
                Registrada el {order.createdAt} para pasar a recoger en horario: {pickup.horario}. No realizaste ningún pago en línea.
              </p>
            </div>

            <div className="tracking-panel">
              <div className="tracking-head">
                <h2>Estado de preparación en tienda</h2>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  disabled={isDelivered}
                  onClick={() => onAdvanceTracking(order.id)}
                >
                  {isDelivered ? 'Reserva recogida en tienda' : 'Avanzar etapa de preparación'}
                </button>
              </div>
              <ol className="tracking-steps">
                {TRACKING_LABELS.map((step, idx) => (
                  <li
                    key={step.key}
                    className={`tracking-step ${idx <= order.trackingIndex ? 'tracking-step--done' : ''}`}
                  >
                    <strong>{step.title}</strong>
                    <span>{step.detail}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="receipt-grid">
              <div className="receipt-block">
                <h3>Punto de retiro y quien recoge</h3>
                <div className="receipt-address">
                  <strong>Librería Bulgari — {STORE_PICKUP_LOCATION}</strong>
                  <span>Recoge: {pickup.nombre}</span>
                  <span className="tabular">Tel. {pickup.telefono}</span>
                  <span>{pickup.email}</span>
                  <span>Horario estimado: {pickup.horario}</span>
                  {(pickup.notas || pickup.referencias) && (
                    <span>Notas: {pickup.notas || pickup.referencias}</span>
                  )}
                </div>
              </div>

              <div className="receipt-block">
                <h3>Detalle de pago al recoger</h3>
                <div className="receipt-payment">
                  <strong>{order.payment.label}</strong>
                  <span>{order.payment.statusText}</span>
                  <span>Sin compra ni cobros en línea · Retiro sin costo</span>
                </div>
              </div>
            </div>

            <div className="receipt-items-block">
              <h3>Artículos reservados</h3>
              <ul className="summary-items">
                {order.items.map((item) => (
                  <li key={`${item.id}__${item.variant}`} className="summary-item">
                    <img className="summary-thumb" src={item.image} alt={item.alt} />
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-variant">
                        {item.variant} · Cant. {item.qty}
                      </span>
                    </div>
                    <span className="summary-item-price tabular">{formatGTQ(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <dl className="summary-totals summary-totals--compact">
                <div className="total-row">
                  <dt>Subtotal</dt>
                  <dd className="tabular">{formatGTQ(order.subtotal)}</dd>
                </div>
                <div className="total-row">
                  <dt>Retiro en tienda</dt>
                  <dd className="tabular">Sin costo</dd>
                </div>
                <div className="total-row total-row--grand">
                  <dt>Total a pagar en mostrador</dt>
                  <dd className="tabular">{formatGTQ(order.total)}</dd>
                </div>
              </dl>
            </div>

            <div className="confirmation-actions">
              <button type="button" className="btn btn--primary" onClick={onBackToCatalog}>
                Volver al catálogo
              </button>
              <button type="button" className="btn btn--secondary" onClick={onOpenHistory}>
                Ver historial de reservas
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
