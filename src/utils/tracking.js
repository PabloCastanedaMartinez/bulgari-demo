import { TRACKING_LABELS } from '../data/products.js';

export const TRACKING_STEP_MINUTES = 15;
export const TRACKING_STEP_MS = TRACKING_STEP_MINUTES * 60 * 1000;

/**
 * Calcula el estado cronometrado de preparación en tienda de una reserva
 * usando incrementos de 15 minutos desde `createdAtMs`.
 */
export function getOrderTrackingState(order, now = Date.now()) {
  const maxIndex = Math.max(0, TRACKING_LABELS.length - 1);
  const createdAtMs =
    typeof order?.createdAtMs === 'number' && Number.isFinite(order.createdAtMs)
      ? order.createdAtMs
      : now -
        Math.min(maxIndex, Math.max(0, Number(order?.trackingIndex) || 0)) * TRACKING_STEP_MS;

  const elapsedMs = Math.max(0, now - createdAtMs);
  const trackingIndex = Math.min(maxIndex, Math.floor(elapsedMs / TRACKING_STEP_MS));
  const isCompleted = trackingIndex >= maxIndex;
  const currentStep = TRACKING_LABELS[trackingIndex] || TRACKING_LABELS[0];
  const nextStepIndex = isCompleted ? null : trackingIndex + 1;
  const nextStep = nextStepIndex !== null ? TRACKING_LABELS[nextStepIndex] : null;
  const nextChangeAtMs = isCompleted ? null : createdAtMs + nextStepIndex * TRACKING_STEP_MS;
  const remainingMs = isCompleted ? 0 : Math.max(0, nextChangeAtMs - now);
  const totalDurationMs = maxIndex * TRACKING_STEP_MS;
  const overallProgressPct =
    totalDurationMs > 0 ? Math.min(100, (elapsedMs / totalDurationMs) * 100) : 100;
  const stepTimestamps = TRACKING_LABELS.map((_, idx) => createdAtMs + idx * TRACKING_STEP_MS);

  return {
    trackingIndex,
    currentStep,
    nextStep,
    isCompleted,
    createdAtMs,
    elapsedMs,
    remainingMs,
    nextChangeAtMs,
    overallProgressPct,
    stepTimestamps
  };
}

/**
 * Sincroniza `createdAtMs` y `trackingIndex` de una reserva según el tiempo transcurrido.
 */
export function normalizeOrderTracking(order, now = Date.now()) {
  if (!order || typeof order !== 'object') return order;
  const state = getOrderTrackingState(order, now);
  return {
    ...order,
    createdAtMs: state.createdAtMs,
    trackingIndex: state.trackingIndex
  };
}

/**
 * Formatea milisegundos restantes en formato MM:SS.
 */
export function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil((Number(ms) || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Formatea una marca de tiempo en hora local de Guatemala (HH:MM).
 */
export function formatStepTime(timestampMs) {
  return new Date(timestampMs).toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
