// CICADA — the flying bug.
//
// Lifts the hero bug off the page and flies it: after the cursor on desktop,
// to wherever the user taps on touch screens. Shared by the teaser (public/
// landing) and the Next site (components/visuals/flying-bug.tsx), so it is
// plain JS with no dependencies.
//
//   const detach = window.CicadaFly.attach(() => homeElement)
//   detach.refresh()   // after the page's home element changes (navigation)
//   detach()
//
// "Home" is where the bug docks when idle — an element, or a function that
// returns the current one (the hero bug on /home, else the navbar logo). The
// bug's position survives full page loads via sessionStorage, so it keeps
// flying from one page to the next.
//
// The bug is three layers (two wings and the body, traced from the brand PNG)
// in a perspective rig; each wing flaps with rotateY about its hinge. Every
// per-frame write is a transform or opacity on a small composited layer.
// Honours prefers-reduced-motion by doing nothing at all.
;(function () {
  "use strict"
  if (window.CicadaFly) return

  var BASE = "/brand/cicada-bug-"
  var ASPECT = 88 / 213
  // Wing hinges, as a fraction of the 213x88 artwork.
  var HINGE_L = "36.6% 42%"
  var HINGE_R = "62% 42%"

  var CSS =
    ".cf-flyer{position:fixed;left:0;top:0;z-index:70;pointer-events:none;will-change:transform;opacity:0;transition:opacity .25s}" +
    ".cf-flyer.cf-on{opacity:1}" +
    ".cf-shadow{position:absolute;left:18%;right:18%;top:62%;height:34%;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.55),transparent);will-change:transform,opacity}" +
    ".cf-rig{position:absolute;inset:0;perspective:240px;will-change:transform}" +
    ".cf-glow{position:absolute;inset:-30% -10%;background:radial-gradient(closest-side,rgba(76,217,123,.28),transparent 70%);will-change:opacity}" +
    ".cf-part{position:absolute;inset:0;width:100%;height:100%;user-select:none;-webkit-user-drag:none}" +
    ".cf-wl{transform-origin:" + HINGE_L + "}" +
    ".cf-wr{transform-origin:" + HINGE_R + "}" +
    ".cf-ghost{opacity:0}" +
    ".cf-away{transition:opacity .35s;opacity:.12!important}"

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v }
  function lerp(a, b, t) { return a + (b - a) * t }
  function angleLerp(a, b, t) {
    var d = ((b - a + 540) % 360) - 180
    return a + d * t
  }

  function el(tag, cls, parent) {
    var n = document.createElement(tag)
    n.className = cls
    if (parent) parent.appendChild(n)
    return n
  }

  function part(src, cls, parent) {
    var img = el("img", "cf-part " + cls, parent)
    img.src = BASE + src + ".svg"
    img.alt = ""
    img.draggable = false
    return img
  }

  var STORE_KEY = "cicada-fly"

  function noop() {}
  noop.refresh = noop

  function attach(home, options) {
    options = options || {}
    if (!home || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return noop
    }
    var resolveHome = typeof home === "function" ? home : function () { return home }

    if (!document.getElementById("cf-style")) {
      var style = el("style", "")
      style.id = "cf-style"
      style.textContent = CSS
      document.head.appendChild(style)
    }

    var touchFirst = window.matchMedia("(hover: none), (pointer: coarse)").matches

    // ---- Rig ---------------------------------------------------------------
    var flyer = el("div", "cf-flyer")
    flyer.setAttribute("aria-hidden", "true")
    var shadow = el("div", "cf-shadow", flyer)
    var rig = el("div", "cf-rig", flyer)
    var glow = el("div", "cf-glow", rig)
    // Motion-blur ghosts trail the real wings by a fraction of a beat.
    var ghostL = part("wing-left", "cf-wl cf-ghost", rig)
    var ghostR = part("wing-right", "cf-wr cf-ghost", rig)
    var wingL = part("wing-left", "cf-wl", rig)
    var wingR = part("wing-right", "cf-wr", rig)
    part("body", "", rig)
    document.body.appendChild(flyer)

    // ---- State -------------------------------------------------------------
    var mode = "home" // home | fly | landed | returning
    var x = 0, y = 0, vx = 0, vy = 0
    var tx = 0, ty = 0
    var heading = 0
    var altitude = 0
    var phase = 0
    var scale = 1
    var width = 100
    var lastMove = 0
    var homeTimer = 0
    // Set while a game (public/brand/cicada-games.js) is steering the bug.
    var game = null
    var raf = 0
    var last = 0
    var t = 0

    // The element currently faded out because the bug has left it.
    var awayEl = null

    function homeRect() {
      var node = resolveHome()
      if (!node) return null
      var r = node.getBoundingClientRect()
      if (!r.width) return null
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }
    }

    function onScreen(r) {
      return r && r.y > -r.h && r.y < window.innerHeight + r.h
    }

    function setAway(away) {
      var node = away ? resolveHome() : null
      if (node === awayEl) return
      if (awayEl) awayEl.classList.remove("cf-away")
      if (node) node.classList.add("cf-away")
      awayEl = node
    }

    function sizeFlyer() {
      width = clamp(window.innerWidth * 0.08, touchFirst ? 72 : 88, 112)
      flyer.style.width = width + "px"
      flyer.style.height = width * ASPECT + "px"
    }

    function show() {
      setAway(true)
      flyer.classList.add("cf-on")
    }

    function takeOff(px, py) {
      clearTimeout(homeTimer)
      if (mode === "home") {
        var r = homeRect()
        if (!r) return
        sizeFlyer()
        // Start exactly on top of the home bug, at its size, then grow/shrink.
        x = r.x
        y = r.y
        vx = 0
        vy = -60
        heading = 0
        altitude = 0
        scale = r.w / width
        show()
      }
      mode = "fly"
      tx = px
      ty = py
      lastMove = t
      start()
    }

    function goHome() {
      if (mode === "home" || game) return
      var r = homeRect()
      if (!onScreen(r)) return // home is off screen; stay where we are
      mode = "returning"
      start()
    }

    // ---- Input ---------------------------------------------------------------
    function onPointerMove(e) {
      if (e.pointerType !== "mouse") return
      if (mode === "home" || mode === "returning" || mode === "landed") {
        if (mode !== "landed" || Math.hypot(e.clientX - x, e.clientY - y) > 14) {
          takeOff(e.clientX, e.clientY)
        }
      }
      tx = e.clientX
      ty = e.clientY
      lastMove = t
    }

    function onPointerDown(e) {
      if (e.pointerType === "mouse") return
      takeOff(e.clientX, e.clientY)
    }

    function onLeave(e) {
      if (!e.relatedTarget) goHome()
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("pointerdown", onPointerDown, { passive: true })
    document.addEventListener("mouseout", onLeave)

    // ---- Loop ------------------------------------------------------------------
    function start() {
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    function frame(now) {
      var dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      t += dt
      raf = 0

      var goalX = tx, goalY = ty, goalScale = 1

      if (mode === "returning") {
        var r = homeRect()
        if (r) {
          goalX = r.x
          goalY = r.y
          goalScale = r.w / width
        } else {
          // Home vanished mid-flight (navigation): settle where we are.
          mode = "fly"
          tx = x
          ty = y
          lastMove = t - 10
        }
      } else if (game) {
        var goal = gameGoal(dt)
        goalX = goal.x
        goalY = goal.y
      } else if (mode === "fly" && !touchFirst) {
        // Hover near the cursor rather than on it, drifting in a lazy orbit
        // that calms down once the cursor rests so the bug can settle.
        var drift = clamp(1 - (t - lastMove) / 1.2, 0, 1)
        goalX += Math.cos(t * 1.3) * 22 * drift + 28
        goalY += Math.sin(t * 1.7) * 16 * drift - 26
      }

      // Critically-damped-ish spring towards the goal, plus a little flutter.
      var dx = goalX - x
      var dy = goalY - y
      var dist = Math.hypot(dx, dy)
      var stiffness = mode === "returning" ? 26 : game ? game.stiffness : 16
      var damping = mode === "returning" ? 9 : game ? game.damping : 6.2
      if (game && game.kind === "chase") {
        // Pursuit: steer towards the cursor at a capped speed, so it can be
        // outrun — just — rather than snapping on like a spring.
        var want = dist > 0.001 ? game.speed / dist : 0
        var grip = clamp(dt * game.turn, 0, 1)
        vx += (dx * want - vx) * grip
        vy += (dy * want - vy) * grip
        x += vx * dt
        y += vy * dt
      } else if (mode !== "landed") {
        vx += (dx * stiffness - vx * damping) * dt + Math.sin(t * 13.1) * 40 * dt
        vy += (dy * stiffness - vy * damping) * dt + Math.cos(t * 11.3) * 40 * dt
        var sp = Math.hypot(vx, vy)
        if (sp > 1500) { vx *= 1500 / sp; vy *= 1500 / sp }
        x += vx * dt
        y += vy * dt
      }
      var speed = Math.hypot(vx, vy)

      // Face the direction of travel; when hovering, turn towards the goal.
      if (speed > 70) heading = angleLerp(heading, (Math.atan2(vy, vx) * 180) / Math.PI + 90, clamp(dt * 7, 0, 1))
      else if (mode === "fly" && dist > 8) heading = angleLerp(heading, (Math.atan2(dy, dx) * 180) / Math.PI + 90, clamp(dt * 2, 0, 1))
      else if (mode === "returning" || mode === "landed") heading = angleLerp(heading, 0, clamp(dt * 3, 0, 1))

      // Landing: touch lands on the tap point; desktop lands once the cursor rests.
      if (mode === "fly" && !game) {
        var restLimit = touchFirst ? 0.2 : 1.6
        if (dist < 5 && speed < 30 && t - lastMove > restLimit) {
          mode = "landed"
          vx = vy = 0
          // On touch there is no cursor to come back to: after a while
          // perched, fly home.
          if (touchFirst) homeTimer = setTimeout(goHome, 7000)
        }
      } else if (mode === "returning" && dist < 2.5 && speed < 40) {
        dock()
        return
      }

      var airborne = mode === "fly" || mode === "returning"
      altitude = lerp(altitude, airborne ? 1 : 0, clamp(dt * (airborne ? 5 : 3), 0, 1))
      scale = lerp(scale, goalScale, clamp(dt * 3.5, 0, 1))

      // Wingbeat: faster when moving fast, winding down as it settles.
      var hz = 6.5 + clamp(speed / 900, 0, 1) * 5.5
      phase += dt * hz * Math.PI * 2 * altitude
      var beat = 0.5 + 0.5 * Math.sin(phase)
      var ghostBeat = 0.5 + 0.5 * Math.sin(phase - 0.9)
      var amp = 62 * altitude
      var rest = 18 * (1 - altitude)
      var a = rest + 6 + amp * beat
      var ga = rest + 6 + amp * ghostBeat
      // Wing tips catch the light on the downstroke.
      var shade = 0.75 + 0.25 * (1 - beat)

      var bob = Math.sin(t * 2.4) * 3 * altitude
      var lift = altitude * (touchFirst ? 14 : 18)

      flyer.style.transform =
        "translate3d(" + (x - width / 2).toFixed(1) + "px," + (y - (width * ASPECT) / 2).toFixed(1) + "px,0)"
      rig.style.transform =
        "translate3d(0," + (bob - lift).toFixed(1) + "px,0) rotate(" + heading.toFixed(1) + "deg) scale(" + (scale * (1 + altitude * 0.06)).toFixed(3) + ")"
      wingL.style.transform = "rotateY(" + a.toFixed(1) + "deg)"
      wingR.style.transform = "rotateY(" + (-a).toFixed(1) + "deg)"
      wingL.style.opacity = wingR.style.opacity = shade.toFixed(2)
      ghostL.style.transform = "rotateY(" + ga.toFixed(1) + "deg)"
      ghostR.style.transform = "rotateY(" + (-ga).toFixed(1) + "deg)"
      ghostL.style.opacity = ghostR.style.opacity = (0.3 * altitude * clamp(hz / 9, 0, 1)).toFixed(2)
      glow.style.opacity = (0.5 + 0.5 * altitude).toFixed(2)
      shadow.style.transform = "translate3d(0," + (6 + lift * 0.9).toFixed(1) + "px,0) scale(" + (scale * (1 - altitude * 0.25)).toFixed(3) + ")"
      shadow.style.opacity = (0.8 - altitude * 0.45).toFixed(2)

      // Keep running while anything is still moving; a settled, landed bug sleeps.
      var settled = mode === "landed" && altitude < 0.01 && Math.abs(scale - goalScale) < 0.001
      if (!settled) raf = requestAnimationFrame(frame)
    }

    function dock() {
      mode = "home"
      vx = vy = 0
      altitude = 0
      flyer.classList.remove("cf-on")
      setAway(false)
    }

    // ---- Games ---------------------------------------------------------------------
    // Where the bug wants to be this frame while a game is running.
    function gameGoal(dt) {
      var W = window.innerWidth, H = window.innerHeight
      if (game.kind === "seek" || game.kind === "chase") return { x: tx, y: ty }

      // flee: bolt directly away from the cursor when it gets close, otherwise
      // wander between random spots. Walls push it sideways, not into corners.
      game.wanderIn -= dt
      if (game.wanderIn <= 0 || Math.hypot(game.wx - x, game.wy - y) < 30) {
        game.wx = 80 + Math.random() * (W - 160)
        game.wy = 110 + Math.random() * (H - 190)
        game.wanderIn = 1.2 + Math.random() * 1.2
      }
      var ax = x - tx, ay = y - ty
      var d = Math.hypot(ax, ay) || 1
      if (d < game.fear) {
        var gx = x + (ax / d) * 320
        var gy = y + (ay / d) * 320
        if (gx < 60 || gx > W - 60) gy = y + (ay >= 0 ? 1 : -1) * 320
        if (gy < 90 || gy > H - 60) gx = x + (ax >= 0 ? 1 : -1) * 320
        return { x: clamp(gx, 60, W - 60), y: clamp(gy, 90, H - 60) }
      }
      return { x: game.wx, y: game.wy }
    }

    /**
     * Hand the bug to a game. kind: "flee" (runs from the cursor), "chase"
     * (hunts it) or "seek" (flies straight to it). options.level scales speed.
     */
    function play(kind, options) {
      options = options || {}
      var level = options.level || 1
      clearTimeout(homeTimer)
      game = {
        kind: kind,
        stiffness: kind === "flee" ? 10 + level * 3 : 22,
        damping: kind === "flee" ? 5 : 7,
        fear: 170 + level * 22,
        speed: 170 + level * 55,
        turn: 2.2 + level * 0.25,
        wx: x, wy: y, wanderIn: 0,
      }
      var W = window.innerWidth, H = window.innerHeight
      if (!tx && !ty) { tx = W / 2; ty = H / 2 }
      if (mode === "home") {
        if (homeRect()) takeOff(tx, ty)
        else {
          // Docked somewhere off screen: appear mid-screen instead.
          sizeFlyer()
          x = W / 2
          y = H / 2
          scale = 1
          show()
        }
      }
      mode = "fly"
      start()
    }

    function setLevel(level) {
      if (game) play(game.kind, { level: level })
    }

    function stopGame() {
      game = null
      lastMove = t
      start()
    }

    /** Throw the bug to a random far spot (a catch in the catch game). */
    function scatter() {
      var W = window.innerWidth, H = window.innerHeight
      var nx = 80 + Math.random() * (W - 160), ny = 110 + Math.random() * (H - 190)
      vx = (nx - x) * 4
      vy = (ny - y) * 4
      if (game) { game.wx = nx; game.wy = ny; game.wanderIn = 1.5 }
      start()
    }

    /** Where the bug is drawn (it hovers above its ground point), for hit tests. */
    function state() {
      var lift = altitude * (touchFirst ? 14 : 18)
      return { x: x, y: y - lift, width: width, flying: mode === "fly" || mode === "returning" }
    }

    // ---- Survive page loads ---------------------------------------------------
    function save() {
      try {
        if (mode === "home") sessionStorage.removeItem(STORE_KEY)
        else sessionStorage.setItem(STORE_KEY, JSON.stringify({ x: x, y: y, h: heading, at: Date.now() }))
      } catch (e) {}
    }

    function restore() {
      var saved = null
      try { saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || "null") } catch (e) {}
      if (!saved || Date.now() - saved.at > 5 * 60 * 1000) return
      sizeFlyer()
      x = tx = clamp(saved.x, 20, window.innerWidth - 20)
      y = ty = clamp(saved.y, 20, window.innerHeight - 20)
      heading = saved.h || 0
      mode = "landed"
      show()
      start()
    }

    window.addEventListener("pagehide", save)
    restore()

    function detach() {
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(homeTimer)
      save()
      document.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("mouseout", onLeave)
      window.removeEventListener("pagehide", save)
      flyer.remove()
      setAway(false)
      if (window.CicadaFly.current === detach) window.CicadaFly.current = null
    }

    // The page's home element changed (client-side navigation): move the
    // faded "away" state to the new one, or re-dock onto it.
    detach.refresh = function () {
      if (mode !== "home") setAway(true)
    }
    detach.play = play
    detach.setLevel = setLevel
    detach.stop = stopGame
    detach.scatter = scatter
    detach.state = state

    window.CicadaFly.current = detach

    return detach
  }

  window.CicadaFly = { attach: attach }
})()
