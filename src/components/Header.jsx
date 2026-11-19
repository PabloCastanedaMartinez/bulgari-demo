import React from 'react';

export default function Header({
  searchQuery,
  onSearchChange,
  ordersCount,
  cartCount,
  isCartOpen,
  onGoHome,
  onNavigateAnchor,
  onOpenHistory,
  onOpenCart,
  cartButtonRef
}) {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a
          href="#vista-tienda"
          className="brand"
          aria-label="Librería Bulgari, volver al inicio"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
        >
          <svg
            className="brand-mark"
            width="28"
            height="30"
            viewBox="0 0 28 30"
            fill="none"
            aria-hidden="true"
          >
            {/* Asta izquierda en forma de lápiz con punta hacia abajo */}
            <rect x="2" y="2" width="6" height="20" rx="1.2" fill="#F59E0B" />
            <rect x="4" y="2" width="2" height="20" fill="#E56F05" />
            <polygon points="2,22 8,22 5,28" fill="#F5D0A9" />
            <polygon points="4,26 6,26 5,28.5" fill="#0A3047" />
            {/* Arcos azul marino de la letra B */}
            <path
              d="M9 3.5H16.5C20.0899 3.5 23 5.73858 23 8.5C23 10.6426 21.2471 12.4694 18.7867 13.1753C21.842 13.7579 24 15.8384 24 18.5C24 21.5376 20.866 24 17 24H9V20.5H16.5C18.433 20.5 20 19.6046 20 18.5C20 17.3954 18.433 16.5 16.5 16.5H10.5V13.2H16C17.6569 13.2 19 12.3046 19 11.2C19 10.0954 17.6569 9.2 16 9.2H9V3.5Z"
              fill="#0A3047"
            />
          </svg>
          <span className="brand-text-group">
            <span className="brand-name">Bulgarı</span>
            <span className="brand-sub">Librería · Escuintla</span>
          </span>
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          <a
            href="#catalogo"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateAnchor('#catalogo');
            }}
          >
            Catálogo
          </a>
          <a
            href="#tienda"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateAnchor('#tienda');
            }}
          >
            Nuestra tienda
          </a>
          <a
            href="#retiro"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateAnchor('#retiro');
            }}
          >
            Retiro en tienda
          </a>
        </nav>

        <div className="header-actions">
          <div className="search-field">
            <label htmlFor="buscador-catalogo" className="sr-only">
              Buscar productos en el catálogo
            </label>
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              id="buscador-catalogo"
              className="search-input"
              placeholder="Buscar útiles, Pelikan, Bozetto..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn--quiet header-orders-btn"
            onClick={onOpenHistory}
            aria-label="Historial de reservas recientes"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <rect x="9" y="3" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
              <path d="M9 12H15M9 16H13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <span className="orders-label">Reservas</span>
            {ordersCount > 0 && (
              <span className="count-chip tabular">{ordersCount}</span>
            )}
          </button>

          <button
            ref={cartButtonRef}
            type="button"
            className="btn btn--primary header-cart-btn"
            aria-controls="carrito-drawer"
            aria-expanded={isCartOpen ? 'true' : 'false'}
            onClick={onOpenCart}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 8H18L19.2 20H4.8L6 8Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
              <path d="M9 8V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <span>Reserva</span>
            <span className="cart-badge tabular">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
