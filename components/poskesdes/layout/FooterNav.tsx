export function FooterNav() {
  return (
    <footer className="bottom-fixed">
      <nav className="bottom-nav" role="navigation" aria-label="Navigasi bawah">
        <a data-link="home">Beranda</a>
        <a data-link="pasien">Pasien</a>
        <a data-link="pemeriksaan">Pemeriksaan</a>
        <a data-link="jadwal">Jadwal</a>
        <a data-link="laporan">Laporan</a>
        <a data-link="ekspor">Ekspor</a>
        <a data-link="profil">Profil</a>
      </nav>
    </footer>
  )
}

