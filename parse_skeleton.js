
// Parse and compare existing skeleton vs. derived skeleton

var existing = "M 498 147 C 476 135, 454 159, 432 147 C 410 135, 388 159, 366 147 C 357 143, 350 148, 345 149 C 350 138, 358 110, 356 80 C 350 48, 336 18, 316 6 C 306 2, 300 1, 294 4 C 282 8, 270 28, 266 58 C 262 88, 263 120, 266 140 C 268 148, 270 152, 270 153 C 274 156, 282 157, 286 154 C 284 150, 276 148, 264 148 C 258 148, 252 148, 248 148 C 252 138, 262 110, 260 82 C 258 52, 256 22, 250 5 C 244 0, 236 2, 228 8 C 216 16, 210 38, 208 64 C 206 92, 210 120, 214 140 C 216 148, 218 152, 218 153 C 210 150, 194 148, 175 148 C 152 158, 126 136, 100 148 C 76 162, 52 134, 28 148 C 14 156, 5 148, 2 148";

// Extract all cubic bezier segments
// Format: M x y followed by C cx1 cy1 cx2 cy2 x y ... repeating

var tokens = existing.split(/\s+/);
var i = 0;
var currentX = 0, currentY = 0;
var segments = [];

while (i < tokens.length) {
  var token = tokens[i];
  if (token === 'M') {
    currentX = parseFloat(tokens[i+1]);
    currentY = parseFloat(tokens[i+2]);
    segments.push({type:'M', x:currentX, y:currentY});
    i += 3;
  } else if (token === 'C') {
    var cx1 = parseFloat(tokens[i+1].replace(',',''));
    var cy1 = parseFloat(tokens[i+2].replace(',',''));
    var cx2 = parseFloat(tokens[i+3].replace(',',''));
    var cy2 = parseFloat(tokens[i+4].replace(',',''));
    var ex  = parseFloat(tokens[i+5].replace(',',''));
    var ey  = parseFloat(tokens[i+6].replace(',',''));
    segments.push({type:'C', x1:cx1, y1:cy1, x2:cx2, y2:cy2, x:ex, y:ey, fromX:currentX, fromY:currentY});
    currentX = ex;
    currentY = ey;
    i += 7;
  } else {
    i++;
  }
}

console.log("EXISTING SKELETON ANCHOR POINTS (from → to):");
segments.forEach(function(s, idx) {
  if (s.type === 'M') {
    console.log(idx + ". START: (" + s.x + ", " + s.y + ")");
  } else {
    var dx = s.x - s.fromX;
    var dir = dx > 0.5 ? "RIGHTWARD" : dx < -0.5 ? "leftward" : "~flat";
    console.log(idx + ". C from(" + s.fromX + "," + s.fromY + ") to(" + s.x + "," + s.y + ") " + dir + " [ctrl1:(" + s.x1 + "," + s.y1 + ") ctrl2:(" + s.x2 + "," + s.y2 + ")]");
  }
});

// Key analysis: where does the path go RIGHTWARD?
console.log("\n=== RIGHTWARD MOVEMENTS ===");
segments.forEach(function(s, idx) {
  if (s.type === 'C') {
    var dx = s.x - s.fromX;
    if (dx > 2) {
      console.log("Segment " + idx + ": from x=" + s.fromX + " to x=" + s.x + " (rightward by " + dx.toFixed(1) + "px) at y~" + ((s.fromY+s.y)/2).toFixed(0));
    }
  }
});

console.log("\n=== DERIVED SKELETON KEY POINTS COMPARISON ===");
console.log("From analysis, key derived centerline points:");
console.log("Right wavy:    SVG(500,150) to SVG(346,148)");
console.log("Right heart:   SVG(346,148) -> up-right to SVG(320,79) -> peak SVG(303,6) -> down-left -> SVG(306,151)");
console.log("Crossing:      SVG(306,151) -> dip SVG(280,158) -> SVG(253,149)");
console.log("Left heart:    SVG(253,149) -> up-right to SVG(249,6) -> down-left to SVG(210,29) -> back down -> SVG(251,145)");
console.log("Left wavy:     SVG(60,154) to SVG(0,144)");
console.log("");
console.log("IMPORTANT: Left heart loop goes FURTHER LEFT to x=210 (leftmost at y=29)");
console.log("           while the existing skeleton goes only to x=208 at y=64 - close but");
console.log("           the top peak in existing is at x=250,y=5 which matches derived x=249,y=6");
