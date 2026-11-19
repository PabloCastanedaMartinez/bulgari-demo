import React, { useEffect, useState } from 'react';
import { TRACKING_LABELS } from '../data/products.js';
import { STORE_PICKUP_LOCATION, formatGTQ } from '../utils/currency.js';
import {
  TRACKING_STEP_MINUTES,
  formatCountdown,
  formatStepTime,
  getOrderTrackingState
} from '../utils/tracking.js';

export default function ConfirmationView({
  order,
  onBackToCatalog,
  onOpenHistory
}) {
  const [now, setNow] = useState(() => Date.now());
  const tracking = order ? getOrderTrackingState(order, now) : null;
  const isCompleted = tracking ? tracking.isCompleted : true;

  useEffect(() => {
    setNow(Date.now());
    if (!order || isCompleted) return undefined;

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [order?.id, order?.createdAtMs, isCompleted]);

  if (!order || !tracking) return null;

  const pickup = order.pickup || order.address || {};

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
                <div
                  className={`tracking-timer tabular${tracking.isCompleted ? ' tracking-timer--done' : ''}`}
                  aria-live="off"
                >
                  {tracking.isCompleted ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M5 13L9 17L19 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Preparación completada</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                        <path
                          d="M12 7V12L15 14"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Siguiente etapa en {formatCountdown(tracking.remainingMs)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="tracking-schedule">
                <p className="tracking-schedule-text">
                  {tracking.isCompleted ? (
                    <>
                      Ciclo cronometrado completado en incrementos de {TRACKING_STEP_MINUTES} min (45 min en total).
                    </>
                  ) : (
                    <>
                      Actualización cronometrada cada {TRACKING_STEP_MINUTES} min · Próxima etapa:{' '}
                      <strong>{tracking.nextStep.title}</strong> ({formatStepTime(tracking.nextChangeAtMs)})
                    </>
                  )}
                </p>
                <div
                  className="tracking-progress"
                  role="progressbar"
                  aria-label="Progreso cronometrado de preparación del pedido"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(tracking.overallProgressPct)}
                >
                  <div
                    className={`tracking-progress-fill${tracking.isCompleted ? ' tracking-progress-fill--done' : ''}`}
                    style={{ width: `${tracking.overallProgressPct}%` }}
                  />
                </div>
              </div>

              <ol className="tracking-steps">
                {TRACKING_LABELS.map((step, idx) => {
                  const isDone = idx <= tracking.trackingIndex;
                  const isCurrent = idx === tracking.trackingIndex && !tracking.isCompleted;
                  return (
                    <li
                      key={step.key}
                      className={`tracking-step${isDone ? ' tracking-step--done' : ''}${
                        isCurrent ? ' tracking-step--current' : ''
                      }`}
                      aria-current={idx === tracking.trackingIndex ? 'step' : undefined}
                    >
                      <span className="tracking-step-time tabular">
                        {idx === 0
                          ? `Inicio · ${formatStepTime(tracking.stepTimestamps[idx])}`
                          : `+${idx * TRACKING_STEP_MINUTES} min · ${formatStepTime(tracking.stepTimestamps[idx])}`}
                      </span>
                      <strong>{step.title}</strong>
                      <span>{step.detail}</span>
                    </li>
                  );
                })}
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
