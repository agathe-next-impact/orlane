
// Build the corrected skeleton path

// SECTION ANALYSIS SUMMARY:
// ========================
// The calligraphic illustration is a figure-8 / double-heart shape with:
// - A right heart loop (SVG x range: 298-340, peak at SVG(303,6))
// - A left heart loop (SVG x range: 210-283, peak at SVG(249,6))
// - A crossing region between them (SVG x: 253-306)
// - A right wavy baseline (SVG x: 346-500)
// - A left wavy baseline (SVG x: 0-60)
// - PLUS: the left heart has a left lobe at the bottom that extends to SVG x=90, y=167

// CENTERLINE (midline of calligraphic stroke) key points:
var centers = {
  // Right wavy: from right end to right heart entry
  rWavyStart: [500, 150],
  rWavyMid1:  [449, 152],
  rWavyMid2:  [370, 144],
  rWavyEnd:   [346, 150],

  // Right heart loop (going up right side, over peak, down left side)
  rHeart_belly:   [320, 79],   // rightmost belly centerline (outer 340, inner 300 -> avg 320)
  rHeart_peak:    [303, 6],    // top peak (both edges meet)
  rHeart_leftMid: [298, 95],   // left side midpoint (outer left edge)
  rHeart_leftBase:[303, 120],  // left side base
  rHeart_exit:    [306, 151],  // exit to crossing

  // Crossing region
  cross_mid:  [280, 160],  // bottom of crossing bump (outer boundary SVG 280.5,171.5 / inner ~148 -> avg ~160)
  cross_exit: [253, 149],  // left heart entry

  // Left heart loop
  lHeart_entry:     [253, 149],
  lHeart_peak:      [249, 6],   // top peak
  lHeart_leftmost:  [210, 29],  // leftmost point (outer left edge SVG 209.6,29)
  lHeart_swing:     [249, 74],  // after rightward swing back (both edges converge ~x=249)
  lHeart_exit:      [251, 145], // baseline

  // Left heart left lobe (the bottom left part of left heart)
  lLobe_waist:  [157, 135],  // waist between left heart's two bottom lobes
  lLobe_peak:   [91, 167],   // left lobe bottom peak
  lWavyStart:   [60, 154],   // start of left wavy

  // Left wavy
  lWavyMid1:  [37, 139],
  lWavyMid2:  [16, 136],
  lWavyEnd:   [0, 144],
};

// BUILD THE PATH (going right to left):
// Start: SVG(500, 150)
// 1. RIGHT WAVY (3 cubics)
// 2. RIGHT HEART loop (5-6 cubics: up-right to belly, over peak, down-left, exit)
// 3. CROSSING (2 cubics: dip down and across)
// 4. LEFT HEART (6 cubics: up right side, over peak, left to leftmost, right swing, down to baseline)
// 5. LEFT HEART LEFT LOBE (2 cubics: down to lobe peak, back up to left wavy start)
// 6. LEFT WAVY (2 cubics)

var path = '';

// --- RIGHT WAVY ---
path += 'M 500 150\n';
path += 'C 486 143, 466 157, 449 152\n';
path += 'C 432 148, 405 139, 370 144\n';
path += 'C 358 149, 352 153, 346 150\n';

// --- RIGHT HEART (entry x=346, y=150; belly x=320,y=79; peak x=303,y=6; exit x=306,y=151) ---
// Going UP the RIGHT SIDE of stroke (x decreases from 346 to 303 as y decreases 150->6)
// Note: x stays between 303 and 346 -- no rightward movement in the CENTERLINE going up
path += 'C 342 130, 330 100, 320 79\n';    // up to belly (slight leftward as ascending)
path += 'C 312 56, 306 28, 303 6\n';       // up to peak
// Going DOWN the LEFT SIDE of stroke (x stays near 298-306, going right slightly as descending)
path += 'C 300 3, 296 12, 295 30\n';       // slight leftward shoulder
path += 'C 295 55, 297 80, 298 95\n';      // left side mid
path += 'C 299 110, 302 130, 306 151\n';   // down to exit (slight rightward: x 298->306)

// --- CROSSING (from x=306,y=151 to x=253,y=149, dipping through x=280,y=160) ---
// This is LEFTWARD overall, with a downward dip (y increases then decreases)
path += 'C 300 157, 287 163, 280 160\n';
path += 'C 272 157, 260 152, 253 149\n';

// --- LEFT HEART ---
// Entry at (253,149) -- going UP the right side of left heart stroke (x stays ~249-253)
path += 'C 252 128, 251 100, 249 74\n';    // up right side
path += 'C 249 45, 249 20, 249 6\n';       // continue up to peak
// Going DOWN/LEFT from peak -- the left side of left heart stroke goes LEFTWARD
path += 'C 245 2, 238 3, 232 8\n';        // slight leftward shoulder
path += 'C 223 15, 215 22, 210 29\n';     // descending to leftmost (x goes left to 210)
// RIGHTWARD SWING: x goes from 210 back rightward to ~249
path += 'C 226 38, 243 56, 249 74\n';     // rightward swing UP (wait - this duplicates y=74)

// Problem: the path now has y=74 twice (going up and swinging back)
// The left heart is a CLOSED LOOP. When descending the left side, we reach y=74 again coming back from the left.
// Let me restructure: after the peak (249,6), go left to (210,29), then RIGHT and DOWN to (251,145)

path = ''; // restart

// --- RIGHT WAVY ---
path += 'M 500 150\n';
path += 'C 486 143, 466 157, 449 152\n';
path += 'C 432 148, 405 139, 370 144\n';
path += 'C 358 149, 352 153, 346 150\n';

// --- RIGHT HEART ---
path += 'C 342 130, 330 100, 320 79\n';
path += 'C 312 56, 306 28, 303 6\n';
path += 'C 300 3, 296 12, 295 30\n';
path += 'C 295 55, 297 80, 298 95\n';
path += 'C 299 110, 302 130, 306 151\n';

// --- CROSSING ---
path += 'C 300 157, 287 163, 280 160\n';
path += 'C 272 157, 260 152, 253 149\n';

// --- LEFT HEART ---
// Phase 1: Go UP from (253,149) to peak (249,6)
// The right edge of left heart stroke ascends: x goes from ~253 to ~249 (nearly vertical)
path += 'C 252 115, 251 70, 249 6\n';   // straight-ish ascent to peak

// Phase 2: Go from peak (249,6) LEFTWARD and down to leftmost (210,29)
// The left edge of left heart stroke: from x=283,y=5 outer right to x=215,y=12 outer left
// Centerline goes from (249,6) heading left: (232,8) -> (215,15) -> (210,29)
path += 'C 244 1, 232 6, 221 14\n';
path += 'C 215 18, 210 23, 210 29\n';

// Phase 3: RIGHTWARD and DOWN from (210,29) back to baseline (251,145)
// The outer left edge swings from leftmost (209.6,29) to (245.4,40.6) -- big rightward jump
// Then continues at ~x=246-248 down to y=138
path += 'C 228 38, 246 55, 248 90\n';   // rightward swing then steady descent
path += 'C 248 115, 249 130, 251 145\n';

// --- LEFT HEART LEFT LOBE ---
// From left heart baseline (251,145), the shape continues with the left lobe
// Outer boundary: SVG(251,145) -> SVG(204,164) -> SVG(157,135) -> SVG(91,167) -> SVG(60,154)
// Centerline of this lobe: goes DOWN-LEFT through the lobe peak at SVG(91,167)
// then back UP-LEFT to meet the left wavy at SVG(60,154)

// Upper edge of left lobe stroke: outer boundary going from (251,145) to (60,154)
// Lower edge: the inner boundary + bottom bump
// The left lobe centerline passes through approximately (157,135) [waist] and (91,167) [peak]
// but wait: waist y=135 is ABOVE baseline y=148, and peak y=167 is well BELOW baseline
// The left lobe is shaped like an inverted heart lobe

// Actually: The outer boundary at this section:
// orig(-51.75,139.375)=SVG(251,145) [start]
// -> C orig(-53.07,136.83...) -> orig(-56,132.125)=SVG(246.8,137.8) [going UP slightly, small detour]
// -> orig(-74.15,102.54...) -> orig(-93.06,61.09...) -- this is going UP dramatically in orig coords
//   but orig y=102 and y=61 would be SVG y=108 and y=67 -- WAIT this can't be right for a bottom lobe
// Let me re-read: orig(-56,132.125) this is the path going back DOWN the right side of the left heart
// From orig(-52.75,143.375) [SVG 250,149] to orig(-56,132.125) [SVG 246.8,137.8] to ...
// orig(-93.06707262,61.08570126): this is going UP to y=67 in SVG! That is the UPPER portion of left heart stroke

// I think I misidentified which portion is the "left lobe"
// Let me re-read the outer boundary more carefully from where the left heart ends:

// After all the right-side analysis, going left in outer boundary:
// ... orig(-242.75,148.375)=SVG(60,154) ... orig(-302.75,140.375)=SVG(0,146) -- these are the LEFT WAVY
// The left wavy connects to the outer boundary at SVG(60,154) and SVG(0,146)

// The LEFT HEART SECOND BOTTOM BUMP (with the left-lobe peak at SVG(90.9,167.4)):
// orig(-211.88,161.75)=SVG(90.9,167.4) -- this is in the OUTER BOUNDARY going left
// And the left heart left base connects at orig(-172.22,143.35)=SVG(130.5,149)

// So the skeleton from left heart base going to left wavy:
// (251,145) -> (218,153) [existing approx] or more precisely:
//   After left heart loop closes at (251,145), the path continues:
//   right lobe area: (251,145) -> (204,164) -> (157,135) [waist] -> (91,167) [left lobe] -> (60,154) [wavy start]
// This is the CONTINUATION of the calligraphic stroke going further left through the left heart LOWER LOBES

// The left heart has TWO BOTTOM LOBES just like the right lobe structure:
// Right bottom lobe: crossing peak at SVG(280.5, 171.5) -- already covered in crossing section
// Left bottom lobe: SVG(90.9, 167.4) -- this needs to be in the skeleton

path += 'C 218 153, 175 143, 157 135\n';   // from left heart base to waist
path += 'C 130 145, 91 162, 60 154\n';     // through left lobe peak to left wavy start

// --- LEFT WAVY ---
path += 'C 45 148, 24 128, 16 136\n';
path += 'C 8 144, 4 146, 0 144\n';

console.log('=== FINAL SKELETON PATH ===');
console.log('');
console.log('d="' + path.replace(/\n/g, ' ').trim() + '"');
console.log('');
console.log('Formatted:');
console.log(path);
