# ============================================================
# gulgo - GENERATEUR DU THEME GRAPHIQUE
# ============================================================
#
# Ce script génère automatiquement les variables CSS
# utilisées par l'application web gulgo.
#
# Technologie frontend :
#   Next.js + TypeScript + Tailwind CSS
#
# Langage de génération :
#   R
#
# Sortie :
#   app/gulgo-theme.css
#
# ============================================================

# ------------------------------------------------------------
# 1. PARAMETRES GENERAUX
# ------------------------------------------------------------

output_file <- file.path(
  "app",
  "gulgo-theme.css"
)

# ------------------------------------------------------------
# 2. IDENTITE VISUELLE gulgo
# ------------------------------------------------------------

gulgo <- list(

  # Couleurs principales
  navy        = "#0B1F3A",
  navy_dark   = "#07162A",
  blue        = "#165DFF",
  blue_dark   = "#0D47C7",
  blue_light  = "#EAF1FF",

  # Couleurs complémentaires
  cyan        = "#06B6D4",
  violet      = "#6366F1",

  # Neutres
  white       = "#FFFFFF",
  background  = "#F7F9FC",
  surface     = "#FFFFFF",
  text        = "#172033",
  text_muted  = "#667085",
  border      = "#E4E7EC",

  # Etats
  success     = "#12B76A",
  success_bg  = "#ECFDF3",

  warning     = "#F79009",
  warning_bg  = "#FFFAEB",

  danger      = "#F04438",
  danger_bg   = "#FEF3F2",

  info        = "#2E90FA",
  info_bg     = "#EFF8FF"
)

# ------------------------------------------------------------
# 3. DESIGN TOKENS
# ------------------------------------------------------------

tokens <- list(

  radius_sm = "8px",
  radius_md = "12px",
  radius_lg = "18px",
  radius_xl = "24px",

  shadow_sm = "0 1px 3px rgba(16, 24, 40, 0.08)",
  shadow_md = "0 8px 24px rgba(16, 24, 40, 0.08)",
  shadow_lg = "0 20px 50px rgba(16, 24, 40, 0.12)",

  max_width = "1200px",

  transition = "all 180ms ease"
)

# ------------------------------------------------------------
# 4. GENERATION CSS
# ------------------------------------------------------------

css <- sprintf(
":root {

  /* ========================================================
     gulgo COLORS
     ======================================================== */

  --gulgo-navy: %s;
  --gulgo-navy-dark: %s;

  --gulgo-blue: %s;
  --gulgo-blue-dark: %s;
  --gulgo-blue-light: %s;

  --gulgo-cyan: %s;
  --gulgo-violet: %s;

  --gulgo-white: %s;
  --gulgo-background: %s;
  --gulgo-surface: %s;

  --gulgo-text: %s;
  --gulgo-text-muted: %s;
  --gulgo-border: %s;

  /* ========================================================
     STATUS
     ======================================================== */

  --gulgo-success: %s;
  --gulgo-success-bg: %s;

  --gulgo-warning: %s;
  --gulgo-warning-bg: %s;

  --gulgo-danger: %s;
  --gulgo-danger-bg: %s;

  --gulgo-info: %s;
  --gulgo-info-bg: %s;

  /* ========================================================
     DESIGN SYSTEM
     ======================================================== */

  --gulgo-radius-sm: %s;
  --gulgo-radius-md: %s;
  --gulgo-radius-lg: %s;
  --gulgo-radius-xl: %s;

  --gulgo-shadow-sm: %s;
  --gulgo-shadow-md: %s;
  --gulgo-shadow-lg: %s;

  --gulgo-max-width: %s;

  --gulgo-transition: %s;
}

/* ==========================================================
   BASE
   ========================================================== */

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--gulgo-background);
  color: var(--gulgo-text);

  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    \"Segoe UI\",
    sans-serif;

  -webkit-font-smoothing: antialiased;
}

/* ==========================================================
   LINKS
   ========================================================== */

a {
  color: inherit;
  text-decoration: none;
}

/* ==========================================================
   CONTAINER
   ========================================================== */

.gulgo-container {
  width: min(
    calc(100%% - 48px),
    var(--gulgo-max-width)
  );

  margin-inline: auto;
}

/* ==========================================================
   BUTTONS
   ========================================================== */

.gulgo-button {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  min-height: 48px;

  padding:
    0 22px;

  border-radius:
    var(--gulgo-radius-md);

  font-weight: 700;

  border: 1px solid transparent;

  cursor: pointer;

  transition:
    var(--gulgo-transition);
}

.gulgo-button-primary {
  color: var(--gulgo-white);
  background: var(--gulgo-blue);

  box-shadow:
    0 8px 18px
    rgba(22, 93, 255, 0.20);
}

.gulgo-button-primary:hover {
  background: var(--gulgo-blue-dark);

  transform:
    translateY(-1px);

  box-shadow:
    0 12px 24px
    rgba(22, 93, 255, 0.25);
}

.gulgo-button-secondary {
  color: var(--gulgo-navy);

  background:
    var(--gulgo-white);

  border-color:
    var(--gulgo-border);
}

.gulgo-button-secondary:hover {
  border-color:
    var(--gulgo-blue);

  color:
    var(--gulgo-blue);
}

/* ==========================================================
   CARD
   ========================================================== */

.gulgo-card {

  background:
    var(--gulgo-surface);

  border:
    1px solid var(--gulgo-border);

  border-radius:
    var(--gulgo-radius-lg);

  box-shadow:
    var(--gulgo-shadow-sm);

  transition:
    var(--gulgo-transition);
}

.gulgo-card:hover {

  transform:
    translateY(-3px);

  box-shadow:
    var(--gulgo-shadow-md);
}

/* ==========================================================
   BADGE
   ========================================================== */

.gulgo-badge {

  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding:
    6px 10px;

  border-radius:
    999px;

  font-size:
    13px;

  font-weight:
    700;

  background:
    var(--gulgo-blue-light);

  color:
    var(--gulgo-blue);
}

/* ==========================================================
   HERO
   ========================================================== */

.gulgo-hero {

  position:
    relative;

  overflow:
    hidden;

  background:
    linear-gradient(
      135deg,
      var(--gulgo-navy) 0%%,
      #102F57 55%%,
      #163E72 100%%
    );

  color:
    var(--gulgo-white);

  border-radius:
    0 0 32px 32px;
}

.gulgo-hero::before {

  content:
    \"\";

  position:
    absolute;

  width:
    500px;

  height:
    500px;

  border-radius:
    50%%;

  background:
    rgba(255,255,255,0.06);

  top:
    -250px;

  right:
    -120px;
}

/* ==========================================================
   SCORE CARD
   ========================================================== */

.gulgo-score-card {

  background:
    rgba(255,255,255,0.10);

  border:
    1px solid rgba(255,255,255,0.18);

  backdrop-filter:
    blur(16px);

  border-radius:
    var(--gulgo-radius-xl);

  box-shadow:
    var(--gulgo-shadow-lg);
}

/* ==========================================================
   RESPONSIVE
   ========================================================== */

@media (max-width: 768px) {

  .gulgo-container {

    width:
      min(
        calc(100%% - 32px),
        var(--gulgo-max-width)
      );
  }

  .gulgo-hero {

    border-radius:
      0 0 24px 24px;
  }

}
",
gulgo$navy,
gulgo$navy_dark,
gulgo$blue,
gulgo$blue_dark,
gulgo$blue_light,
gulgo$cyan,
gulgo$violet,
gulgo$white,
gulgo$background,
gulgo$surface,
gulgo$text,
gulgo$text_muted,
gulgo$border,
gulgo$success,
gulgo$success_bg,
gulgo$warning,
gulgo$warning_bg,
gulgo$danger,
gulgo$danger_bg,
gulgo$info,
gulgo$info_bg,
tokens$radius_sm,
tokens$radius_md,
tokens$radius_lg,
tokens$radius_xl,
tokens$shadow_sm,
tokens$shadow_md,
tokens$shadow_lg,
tokens$max_width,
tokens$transition
)

# ------------------------------------------------------------
# 5. CREATION DU DOSSIER SI NECESSAIRE
# ------------------------------------------------------------

if (!dir.exists("app")) {
  dir.create("app", recursive = TRUE)
}

# ------------------------------------------------------------
# 6. ECRITURE DU FICHIER
# ------------------------------------------------------------

writeLines(
  css,
  con = output_file,
  useBytes = TRUE
)

cat("\n")
cat("============================================\n")
cat(" gulgo DESIGN SYSTEM\n")
cat("============================================\n")
cat("\n")
cat("Theme CSS genere avec succes.\n")
cat("\n")
cat("Fichier :", output_file, "\n")
cat("\n")
cat("Couleur principale :", gulgo$blue, "\n")
cat("Couleur institutionnelle :", gulgo$navy, "\n")
cat("\n")
cat("============================================\n")