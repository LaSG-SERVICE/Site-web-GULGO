export default function Loading() {
  return (
    <main
      className="loading-page"
      aria-label="Chargement de GULGO"
      aria-busy="true"
    >
      <div className="loading-mark" aria-hidden="true">
        G
      </div>

      <div className="loading-bar" aria-hidden="true">
        <span />
      </div>

      <p>Préparation de votre espace professionnel…</p>
    </main>
  );
}