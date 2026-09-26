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

  // ---- Skip ------------------------------------------------------------
  function finish() {
    timers.forEach(clearTimeout)
    intervals.forEach(clearInterval)
    timers = []
    intervals = []
    if (tag) tag.textContent = tagText
    root.classList.add("done")
    removeSkipListeners()
  }

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
