// CICADA 2026 — intro choreography and ambient details.
// The timeline lives in styles.css; this file only starts it, drives the text
// scrambles CSS can't do, and handles skipping.
;(function () {
  "use strict"

  var root = document.documentElement
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  var CIPHER = "0123456789ABCDEF#$%&*+<>/\\=?"
  var timers = []
  var intervals = []

  clearTimeout(window.__introFailsafe)

  // The intro is a once-per-visit event. Coming back to "/" later in the same
  // session goes straight through to the live site; ?stay=1 always holds here.
  var SEEN_KEY = "cicada:intro-seen"
  var STAY_KEY = "cicada:intro-stay"
  var forceStay = /[?&]stay=1\b/.test(window.location.search)
  if (forceStay) {
    try { sessionStorage.setItem(STAY_KEY, "1") } catch (err) { /* private mode */ }
  } else {
    var seen = false
    try { seen = !!sessionStorage.getItem(SEEN_KEY) } catch (err) { /* ignore */ }
    if (seen) { window.location.replace("/home"); return }
  }

  function rand(n) { return Math.floor(Math.random() * n) }
  function randChar() { return CIPHER[rand(CIPHER.length)] }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)) }
  function every(fn, ms) { var id = setInterval(fn, ms); intervals.push(id); return id }

  // ---- Wordmark ciphers ------------------------------------------------
  // Matches the CSS: ciphers appear at 1.35s, letter i locks at 1.55s + i*0.11s.
  function runCiphers() {
    var ciphers = document.querySelectorAll(".cipher")
    var start = performance.now()
    var id = every(function () {
      var t = (performance.now() - start) / 1000
      var live = 0
      for (var i = 0; i < ciphers.length; i++) {
        if (t < 0.25 + i * 0.11) { ciphers[i].textContent = randChar(); live++ }
      }
      if (!live) clearInterval(id)
    }, 55)
  }

  // ---- Tagline decrypt -------------------------------------------------
  var tag = document.querySelector(".tagline [aria-hidden]")
  var tagText = tag ? tag.textContent : ""

  function decryptTagline(duration) {
    if (!tag) return
    var start = performance.now()
    var id = every(function () {
      var p = Math.min(1, (performance.now() - start) / duration)
      var fixed = Math.floor(p * tagText.length)
      var out = tagText.slice(0, fixed)
      for (var i = fixed; i < tagText.length; i++) {
        out += tagText[i] === " " ? " " : randChar()
      }
      tag.textContent = out
      if (p === 1) clearInterval(id)
    }, 40)
  }

  // ---- Sound -----------------------------------------------------------
  // Browsers refuse audio until the visitor has interacted with the page, so
  // the sting is attempted immediately and, if refused, armed to start on the
  // first gesture. The button is both the manual control and the signal that
  // sound exists at all.
  var sting = document.querySelector(".sting")
  var soundBtn = document.querySelector(".sound-btn")
  var soundLabel = soundBtn ? soundBtn.querySelector(".sound-label") : null
  var soundOn = false

  function markSound(on) {
    soundOn = on
    if (!soundBtn) return
    soundBtn.setAttribute("aria-pressed", on ? "true" : "false")
    if (soundLabel) soundLabel.textContent = on ? "Sound on" : "Tap for sound"
  }

  function playSting() {
    if (!sting || soundOn) return
    var p = sting.play()
    if (p && typeof p.then === "function") {
      p.then(function () { markSound(true) }).catch(function () { markSound(false) })
    } else {
      markSound(true)
    }
  }

  function stopSting() {
    if (!sting) return
    sting.pause()
    sting.currentTime = 0
    markSound(false)
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", function (e) {
      e.stopPropagation()
      if (soundOn) stopSting()
      else playSting()
    })
  }
  // First gesture anywhere also unlocks it, for the common autoplay refusal.
  document.addEventListener("pointerdown", function once() {
    document.removeEventListener("pointerdown", once)
    if (!soundOn && !reduced) playSting()
  })

  if (!reduced) playSting()

  // ---- Skip ------------------------------------------------------------
  // Custom cursor and grid trails (public/brand/cicada-cursor.js).
  if (window.CicadaCursor) window.CicadaCursor.attach({ grid: ".grid" })

  // Once the intro is over, the bug is free to fly (public/brand/cicada-fly.js).
  var flying = false
  function releaseBug() {
    if (flying || !window.CicadaFly) return
    flying = true
    window.CicadaFly.attach(document.querySelector(".bug"))
    if (window.CicadaGames) window.CicadaGames.attach()
  }

  function finish() {
    releaseBug()
    timers.forEach(clearTimeout)
    intervals.forEach(clearInterval)
    timers = []
    intervals = []
    if (tag) tag.textContent = tagText
    root.classList.add("done")
    removeSkipListeners()
    startAdvance()
  }

  // ---- Auto-advance ----------------------------------------------------
  // The fest is on, so the teaser hands visitors to the live site by itself.
  // "Stay here" cancels for good; so does opening any link, and the second
  // visit in a session skips the intro altogether (see the top of the file).
  var ADVANCE_MS = 5000
  var advance = document.querySelector(".advance")
  var advanceBar = advance ? advance.querySelector(".advance-bar i") : null
  var advanceCount = advance ? advance.querySelector(".advance-count") : null
  var advanceStay = advance ? advance.querySelector(".advance-stay") : null
  var advanceRaf = 0
  var advanceCancelled = false
  var advanceRunning = false

  function cancelAdvance(remember) {
    advanceCancelled = true
    advanceRunning = false
    cancelAnimationFrame(advanceRaf)
    if (advance) advance.hidden = true
    // Only "Stay here" is a standing decision; leaving by a link is not.
    try { sessionStorage.setItem(remember ? STAY_KEY : SEEN_KEY, "1") } catch (err) { /* private mode */ }
  }

  function startAdvance() {
    if (advanceCancelled || advanceRunning || !advance) return
    try { if (sessionStorage.getItem(STAY_KEY)) return } catch (err) { /* ignore */ }
    advanceRunning = true
    advance.hidden = false
    var t0 = performance.now()
    function step(now) {
      if (advanceCancelled) return
      var p = Math.min(1, (now - t0) / ADVANCE_MS)
      if (advanceBar) advanceBar.style.width = (p * 100).toFixed(2) + "%"
      if (advanceCount) advanceCount.textContent = String(Math.max(1, Math.ceil((1 - p) * ADVANCE_MS / 1000)))
      if (p < 1) { advanceRaf = requestAnimationFrame(step); return }
      try { sessionStorage.setItem(SEEN_KEY, "1") } catch (err) { /* ignore */ }
      window.location.replace("/home")
    }
    advanceRaf = requestAnimationFrame(step)
  }

  if (advanceStay) {
    advanceStay.addEventListener("click", function (e) {
      e.stopPropagation()
      cancelAdvance(true)
    })
  }
  // Following any link is a decision of its own; don't race it.
  document.addEventListener("click", function (e) {
    if (e.target.closest("a")) cancelAdvance(false)
  })

  function skip() {
    if (root.classList.contains("done")) return
    root.classList.add("skip")
    finish()
  }

  function onKey(e) {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip()
  }
  function onPointer(e) {
    if (e.target.closest("a")) return
    skip()
  }
  function removeSkipListeners() {
    document.removeEventListener("keydown", onKey)
    document.removeEventListener("pointerdown", onPointer)
  }

  var skipBtn = document.querySelector(".skip-btn")
  if (skipBtn) skipBtn.addEventListener("click", skip)

  // ---- Start -----------------------------------------------------------
  function start() {
    root.classList.add("go")
    if (reduced) { finish(); return }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    if (tag) tag.textContent = ""

    later(runCiphers, 1350)
    later(function () { decryptTagline(650) }, 2150)
    later(finish, 3300)
  }

  if (root.classList.contains("skip")) finish()
  else requestAnimationFrame(start)

  // ---- Surveillance clock ----------------------------------------------
  var clock = document.querySelector(".clock")
  function pad(n) { return (n < 10 ? "0" : "") + n }
  function tick() {
    var d = new Date()
    clock.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
  }
  if (clock) { tick(); setInterval(tick, 1000) }

  // ---- Grid pings --------------------------------------------------------
  // Each ping sits exactly on a grid dot and hops to a new one between cycles,
  // while it is invisible.
  if (reduced) return

  var grid = document.querySelector(".grid")
  var pings = document.querySelectorAll(".ping")

  function place(el) {
    var cs = getComputedStyle(grid)
    var cell = parseFloat(cs.getPropertyValue("--cell")) || 18
    var major = cell * 8
    // Bias towards the middle of the screen, where the grid mask is visible.
    var w = window.innerWidth
    var h = window.innerHeight
    var x = major + w * (0.12 + Math.random() * 0.76)
    var y = major + h * (0.12 + Math.random() * 0.7)
    el.style.left = Math.round(x / cell) * cell + "px"
    el.style.top = Math.round(y / cell) * cell + "px"
  }

  for (var i = 0; i < pings.length; i++) {
    place(pings[i])
    pings[i].style.animationDelay = (0.8 + i * 1.15 + Math.random() * 0.8).toFixed(2) + "s"
    pings[i].addEventListener("animationiteration", function (e) {
      if (e.target === e.currentTarget) place(e.currentTarget)
    })
  }
})()
