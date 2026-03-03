
const tx = 302.75, ty = 5.625;
const t = (x, y) => [+(x+tx).toFixed(1), +(y+ty).toFixed(1)];

console.log("=== KEY SVG VIEWPORT COORDINATES TABLE ===\n");

const keyPoints = [
  ["R-wavy right end upper edge", 197.25, 148.375],
  ["R-wavy right end lower edge", 197.25, 151.375],
  ["R-wavy inflection upper", 183, 147.1875],
  ["R-wavy trough upper", 162.9375, 148.3125],
  ["R-wavy trough lower", 163.0625, 152.875],
  ["R-wavy peak upper", 146.5625, 150.125],
  ["R-wavy mid upper", 115.164, 145.353],
  ["R-wavy mid lower", 109.5625, 148.25],
  ["R-wavy far-left upper", 67.38, 141.95],
  ["R-wavy far-left lower", 55, 149.375],
  ["R-wavy left upper", 43.625, 147.06],
  ["R-wavy left lower", 1.25, 149.375],
  ["R-heart baseline right", 5.25, 145.375],
  ["R-heart bottom-right", 9.84, 137.13],
  ["R-heart mid-right", 25.25, 112.375],
  ["R-heart rightmost belly", 37.25, 73.375],
  ["R-heart inner hole right", 34.25, 77.375],
  ["R-heart top peak", 0, 0],
  ["R-heart top-right inflection", 11.72, 40.32],
  ["R-heart left-side waist", -2.1875, 89.875],
  ["R-heart left-side lower", -4.45, 101.29],
  ["R-heart left-side base", 0.25, 114.375],
  ["Crossing start (right side)", 1.25, 149.375],
  ["Crossing bottom peak (left-heart right lobe)", -22.25, 165.875],
  ["L-heart right base", -47.75, 146.375],
  ["L-heart right side top", -19.75, -0.625],
  ["L-heart inner right hole start", -27.4375, 11.125],
  ["L-heart right edge mid", -50.27, 66.33],
  ["L-heart right edge lower", -52.8125, 130.25],
  ["L-heart right base right side", -51.75, 139.375],
  ["L-heart top inner peak", -75.75, 5.375],
  ["L-heart top outer left", -87.0625, 6.375],
  ["L-heart leftmost", -93.19921875, 23.34375],
  ["L-heart left descent entry", -57.37, 34.96],
  ["L-heart left side lower", -56, 132.125],
  ["L-heart waist between lobes", -145.75, 129.6875],
  ["L-heart left lobe bottom peak", -211.8828125, 161.74609375],
  ["L-wavy right end", -242.75, 148.375],
  ["L-wavy mid dip", -265.3125, 130.8125],
  ["L-wavy far point", -286.75, 133.375],
  ["L-wavy left end", -302.75, 140.375],
];

console.log("Label | orig_x | orig_y | SVG_x | SVG_y");
console.log("------|--------|--------|-------|------");
keyPoints.forEach(function(item) {
  var label = item[0], ox = item[1], oy = item[2];
  var sv = t(ox, oy);
  console.log(label + " | " + ox + " | " + oy + " | " + sv[0] + " | " + sv[1]);
});

console.log("\n\nSTRUCTURAL ANALYSIS:\n");
console.log("RIGHT heart x range in SVG: " + t(-4.45,0)[0] + " to " + t(37.25,0)[0]);
console.log("LEFT heart x range in SVG: " + t(-93.2,0)[0] + " to " + t(-19.75,0)[0]);
console.log("Crossing region SVG x: " + t(-47.75,0)[0] + " to " + t(1.25,0)[0]);
console.log("Right wavy SVG x: " + t(5.25,0)[0] + " to " + t(197.25,0)[0]);
console.log("Left wavy SVG x: " + t(-242.75,0)[0] + " to " + t(-302.75,0)[0]);

// Centerline derivation
console.log("\n\nCENTERLINE DERIVATION:\n");

// RIGHT HEART centerline:
// At each y, average the x of left stroke edge and right stroke edge
// Left edge of right heart stroke (outer boundary, top section going left-then-down):
//   y=6: x=302.75 (peak, single point)
//   y=46: x~302 (on curve toward SVG(300.56, 95.5))
//   y=79: x~300.6 (still descending left edge toward y=95.5)
//   y=95: x=300.56 (-2.1875+tx=300.56)
//   y=107: x=298.3 (-4.45+tx)
//   y=120: x=303 (0.25+tx)
// Right edge of right heart stroke (outer boundary, re-ascending section):
//   y=6: x=302.75 (top, same as left)
//   y=46: x=314.47 (11.72+tx) -- the path goes right before left edge turns
//   y=74: x=326 (23.3+tx roughly)
//   y=79: x=340 (37.25+tx) RIGHTMOST
//   y=107: x=330 (interpolated between (340,79) and (328,118))
//   y=120: x=325.5 (roughly at (25.25,112.375)=SVG(328,118) vicinity)
//   y=143: x=312.6 (9.84+tx)
//   y=151: x=308 (5.25+tx)

// So the CENTERLINE x at each y for right heart:
// y=6:  (302.75 + 302.75)/2 = 302.75
// y=46: (302 + 314)/2 = 308
// y=74: (300.7 + 326)/2 = 313
// y=79: (300.5 + 340)/2 = 320
// y=95: (300.56 + 334)/2 = 317
// y=107:(298.3 + 330)/2 = 314
// y=120:(303 + 325)/2 = 314
// y=143:(303.5 + 312.6)/2 = 308
// y=151:(304 + 308)/2 = 306

console.log("RIGHT HEART centerline (SVG coords):");
var rhc = [
  [303, 6],
  [308, 46],
  [314, 74],
  [320, 79],
  [317, 95],
  [314, 107],
  [314, 120],
  [308, 143],
  [306, 151],
];
rhc.forEach(function(p) { console.log("  SVG(" + p[0] + ", " + p[1] + ")"); });

// LEFT HEART centerline:
// The left heart right stroke edge (outer boundary right side):
//   y=5:  x=283 (-19.75+tx) top right of left heart
//   y=20: x=280 (roughly between 283,5 and 252,74)
//   y=40: x=270
//   y=74: x=252.5 (-50.27+tx)
//   y=130: x=249.9 (-52.8125+tx)
//   y=145: x=251 (-51.75+tx)
// The left heart left stroke edge (outer boundary left side):
//   y=12: x=215.7 (-87.0625+tx)
//   y=29: x=209.6 (-93.19+tx)  LEFTMOST
//   y=41: x=245.4 (-57.37+tx)  (this is where left edge swings right dramatically)
//   y=138: x=246.75 (-56+tx)
//   y=145: x=251 (-51.75+tx) approximately
// Also the inner cutout1 defines the inner hole:
//   Top of hole right boundary: SVG(275, 17) [-27.44+tx, 11.125+ty]
//   Top of hole left boundary: SVG(214, 20) [-88.56+tx, 14.19+ty]
// The left heart stroke is a wide calligraphic mark
// At y=12: stroke spans from x=215.7 (outer left) to x=275 (inner hole right) = width 59px, center = 245.4
// At y=29: stroke spans from x=209.6 (outer left) to x=~268 (inner hole) = center ~238.8
// At y=41: stroke spans from x=245.4 (left edge swings right) to x=270 (right edge) = center ~257.7
// At y=74: stroke spans from x=245.4 (left side) to x=252.5 (right side) = center ~248.9
// At y=130: stroke spans from x=246.75 (left) to x=249.9 (right) = very thin, center ~248.3

console.log("\nLEFT HEART centerline (SVG coords):");
var lhc = [
  [249, 6],   // top peak (average of right edge 283 and left edge 216)
  [245, 14],  // y=14 (average of right hole boundary 275 and outer left 215)
  [239, 29],  // leftmost region (left edge at 209.6, inner hole boundary ~268)
  [258, 41],  // left edge swings back right to 245.4, right edge at 270
  [249, 74],  // both edges close: left 245.9, right 252.5
  [248, 130], // both edges very close: left 246.75, right 249.9
  [251, 145], // baseline
];
lhc.forEach(function(p) { console.log("  SVG(" + p[0] + ", " + p[1] + ")"); });

// CROSSING REGION centerline:
// Upper edge: outer boundary orig(1.25,149.375) -> orig(-22.25,165.875) -> orig(-47.75,146.375)
//   SVG: (304,155) -> (280.5,171.5) -> (255,152)
// Inner edge: cutout2 end orig(-1.75,142.375)=SVG(301,148), cutout4 area SVG(259-277, 130-167)
//   At x=280: inner edge y ~ 142-148 (from cutout4 SVG(259,148) to SVG(277,167))
//   Actually cutout4 is: M-25.75 124.375 going to -43.75 142.375 -- so inner boundary goes from
//   SVG(277,130) to SVG(259,148) -- this is the UPPER edge of the inner hole
//   Lower edge of inner hole: orig(-25.75,161.375)=SVG(277,167)
// So the crossing region: outer boundary dips to y=171.5 at x=280.5
//   inner boundary (lower edge of holes) is at y~130-148 in this region
// Centerline of crossing stroke (average outer dip and inner upper):
//   At x=280: outer y=171.5, inner upper y~142 -> center y = (171.5+142)/2 = 156.75

console.log("\nCROSSING REGION centerline (SVG coords, right to left):");
var cross = [
  [306, 151],  // right heart exit
  [295, 156],
  [280, 158],  // center of crossing (averaged outer dip and inner boundary)
  [265, 154],
  [253, 149],  // left heart entry
];
cross.forEach(function(p) { console.log("  SVG(" + p[0] + ", " + p[1] + ")"); });

// LEFT WAVY centerline:
// The left wavy section spans SVG x=60 to SVG x=0 (very narrow - only 60px)
// Upper edge (outer boundary):
//   orig(-242.75,148.375)=SVG(60,154) -> orig(-248.28,144.78)=SVG(54.47,150.41)
//   -> orig(-265.3125,130.8125)=SVG(37.44,136.44)
//   -> orig(-286.75,133.375)=SVG(16,139) -> orig(-302.75,140.375)=SVG(0,146)
// Lower edge (outer boundary, going back right):
//   orig(-302.75,137.375)=SVG(0,143) -> orig(-295.62,132.78)=SVG(7.13,138.4)
//   -> orig(-286.37,128.26)=SVG(16.38,133.89) -> orig(-265.3125,130.8125) same
//   -> orig(-238.25,145.97)=SVG(64.5,151.6)
//   (then connecting to: orig(-242.75,148.375)=SVG(60,154))
// The lower edge around SVG x=37: upper y=136.44,
//   lower is from: orig(-286.37,128.26)=SVG(16.4,133.9) to orig(-238.25,145.97)=SVG(64.5,151.6)
//   at x=37: interpolate: frac=(37-16.4)/(64.5-16.4)=20.6/48.1=0.428 -> y=133.9+0.428*(151.6-133.9)=133.9+7.58=141.5
// centerline at x=37: (136.44+141.5)/2=138.97

console.log("\nLEFT WAVY centerline (SVG coords, right to left):");
var lw = [
  [60, 154],   // right end
  [54, 150],
  [37, 139],   // dip
  [16, 136],   // dip
  [0, 144],    // left end
];
lw.forEach(function(p) { console.log("  SVG(" + p[0] + ", " + p[1] + ")"); });
