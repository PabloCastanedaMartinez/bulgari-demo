import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  STORE_PICKUP_LOCATION,
  formatGTQ,
  generateOrderFolio
} from '../utils/currency.js';

const INITIAL_PICKUP = {
  nombre: '',
  telefono: '',
  email: '',
  horario: 'Hoy, en 1 – 2 horas (express)',
  notas: ''
};

const DEMO_PICKUP = {
  nombre: 'Andrea Morales Argueta',
  telefono: '4558 9615',
  email: 'andrea.morales@ejemplo.com',
  horario: 'Hoy, en 1 – 2 horas (express)',
  notas: 'Pasaré después de las 16:00 h; favor empacar en bolsa resistente'
};

export default function CheckoutView({
  metrics,
  demoOptions,
  onBackToStore,
  onOrderConfirmed,
  onShowToast
}) {
  const [pickup, setPickup] = useState(INITIAL_PICKUP);
  const [cashOption, setCashOption] = useState('exacto');
  const [cashCustom, setCashCustom] = useState('');
  const [errors, setErrors] = useState({});
  const [errorBanner, setErrorBanner] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fieldRefs = useRef({});
  const appliedDemoRef = useRef(false);

  useEffect(() => {
    if (!demoOptions || appliedDemoRef.current) return;
    appliedDemoRef.current = true;
    if (demoOptions.fill) {
      setPickup(DEMO_PICKUP);
    }
    if (demoOptions.cashBill && metrics.total <= demoOptions.cashBill) {
      setCashOption(String(demoOptions.cashBill));
    } else if (metrics.total <= 500) {
      setCashOption('500');
    }
  }, [demoOptions, metrics.total]);

  // Asegurar que no quede seleccionado un billete menor al total si cambia la lista de reserva
  useEffect(() => {
    if (cashOption === '200' && metrics.total > 200) {
      setCashOption('exacto');
    } else if (cashOption === '500' && metrics.total > 500) {
      setCashOption('exacto');
    }
  }, [cashOption, metrics.total]);

  const cashState = useMemo(() => {
    const total = metrics.total;
    let paidAmount = total;
    let valid = true;
    let errorMsg = '';

    if (cashOption === 'exacto') {
      paidAmount = total;
    } else if (cashOption === '200') {
      paidAmount = 200;
      if (200 < total) {
        valid = false;
        errorMsg = `El billete de Q200.00 no cubre el total (${formatGTQ(total)}).`;
      }
    } else if (cashOption === '500') {
      paidAmount = 500;
      if (500 < total) {
        valid = false;
        errorMsg = `El monto de Q500.00 no cubre el total (${formatGTQ(total)}).`;
      }
    } else if (cashOption === 'otro') {
      const parsed = Number(cashCustom);
      if (!cashCustom || Number.isNaN(parsed)) {
        valid = false;
        errorMsg = 'Ingresa el monto en efectivo con el que pagarás en mostrador al recoger.';
      } else if (parsed < total) {
        valid = false;
        errorMsg = `El monto debe ser al menos ${formatGTQ(total)} para cubrir tu reserva.`;
      } else {
        paidAmount = parsed;
      }
    }

    const change = valid ? Math.max(0, paidAmount - total) : 0;
    return { option: cashOption, paidAmount, change, valid, errorMsg };
  }, [cashOption, cashCustom, metrics.total]);

  const handlePickupChange = (field, value) => {
    setPickup((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleAutofillPickup = () => {
    setPickup(DEMO_PICKUP);
    setErrors({});
    setErrorBanner('');
    onShowToast('Datos de reserva autocompletados');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (metrics.items.length === 0) {
      const emptyMsg = 'Tu lista de reserva está vacía. Agrega productos antes de confirmar.';
      setErrorBanner(emptyMsg);
      onShowToast(emptyMsg);
      return;
    }

    if (metrics.hasStockErrors) {
      const stockMsg =
        metrics.stockErrors.join(' ') ||
        'Algunos productos superan el stock disponible. Ajusta tu lista de reserva antes de confirmar.';
      setErrorBanner(stockMsg);
      onShowToast(metrics.stockErrors[0] || stockMsg);
      return;
    }

    const newErrors = {};
    const invalidOrder = [];

    const markError = (key, msg) => {
      newErrors[key] = msg;
      invalidOrder.push(key);
    };

    if (pickup.nombre.trim().length < 3) {
      markError('nombre', 'Escribe el nombre completo de quien recogerá la reserva.');
    }

    const phoneDigits = pickup.telefono.replace(/\D/g, '');
    if (phoneDigits.length < 8 || phoneDigits.length > 10) {
      markError('telefono', 'Ingresa un número telefónico de 8 a 10 dígitos para avisarte cuando esté listo.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pickup.email.trim())) {
      markError('email', 'Escribe un correo electrónico válido (ejemplo@dominio.com).');
    }

    if (!cashState.valid) {
      markError('cashCustom', cashState.errorMsg);
    }

    setErrors(newErrors);

    if (invalidOrder.length > 0) {
      const count = invalidOrder.length;
      setErrorBanner(
        count === 1
          ? 'Revisa 1 campo marcado antes de confirmar tu reserva para recoger en tienda.'
          : `Revisa los ${count} campos marcados antes de confirmar tu reserva para recoger en tienda.`
      );
      const firstKey = invalidOrder[0];
      fieldRefs.current[firstKey]?.focus();
      return;
    }

    setErrorBanner('');
    setSubmitting(true);

    const orderId = generateOrderFolio();

    const trimmedPickup = {
      nombre: pickup.nombre.trim(),
      telefono: pickup.telefono.trim(),
      email: pickup.email.trim(),
      horario: pickup.horario,
      notas: pickup.notas.trim()
    };

    const paymentDetail = {
      method: 'efectivo',
      label: 'Efectivo en mostrador al recoger',
      paidWith: cashState.paidAmount,
      changeDue: cashState.change,
      statusText:
        cashState.change === 0
          ? `Pago exacto al recoger en mostrador (${formatGTQ(metrics.total)})`
          : `Pagas en tienda con ${formatGTQ(cashState.paidAmount)} · Vuelto preparado en caja: ${formatGTQ(cashState.change)}`
    };

    setTimeout(() => {
      const confirmedAtMs = Date.now();
      const createdAt = new Date(confirmedAtMs).toLocaleString('es-GT', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      setSubmitting(false);
      onOrderConfirmed({
        id: orderId,
        createdAt,
        createdAtMs: confirmedAtMs,
        pickup: trimmedPickup,
        payment: paymentDetail
      });
    }, 450);
  };

  return (
    <div id="vista-checkout" className="view-panel">
      <section className="checkout-section" aria-labelledby="checkout-titulo">
        <div className="wrap">
          <div className="checkout-topbar">
            <button type="button" className="btn btn--quiet" onClick={onBackToStore}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Volver al catálogo</span>
            </button>
            <span className="checkout-mode-note">Reserva sin compra online · Retiro en Interplaza Escuintla</span>
          </div>

          <div className="checkout-head">
            <h1 id="checkout-titulo">Datos de reserva para recoger en tienda</h1>
            <p className="section-sub">
              No realizas ninguna compra ni cobro en línea. Ingresa tus datos para que la librería prepare tus artículos en Interplaza Escuintla; pagarás únicamente en efectivo en mostrador al recoger.
            </p>
          </div>

          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit} noValidate>
              {/* BLOQUE 1: DATOS PARA RESERVA Y RETIRO */}
              <fieldset className="checkout-panel">
                <legend className="sr-only">Datos para tu reserva y retiro en tienda</legend>
                <div className="panel-stack">
                  <div className="panel-header-row">
                    <h2 className="panel-heading">Datos para tu reserva y retiro en tienda</h2>
                    <button
                      type="button"
                      className="btn btn--quiet btn--sm"
                      onClick={handleAutofillPickup}
                    >
                      Autocompletar datos de prueba
                    </button>
                  </div>
                  <p className="panel-desc">
                    Preparamos tu paquete con anticipación para que únicamente pases a recogerlo y pagues en efectivo al recibirlo en mostrador.
                  </p>

                  <div className="pickup-location-box">
                    <strong>Punto de retiro:</strong> Librería Bulgari — {STORE_PICKUP_LOCATION}
                  </div>

                  <div className="form-grid">
                    <div className="field field--full">
                      <label htmlFor="dir-nombre">
                        Nombre completo de quien recoge <span className="req" aria-hidden="true">*</span>
                      </label>
                      <input
                        ref={(el) => { fieldRefs.current.nombre = el; }}
                        type="text"
                        id="dir-nombre"
                        autoComplete="name"
                        placeholder="Ej. Andrea Morales Argueta"
                        value={pickup.nombre}
                        onChange={(e) => handlePickupChange('nombre', e.target.value)}
                        aria-invalid={errors.nombre ? 'true' : undefined}
                        aria-describedby={errors.nombre ? 'err-dir-nombre' : undefined}
                      />
                      <span className="field-error" id="err-dir-nombre" aria-live="polite">
                        {errors.nombre || ''}
                      </span>
                    </div>

                    <div className="field">
                      <label htmlFor="dir-telefono">
                        Teléfono de contacto (8 dígitos) <span className="req" aria-hidden="true">*</span>
                      </label>
                      <input
                        ref={(el) => { fieldRefs.current.telefono = el; }}
                        type="tel"
                        id="dir-telefono"
                        autoComplete="tel-national"
                        inputMode="numeric"
                        maxLength={14}
                        placeholder="4558 9615"
                        value={pickup.telefono}
                        onChange={(e) => handlePickupChange('telefono', e.target.value)}
                        aria-invalid={errors.telefono ? 'true' : undefined}
                        aria-describedby={errors.telefono ? 'err-dir-telefono' : undefined}
                      />
                      <span className="field-error" id="err-dir-telefono" aria-live="polite">
                        {errors.telefono || ''}
                      </span>
                    </div>

                    <div className="field">
                      <label htmlFor="dir-email">
                        Correo para comprobante de reserva <span className="req" aria-hidden="true">*</span>
                      </label>
                      <input
                        ref={(el) => { fieldRefs.current.email = el; }}
                        type="email"
                        id="dir-email"
                        autoComplete="email"
                        placeholder="andrea@ejemplo.com"
                        value={pickup.email}
                        onChange={(e) => handlePickupChange('email', e.target.value)}
                        aria-invalid={errors.email ? 'true' : undefined}
                        aria-describedby={errors.email ? 'err-dir-email' : undefined}
                      />
                      <span className="field-error" id="err-dir-email" aria-live="polite">
                        {errors.email || ''}
                      </span>
                    </div>

                    <div className="field field--full">
                      <label htmlFor="dir-horario">
                        Horario estimado para pasar a recoger <span className="req" aria-hidden="true">*</span>
                      </label>
                      <select
                        id="dir-horario"
                        value={pickup.horario}
                        onChange={(e) => handlePickupChange('horario', e.target.value)}
                      >
                        <option value="Hoy, en 1 – 2 horas (express)">Hoy, en 1 – 2 horas (express)</option>
                        <option value="Hoy, 15:00 – 19:00 h">Hoy, 15:00 – 19:00 h</option>
                        <option value="Mañana, 09:00 – 13:00 h">Mañana, 09:00 – 13:00 h</option>
                        <option value="Mañana, 14:00 – 19:00 h">Mañana, 14:00 – 19:00 h</option>
                      </select>
                    </div>

                    <div className="field field--full">
                      <label htmlFor="dir-notas">
                        Notas para la librería o persona adicional que recoge (opcional)
                      </label>
                      <input
                        type="text"
                        id="dir-notas"
                        placeholder="Ej. Pasará mi hermano Carlos Morales o empacar en bolsa resistente"
                        value={pickup.notas}
                        onChange={(e) => handlePickupChange('notas', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* BLOQUE 2: PAGO EN MOSTRADOR AL RECOGER */}
              <fieldset className="checkout-panel">
                <legend className="sr-only">Pago en mostrador al recoger</legend>
                <div className="panel-stack">
                  <div className="panel-header-row">
                    <h2 className="panel-heading">Pago en efectivo en mostrador al recoger</h2>
                    <span className="payment-tag">Únicamente efectivo en tienda</span>
                  </div>
                  <p className="panel-desc">
                    Sin cobros en línea. Pagarás únicamente en efectivo en caja al recoger tu pedido. Opcionalmente indica con qué billete pagarás para agilizar tu vuelto.
                  </p>

                  <div className="payment-subpanel">
                    <div className="subpanel-head">
                      <h3>Programar vuelto en caja (opcional)</h3>
                      <p>
                        Indica con qué billete pagarás en mostrador para tener tu vuelto preparado cuando pases por tu reserva.
                      </p>
                    </div>

                    <div className="cash-presets" role="radiogroup" aria-label="Monto en efectivo con el que pagarás en mostrador">
                      <label className="cash-preset">
                        <input
                          type="radio"
                          name="efectivo_opcion"
                          value="exacto"
                          checked={cashOption === 'exacto'}
                          onChange={() => setCashOption('exacto')}
                        />
                        <span>
                          Monto exacto (<strong className="tabular">{formatGTQ(metrics.total)}</strong>)
                        </span>
                      </label>

                      <label className="cash-preset">
                        <input
                          type="radio"
                          name="efectivo_opcion"
                          value="200"
                          checked={cashOption === '200'}
                          disabled={metrics.total > 200}
                          onChange={() => setCashOption('200')}
                        />
                        <span>
                          Billete de <strong className="tabular">{formatGTQ(200)}</strong>
                        </span>
                      </label>

                      <label className="cash-preset">
                        <input
                          type="radio"
                          name="efectivo_opcion"
                          value="500"
                          checked={cashOption === '500'}
                          disabled={metrics.total > 500}
                          onChange={() => setCashOption('500')}
                        />
                        <span>
                          Efectivo por <strong className="tabular">{formatGTQ(500)}</strong>
                        </span>
                      </label>

                      <label className="cash-preset">
                        <input
                          type="radio"
                          name="efectivo_opcion"
                          value="otro"
                          checked={cashOption === 'otro'}
                          onChange={() => setCashOption('otro')}
                        />
                        <span>Otro monto en efectivo</span>
                      </label>
                    </div>

                    {cashOption === 'otro' && (
                      <div className="field cash-custom-field">
                        <label htmlFor="efectivo-monto-custom">
                          Monto en efectivo que entregarás en caja (Q) <span className="req" aria-hidden="true">*</span>
                        </label>
                        <input
                          ref={(el) => { fieldRefs.current.cashCustom = el; }}
                          type="number"
                          id="efectivo-monto-custom"
                          min="1"
                          step="1"
                          inputMode="numeric"
                          placeholder="Ej. 600"
                          value={cashCustom}
                          onChange={(e) => {
                            setCashCustom(e.target.value);
                            if (errors.cashCustom) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.cashCustom;
                                return next;
                              });
                            }
                          }}
                          aria-invalid={errors.cashCustom ? 'true' : undefined}
                          aria-describedby={errors.cashCustom ? 'err-efectivo-custom' : undefined}
                        />
                        <span className="field-error" id="err-efectivo-custom" aria-live="polite">
                          {errors.cashCustom || ''}
                        </span>
                      </div>
                    )}

                    <div
                      className={`change-summary ${cashState.valid ? 'change-summary--ok' : 'change-summary--error'}`}
                      aria-live="polite"
                    >
                      {!cashState.valid ? (
                        cashState.errorMsg
                      ) : cashState.change === 0 ? (
                        <>
                          Pagarás el monto exacto (<strong className="tabular">{formatGTQ(metrics.total)}</strong>) en efectivo en mostrador al recoger. No se requiere vuelto.
                        </>
                      ) : (
                        <>
                          Pagarás en mostrador con <strong className="tabular">{formatGTQ(cashState.paidAmount)}</strong>. Tendremos <strong className="tabular">{formatGTQ(cashState.change)}</strong> de vuelto listo en caja al recoger.
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </fieldset>

              {errorBanner && (
                <div className="form-alert" role="alert">
                  {errorBanner}
                </div>
              )}

              <div className="checkout-submit-row">
                <button
                  type="submit"
                  className="btn btn--primary btn--lg btn--full"
                  disabled={submitting}
                >
                  {submitting
                    ? 'Registrando reserva en tienda...'
                    : 'Confirmar reserva para recoger en tienda'}
                </button>
              </div>
            </form>

            {/* RESUMEN LATERAL */}
            <aside className="order-summary" aria-labelledby="resumen-titulo">
              <div className="summary-card">
                <h2 id="resumen-titulo">Resumen de tu reserva</h2>

                <ul className="summary-items">
                  {metrics.items.map((item) => (
                    <li key={`${item.product.id}__${item.variant}`} className="summary-item">
                      <img className="summary-thumb" src={item.product.image} alt={item.product.alt} />
                      <div className="summary-item-info">
                        <span className="summary-item-name">{item.product.name}</span>
                        <span className="summary-item-variant">
                          {item.variant} · Cant. {item.qty}
                        </span>
                        <span
                          className={`summary-item-stock tabular${
                            item.exceedsStock ? ' summary-item-stock--error' : ''
                          }`}
                        >
                          {item.exceedsStock
                            ? `Excede stock disponible (${item.availableStock} uds.)`
                            : `Stock disponible: ${item.availableStock} uds.`}
                        </span>
                      </div>
                      <span className="summary-item-price tabular">{formatGTQ(item.lineTotal)}</span>
                    </li>
                  ))}
                </ul>

                <div className="summary-address-box">
                  <h3>Retiro en tienda</h3>
                  <div>
                    <strong>Interplaza Escuintla · 2.º Nivel, Locales L-259 y L-260</strong>
                  </div>
                  {(pickup.nombre.trim() || pickup.telefono.trim()) ? (
                    <div>
                      Recoge:{' '}
                      {[pickup.nombre.trim(), pickup.telefono.trim()].filter(Boolean).join(' · ')}
                    </div>
                  ) : (
                    <p className="summary-address-placeholder">
                      Ingresa tu nombre y teléfono para asignar tu código de retiro.
                    </p>
                  )}
                  <div className="summary-address-placeholder">Horario estimado: {pickup.horario}</div>
                </div>

                <dl className="summary-totals">
                  <div className="total-row">
                    <dt>Subtotal</dt>
                    <dd className="tabular">{formatGTQ(metrics.subtotal)}</dd>
                  </div>
                  <div className="total-row">
                    <dt>Retiro en tienda</dt>
                    <dd className="tabular">Sin costo</dd>
                  </div>
                  <div className="total-row">
                    <dt>Pago al recoger</dt>
                    <dd>Únicamente efectivo en mostrador</dd>
                  </div>
                  <div className="total-row">
                    <dt>Vuelto estimado en caja</dt>
                    <dd className="tabular">
                      {!cashState.valid
                        ? 'Pendiente'
                        : cashState.change === 0
                          ? 'Monto exacto (Q0.00)'
                          : formatGTQ(cashState.change)}
                    </dd>
                  </div>
                  <div className="total-row total-row--grand">
                    <dt>Total a pagar en mostrador</dt>
                    <dd className="tabular">{formatGTQ(metrics.total)}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
