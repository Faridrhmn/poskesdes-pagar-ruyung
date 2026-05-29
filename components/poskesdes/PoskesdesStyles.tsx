export function PoskesdesStyles() {
  return (
    <style jsx global>{`
      /* ========== MOBILE FIRST BASE STYLES ========== */
      .poskesdes-app {
        --teal-600: #0ea5a4;
        --teal-50: #f0fafa;
        --orange-400: #fb923c;
        --muted: #6b7280;
        --danger: #ef4444;
        --warning: #f97316;
        --success: #16a34a;
        --card-shadow: 0 4px 12px rgba(16, 24, 40, 0.08);
        font-family: var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background: var(--teal-50);
        color: #04203a;
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .poskesdes-app * {
        box-sizing: border-box;
      }

      /* ========== MOBILE HEADER ========== */
      .poskesdes-app header {
        background: #fff;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .poskesdes-app .logo {
        display: flex;
        gap: 8px;
        align-items: center;
        flex: 1;
        min-width: 0;
      }

      .poskesdes-app .logo > div:last-child {
        flex: 1;
        min-width: 0;
      }

      .poskesdes-app .logo > div:last-child > div:first-child {
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .poskesdes-app .logo > div:last-child > div:last-child {
        font-size: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .poskesdes-app .mark {
        width: 36px;
        height: 36px;
        min-width: 36px;
        border-radius: 8px;
        background: linear-gradient(135deg, var(--teal-600), #0891b2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 700;
        font-size: 12px;
      }

      /* ========== MOBILE MENU TOGGLE BUTTON ========== */
      .poskesdes-app .menu-toggle {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 32px;
        height: 32px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 101;
        -webkit-tap-highlight-color: transparent;
      }

      .poskesdes-app .menu-toggle span {
        width: 24px;
        height: 3px;
        background: var(--teal-600);
        border-radius: 3px;
        transition: all 0.3s ease;
        transform-origin: center;
      }

      .poskesdes-app .menu-toggle span.open:nth-child(1) {
        transform: rotate(45deg) translate(8px, 8px);
      }

      .poskesdes-app .menu-toggle span.open:nth-child(2) {
        opacity: 0;
      }

      .poskesdes-app .menu-toggle span.open:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -7px);
      }

      /* ========== MOBILE MENU OVERLAY ========== */
      .poskesdes-app .menu-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99;
        animation: fadeIn 0.2s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      /* ========== MOBILE TOP NAV (SLIDE MENU) ========== */
      .poskesdes-app nav.top-nav {
        position: fixed;
        top: 0;
        right: 0;
        width: 280px;
        max-width: 85vw;
        height: 100vh;
        background: #fff;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        padding: 60px 0 20px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 100;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }

      .poskesdes-app nav.top-nav.open {
        transform: translateX(0);
      }

      .poskesdes-app nav.top-nav a {
        color: var(--muted);
        text-decoration: none;
        font-weight: 600;
        padding: 14px 20px;
        border-radius: 0;
        font-size: 15px;
        border-left: 4px solid transparent;
        transition: all 0.2s;
        display: block;
        -webkit-tap-highlight-color: transparent;
      }

      .poskesdes-app nav.top-nav a:active {
        background: rgba(14, 165, 164, 0.05);
        transform: scale(0.98);
      }

      .poskesdes-app nav.top-nav a.active {
        background: rgba(14, 165, 164, 0.08);
        color: var(--teal-600);
        border-left-color: var(--teal-600);
      }

      /* ========== MOBILE CONTAINER ========== */
      .poskesdes-app main.container {
        max-width: 100%;
        margin: 0;
        padding: 12px 12px 20px;
      }

      /* ========== MOBILE CARDS ========== */
      .poskesdes-app .card {
        background: #fff;
        border-radius: 10px;
        padding: 14px;
        box-shadow: var(--card-shadow);
        margin-bottom: 12px;
      }

      .poskesdes-app .card h2 {
        font-size: 18px;
        margin: 0 0 8px 0;
        line-height: 1.3;
      }

      .poskesdes-app .card h3 {
        font-size: 16px;
        margin: 12px 0 8px 0;
        line-height: 1.3;
      }

      .poskesdes-app .card p {
        margin: 8px 0;
        line-height: 1.5;
      }

      /* ========== MOBILE HERO ========== */
      .poskesdes-app .hero {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
        text-align: center;
      }

      .poskesdes-app .hero svg {
        width: 80px;
        height: 80px;
      }

      .poskesdes-app .hero > div {
        width: 100%;
      }

      .poskesdes-app .hero h2 {
        font-size: 18px;
        margin: 0 0 8px 0;
      }

      .poskesdes-app .muted {
        color: var(--muted);
        font-size: 13px;
        line-height: 1.5;
      }

      /* ========== MOBILE GRID & SERVICES ========== */
      .poskesdes-app .grid {
        display: grid;
        gap: 10px;
      }

      .poskesdes-app .grid.services {
        grid-template-columns: 1fr;
      }

      .poskesdes-app .svc {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 14px;
        border-radius: 10px;
        background: linear-gradient(180deg, #fff, #fbfbfb);
        border: 1px solid #f3f7f7;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        -webkit-tap-highlight-color: transparent;
      }

      .poskesdes-app .svc:active {
        transform: scale(0.98);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .poskesdes-app .svc .icon {
        width: 48px;
        height: 48px;
        min-width: 48px;
        border-radius: 10px;
        background: var(--teal-50);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
      }

      .poskesdes-app .svc > div:last-child {
        flex: 1;
        min-width: 0;
      }

      .poskesdes-app .svc > div:last-child > div:first-child {
        font-weight: 700;
        font-size: 14px;
        line-height: 1.3;
        margin-bottom: 4px;
      }

      .poskesdes-app .svc > div:last-child > div:last-child {
        font-size: 12px;
        line-height: 1.4;
      }

      /* ========== MOBILE BUTTONS ========== */
      .poskesdes-app .btn,
      .poskesdes-app .btn-primary {
        display: inline-block;
        padding: 12px 18px;
        border-radius: 10px;
        background: var(--teal-600);
        color: #fff;
        border: none;
        font-weight: 700;
        font-size: 14px;
        cursor: pointer;
        text-align: center;
        width: 100%;
        transition: background 0.2s, transform 0.1s;
        -webkit-tap-highlight-color: transparent;
      }

      .poskesdes-app .btn:active,
      .poskesdes-app .btn-primary:active {
        transform: scale(0.98);
        background: #0d9493;
      }

      .poskesdes-app .small-btn {
        padding: 8px 12px;
        border-radius: 8px;
        background: #eef2f3;
        color: var(--teal-600);
        text-decoration: none;
        font-weight: 700;
        font-size: 12px;
        border: none;
        cursor: pointer;
        display: inline-block;
        transition: background 0.2s, transform 0.1s;
        -webkit-tap-highlight-color: transparent;
        white-space: nowrap;
      }

      .poskesdes-app .small-btn:active {
        transform: scale(0.96);
        background: #dde5e7;
      }

      /* ========== MOBILE AGENDA ITEMS ========== */
      .poskesdes-app .agenda .item {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border-radius: 10px;
        border: 1px solid #f1f5f9;
        margin-bottom: 8px;
      }

      .poskesdes-app .agenda .item > div:first-child {
        flex: 1;
        min-width: 0;
      }

      .poskesdes-app .agenda .item > div:last-child {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
      }

      /* ========== MOBILE BOTTOM NAVIGATION (HIDDEN - USING HEADER MENU) ========== */
      .poskesdes-app footer.bottom-fixed {
        display: none;
      }

      .poskesdes-app section.page {
        display: none;
      }

      .poskesdes-app section.page.active {
        display: block;
      }

      /* ========== MOBILE FORMS ========== */
      .poskesdes-app .form-row {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .poskesdes-app .form-row .col {
        flex: 1;
        width: 100%;
      }

      .poskesdes-app input,
      .poskesdes-app select,
      .poskesdes-app textarea {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #e6eef0;
        font: inherit;
        font-size: 14px;
        background: #fff;
        transition: border-color 0.2s, box-shadow 0.2s;
        -webkit-appearance: none;
        appearance: none;
      }

      .poskesdes-app input:focus,
      .poskesdes-app select:focus,
      .poskesdes-app textarea:focus {
        outline: none;
        border-color: var(--teal-600);
        box-shadow: 0 0 0 3px rgba(14, 165, 164, 0.1);
      }

      .poskesdes-app select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 36px;
      }

      .poskesdes-app textarea {
        min-height: 80px;
        resize: vertical;
      }

      .poskesdes-app label {
        font-size: 13px;
        font-weight: 600;
        display: block;
        margin-bottom: 12px;
        color: #0b3b3b;
        line-height: 1.4;
      }

      .poskesdes-app label input,
      .poskesdes-app label select,
      .poskesdes-app label textarea {
        margin-top: 6px;
      }

      /* ========== MOBILE MODAL ========== */
      .poskesdes-app .modal {
        position: fixed;
        inset: 0;
        display: none;
        align-items: flex-end;
        justify-content: center;
        background: rgba(2, 6, 23, 0.5);
        z-index: 200;
        padding: 0;
      }

      .poskesdes-app .modal.show {
        display: flex;
      }

      .poskesdes-app .modal .panel {
        width: 100%;
        max-width: 100%;
        background: #fff;
        border-radius: 20px 20px 0 0;
        padding: 20px;
        max-height: 85vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }

      /* ========== MOBILE BADGES ========== */
      .poskesdes-app .badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 10px;
        color: #fff;
        font-weight: 700;
        white-space: nowrap;
      }

      .poskesdes-app .badge-danger {
        background: var(--danger);
      }

      .poskesdes-app .badge-warning {
        background: var(--orange-400);
      }

      .poskesdes-app .badge-success {
        background: var(--success);
      }

      .poskesdes-app .badge-muted {
        background: var(--muted);
      }

      /* ========== MOBILE TABLE ========== */
      .poskesdes-app .table-like {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .poskesdes-app .table-like div {
        display: grid;
        grid-template-columns: 32px 2fr 1.5fr 1.5fr;
        padding: 8px 6px;
        border-bottom: 1px solid #eef2f3;
        font-size: 12px;
        min-width: 400px;
      }

      .poskesdes-app .table-like div.header {
        font-weight: 700;
        background: #f9fafb;
        border-radius: 8px;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      /* ========== MOBILE FIELDSET ========== */
      .poskesdes-app fieldset.card.anc-block {
        border-radius: 10px;
        padding: 14px;
        margin-bottom: 14px;
        background: linear-gradient(180deg, #fff, #fbfbfb);
        border: 1px solid #eef6f6;
      }

      .poskesdes-app fieldset.card.anc-block legend {
        padding: 6px 10px;
        border-radius: 6px;
        background: #f8faf9;
        font-weight: 700;
        margin-bottom: 10px;
        font-size: 14px;
      }

      .poskesdes-app .layanan-detail label {
        display: block;
        margin-bottom: 12px;
        font-weight: 600;
        color: #0b3b3b;
      }

      .poskesdes-app .layanan-detail input,
      .poskesdes-app .layanan-detail select,
      .poskesdes-app .layanan-detail textarea {
        margin-top: 6px;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #e6eef0;
        font-weight: 500;
        background: #fff;
        font-size: 14px;
      }

      .poskesdes-app .danger-note {
        color: var(--danger);
        font-weight: 700;
        margin-top: 8px;
        font-size: 12px;
        line-height: 1.4;
      }

      /* ========== TABLET & DESKTOP RESPONSIVE ========== */
      @media (min-width: 640px) {
        .poskesdes-app main.container {
          padding: 16px 20px 20px;
        }

        .poskesdes-app .card {
          padding: 18px;
        }

        .poskesdes-app .hero {
          flex-direction: row;
          text-align: left;
        }

        .poskesdes-app .hero svg {
          width: 96px;
          height: 96px;
        }

        .poskesdes-app .hero > div > div:first-child {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .poskesdes-app .grid.services {
          grid-template-columns: repeat(2, 1fr);
        }

        .poskesdes-app .form-row {
          flex-direction: row;
          gap: 12px;
        }

        .poskesdes-app .form-row .col {
          width: auto;
        }

        .poskesdes-app .agenda .item {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }

        .poskesdes-app .btn,
        .poskesdes-app .btn-primary {
          width: auto;
          min-width: 140px;
        }

        .poskesdes-app .modal {
          align-items: center;
        }

        .poskesdes-app .modal .panel {
          width: min(600px, 90%);
          border-radius: 16px;
          max-height: 90vh;
        }
      }

      @media (min-width: 768px) {
        .poskesdes-app header {
          padding: 12px 20px;
        }

        .poskesdes-app .mark {
          width: 44px;
          height: 44px;
          min-width: 44px;
          font-size: 14px;
        }

        .poskesdes-app .logo > div:last-child > div:first-child {
          font-size: 16px;
        }

        .poskesdes-app .logo > div:last-child > div:last-child {
          font-size: 12px;
        }

        .poskesdes-app .menu-toggle {
          display: none;
        }

        .poskesdes-app nav.top-nav {
          position: static;
          width: auto;
          height: auto;
          max-width: none;
          background: transparent;
          box-shadow: none;
          display: flex;
          flex-direction: row;
          padding: 0;
          transform: none;
          overflow: visible;
          margin-left: auto;
          gap: 8px;
        }

        .poskesdes-app nav.top-nav a {
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 8px;
          border-left: none;
        }

        .poskesdes-app nav.top-nav a:active {
          transform: none;
        }

        .poskesdes-app nav.top-nav a.active {
          background: rgba(14, 165, 164, 0.08);
          color: var(--teal-600);
          border-left: none;
        }

        .poskesdes-app .logout-btn-mobile {
          display: none;
        }

        .poskesdes-app .logout-btn-desktop {
          display: block !important;
        }

        .poskesdes-app .logout-btn-desktop:hover {
          background: #fee2e2;
        }

        .poskesdes-app main.container {
          max-width: 980px;
          margin: 20px auto;
          padding: 0 20px 40px;
        }

        .poskesdes-app .grid.services {
          grid-template-columns: repeat(3, 1fr);
        }

        .poskesdes-app footer.bottom-fixed {
          display: none;
        }

        .poskesdes-app .card h2 {
          font-size: 22px;
        }

        .poskesdes-app .card h3 {
          font-size: 18px;
        }

        .poskesdes-app .hero h2 {
          font-size: 22px;
        }

        .poskesdes-app .svc > div:last-child > div:first-child {
          font-size: 15px;
        }

        .poskesdes-app .svc > div:last-child > div:last-child {
          font-size: 13px;
        }
      }

      @media (min-width: 1024px) {
        .poskesdes-app main.container {
          max-width: 1080px;
        }

        .poskesdes-app .modal .panel {
          width: min(720px, 85%);
        }
      }

      @media print {
        .poskesdes-app header,
        .poskesdes-app footer.bottom-fixed,
        .poskesdes-app nav.top-nav,
        .poskesdes-app .svc,
        .poskesdes-app .hero,
        .poskesdes-app #form-edukasi,
        .poskesdes-app #ekspor,
        .poskesdes-app #profil,
        .poskesdes-app #jadwal,
        .poskesdes-app .btn,
        .poskesdes-app .small-btn,
        .poskesdes-app .bottom-nav {
          display: none !important;
        }

        .poskesdes-app main.container {
          margin: 0;
          padding: 0;
          max-width: 100%;
        }

        .poskesdes-app,
        .poskesdes-app .card {
          background: #fff;
          box-shadow: none;
        }

        .poskesdes-app section.page {
          display: block !important;
        }

        .poskesdes-app #edukasi h2,
        .poskesdes-app #edukasi h3,
        .poskesdes-app #education-list {
          display: block !important;
        }

        .poskesdes-app #edukasi .muted {
          display: none;
        }
      }
    `}</style>
  )
}

