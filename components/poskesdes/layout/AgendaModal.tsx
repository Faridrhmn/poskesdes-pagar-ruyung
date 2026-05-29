export function AgendaModal() {
  return (
    <div id="modal" className="modal" aria-hidden="true" role="dialog" aria-modal="true">
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong id="modal-title" />
          <button id="modal-close" className="small-btn" type="button">
            Tutup
          </button>
        </div>
        <div style={{ height: "8px" }} />
        <div id="modal-body" className="muted" />
      </div>
    </div>
  )
}

