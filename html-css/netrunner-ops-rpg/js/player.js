// player.js
// Player sprite metadata, drawing, and animation

// Sprite sheet info: 3x3 grid (side, down, up)
const playerSprite = {
  cols: 3,
  rows: 3,
  frameX: 0,
  frameY: 1,          // start facing down
  frameTimer: 0,
  frameInterval: 10,  // lower = faster animation
  lastDirection: "down",
};

// Draw the player using the global ctx, sprites, and gameState
function drawPlayer() {
  const p = gameState.player;
  const sheet = sprites.player;

  if (sheet.complete && sheet.naturalWidth) {
    const cellWidth = sheet.naturalWidth / playerSprite.cols;
    const cellHeight = sheet.naturalHeight / playerSprite.rows;

    // Crop in a bit so we avoid the transparent border/feet reflection
    const insetX = 6;
    const insetY = 0;
    const srcWidth = cellWidth - insetX * 2;
    const srcHeight = cellHeight - insetY * 2;

    const srcX = playerSprite.frameX * cellWidth + insetX;
    const srcY = playerSprite.frameY * cellHeight + insetY;

    // How big the character appears in the world (in map pixels)
    const destWidth = 24;
    const destHeight = 24;

    // Center horizontally in the TILE_SIZE, keep feet near bottom
    const destX = p.x + (p.width - destWidth) / 2;
    const destY = p.y + (p.height - destHeight);

    ctx.drawImage(
      sheet,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
      destX,
      destY,
      destWidth,
      destHeight
    );
  } else {
    // Fallback while loading
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
  }
}

// Simple animation step – just cycles frameX while moving
function animatePlayer(moving) {
  if (moving) {
    playerSprite.frameTimer++;
    if (playerSprite.frameTimer >= playerSprite.frameInterval) {
      playerSprite.frameX = (playerSprite.frameX + 1) % playerSprite.cols; // 0–2
      playerSprite.frameTimer = 0;
    }
  } else {
    // idle = first column in the row
    playerSprite.frameX = 0;
    playerSprite.frameTimer = 0;
  }
}
