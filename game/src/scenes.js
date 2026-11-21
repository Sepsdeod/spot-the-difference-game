// Lantern Lane — scene art.
// Every scene is drawn twice: once as the original (left panel) and once with
// its hidden differences applied (right panel). A scene's paint() receives a
// set `v` of difference ids that are ALTERED in this panel; the left panel
// passes an empty set, the right panel passes every id. All art is original
// vector drawing made in code — no images, no copied assets.

export const PANEL_W = 560;
export const PANEL_H = 420;

// ---- small drawing helpers -------------------------------------------------
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function poly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

// Four-point sparkle star.
function sparkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// A gull in flight: two curved strokes.
function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 7 * s, x + 9 * s, y);
  ctx.stroke();
}

function skyGradient(ctx, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

// ---- Scene 1: Harbor at Dusk ----------------------------------------------
function paintHarbor(ctx, v) {
  skyGradient(ctx, [[0, '#2b1d52'], [0.45, '#7a3b6e'], [0.7, '#e07a4f'], [1, '#f7b267']]);
  // Sun (diff: sun) — low over the water.
  if (!v.has('sun')) {
    ctx.fillStyle = '#ffd166';
    circle(ctx, 92, 82, 26);
    ctx.fillStyle = 'rgba(255, 209, 102, 0.25)';
    circle(ctx, 92, 82, 40);
  } else {
    // A small cloud sits where the sun was.
    ctx.fillStyle = 'rgba(255, 214, 180, 0.9)';
    ellipse(ctx, 92, 82, 34, 12);
    ellipse(ctx, 112, 78, 22, 10);
  }
  // Clouds.
  ctx.fillStyle = 'rgba(255, 190, 160, 0.75)';
  ellipse(ctx, 300, 52, 52, 13);
  ellipse(ctx, 330, 46, 34, 11);
  ellipse(ctx, 470, 96, 44, 11);
  // Gulls (diff: gull) — three in the original, two altered.
  ctx.fillStyle = '#241a33';
  gull(ctx, 210, 66, 1, '#241a33');
  gull(ctx, 258, 48, 0.85, '#241a33');
  if (!v.has('gull')) gull(ctx, 306, 70, 0.9, '#241a33');
  // Sea.
  ctx.fillStyle = '#274b73';
  ctx.fillRect(0, 300, PANEL_W, 120);
  ctx.fillStyle = '#3a6a96';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(30 + i * 110, 318 + (i % 2) * 14, 62, 3);
    ctx.fillRect(70 + i * 105, 352 + (i % 2) * 12, 48, 3);
  }
  // Sun glitter on the water (only when the sun is there).
  if (!v.has('sun')) {
    ctx.fillStyle = 'rgba(255, 209, 102, 0.5)';
    for (let i = 0; i < 4; i++) ctx.fillRect(72, 322 + i * 16, 40 - i * 6, 3);
  }
  // Distant lighthouse (diff: beam).
  ctx.fillStyle = '#e8e0d0';
  poly(ctx, [[468, 300], [478, 300], [474, 208], [472, 208]]);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(469, 246, 8, 12);
  ctx.fillStyle = '#2c2c34';
  ctx.fillRect(468, 200, 12, 10);
  ctx.fillStyle = '#ffe66d';
  circle(ctx, 474, 196, 7);
  if (!v.has('beam')) {
    ctx.fillStyle = 'rgba(255, 230, 109, 0.35)';
    poly(ctx, [[474, 196], [540, 168], [540, 214]]);
    poly(ctx, [[474, 196], [408, 176], [408, 212]]);
  }
  // Fishing boat with a flag (diff: flag).
  ctx.fillStyle = '#5d3a1a';
  poly(ctx, [[150, 322], [232, 322], [216, 348], [166, 348]]);
  ctx.fillStyle = '#3a2410';
  ctx.fillRect(188, 272, 5, 52);
  ctx.fillStyle = v.has('flag') ? '#2e6fb7' : '#d64541';
  poly(ctx, [[193, 272], [228, 280], [193, 290]]);
  // Fisherman on the pier.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(0, 356, 250, 64);
  ctx.fillStyle = '#8a6a45';
  for (let x = 8; x < 250; x += 26) ctx.fillRect(x, 356, 3, 64);
  ctx.strokeStyle = '#2c2c34';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(96, 330);
  ctx.quadraticCurveTo(130, 300, 168, 316);
  ctx.stroke();
  // Jumping fish (diff: fish).
  if (!v.has('fish')) {
    ctx.fillStyle = '#9fd8e8';
    ellipse(ctx, 350, 372, 16, 7);
    poly(ctx, [[364, 372], [374, 366], [374, 378]]);
    ctx.fillStyle = '#cfeef7';
    circle(ctx, 352, 370, 2);
  }
  // Lantern post (diff: lantern).
  ctx.fillStyle = '#2c2c34';
  ctx.fillRect(58, 296, 6, 62);
  ctx.fillStyle = v.has('lantern') ? '#5a5a66' : '#ffd166';
  rr(ctx, 48, 276, 26, 22, 4);
  ctx.fillStyle = '#2c2c34';
  ctx.fillRect(44, 272, 34, 5);
  if (!v.has('lantern')) {
    ctx.fillStyle = 'rgba(255, 209, 102, 0.3)';
    circle(ctx, 61, 287, 24);
  }
  // Crates on the pier (diff: crate) — three stacked, two altered.
  ctx.fillStyle = '#a4713a';
  ctx.fillRect(498, 332, 26, 26);
  ctx.fillRect(524, 332, 26, 26);
  ctx.fillStyle = '#8a5a2c';
  ctx.fillRect(498, 332, 26, 3);
  ctx.fillRect(524, 332, 26, 3);
  if (!v.has('crate')) {
    ctx.fillStyle = '#a4713a';
    ctx.fillRect(511, 306, 26, 26);
    ctx.fillStyle = '#8a5a2c';
    ctx.fillRect(511, 306, 26, 3);
  }
}

// ---- Scene 2: Night Market -------------------------------------------------
function paintMarket(ctx, v) {
  skyGradient(ctx, [[0, '#0d1530'], [0.6, '#1b2a52'], [1, '#2c4a7a']]);
  // Moon (diff: moon) — crescent vs full.
  ctx.fillStyle = '#f4ead5';
  circle(ctx, 482, 58, 24);
  if (!v.has('moon')) {
    ctx.fillStyle = '#1b2a52';
    circle(ctx, 492, 52, 21);
  }
  // String lights across the top (diff: bulb) — one bulb dark when altered.
  ctx.strokeStyle = '#0a0a12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 70);
  ctx.quadraticCurveTo(280, 130, 540, 66);
  ctx.stroke();
  const bulbs = [60, 140, 220, 300, 380, 460, 520];
  bulbs.forEach((x, i) => {
    const y = 70 + Math.sin((x / 540) * Math.PI) * 52;
    const dark = v.has('bulb') && i === 3;
    ctx.fillStyle = dark ? '#3a3a48' : ['#ffd166', '#ff8fa3', '#7ee0a3'][i % 3];
    circle(ctx, x, y + 8, 6);
    if (!dark) {
      ctx.fillStyle = 'rgba(255, 220, 120, 0.25)';
      circle(ctx, x, y + 8, 12);
    }
  });
  // Ground.
  ctx.fillStyle = '#3a2c22';
  ctx.fillRect(0, 360, PANEL_W, 60);
  ctx.fillStyle = '#4a3a2c';
  ctx.fillRect(0, 360, PANEL_W, 4);
  // Stall 1 (left): red awning.
  ctx.fillStyle = '#8a3324';
  poly(ctx, [[30, 170], [150, 170], [162, 210], [18, 210]]);
  ctx.fillStyle = '#e8dcc8';
  for (let i = 0; i < 4; i++) poly(ctx, [[42 + i * 30, 170], [58 + i * 30, 170], [62 + i * 30, 210], [46 + i * 30, 210]]);
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(30, 210, 120, 90);
  ctx.fillStyle = '#c98f4e';
  rr(ctx, 44, 236, 92, 40, 6);
  // Fruit basket (diff: fruit) — apples red, oranges orange.
  ctx.fillStyle = v.has('fruit') ? '#ff9f1c' : '#d64541';
  for (const [fx, fy] of [[58, 252], [78, 246], [98, 252], [68, 260], [90, 260]]) circle(ctx, fx, fy, 8);
  ctx.fillStyle = '#7ee0a3';
  circle(ctx, 78, 242, 3);
  // Stall 2 (middle): awning colour is the difference (diff: awning).
  const awn = v.has('awning') ? '#2e7d4f' : '#c0392b';
  ctx.fillStyle = awn;
  poly(ctx, [[210, 160], [350, 160], [362, 204], [198, 204]]);
  ctx.fillStyle = '#e8dcc8';
  for (let i = 0; i < 5; i++) poly(ctx, [[222 + i * 28, 160], [238 + i * 28, 160], [242 + i * 28, 204], [226 + i * 28, 204]]);
  ctx.fillStyle = '#5d3a24';
  ctx.fillRect(212, 204, 136, 96);
  // Round vs square hanging sign (diff: sign).
  ctx.fillStyle = '#ffd166';
  ctx.strokeStyle = '#2c2c34';
  ctx.lineWidth = 3;
  if (!v.has('sign')) {
    circle(ctx, 352, 150, 16);
  } else {
    rr(ctx, 336, 134, 32, 32, 4);
  }
  ctx.fillStyle = '#2c2c34';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TEA', 352, 155);
  // Vendor with a hat (diff: hat) — straw hat vs flat cap.
  ctx.fillStyle = '#f2c9a0';
  circle(ctx, 280, 258, 16);
  ctx.fillStyle = '#4a6b8a';
  rr(ctx, 258, 274, 44, 52, 8);
  if (!v.has('hat')) {
    ctx.fillStyle = '#e8c96a';
    ellipse(ctx, 280, 246, 26, 7);
    ctx.fillStyle = '#d4a94e';
    rr(ctx, 266, 232, 28, 14, 6);
  } else {
    ctx.fillStyle = '#2c4a6b';
    ellipse(ctx, 280, 244, 20, 8);
    rr(ctx, 264, 234, 32, 10, 5);
  }
  // Stall 3 (right): blue awning, jars.
  ctx.fillStyle = '#2e5f8a';
  poly(ctx, [[400, 170], [530, 170], [542, 210], [388, 210]]);
  ctx.fillStyle = '#e8dcc8';
  for (let i = 0; i < 4; i++) poly(ctx, [[412 + i * 32, 170], [428 + i * 32, 170], [432 + i * 32, 210], [416 + i * 32, 210]]);
  ctx.fillStyle = '#4a3a5d';
  ctx.fillRect(402, 210, 128, 90);
  ctx.fillStyle = '#7ee0a3';
  rr(ctx, 416, 232, 26, 34, 5);
  ctx.fillStyle = '#ff8fa3';
  rr(ctx, 452, 232, 26, 34, 5);
  ctx.fillStyle = '#ffd166';
  rr(ctx, 488, 232, 26, 34, 5);
  // Cat on a crate (diff: cat).
  ctx.fillStyle = '#8a5a2c';
  ctx.fillRect(468, 330, 52, 30);
  ctx.fillStyle = '#a4713a';
  ctx.fillRect(468, 330, 52, 4);
  if (!v.has('cat')) {
    ctx.fillStyle = '#3a3a48';
    ellipse(ctx, 494, 322, 20, 10);
    circle(ctx, 510, 310, 9);
    poly(ctx, [[504, 303], [507, 294], [511, 302]]);
    poly(ctx, [[514, 302], [518, 294], [519, 303]]);
    ctx.strokeStyle = '#3a3a48';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(474, 320);
    ctx.quadraticCurveTo(462, 314, 466, 304);
    ctx.stroke();
  }
  // Paper lanterns hanging from stall 2.
  ctx.fillStyle = '#ff8fa3';
  ellipse(ctx, 232, 300, 12, 15);
  ctx.fillStyle = '#ffd166';
  ellipse(ctx, 330, 300, 12, 15);
}

// ---- Scene 3: Moonlit Garden ----------------------------------------------
function paintGarden(ctx, v) {
  skyGradient(ctx, [[0, '#0a1230'], [0.55, '#1c2f5e'], [1, '#3d5a3a']]);
  // Stars (diff: star) — eight vs seven.
  const stars = [[60, 44], [150, 36], [240, 58], [330, 40], [420, 52], [500, 38], [110, 96], [470, 108]];
  stars.forEach(([x, y], i) => {
    if (v.has('star') && i === 6) return;
    sparkle(ctx, x, y, 6, '#fff6c9');
  });
  // Big moon.
  ctx.fillStyle = '#f4ead5';
  circle(ctx, 486, 66, 30);
  ctx.fillStyle = '#e0d4b8';
  circle(ctx, 476, 58, 6);
  circle(ctx, 496, 74, 4);
  // Fireflies (diff: firefly) — five vs four.
  const flies = [[96, 196], [150, 230], [210, 190], [120, 300], [260, 250]];
  flies.forEach(([x, y], i) => {
    if (v.has('firefly') && i === 2) return;
    ctx.fillStyle = 'rgba(190, 255, 120, 0.9)';
    circle(ctx, x, y, 3);
    ctx.fillStyle = 'rgba(190, 255, 120, 0.25)';
    circle(ctx, x, y, 8);
  });
  // Garden ground + fence.
  ctx.fillStyle = '#2c4a2e';
  ctx.fillRect(0, 300, PANEL_W, 120);
  ctx.fillStyle = '#5d3a24';
  ctx.fillRect(0, 286, PANEL_W, 8);
  for (let x = 20; x < PANEL_W; x += 46) {
    ctx.fillRect(x, 258, 8, 40);
    ctx.beginPath();
    ctx.moveTo(x, 258);
    ctx.lineTo(x + 4, 248);
    ctx.lineTo(x + 8, 258);
    ctx.closePath();
    ctx.fill();
  }
  // Big tree with apples (diff: apple) — three vs two.
  ctx.fillStyle = '#4a2c1a';
  ctx.fillRect(288, 190, 20, 110);
  ctx.fillStyle = '#2e6b34';
  circle(ctx, 298, 160, 62);
  circle(ctx, 252, 190, 40);
  circle(ctx, 344, 190, 40);
  ctx.fillStyle = '#d64541';
  circle(ctx, 262, 168, 7);
  circle(ctx, 330, 150, 7);
  if (!v.has('apple')) circle(ctx, 298, 196, 7);
  // Fountain (diff: water) — flowing arc vs still.
  ctx.fillStyle = '#8a8f98';
  ellipse(ctx, 150, 330, 56, 14);
  ctx.fillStyle = '#5d6b7a';
  rr(ctx, 138, 296, 24, 36, 6);
  ctx.fillStyle = '#7fb7d9';
  ellipse(ctx, 150, 330, 46, 9);
  if (!v.has('water')) {
    ctx.strokeStyle = '#a8d4ea';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(150, 292);
    ctx.quadraticCurveTo(128, 268, 118, 318);
    ctx.moveTo(150, 292);
    ctx.quadraticCurveTo(172, 268, 182, 318);
    ctx.stroke();
  }
  // Pond with a frog on a lily pad (diff: frog).
  ctx.fillStyle = '#2e5f8a';
  ellipse(ctx, 430, 372, 78, 20);
  ctx.fillStyle = '#3a8a4f';
  ellipse(ctx, 410, 368, 26, 9);
  ellipse(ctx, 452, 376, 22, 8);
  if (!v.has('frog')) {
    ctx.fillStyle = '#4caf50';
    circle(ctx, 410, 358, 10);
    ctx.fillStyle = '#1a1a1a';
    circle(ctx, 406, 354, 2);
    circle(ctx, 414, 354, 2);
  }
  // Flower bed (diff: flower) — red tulips vs yellow.
  const petal = v.has('flower') ? '#ffd166' : '#d64541';
  ctx.fillStyle = '#2e6b34';
  for (let x = 60; x <= 220; x += 26) ctx.fillRect(x, 350, 3, 34);
  ctx.fillStyle = petal;
  for (let x = 60; x <= 220; x += 26) {
    ellipse(ctx, x + 1, 344, 7, 10);
  }
  // Butterfly near the flowers (diff: butterfly).
  if (!v.has('butterfly')) {
    ctx.fillStyle = '#ff8fa3';
    ellipse(ctx, 348, 296, 10, 7);
    ellipse(ctx, 362, 296, 10, 7);
    ctx.fillStyle = '#ffd166';
    ellipse(ctx, 348, 306, 8, 5);
    ellipse(ctx, 362, 306, 8, 5);
    ctx.strokeStyle = '#2c2c34';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(355, 296);
    ctx.lineTo(355, 312);
    ctx.stroke();
  }
  // Bench with a cushion (diff: cushion).
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(452, 296, 76, 10);
  ctx.fillRect(458, 306, 6, 26);
  ctx.fillRect(516, 306, 6, 26);
  ctx.fillRect(452, 282, 76, 8);
  if (!v.has('cushion')) {
    ctx.fillStyle = '#c0392b';
    rr(ctx, 458, 290, 64, 10, 4);
  }
}

// ---- Scene table -----------------------------------------------------------
export const SCENES = [
  {
    id: 'harbor',
    name: 'Harbor at Dusk',
    subtitle: 'A fishing pier as the sun goes down',
    timeLimit: 90,
    paint: paintHarbor,
    diffs: [
      { id: 'sun', label: 'the setting sun', x: 92, y: 82, r: 30 },
      { id: 'beam', label: 'the lighthouse beam', x: 474, y: 196, r: 30 },
      { id: 'gull', label: 'a seagull', x: 306, y: 70, r: 26 },
      { id: 'flag', label: 'the boat flag colour', x: 210, y: 281, r: 28 },
      { id: 'fish', label: 'the jumping fish', x: 356, y: 372, r: 28 },
      { id: 'lantern', label: 'the lit pier lantern', x: 61, y: 287, r: 30 },
      { id: 'crate', label: 'the top crate', x: 524, y: 319, r: 28 },
    ],
  },
  {
    id: 'market',
    name: 'Night Market',
    subtitle: 'Lanterns, stalls and one sleepy cat',
    timeLimit: 75,
    paint: paintMarket,
    diffs: [
      { id: 'moon', label: 'the shape of the moon', x: 482, y: 58, r: 30 },
      { id: 'bulb', label: 'a dark string-light bulb', x: 300, y: 128, r: 26 },
      { id: 'awning', label: 'the middle awning colour', x: 280, y: 182, r: 30 },
      { id: 'sign', label: 'the hanging tea sign', x: 352, y: 150, r: 28 },
      { id: 'hat', label: 'the vendor’s hat', x: 280, y: 242, r: 28 },
      { id: 'fruit', label: 'the fruit in the basket', x: 78, y: 252, r: 28 },
      { id: 'cat', label: 'the cat on the crate', x: 494, y: 314, r: 30 },
    ],
  },
  {
    id: 'garden',
    name: 'Moonlit Garden',
    subtitle: 'Fireflies, a fountain and a frog',
    timeLimit: 60,
    paint: paintGarden,
    diffs: [
      { id: 'star', label: 'a star in the sky', x: 110, y: 96, r: 26 },
      { id: 'firefly', label: 'a firefly', x: 210, y: 190, r: 26 },
      { id: 'apple', label: 'an apple on the tree', x: 298, y: 196, r: 26 },
      { id: 'water', label: 'the fountain water', x: 150, y: 292, r: 30 },
      { id: 'frog', label: 'the frog on the lily pad', x: 410, y: 358, r: 28 },
      { id: 'flower', label: 'the colour of the tulips', x: 140, y: 344, r: 30 },
      { id: 'butterfly', label: 'the butterfly', x: 355, y: 300, r: 28 },
      { id: 'cushion', label: 'the bench cushion', x: 490, y: 292, r: 28 },
    ],
  },
];
