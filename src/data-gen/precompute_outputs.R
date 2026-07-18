# =============================================================================
# precompute_outputs.R — Genera todos los PNG precomputados para los MDX
#
# Ejecutar desde la raiz del proyecto:
#   Rscript src/data-gen/precompute_outputs.R
#
# Requiere: gamlss, gamlss.data
# =============================================================================

library(gamlss)
library(gamlss.data)
library(survival)

out_base <- file.path("public", "precomputed")
data_dir <- file.path("public", "data")

# Helper: guardar plot en PNG
save_png <- function(path, expr, width = 800, height = 600) {
  dir.create(dirname(path), recursive = TRUE, showWarnings = FALSE)
  png(path, width = width, height = height, res = 120)
  tryCatch(expr, finally = dev.off())
  cat("OK:", path, "\n")
}

# =============================================================================
# Modulo 01: explorar carteras + histDist
# =============================================================================
cat("\n=== Modulo 01 ===\n")

severidad <- read.csv(file.path(data_dir, "severidad_acc.csv"))
severidad$sector <- as.factor(severidad$sector)

# 01/explorar-carteras.png
save_png(file.path(out_base, "01", "explorar-carteras.png"), {
  cartera_A <- severidad$severidad[severidad$sector == "manufactura"]
  cartera_B <- severidad$severidad[severidad$sector == "construccion"]
  plot(density(cartera_A), col = "#1e3a5f", lwd = 2,
       main = "Densidades de severidad por cartera",
       xlab = "Severidad (millones COP)", xlim = range(severidad$severidad))
  lines(density(cartera_B), col = "#c62828", lwd = 2)
  legend("topright", c("Manufactura", "Construccion"),
         col = c("#1e3a5f", "#c62828"), lwd = 2, bty = "n")
})

# 01/histdist-severidad.png
save_png(file.path(out_base, "01", "histdist-severidad.png"), {
  y <- severidad$severidad
  m_no <- gamlss(y ~ 1, family = NO)
  m_ga <- gamlss(y ~ 1, family = GA)
  m_bct <- gamlss(y ~ 1, family = BCT)
  par(mfrow = c(1, 3))
  histDist(y, family = NO, main = "Normal")
  histDist(y, family = GA, main = "Gamma")
  histDist(y, family = BCT, main = "BCT")
  par(mfrow = c(1, 1))
})

# =============================================================================
# Modulo 02: gamlss Gamma mu y mu+sigma
# =============================================================================
cat("\n=== Modulo 02 ===\n")

# 02/gamlss-gamma-mu.png
save_png(file.path(out_base, "02", "gamlss-gamma-mu.png"), {
  m1 <- gamlss(severidad ~ log(monto) + sector, family = GA, data = severidad)
  term.plot(m1, what = "mu", pages = 1, ask = FALSE, se = TRUE)
})

# 02/gamlss-gamma-mu-sigma.png
save_png(file.path(out_base, "02", "gamlss-gamma-mu-sigma.png"), {
  m2 <- gamlss(severidad ~ log(monto) + sector,
               sigma.formula = ~ sector, family = GA, data = severidad)
  term.plot(m2, what = "sigma", pages = 1, ask = FALSE, se = TRUE)
})

# 02/residuos-rapido.png
save_png(file.path(out_base, "02", "residuos-rapido.png"), {
  plot(m2)
})

# =============================================================================
# Modulo 03: fitDist
# =============================================================================
cat("\n=== Modulo 03 ===\n")

save_png(file.path(out_base, "03", "fitdist-severidad.png"), {
  y <- severidad$severidad
  histDist(y, family = BCT, main = "BCT - severidad")
})

# =============================================================================
# Modulo 04: worm plots
# =============================================================================
cat("\n=== Modulo 04 ===\n")

data(dbbmi)

# 04/worm-plot-dbbmi.png (modelo bueno)
save_png(file.path(out_base, "04", "worm-plot-dbbmi.png"), {
  m_good <- gamlss(bmi ~ pb(age), sigma.formula = ~ pb(age),
                   nu.formula = ~ pb(age), family = BCCG, data = dbbmi)
  wp(m_good, xvar = dbbmi$age, n.inter = 4,
     main = "Worm plots - BCCG (buen ajuste)")
})

# 04/worm-plot-falla.png (modelo malo: Normal sin suavizados)
save_png(file.path(out_base, "04", "worm-plot-falla.png"), {
  m_bad <- gamlss(bmi ~ age, family = NO, data = dbbmi)
  wp(m_bad, xvar = dbbmi$age, n.inter = 4,
     main = "Worm plots - Normal (mal ajuste)")
})

# =============================================================================
# Modulo 05: cementos P-splines
# =============================================================================
cat("\n=== Modulo 05 ===\n")

cementos <- read.csv(file.path(data_dir, "cementos.csv"))

save_png(file.path(out_base, "05", "cementos-modelos.png"), {
  m3 <- gamlss(dureza ~ pb(temperatura),
               sigma.formula = ~ pb(temperatura),
               family = NO, data = cementos)
  par(mfrow = c(1, 2))
  term.plot(m3, what = "mu", se = TRUE,
            main = "Efecto de temperatura en mu")
  term.plot(m3, what = "sigma", se = TRUE,
            main = "Efecto de temperatura en sigma")
  par(mfrow = c(1, 1))
})

# =============================================================================
# Modulo 06: PD con efecto aleatorio
# =============================================================================
cat("\n=== Modulo 06 ===\n")

cartera_pd <- read.csv(file.path(data_dir, "cartera_pd.csv"))
cartera_pd$sector <- as.factor(cartera_pd$sector)
cartera_pd$trimestre <- as.factor(cartera_pd$trimestre)

save_png(file.path(out_base, "06", "pd-efecto-aleatorio.png"), {
  m2 <- gamlss(default ~ endeudamiento + ratio_liquidez + antiguedad + random(factor(sector)),
               family = BI, data = cartera_pd)
  plot(m2, xvar = cartera_pd$sector, main = "PD por sector")
})

# =============================================================================
# Modulo 07: balance sesgo-varianza
# =============================================================================
cat("\n=== Modulo 07 ===\n")

save_png(file.path(out_base, "07", "balance-sesgo-varianza.png"), {
  m <- gamlss(dureza ~ pb(temperatura),
              sigma.formula = ~ pb(temperatura),
              family = NO, data = cementos)
  par(mfrow = c(1, 2))
  term.plot(m, what = "mu", se = TRUE, partial = TRUE,
            main = "Suavizado mu (df ~ 7)")
  term.plot(m, what = "sigma", se = TRUE, partial = TRUE,
            main = "Suavizado sigma (df ~ 5)")
  par(mfrow = c(1, 1))
})

# =============================================================================
# Modulo 09: lotes BEINF
# =============================================================================
cat("\n=== Modulo 09 ===\n")

lotes <- read.csv(file.path(data_dir, "lotes_defectuosos.csv"))
lotes$linea <- as.factor(lotes$linea)

save_png(file.path(out_base, "09", "lotes-beinf.png"), {
  m <- gamlss(proporcion_defectos ~ linea + temperatura + velocidad,
              sigma.formula = ~ linea,
              nu.formula = ~ linea,
              tau.formula = ~ linea,
              family = BEINF, data = lotes)
  plot(m)
})

# =============================================================================
# Modulo 10: BCT vs GB2 vs Gamma
# =============================================================================
cat("\n=== Modulo 10 ===\n")

save_png(file.path(out_base, "10", "bct-gb2-comparacion.png"), {
  fo <- severidad ~ log(monto) + sector + antiguedad
  sigma_fo <- ~ sector
  m_ga  <- gamlss(fo, sigma.formula = sigma_fo, family = GA,  data = severidad)
  m_bct <- gamlss(fo, sigma.formula = sigma_fo, family = BCT, data = severidad)
  par(mfrow = c(1, 2))
  histDist(severidad$severidad, family = GA, main = "Gamma")
  histDist(severidad$severidad, family = BCT, main = "BCT")
  par(mfrow = c(1, 1))
})

# =============================================================================
# Modulo 11: centiles LMS
# =============================================================================
cat("\n=== Modulo 11 ===\n")

# 11/centiles-dbbmi.png
save_png(file.path(out_base, "11", "centiles-dbbmi.png"), {
  m_lms <- gamlss(bmi ~ pb(age), sigma.formula = ~ pb(age),
                  nu.formula = ~ pb(age), family = BCCG, data = dbbmi)
  centiles(m_lms, xvar = dbbmi$age, cent = c(3, 15, 50, 85, 97),
           main = "Curvas de centiles de IMC (LMS)",
           xlab = "Edad (anos)", ylab = "IMC (kg/m2)")
})

# 11/lms-parametros.png
save_png(file.path(out_base, "11", "lms-parametros.png"), {
  m_lms <- gamlss(bmi ~ pb(age), sigma.formula = ~ pb(age),
                  nu.formula = ~ pb(age), family = BCCG, data = dbbmi)
  par(mfrow = c(1, 3))
  term.plot(m_lms, what = "mu", se = TRUE, main = "M: mediana del IMC")
  term.plot(m_lms, what = "sigma", se = TRUE, main = "S: coef. de variacion")
  term.plot(m_lms, what = "nu", se = TRUE, main = "L: Box-Cox (asimetria)")
  par(mfrow = c(1, 1))
})

# 11/worm-plot-lms.png
save_png(file.path(out_base, "11", "worm-plot-lms.png"), {
  m_lms <- gamlss(bmi ~ pb(age), sigma.formula = ~ pb(age),
                  nu.formula = ~ pb(age), family = BCCG, data = dbbmi)
  wp(m_lms, xvar = dbbmi$age, n.inter = 4,
     main = "Worm plots - LMS (BCCG)")
})

# 11/comparacion-lms-lmst.png
save_png(file.path(out_base, "11", "comparacion-lms-lmst.png"), {
  m_lms <- gamlss(bmi ~ pb(age), sigma.formula = ~ pb(age),
                  nu.formula = ~ pb(age), family = BCCG, data = dbbmi)
  m_lmst <- gamlss(bmi ~ pb(age), sigma.formula = ~ pb(age),
                   nu.formula = ~ pb(age), tau.formula = ~ pb(age),
                   family = BCT, data = dbbmi)
  par(mfrow = c(1, 2))
  centiles(m_lms, xvar = dbbmi$age, cent = c(3, 15, 50, 85, 97),
           main = "LMS (BCCG)", ylab = "IMC", xlab = "Edad")
  centiles(m_lmst, xvar = dbbmi$age, cent = c(3, 15, 50, 85, 97),
           main = "LMST (BCT)", ylab = "IMC", xlab = "Edad")
  par(mfrow = c(1, 1))
})

# 11/lmst-extension.png
save_png(file.path(out_base, "11", "lmst-extension.png"), {
  m_lmst <- gamlss(bmi ~ pb(age), sigma.formula = ~ pb(age),
                   nu.formula = ~ pb(age), tau.formula = ~ pb(age),
                   family = BCT, data = dbbmi)
  centiles(m_lmst, xvar = dbbmi$age, cent = c(3, 15, 50, 85, 97),
           main = "Curvas de centiles (LMST - BCT)")
})

# 11/centiles-severidad-plot.png
save_png(file.path(out_base, "11", "centiles-severidad-plot.png"), {
  m <- gamlss(severidad ~ pb(log(monto)) + sector,
              sigma.formula = ~ pb(log(monto)) + sector,
              family = BCT, data = severidad)
  newd <- data.frame(monto = seq(20, 500, length = 100), sector = "manufactura")
  mu_hat <- predict(m, newdata = newd, what = "mu", type = "response")
  sigma_hat <- predict(m, newdata = newd, what = "sigma", type = "response")
  nu_hat <- predict(m, newdata = newd, what = "nu", type = "response")
  tau_hat <- predict(m, newdata = newd, what = "tau", type = "response")
  q50 <- qBCT(0.50, mu = mu_hat, sigma = sigma_hat, nu = nu_hat, tau = tau_hat)
  q95 <- qBCT(0.95, mu = mu_hat, sigma = sigma_hat, nu = nu_hat, tau = tau_hat)
  q99 <- qBCT(0.99, mu = mu_hat, sigma = sigma_hat, nu = nu_hat, tau = tau_hat)
  plot(newd$monto, q50, type = "l", lwd = 2, col = "#1e3a5f",
       main = "Centiles de severidad por monto (manufactura)",
       xlab = "Monto asegurado (millones COP)",
       ylab = "Severidad (millones COP)",
       ylim = c(0, max(q99) * 1.1))
  lines(newd$monto, q95, lwd = 2, col = "#e67e22")
  lines(newd$monto, q99, lwd = 2, col = "#c0392b")
  legend("topleft", c("P50", "P95", "P99"),
         col = c("#1e3a5f", "#e67e22", "#c0392b"), lwd = 2, bty = "n")
})

# =============================================================================
# Modulo 12: Weibull censura
# =============================================================================
cat("\n=== Modulo 12 ===\n")

fatiga <- read.csv(file.path(data_dir, "fatiga.csv"))
fatiga$cens <- as.numeric(as.character(fatiga$censura))

save_png(file.path(out_base, "12", "weibull-censura.png"), {
  histDist(fatiga$ciclos, family = WEI3, main = "Weibull - ciclos hasta fallo",
           xlab = "Ciclos")
})

# =============================================================================
# Modulo 13: estacionalidad cy
# =============================================================================
cat("\n=== Modulo 13 ===\n")

demanda <- read.csv(file.path(data_dir, "demanda_skus.csv"))
demanda$semana <- as.numeric(factor(demanda$fecha))
demanda$sku <- as.factor(demanda$sku)
demanda$promocion <- as.factor(demanda$promocion)

# Usar un SKU erratico
sku_data <- demanda[demanda$sku == unique(demanda$sku)[15], ]

save_png(file.path(out_base, "13", "estacionalidad-cy.png"), {
  if (nrow(sku_data) > 0 && var(sku_data$demanda) > 0) {
    m <- gamlss(demanda ~ promocion + cy(semana, cyclic = TRUE),
                sigma.formula = ~ 1, family = NBI, data = sku_data)
    term.plot(m, what = "mu", se = TRUE,
              main = "Efecto estacional en la demanda")
  } else {
    plot.new()
    text(0.5, 0.5, "Datos insuficientes para SKU seleccionado")
  }
})

# =============================================================================
# Modulo 14: PD modelo completo
# =============================================================================
cat("\n=== Modulo 14 ===\n")

save_png(file.path(out_base, "14", "pd-modelo-completo.png"), {
  m3 <- gamlss(default ~ endeudamiento + ratio_liquidez + antiguedad +
                 random(factor(sector)) + random(factor(trimestre)),
               family = BI, data = cartera_pd)
  plot(m3)
})

# =============================================================================
# Modulo 15: LGD BEINF
# =============================================================================
cat("\n=== Modulo 15 ===\n")

rec <- read.csv(file.path(data_dir, "recuperaciones_acc.csv"))
rec$sector <- as.factor(rec$sector)
rec$colateral <- as.factor(rec$colateral)

save_png(file.path(out_base, "15", "lgd-beinf-completo.png"), {
  m <- gamlss(lgd ~ sector + log(monto) + antiguedad + colateral,
              sigma.formula = ~ colateral,
              nu.formula = ~ colateral + sector,
              tau.formula = ~ colateral,
              family = BEINF, data = rec)
  plot(m)
})

# =============================================================================
# Modulo 17: simulacion agregada
# =============================================================================
cat("\n=== Modulo 17 ===\n")

save_png(file.path(out_base, "17", "simulacion-agregada.png"), {
  set.seed(2026)
  n_sim <- 10000
  S_total <- numeric(n_sim)
  freq_mu <- 5.82
  freq_sigma <- 0.6
  freq_nu <- 0.08
  sev_mu <- 48.3
  sev_sigma <- 0.59
  sev_nu <- 1.0
  sev_tau <- 4.82

  for (s in 1:n_sim) {
    N <- rZINBI(1, mu = freq_mu, sigma = freq_sigma, nu = freq_nu)
    if (N == 0) {
      S_total[s] <- 0
    } else {
      severidades <- rBCT(N, mu = sev_mu, sigma = sev_sigma,
                          nu = sev_nu, tau = sev_tau)
      S_total[s] <- sum(severidades)
    }
  }

  hist(S_total, breaks = 50, main = "Perdida agregada - Construccion urbana",
       xlab = "Millones COP", col = "#dbe7f2", border = "#1e3a5f")
  abline(v = mean(S_total), col = "#2e7d32", lwd = 2, lty = 2)
  abline(v = quantile(S_total, 0.995), col = "#dc2626", lwd = 2, lty = 2)
  legend("topright", c("E[S]", "VaR 99.5%"), col = c("#2e7d32", "#dc2626"),
         lwd = 2, lty = 2, bty = "n")
})

cat("\n=== DONE: todos los PNG generados ===\n")
