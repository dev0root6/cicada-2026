// CICADA — custom cursor and grid trails.
//
//   window.CicadaCursor.attach({ grid: ".heist-grid" })
//
// Cursor: a surveillance reticle — a dot that tracks the pointer exactly and a
// ring with crosshair notches that trails it, growing over anything clickable.
// Text fields keep the native I-beam. Mouse / trackpad only; touch is untouched.
//
// Trails: grid dots light up along the pointer's path and fade, joined by
// right-angled "circuit" traces, snapped to the live (drifting) background
// grid. Drawn on one canvas that only animates while a trail is fading. On
// touch screens a tap sends a small pulse through the grid instead.
//
// Shared by the teaser (public/landing) and the Next site
// (components/visuals/site-effects.tsx). Plain JS, no dependencies.
;(function () {
  "use strict"
  if (window.CicadaCursor) return

  var GREEN = "76,217,123"
  var LIFE = 850 // ms a lit dot / trace takes to fade

  var CSS =
    "html.cc-on,html.cc-on *{cursor:none!important}" +
    "html.cc-on :is(input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]),textarea,select,[contenteditable=true]){cursor:auto!important}" +
    ".cc-dot,.cc-ring{position:fixed;left:0;top:0;z-index:80;pointer-events:none;border-radius:50%;will-change:transform;opacity:0;transition:opacity .2s}" +
    "html.cc-visible .cc-dot,html.cc-visible .cc-ring{opacity:1}" +
    "html.cc-text .cc-dot,html.cc-text .cc-ring{opacity:0}" +
    ".cc-dot{width:6px;height:6px;margin:-3px 0 0 -3px;background:#4cd97b;box-shadow:0 0 8px 1px rgba(" + GREEN + ",.8)}" +
    ".cc-ring{width:34px;height:34px;margin:-17px 0 0 -17px}" +
    ".cc-ring i{position:absolute;inset:0;border:1px solid rgba(" + GREEN + ",.6);border-radius:50%;transition:transform .25s cubic-bezier(.3,1.4,.5,1),background-color .25s,border-color .25s}" +
    // Crosshair notches at 12, 3, 6 and 9 o'clock.
    ".cc-ring i::before,.cc-ring i::after{content:'';position:absolute;background:rgba(" + GREEN + ",.9)}" +
    ".cc-ring i::before{left:50%;top:-4px;bottom:-4px;width:1px;margin-left:-.5px;-webkit-mask:linear-gradient(#000 0 7px,transparent 7px calc(100% - 7px),#000 0);mask:linear-gradient(#000 0 7px,transparent 7px calc(100% - 7px),#000 0)}" +
    ".cc-ring i::after{top:50%;left:-4px;right:-4px;height:1px;margin-top:-.5px;-webkit-mask:linear-gradient(90deg,#000 0 7px,transparent 7px calc(100% - 7px),#000 0);mask:linear-gradient(90deg,#000 0 7px,transparent 7px calc(100% - 7px),#000 0)}" +
    "html.cc-hover .cc-ring i{transform:scale(1.55) rotate(45deg);background:rgba(" + GREEN + ",.08);border-color:#4cd97b}" +
    "html.cc-down .cc-ring i{transform:scale(.8)}" +
    "html.cc-hover.cc-down .cc-ring i{transform:scale(1.25) rotate(45deg)}" +
    ".cc-trails{position:fixed;inset:0;z-index:-1;pointer-events:none}"

  var INTERACTIVE = "a,button,[role=button],label,summary,select,input[type=checkbox],input[type=radio],input[type=submit],input[type=button],[data-cursor=hover]"
  var TEXTUAL = "input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]),textarea,[contenteditable=true]"

  function attach(options) {
    options = options || {}
    var root = document.documentElement
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches

    if (!document.getElementById("cc-style")) {
      var style = document.createElement("style")
      style.id = "cc-style"
      style.textContent = CSS
      document.head.appendChild(style)
    }

    var cleanups = []
    function on(target, type, fn, opts) {
      target.addEventListener(type, fn, opts)
      cleanups.push(function () { target.removeEventListener(type, fn, opts) })
    }

    // ---- Reticle ---------------------------------------------------------------
    var dot = null, ring = null
    var px = -100, py = -100, rx = -100, ry = -100
    var ringRaf = 0

    if (finePointer) {
      dot = document.createElement("div")
      dot.className = "cc-dot"
      ring = document.createElement("div")
      ring.className = "cc-ring"
      ring.appendChild(document.createElement("i"))
      dot.setAttribute("aria-hidden", "true")
      ring.setAttribute("aria-hidden", "true")
      document.body.appendChild(ring)
      document.body.appendChild(dot)
      root.classList.add("cc-on")

      var followRing = function () {
        ringRaf = 0
        var k = reduced ? 1 : 0.22
        rx += (px - rx) * k
        ry += (py - ry) * k
        ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)"
        if (Math.abs(px - rx) > 0.2 || Math.abs(py - ry) > 0.2) ringRaf = requestAnimationFrame(followRing)
      }

      on(document, "pointermove", function (e) {
        if (e.pointerType !== "mouse") return
        if (rx < -50) { rx = e.clientX; ry = e.clientY }
        px = e.clientX
        py = e.clientY
        dot.style.transform = "translate3d(" + px + "px," + py + "px,0)"
        if (!ringRaf) ringRaf = requestAnimationFrame(followRing)
        root.classList.add("cc-visible")
        var target = e.target instanceof Element ? e.target : null
        root.classList.toggle("cc-text", !!(target && target.closest(TEXTUAL)))
        root.classList.toggle("cc-hover", !!(target && target.closest(INTERACTIVE)))
      }, { passive: true })
      on(document, "mousedown", function () { root.classList.add("cc-down") })
      on(document, "mouseup", function () { root.classList.remove("cc-down") })
      on(document, "mouseout", function (e) { if (!e.relatedTarget) root.classList.remove("cc-visible") })
    }

    // ---- Grid trails -------------------------------------------------------------
    var canvas = null
    if (!reduced) {
      canvas = document.createElement("canvas")
      canvas.className = "cc-trails"
      canvas.setAttribute("aria-hidden", "true")
      // z-index -1 and last in the body: above the fixed background layers
      // (also -1, earlier in the tree), below all page content.
      document.body.appendChild(canvas)
    }
    var ctx = canvas && canvas.getContext("2d")
    var dpr = 1
    var cells = new Map() // "x,y" -> { x, y, t }
    var traces = [] // { x1, y1, x2, y2, t }
    var lastCell = null
    var trailRaf = 0

    function resize() {
      if (!canvas) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
    }

    // Where the background grid's dots are right now: its cell size and the
    // current drift offset, read from the live element so trails land on dots.
    // The drift is ~1px/s, so a quarter-second-old reading is exact enough and
    // spares a layout read on every mouse move.
    var frameCache = null
    function gridFrame() {
      var now = performance.now()
      if (frameCache && now - frameCache.at < 250) return frameCache
      frameCache = readGrid()
      frameCache.at = now
      return frameCache
    }

    function readGrid() {
      var node = options.grid ? document.querySelector(options.grid) : null
      var cell = 18
      var ox = 0, oy = 0
      if (node) {
        var cs = getComputedStyle(node)
        cell = parseFloat(cs.getPropertyValue("--cell")) || cell
        var r = node.getBoundingClientRect()
        ox = r.left
        oy = r.top
      }
      return { cell: cell, ox: ((ox % cell) + cell) % cell, oy: ((oy % cell) + cell) % cell }
    }

    function snap(v, off, cell) {
      return off + Math.round((v - off) / cell) * cell
    }

    function light(x, y, now) {
      var key = x + "," + y
      var c = cells.get(key)
      if (c) c.t = now
      else cells.set(key, { x: x, y: y, t: now })
    }

    function trailTo(x, y) {
      if (!ctx) return
      var now = performance.now()
      var g = gridFrame()
      var sx = snap(x, g.ox, g.cell)
      var sy = snap(y, g.oy, g.cell)
      if (lastCell && lastCell.x === sx && lastCell.y === sy) return
      if (lastCell) {
        // Walk the path cell by cell along a right-angled route, like a trace.
        // Count whole cells rather than comparing coordinates: the grid drifts,
        // so the previous point may sit a fraction of a pixel off this frame.
        var cx = snap(lastCell.x, g.ox, g.cell)
        var cy = snap(lastCell.y, g.oy, g.cell)
        var nx = Math.round((sx - cx) / g.cell)
        var ny = Math.round((sy - cy) / g.cell)
        // A long jump (a flick, or the pointer re-entering) starts a new trail
        // rather than drawing a line of dots across the screen.
        if (Math.abs(nx) + Math.abs(ny) <= 8) {
          var i
          for (i = 0; i < Math.abs(nx); i++) light(cx + Math.sign(nx) * i * g.cell, cy, now)
          for (i = 0; i < Math.abs(ny); i++) light(sx, cy + Math.sign(ny) * i * g.cell, now)
          traces.push({ x1: cx, y1: cy, x2: sx, y2: cy, t: now })
          traces.push({ x1: sx, y1: cy, x2: sx, y2: sy, t: now })
        }
      }
      light(sx, sy, now)
      lastCell = { x: sx, y: sy }
      if (!trailRaf) trailRaf = requestAnimationFrame(drawTrails)
    }

    function pulse(x, y) {
      if (!ctx) return
      var now = performance.now()
      var g = gridFrame()
      var sx = snap(x, g.ox, g.cell)
      var sy = snap(y, g.oy, g.cell)
      for (var i = -3; i <= 3; i++) {
        for (var j = -3; j <= 3; j++) {
          var d = Math.abs(i) + Math.abs(j)
          if (d > 3) continue
          // Stagger by distance so the pulse ripples outward.
          cells.set((sx + i * g.cell) + "," + (sy + j * g.cell), { x: sx + i * g.cell, y: sy + j * g.cell, t: now + d * 70 })
        }
      }
      if (!trailRaf) trailRaf = requestAnimationFrame(drawTrails)
    }

    function drawTrails(now) {
      trailRaf = 0
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.lineWidth = 1
      traces = traces.filter(function (s) {
        var a = 1 - (now - s.t) / LIFE
        if (a <= 0) return false
        ctx.strokeStyle = "rgba(" + GREEN + "," + (a * 0.35).toFixed(3) + ")"
        ctx.beginPath()
        ctx.moveTo(s.x1 + 0.5, s.y1 + 0.5)
        ctx.lineTo(s.x2 + 0.5, s.y2 + 0.5)
        ctx.stroke()
        return true
      })

      cells.forEach(function (c, key) {
        var age = now - c.t
        if (age < 0) return // a pulse cell that hasn't fired yet
        var a = 1 - age / LIFE
        if (a <= 0) { cells.delete(key); return }
        var ease = a * a
        ctx.fillStyle = "rgba(" + GREEN + "," + (ease * 0.22).toFixed(3) + ")"
        ctx.beginPath()
        ctx.arc(c.x, c.y, 5 * ease + 1, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "rgba(" + GREEN + "," + (0.35 + ease * 0.65).toFixed(3) + ")"
        ctx.beginPath()
        ctx.arc(c.x, c.y, 1.2 + ease * 0.9, 0, Math.PI * 2)
        ctx.fill()
      })

      if (cells.size || traces.length) trailRaf = requestAnimationFrame(drawTrails)
      else lastCell = null
    }

    if (canvas) {
      resize()
      on(window, "resize", resize, { passive: true })
      on(document, "pointermove", function (e) {
        if (e.pointerType === "mouse") trailTo(e.clientX, e.clientY)
      }, { passive: true })
      on(document, "pointerdown", function (e) {
        if (e.pointerType !== "mouse") pulse(e.clientX, e.clientY)
      }, { passive: true })
      on(document, "mouseout", function (e) { if (!e.relatedTarget) lastCell = null })
    }

    return function detach() {
      cleanups.forEach(function (fn) { fn() })
      if (ringRaf) cancelAnimationFrame(ringRaf)
      if (trailRaf) cancelAnimationFrame(trailRaf)
      if (dot) dot.remove()
      if (ring) ring.remove()
      if (canvas) canvas.remove()
      root.classList.remove("cc-on", "cc-visible", "cc-hover", "cc-down", "cc-text")
    }
  }

  window.CicadaCursor = { attach: attach }
})()
