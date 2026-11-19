import React from 'react';
import { CATEGORIES, PRODUCTS } from '../data/products.js';
import { formatGTQ } from '../utils/currency.js';

export default function StoreView({
  filteredProducts,
  selectedCategory,
  onSelectCategory,
  onlyToday,
  onToggleToday,
  sortBy,
  onSortChange,
  onClearFilters,
  selectedVariants,
  onSelectVariant,
  getCartQty,
  onAddToCart,
  onUpdateQty,
  onOpenProductModal,
  onHeroQuickAdd
}) {
  return (
    <div id="vista-tienda" className="view-panel">
      <section className="hero" aria-labelledby="hero-titulo">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              Interplaza Escuintla · 2.º Nivel, Locales L-259 y L-260
            </span>
            <h1 id="hero-titulo">Todo lo que necesitas para el colegio, la universidad y tu oficina</h1>
            <p className="hero-lead">
              Olvida las esperas en Escuintla. En Librería Bulgari eliges y reservas desde esta página —sin compra online ni pagos anticipados— tus útiles escolares, marcadores Pelikan Lettering, colores Bozetto, artículos de oficina y anillos De La Riva para pasar a recogerlos listos en Interplaza.
            </p>
            <div className="hero-actions">
              <a href="#catalogo" className="btn btn--primary">
                Ver catálogo de librería
              </a>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={onHeroQuickAdd}
              >
                Reservar Kit Escolar Bulgari — {formatGTQ(185)}
              </button>
            </div>
            <ul className="hero-facts" aria-label="Condiciones de reserva y retiro">
              <li>
                <strong>Reserva sin compra online</strong>
                <span>Aparta tus artículos en línea sin pagos anticipados</span>
              </li>
              <li>
                <strong>Listo para recoger en tienda</strong>
                <span>Retira sin filas en Interplaza, Locales L-259 y L-260</span>
              </li>
              <li>
                <strong>Pago en efectivo al recoger</strong>
                <span>Únicamente efectivo directamente en mostrador al retirar tu pedido</span>
              </li>
            </ul>
          </div>

          <figure className="hero-media">
            <img
              src="/assets/img/bulgari-hero.jpg"
              alt="Organizador con bolígrafos, marcadores, folders de colores y útiles escolares de Librería Bulgari"
              width="1600"
              height="1070"
            />
          </figure>
        </div>
      </section>

      <section id="catalogo" className="catalog-section" aria-labelledby="catalogo-titulo">
        <div className="wrap">
          <div className="section-head">
            <h2 id="catalogo-titulo">Muestra de productos Librería Bulgari</h2>
            <p className="section-sub">
              Doce artículos seleccionados de nuestras líneas escolares, de arte, oficina y graduación con precios en Quetzales (GTQ). Elige presentación antes de agregar a tu reserva.
            </p>
          </div>

          <div className="catalog-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Filtrar por categoría">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="tab-btn"
                  role="tab"
                  aria-selected={selectedCategory === cat.id ? 'true' : 'false'}
                  onClick={() => onSelectCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="toolbar-controls">
              <label className="toggle-chip">
                <input
                  type="checkbox"
                  checked={onlyToday}
                  onChange={(e) => onToggleToday(e.target.checked)}
                />
                <span>Listo para recoger hoy</span>
              </label>

              <div className="sort-wrap">
                <label htmlFor="orden-catalogo" className="sort-label">
                  Orden
                </label>
                <select
                  id="orden-catalogo"
                  className="select-control"
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                >
                  <option value="destacados">Destacados</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                </select>
              </div>
            </div>
          </div>

          <p className="catalog-status" aria-live="polite">
            Mostrando {filteredProducts.length} de {PRODUCTS.length} productos
          </p>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const selectedVariant = selectedVariants[product.id] || product.variants[0];
                const qtyInCart = getCartQty(product.id, selectedVariant);
                const mediaClass = product.mediaClass
                  ? `product-media ${product.mediaClass}`
                  : 'product-media';

                return (
                  <article key={product.id} className="product-card">
                    <div className={mediaClass}>
                      <img src={product.image} alt={product.alt} />
                    </div>
                    <div className="product-body">
                      <div className="product-top-row">
                        <h3 className="product-title">{product.name}</h3>
                        <span className="product-price tabular">{formatGTQ(product.price)}</span>
                      </div>
                      <p className="product-desc">{product.description}</p>
                      <div className="product-meta-row">
                        <span className="meta-tag">{product.categoryLabel}</span>
                        {product.today ? (
                          <span className="meta-tag meta-tag--today">Listo hoy en tienda</span>
                        ) : (
                          <span className="meta-tag">Listo en 24 h</span>
                        )}
                      </div>
                      <div className="variant-group">
                        <span className="variant-label">Presentación</span>
                        <div className="variant-pills" role="group" aria-label={`Presentación de ${product.name}`}>
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
                      <div className="product-actions">
                        {qtyInCart > 0 ? (
                          <div className="qty-inline" aria-label={`Cantidad en reserva para ${product.name}`}>
                            <button
                              type="button"
                              className="qty-inline-btn"
                              aria-label={`Quitar una unidad de ${product.name}`}
                              onClick={() => onUpdateQty(product.id, selectedVariant, -1)}
                            >
                              −
                            </button>
                            <span className="qty-inline-val tabular">{qtyInCart} en reserva</span>
                            <button
                              type="button"
                              className="qty-inline-btn"
                              aria-label={`Añadir una unidad más de ${product.name}`}
                              onClick={() => onUpdateQty(product.id, selectedVariant, 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => onAddToCart(product.id, selectedVariant, 1)}
                          >
                            Agregar a reserva
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn--secondary"
                          onClick={() => onOpenProductModal(product.id)}
                        >
                          Detalles
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-title">No encontramos artículos con esa búsqueda o filtro.</p>
              <p className="empty-desc">
                Prueba limpiando el filtro de categoría o buscando otro término como «Pelikan», «Bozetto», «escritorio» o «De La Riva».
              </p>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={onClearFilters}
              >
                Mostrar todo el catálogo
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="tienda" className="workshop-section" aria-labelledby="tienda-titulo">
        <div className="wrap workshop-grid">
          <div className="workshop-copy">
            <h2 id="tienda-titulo">Reserva en línea y recoge sin esperas en Interplaza Escuintla</h2>
            <p className="workshop-lead">
              Comercial Bulgari — Librería prepara listas escolares completas, artículos universitarios, insumos de oficina y cotizaciones de anillos de graduación De La Riva para que pases a recogerlos listos en el segundo nivel de Interplaza Escuintla.
            </p>

            <dl className="schedule-list" id="retiro">
              <div className="schedule-row">
                <dt>Punto de retiro</dt>
                <dd>Interplaza Escuintla, Km. 60 Autopista Palín-Escuintla · Segundo Nivel, Locales L-259 y L-260.</dd>
              </div>
              <div className="schedule-row">
                <dt>Horario de retiro</dt>
                <dd>Lunes a sábado de 09:00 a 19:00 h · Domingo de 10:00 a 18:00 h.</dd>
              </div>
              <div className="schedule-row">
                <dt>Tiempo de preparación</dt>
                <dd>Artículos con etiqueta «Listo hoy en tienda» preparados desde 45 minutos; bajo pedido listos en 24 h.</dd>
              </div>
              <div className="schedule-row">
                <dt>Pago al recoger</dt>
                <dd>Sin compra ni cobros online. Únicamente pago en efectivo en mostrador al recoger tu pedido.</dd>
              </div>
            </dl>

            <div className="promo-banner">
              <div>
                <strong>¿Necesitas cotizar tu lista de útiles o anillos De La Riva?</strong>
              </div>
              <span className="promo-banner-phone">
                WhatsApp: 4558-9615 · Local: 7764-1568
              </span>
            </div>
          </div>

          <figure className="workshop-media">
            <img
              src="/assets/img/bulgari-cover.jpg"
              alt="Portada oficial de Librería Bulgari: Todo lo que necesitas para el Colegio, Universidad y Oficina"
              width="3365"
              height="1246"
            />
          </figure>
        </div>
      </section>
    </div>
  );
}
