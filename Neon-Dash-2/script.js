/* ================================================================
   NEON DASH — script.js
   Motor de juego puro: HTML5 Canvas + Vanilla JS
   Sin dependencias externas. Objetivo: 60 FPS constantes.
   ================================================================ */

'use strict';

// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 1: CONSTANTES DE AFINACIÓN DE FÍSICAS
//  *** AQUÍ puedes modificar la sensación del juego ***
// ─────────────────────────────────────────────────────────────────

const CONFIG = {

  // --- JUGADOR ---
  // Fuerza del salto: valor negativo (hacia arriba en canvas).
  // Más negativo = salto más alto. Rango recomendado: -14 a -22
  JUMP_FORCE: -17,

  // Gravedad: cuánta velocidad hacia abajo se agrega por frame.
  // Más alto = caída más rápida, juego más difícil. Rango: 0.6 a 1.4
  GRAVITY: 0.9,

  // Velocidad máxima de caída (terminal velocity).
  // Evita que el jugador caiga "infinito" en pantallas grandes. Rango: 18 a 30
  MAX_FALL_SPEED: 24,

  // Ancho y alto del jugador en píxeles lógicos (antes de escala)
  PLAYER_W: 38,
  PLAYER_H: 38,

  // Posición horizontal fija del jugador (% del ancho del canvas)
  PLAYER_X_RATIO: 0.15,

  // --- OBSTÁCULOS ---
  // Velocidad inicial de los obstáculos (px/frame a 60 FPS).
  // Rango sugerido: 5 a 12. El juego acelera con el tiempo.
  OBSTACLE_SPEED_INITIAL: 6,

  // Incremento de velocidad por cada obstáculo pasado.
  // 0 = velocidad constante. Rango: 0 a 0.15
  OBSTACLE_SPEED_INCREMENT: 0.07,

  // Velocidad máxima permitida para los obstáculos
  OBSTACLE_SPEED_MAX: 18,

  // Frames entre la aparición de obstáculos (menor = más frecuente).
  // Se reduce a medida que el puntaje sube.
  SPAWN_INTERVAL_INITIAL: 100,
  SPAWN_INTERVAL_MIN: 52,

  // --- SUELO ---
  // Altura del suelo como fracción del alto del canvas. 0.82 = 82% desde arriba.
  GROUND_Y_RATIO: 0.82,

  // --- VISUAL ---
  // Intensidad del glow de los elementos. Mayor = más neón. Rango: 8 a 30
  GLOW_BLUR: 16,
};


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 2: PALETA DE COLORES SYNTHWAVE
// ─────────────────────────────────────────────────────────────────

const COLORS = {
  BACKGROUND:   '#04000f',
  GRID_LINE:    'rgba(100, 0, 200, 0.18)',
  GROUND:       '#1a003a',
  GROUND_LINE:  '#b400ff',
  PLAYER_FILL:  'rgba(0, 245, 255, 0.15)',
  PLAYER_STROKE:'#00f5ff',
  OBSTACLE:     '#ff00c8',
  STAR:         'rgba(200, 180, 255, ',  // se completa con alpha
  SCANLINE:     'rgba(0,0,0,0.08)',
};


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 3: REFERENCIAS AL DOM
// ─────────────────────────────────────────────────────────────────

const canvas      = document.getElementById('gameCanvas');
const ctx         = canvas.getContext('2d');
const scoreEl     = document.getElementById('score-value');
const bestEl      = document.getElementById('best-value');
const deathScreen = document.getElementById('death-screen');
const dotsEl      = document.getElementById('dots');


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 4: ESTADO GLOBAL DEL JUEGO
//  Un objeto único para todo el estado — evita variables globales sueltas
// ─────────────────────────────────────────────────────────────────

let state = {};        // se inicializa en resetGame()
let bestScore = 0;
let rafId = null;      // ID del requestAnimationFrame activo
let lastTime = 0;      // timestamp del último frame (para delta time)


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 5: ESTRELLAS DE FONDO (generadas una sola vez)
// ─────────────────────────────────────────────────────────────────

// Pool de estrellas: se crean al inicio y se reutilizan siempre.
// Esto evita garbage collection innecesario.
const STAR_COUNT = 120;
const stars = new Float32Array(STAR_COUNT * 3); // x, y, alpha por estrella

function buildStars() {
  for (let i = 0; i < STAR_COUNT; i++) {
    const base = i * 3;
    stars[base]     = Math.random();          // x normalizado 0-1
    stars[base + 1] = Math.random() * 0.75;   // y normalizado 0-0.75 (solo cielo)
    stars[base + 2] = 0.2 + Math.random() * 0.7; // alpha
  }
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 6: RESIZE DEL CANVAS (responsive)
// ─────────────────────────────────────────────────────────────────

function resizeCanvas() {
  // Usar devicePixelRatio para pantallas de alta densidad
  // pero sin sacrificar rendimiento en dispositivos lentos.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.scale(dpr, dpr);

  // Alias de conveniencia (dimensiones lógicas)
  canvas.lw = window.innerWidth;
  canvas.lh = window.innerHeight;
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 7: INICIALIZACIÓN Y RESET
// ─────────────────────────────────────────────────────────────────

function resetGame() {
  const groundY = canvas.lh * CONFIG.GROUND_Y_RATIO;
  const px      = canvas.lw * CONFIG.PLAYER_X_RATIO;

  state = {
    // Jugador
    player: {
      x:  px,
      y:  groundY - CONFIG.PLAYER_H,  // apoyado en el suelo
      vy: 0,                           // velocidad vertical
      onGround: true,
    },

    // Obstáculos: array de objetos { x, w, h, type }
    // Se reciclan para minimizar allocations.
    obstacles: [],

    // Contador de frames para el spawn
    frameCount: 0,

    // Puntuación
    score: 0,

    // Velocidad actual de obstáculos
    obstacleSpeed: CONFIG.OBSTACLE_SPEED_INITIAL,

    // Intervalo de spawn actual
    spawnInterval: CONFIG.SPAWN_INTERVAL_INITIAL,

    // Flag para no procesar salto repetido en el mismo keydown
    jumpPressed: false,

    // ¿El juego está corriendo?
    running: true,

    // Suelo Y (calculado una vez)
    groundY: groundY,
  };

  scoreEl.textContent = '0';
  deathScreen.classList.add('hidden');
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 8: SPAWNER DE OBSTÁCULOS
//  Genera pinchos/triángulos en el borde derecho del canvas.
// ─────────────────────────────────────────────────────────────────

function spawnObstacle() {
  // Variación aleatoria: obstáculos simples o dobles (pareja de pinchos)
  const roll = Math.random();

  if (roll < 0.55) {
    // Obstáculo simple: un pincho
    pushObstacle(1);
  } else if (roll < 0.85) {
    // Obstáculo doble: dos pinchos juntos
    pushObstacle(2);
  } else {
    // Obstáculo triple: desafío
    pushObstacle(3);
  }
}

function pushObstacle(count) {
  const baseW = 28;
  const baseH = 42;
  const gap   = 4;
  const totalW = count * baseW + (count - 1) * gap;

  // Un solo objeto de "grupo" representado por un rectángulo hit-box
  // y dibujado como N triángulos
  state.obstacles.push({
    x:     canvas.lw + 20,       // fuera del canvas a la derecha
    y:     state.groundY - baseH, // base toca el suelo
    w:     totalW,
    h:     baseH,
    count: count,
    baseW: baseW,
    gap:   gap,
  });
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 9: COLISIÓN AABB (Axis-Aligned Bounding Box)
//  Hitbox reducida un 20% para que se sienta justa, no tramposa.
// ─────────────────────────────────────────────────────────────────

function checkCollision(player, obs) {
  const shrink = 0.20; // 20% de margen de perdón en cada lado

  const px = player.x + CONFIG.PLAYER_W * shrink;
  const py = player.y + CONFIG.PLAYER_H * shrink;
  const pw = CONFIG.PLAYER_W  * (1 - shrink * 2);
  const ph = CONFIG.PLAYER_H  * (1 - shrink * 2);

  // Margen extra en la punta del triángulo (eje Y): los triángulos
  // son más estrechos arriba, así que ajustamos el hitbox del obs.
  const obsShrinkX = obs.w  * 0.15;
  const obsShrinkY = obs.h  * 0.10;

  return (
    px < obs.x + obs.w - obsShrinkX &&
    px + pw > obs.x + obsShrinkX    &&
    py < obs.y + obs.h - obsShrinkY &&
    py + ph > obs.y + obsShrinkY
  );
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 10: LÓGICA DE UPDATE (se llama 60 veces por segundo)
// ─────────────────────────────────────────────────────────────────

function update() {
  if (!state.running) return;

  const s = state;
  s.frameCount++;

  // --- Física del jugador ---
  s.player.vy += CONFIG.GRAVITY;
  if (s.player.vy > CONFIG.MAX_FALL_SPEED) s.player.vy = CONFIG.MAX_FALL_SPEED;
  s.player.y  += s.player.vy;

  // Colisión con el suelo
  const groundLimit = s.groundY - CONFIG.PLAYER_H;
  if (s.player.y >= groundLimit) {
    s.player.y  = groundLimit;
    s.player.vy = 0;
    s.player.onGround = true;
  }

  // --- Spawn de obstáculos ---
  if (s.frameCount % s.spawnInterval === 0) {
    spawnObstacle();

    // Progresiva dificultad: reducir el intervalo de spawn con el tiempo
    if (s.spawnInterval > CONFIG.SPAWN_INTERVAL_MIN) {
      s.spawnInterval -= 1;
    }
  }

  // --- Mover y limpiar obstáculos ---
  const speed = s.obstacleSpeed;
  let survived = 0;  // cuenta obstáculos que el jugador superó

  for (let i = s.obstacles.length - 1; i >= 0; i--) {
    const obs = s.obstacles[i];
    obs.x -= speed;

    // Colisión
    if (checkCollision(s.player, obs)) {
      triggerDeath();
      return;
    }

    // Obstáculo pasó al jugador → sumar punto
    if (!obs.scored && obs.x + obs.w < s.player.x) {
      obs.scored = true;
      survived++;
    }

    // Fuera del canvas → eliminar (splice desde atrás es O(n) peor caso
    // pero con pocos obstáculos en pantalla es trivial)
    if (obs.x + obs.w < -20) {
      s.obstacles.splice(i, 1);
    }
  }

  // --- Actualizar puntuación ---
  if (survived > 0) {
    s.score += survived;
    scoreEl.textContent = s.score;

    // Aumentar velocidad de obstáculos con cada punto
    s.obstacleSpeed = Math.min(
      CONFIG.OBSTACLE_SPEED_INITIAL + s.score * CONFIG.OBSTACLE_SPEED_INCREMENT,
      CONFIG.OBSTACLE_SPEED_MAX
    );
  }

  // Puntuación pasiva: 1 punto cada 6 frames (ritmo de avance)
  if (s.frameCount % 6 === 0) {
    s.score++;
    scoreEl.textContent = s.score;
  }
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 11: MUERTE Y REINICIO
// ─────────────────────────────────────────────────────────────────

function triggerDeath() {
  state.running = false;

  // Actualizar best score
  if (state.score > bestScore) {
    bestScore = state.score;
    bestEl.textContent = bestScore;
  }

  // Mostrar pantalla de Game Over con animación de puntos
  deathScreen.classList.remove('hidden');
  let dotCount = 0;
  const dotInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    dotsEl.textContent = '.'.repeat(dotCount);
  }, 200);

  // Reiniciar automáticamente tras 1.2 segundos
  setTimeout(() => {
    clearInterval(dotInterval);
    resetGame();
  }, 1200);
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 12: SALTO
// ─────────────────────────────────────────────────────────────────

function jump() {
  if (!state.running) return;
  if (!state.player.onGround) return;  // solo un salto; sin doble salto en MVP

  state.player.vy        = CONFIG.JUMP_FORCE;
  state.player.onGround  = false;
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 13: RENDER — CAPAS EN ORDEN DE PROFUNDIDAD
// ─────────────────────────────────────────────────────────────────

function render() {
  const W = canvas.lw;
  const H = canvas.lh;

  // 1. Fondo base
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, W, H);

  drawStars(W, H);
  drawGrid(W, H);
  drawGround(W, H);
  drawObstacles();
  drawPlayer();
  drawScanlines(W, H);
}

// ── 13a. Estrellas ───────────────────────────────────────────────
function drawStars(W, H) {
  for (let i = 0; i < STAR_COUNT; i++) {
    const base  = i * 3;
    const x     = stars[base]     * W;
    const y     = stars[base + 1] * H;
    const alpha = stars[base + 2];

    // Parpadeo sutil basado en frame count
    const flicker = 0.6 + 0.4 * Math.sin(state.frameCount * 0.05 + i);

    ctx.fillStyle = COLORS.STAR + (alpha * flicker).toFixed(2) + ')';
    ctx.fillRect(x, y, 1.5, 1.5);
  }
}

// ── 13b. Cuadrícula perspectiva (suelo) ─────────────────────────
function drawGrid(W, H) {
  const groundY = state.groundY;
  const speed   = state.obstacleSpeed;

  // Offset que avanza con los obstáculos para dar sensación de movimiento
  const offset  = (state.frameCount * speed * 0.5) % 60;

  ctx.strokeStyle = COLORS.GRID_LINE;
  ctx.lineWidth   = 0.5;
  ctx.beginPath();

  // Líneas verticales convergiendo en un punto de fuga central
  const vanishX = W * 0.5;
  const vanishY = groundY * 0.4;

  for (let t = 0; t <= 1; t += 0.07) {
    const xBottom = t * W;
    const xTop    = vanishX + (xBottom - vanishX) * 0.05;
    ctx.moveTo(xBottom - offset * (xBottom - vanishX) / W, groundY);
    ctx.lineTo(xTop, vanishY);
  }
  ctx.stroke();
}

// ── 13c. Suelo ──────────────────────────────────────────────────
function drawGround(W, H) {
  const gY = state.groundY;

  // Bloque de suelo con gradiente
  const grad = ctx.createLinearGradient(0, gY, 0, H);
  grad.addColorStop(0, '#1a003a');
  grad.addColorStop(1, '#04000f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, gY, W, H - gY);

  // Línea neón del suelo
  ctx.shadowBlur   = CONFIG.GLOW_BLUR;
  ctx.shadowColor  = COLORS.GROUND_LINE;
  ctx.strokeStyle  = COLORS.GROUND_LINE;
  ctx.lineWidth    = 2;
  ctx.beginPath();
  ctx.moveTo(0, gY);
  ctx.lineTo(W, gY);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

// ── 13d. Obstáculos (triángulos) ─────────────────────────────────
function drawObstacles() {
  for (let i = 0; i < state.obstacles.length; i++) {
    const obs = state.obstacles[i];
    drawSpike(obs);
  }
}

function drawSpike(obs) {
  ctx.shadowBlur  = CONFIG.GLOW_BLUR + 4;
  ctx.shadowColor = COLORS.OBSTACLE;

  for (let j = 0; j < obs.count; j++) {
    const spikeX = obs.x + j * (obs.baseW + obs.gap);
    const spikeY = state.groundY;  // punta toca el suelo... espera, la base es la base

    // Triángulo con base abajo, punta arriba
    ctx.beginPath();
    ctx.moveTo(spikeX,              spikeY);           // base izquierda
    ctx.lineTo(spikeX + obs.baseW,  spikeY);           // base derecha
    ctx.lineTo(spikeX + obs.baseW / 2, obs.y);         // punta superior
    ctx.closePath();

    // Relleno con gradiente vertical
    const triGrad = ctx.createLinearGradient(spikeX, obs.y, spikeX, spikeY);
    triGrad.addColorStop(0, 'rgba(255, 0, 200, 0.9)');
    triGrad.addColorStop(1, 'rgba(180, 0, 100, 0.5)');
    ctx.fillStyle = triGrad;
    ctx.fill();

    ctx.strokeStyle = COLORS.OBSTACLE;
    ctx.lineWidth   = 1.5;
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
}

// ── 13e. Jugador ─────────────────────────────────────────────────
function drawPlayer() {
  const p  = state.player;
  const x  = p.x;
  const y  = p.y;
  const W  = CONFIG.PLAYER_W;
  const H  = CONFIG.PLAYER_H;

  // Glow exterior (capa de sombra)
  ctx.shadowBlur  = CONFIG.GLOW_BLUR + 8;
  ctx.shadowColor = COLORS.PLAYER_STROKE;

  // Relleno traslúcido
  ctx.fillStyle = COLORS.PLAYER_FILL;
  ctx.fillRect(x, y, W, H);

  // Borde neón
  ctx.strokeStyle = COLORS.PLAYER_STROKE;
  ctx.lineWidth   = 2;
  ctx.strokeRect(x, y, W, H);

  // Cruz interior decorativa (detalle Synthwave)
  ctx.strokeStyle = 'rgba(0, 245, 255, 0.35)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(x + W / 2, y + 5);
  ctx.lineTo(x + W / 2, y + H - 5);
  ctx.moveTo(x + 5, y + H / 2);
  ctx.lineTo(x + W - 5, y + H / 2);
  ctx.stroke();

  // Destello en esquina superior izquierda
  ctx.fillStyle = 'rgba(0, 245, 255, 0.7)';
  ctx.fillRect(x, y, 6, 2);
  ctx.fillRect(x, y, 2, 6);

  ctx.shadowBlur = 0;
}

// ── 13f. Scanlines CRT (overlay final, muy ligero) ───────────────
function drawScanlines(W, H) {
  // Solo dibujamos si no estamos en bajo rendimiento.
  // Líneas cada 4px — muy barato de renderizar.
  ctx.fillStyle = COLORS.SCANLINE;
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1);
  }
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 14: BUCLE PRINCIPAL
//  requestAnimationFrame asegura sincronización con el monitor.
//  El capping a 60 FPS evita que vaya más rápido en pantallas de 144Hz.
// ─────────────────────────────────────────────────────────────────

const TARGET_FPS    = 60;
const FRAME_BUDGET  = 1000 / TARGET_FPS;  // ~16.67ms

function gameLoop(timestamp) {
  rafId = requestAnimationFrame(gameLoop);

  // Delta time: cuántos ms pasaron desde el último frame
  const delta = timestamp - lastTime;

  // Si pasaron menos de ~16ms, saltamos este frame (cap a 60 FPS)
  if (delta < FRAME_BUDGET - 1) return;

  lastTime = timestamp - (delta % FRAME_BUDGET);

  update();
  render();
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 15: INPUT — Teclado y Táctil
// ─────────────────────────────────────────────────────────────────

function initInput() {
  // Teclado
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();  // evitar scroll con Space/ArrowUp
      jump();
    }
  });

  // Touch (móviles / tablets)
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
  }, { passive: false });

  // Click de ratón (debug en desktop)
  canvas.addEventListener('mousedown', () => jump());
}


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 16: RESIZE LISTENER
//  Debounced para no spamear el resize en cada pixel
// ─────────────────────────────────────────────────────────────────

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Cancelar el loop actual, reconfigurar canvas, reiniciar
    if (rafId) cancelAnimationFrame(rafId);
    resizeCanvas();
    resetGame();
    lastTime = 0;
    rafId = requestAnimationFrame(gameLoop);
  }, 150);
});


// ─────────────────────────────────────────────────────────────────
//  SECCIÓN 17: INICIALIZACIÓN — Punto de entrada del juego
// ─────────────────────────────────────────────────────────────────

function init() {
  resizeCanvas();   // 1. Ajustar canvas al viewport
  buildStars();     // 2. Generar pool de estrellas (una sola vez)
  resetGame();      // 3. Inicializar estado del juego
  initInput();      // 4. Registrar listeners de input
  rafId = requestAnimationFrame(gameLoop);  // 5. Arrancar el loop
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
