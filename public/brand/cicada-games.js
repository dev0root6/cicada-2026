// CICADA — play with the bug.
//
//   window.CicadaGames.attach()   // once per page; desktop only
//   window.CicadaGames.open()     // show the game picker (e.g. from a button)
//
// Restless, erratic mouse movement kept up for more than 5 seconds (lots of
// direction changes, continuously) pops a small "wanna play with the bug?"
// prompt, at most once per visit. Three games, all played with the real flying bug from
// cicada-fly.js (window.CicadaFly.current):
//
//   CATCH       it runs from the cursor; click it as often as you can in 30s
//   EVADE       it hunts the cursor and gets faster; survive as long as you can
//   GRID HEIST  it follows the cursor; steer it onto vault nodes before they fade
//
// Best scores are kept in localStorage. Plain JS, no dependencies.
;(function () {
  "use strict"
  if (window.CicadaGames) return

  var G = "76,217,123"
  var CSS =
    ".cg-toast{position:fixed;right:24px;bottom:24px;z-index:75;width:min(300px,calc(100vw - 48px));padding:16px 18px;border:1px solid rgba(" + G + ",.35);border-radius:16px;background:rgba(10,14,11,.94);box-shadow:0 0 40px rgba(" + G + ",.15);font:13px/1.5 ui-monospace,'JetBrains Mono',Menlo,monospace;color:#e8efe9;opacity:0;transform:translate3d(0,12px,0);transition:opacity .3s,transform .3s}" +
    ".cg-toast.cg-in{opacity:1;transform:none}" +
    ".cg-eyebrow{margin:0;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#4cd97b}" +
    ".cg-eyebrow::before{content:'// ';opacity:.6}" +
    ".cg-toast p.cg-q{margin:8px 0 14px;font-size:15px;font-weight:600;letter-spacing:.02em}" +
    ".cg-row{display:flex;gap:8px;flex-wrap:wrap}" +
    ".cg-btn{appearance:none;border:1px solid rgba(" + G + ",.45);background:rgba(" + G + ",.06);color:#4cd97b;border-radius:999px;padding:8px 16px;font:600 11px/1 ui-monospace,'JetBrains Mono',Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;transition:background .2s,color .2s,border-color .2s}" +
    ".cg-btn:hover,.cg-btn:focus-visible{background:#4cd97b;color:#06120a;border-color:#4cd97b;outline:none}" +
    ".cg-btn.cg-primary{background:#4cd97b;color:#06120a;box-shadow:0 0 20px rgba(" + G + ",.3)}" +
    ".cg-btn.cg-ghost{border-color:transparent;background:none;color:#8fa196}" +
    ".cg-btn.cg-ghost:hover{color:#e8efe9;background:rgba(255,255,255,.04)}" +
    ".cg-backdrop{position:fixed;inset:0;z-index:75;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(5,8,6,.72);backdrop-filter:blur(3px);opacity:0;transition:opacity .25s}" +
    ".cg-backdrop.cg-in{opacity:1}" +
    ".cg-modal{width:min(720px,100%);padding:28px;border:1px solid rgba(" + G + ",.3);border-radius:20px;background:#0b110d;box-shadow:0 0 60px rgba(" + G + ",.12);font-family:ui-monospace,'JetBrains Mono',Menlo,monospace;color:#e8efe9}" +
    ".cg-modal h2{margin:10px 0 6px;font-size:24px;letter-spacing:.04em;text-transform:uppercase}" +
    ".cg-modal p.cg-sub{margin:0 0 22px;color:#8fa196;font:14px/1.6 'Plus Jakarta Sans',system-ui,sans-serif}" +
    ".cg-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}" +
    "@media (max-width:640px){.cg-cards{grid-template-columns:1fr}}" +
    ".cg-card{appearance:none;text-align:left;border:1px solid rgba(" + G + ",.18);border-radius:14px;background:rgba(" + G + ",.03);padding:16px;color:inherit;font:inherit;transition:border-color .2s,background .2s,transform .2s}" +
    ".cg-card:hover,.cg-card:focus-visible{border-color:#4cd97b;background:rgba(" + G + ",.08);transform:translateY(-2px);outline:none}" +
    ".cg-card b{display:block;font-size:14px;letter-spacing:.14em;color:#4cd97b}" +
    ".cg-card span{display:block;margin-top:8px;font:13px/1.5 'Plus Jakarta Sans',system-ui,sans-serif;color:#b9c7be}" +
    ".cg-card i{display:block;margin-top:12px;font-style:normal;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#6f8076}" +
    ".cg-foot{display:flex;justify-content:space-between;align-items:center;margin-top:20px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6f8076}" +
    ".cg-layer{position:fixed;inset:0;z-index:65}" +
    ".cg-hud{position:fixed;left:50%;top:84px;z-index:75;display:flex;gap:22px;align-items:center;padding:10px 20px;transform:translateX(-50%);border:1px solid rgba(" + G + ",.3);border-radius:999px;background:rgba(10,14,11,.9);font:12px/1 ui-monospace,'JetBrains Mono',Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#8fa196;white-space:nowrap}" +
    ".cg-hud strong{color:#4cd97b;font-size:16px;letter-spacing:.06em;margin-left:6px}" +
    ".cg-count{position:fixed;inset:0;z-index:75;display:flex;align-items:center;justify-content:center;pointer-events:none;font:700 min(26vw,180px)/1 ui-monospace,'JetBrains Mono',Menlo,monospace;color:#4cd97b;text-shadow:0 0 40px rgba(" + G + ",.6)}" +
    ".cg-count span{animation:cg-pop .9s ease-out both}" +
    "@keyframes cg-pop{0%{opacity:0;transform:scale(1.6)}20%{opacity:1;transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:scale(.85)}}" +
    ".cg-float{position:fixed;z-index:75;pointer-events:none;font:700 16px/1 ui-monospace,'JetBrains Mono',Menlo,monospace;color:#4cd97b;text-shadow:0 0 12px rgba(" + G + ",.8);animation:cg-float .8s ease-out forwards}" +
    ".cg-float.cg-miss{color:#8fa196;text-shadow:none;font-size:11px;letter-spacing:.2em}" +
    "@keyframes cg-float{from{opacity:1;transform:translate(-50%,-50%)}to{opacity:0;transform:translate(-50%,-160%)}}" +
    ".cg-node{position:fixed;z-index:66;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#4cd97b;box-shadow:0 0 16px 4px rgba(" + G + ",.6);pointer-events:none}" +
    ".cg-node::after{content:'';position:absolute;inset:-10px;border:1px solid rgba(" + G + ",.8);border-radius:50%;animation:cg-ring 1.2s ease-out infinite}" +
    "@keyframes cg-ring{from{transform:scale(.4);opacity:1}to{transform:scale(1.4);opacity:0}}" +
    ".cg-burst{position:fixed;z-index:66;width:60px;height:60px;margin:-30px 0 0 -30px;border:2px solid #4cd97b;border-radius:50%;pointer-events:none;animation:cg-burst .5s ease-out forwards}" +
    "@keyframes cg-burst{from{transform:scale(.2);opacity:1}to{transform:scale(1.6);opacity:0}}" +
    ".cg-big{margin:6px 0 2px;font-size:56px;font-weight:700;color:#4cd97b;text-shadow:0 0 30px rgba(" + G + ",.4)}"

  var GAMES = {
    catch: { title: "Catch", blurb: "It runs from your cursor. Click it as many times as you can.", rule: "30 seconds", unit: "catches" },
    evade: { title: "Evade", blurb: "It hunts your cursor and keeps getting faster. Don't get caught.", rule: "Survive", unit: "seconds" },
    heist: { title: "Grid Heist", blurb: "It follows your cursor. Fly it onto the vault nodes before they fade.", rule: "30 seconds", unit: "nodes" },
  }
  var ORDER = ["catch", "evade", "heist"]

  function el(tag, cls, parent, html) {
    var n = document.createElement(tag)
    if (cls) n.className = cls
    if (html != null) n.innerHTML = html
    if (parent) parent.appendChild(n)
    return n
  }

  function best(kind, value) {
    var key = "cicada-best-" + kind
    try {
      var prev = parseFloat(localStorage.getItem(key) || "0") || 0
      if (value != null && value > prev) { localStorage.setItem(key, String(value)); return value }
      return prev
    } catch (e) { return value || 0 }
  }

  function fmt(kind, v) {
    return kind === "evade" ? v.toFixed(1) : String(Math.round(v))
  }

  var attached = false
  var mx = -1, my = -1
  var ui = null // current toast / modal root
  var running = null // current game

  function fly() {
    return window.CicadaFly && window.CicadaFly.current && window.CicadaFly.current.play
      ? window.CicadaFly.current
      : null
  }

  function canPlay() {
    return (
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
  }

  // ---- UI shells ---------------------------------------------------------------
  function closeUI() {
    if (!ui) return
    var node = ui
    ui = null
    node.classList.remove("cg-in")
    setTimeout(function () { node.remove() }, 300)
  }

  function modal(inner) {
    closeUI()
    var back = el("div", "cg-backdrop", document.body)
    back.setAttribute("role", "dialog")
    back.setAttribute("aria-modal", "true")
    var box = el("div", "cg-modal", back, inner)
    back.addEventListener("mousedown", function (e) { if (e.target === back) closeUI() })
    ui = back
    requestAnimationFrame(function () { back.classList.add("cg-in") })
    var first = box.querySelector("button")
    if (first) first.focus({ preventScroll: true })
    return box
  }

  function offer() {
    if (ui || running || !fly()) return
    try {
      if (sessionStorage.getItem("cicada-games-offered")) return
      sessionStorage.setItem("cicada-games-offered", "1")
    } catch (e) {}
    var toast = el(
      "div",
      "cg-toast",
      document.body,
      '<p class="cg-eyebrow">Restless cursor detected</p>' +
        '<p class="cg-q">Wanna play with the bug?</p>' +
        '<div class="cg-row"><button class="cg-btn cg-primary" data-a="play">Play</button>' +
        '<button class="cg-btn cg-ghost" data-a="no">Not now</button></div>',
    )
    toast.setAttribute("role", "status")
    ui = toast
    requestAnimationFrame(function () { toast.classList.add("cg-in") })
    var timer = setTimeout(function () { if (ui === toast) closeUI() }, 9000)
    toast.addEventListener("click", function (e) {
      var a = e.target.closest("[data-a]")
      if (!a) return
      clearTimeout(timer)
      if (a.dataset.a === "play") open()
      else closeUI()
    })
  }

  function open() {
    if (running) return
    if (!fly()) return
    var cards = ORDER.map(function (k) {
      var g = GAMES[k]
      var b = best(k)
      return (
        '<button class="cg-card" data-game="' + k + '"><b>' + g.title.toUpperCase() + "</b><span>" + g.blurb +
        "</span><i>" + g.rule + (b ? " · best " + fmt(k, b) : "") + "</i></button>"
      )
    }).join("")
    var box = modal(
      '<p class="cg-eyebrow">Side job</p><h2>Play with the bug</h2>' +
        '<p class="cg-sub">Pick a job. The cicada is already in position.</p>' +
        '<div class="cg-cards">' + cards + "</div>" +
        '<div class="cg-foot"><span>Esc to quit anytime</span><button class="cg-btn cg-ghost" data-a="close">Close</button></div>',
    )
    box.addEventListener("click", function (e) {
      var card = e.target.closest("[data-game]")
      if (card) return start(card.dataset.game)
      if (e.target.closest('[data-a="close"]')) closeUI()
    })
  }

  // ---- Game runner ---------------------------------------------------------------
  function start(kind) {
    var ctrl = fly()
    if (!ctrl) return closeUI()
    closeUI()

    var layer = el("div", "cg-layer", document.body)
    var hud = el("div", "cg-hud", document.body)
    var count = el("div", "cg-count", document.body)
    var g = GAMES[kind]
    var score = 0
    var elapsed = 0
    var live = false
    var raf = 0
    var last = 0
    var nodes = []
    var spawnIn = 0

    running = { kind: kind, end: end }

    function paint() {
      var time = kind === "evade" ? elapsed.toFixed(1) + "s" : Math.max(0, 30 - elapsed).toFixed(1) + "s"
      hud.innerHTML =
        "<span>" + g.title + "</span>" +
        "<span>" + (kind === "evade" ? "Survived" : "Score") + "<strong>" + (kind === "evade" ? time : score) + "</strong></span>" +
        (kind === "evade" ? "" : "<span>Time<strong>" + time + "</strong></span>") +
        "<span>Esc quits</span>"
    }
    paint()

    function float(x, y, text, miss) {
      var f = el("div", "cg-float" + (miss ? " cg-miss" : ""), document.body, text)
      f.style.left = x + "px"
      f.style.top = y + "px"
      setTimeout(function () { f.remove() }, 800)
    }

    function burst(x, y) {
      var b = el("div", "cg-burst", document.body)
      b.style.left = x + "px"
      b.style.top = y + "px"
      setTimeout(function () { b.remove() }, 500)
    }

    // Countdown; the bug gets out of the way while it runs.
    ctrl.play(kind === "catch" ? "flee" : kind === "evade" ? "flee" : "seek", { level: kind === "evade" ? 3 : 1 })
    var n = 3
    function tick() {
      if (!running) return
      count.innerHTML = "<span>" + (n > 0 ? n : "GO") + "</span>"
      if (n-- > 0) return setTimeout(tick, 800)
      setTimeout(function () { count.remove() }, 700)
      live = true
      if (kind === "evade") ctrl.play("chase", { level: 1 })
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    tick()

    function loop(now) {
      if (!running) return
      var dt = Math.min((now - last) / 1000, 0.05)
      last = now
      elapsed += dt
      var s = ctrl.state()

      if (kind === "evade") {
        ctrl.setLevel(1 + elapsed / 5)
        if (Math.hypot(s.x - mx, s.y - my) < 24) return end("Caught.")
      } else if (elapsed >= 30) {
        return end("Time.")
      }

      if (kind === "heist") {
        spawnIn -= dt
        if (spawnIn <= 0 && nodes.length < 3) {
          spawnNode()
          spawnIn = 0.9 + Math.random() * 0.6
        }
        nodes = nodes.filter(function (node) {
          node.life -= dt
          if (Math.hypot(node.x - s.x, node.y - s.y) < 28) {
            score++
            burst(node.x, node.y)
            float(node.x, node.y, "+1")
            node.el.remove()
            return false
          }
          if (node.life <= 0) { node.el.remove(); return false }
          node.el.style.opacity = Math.min(1, node.life / 1.2).toFixed(2)
          return true
        })
      }

      paint()
      raf = requestAnimationFrame(loop)
    }

    function spawnNode() {
      var cell = 18
      var W = window.innerWidth, H = window.innerHeight
      var x = Math.round((70 + Math.random() * (W - 140)) / cell) * cell
      var y = Math.round((110 + Math.random() * (H - 180)) / cell) * cell
      var node = { x: x, y: y, life: 4.5, el: el("div", "cg-node", document.body) }
      node.el.style.left = x + "px"
      node.el.style.top = y + "px"
      nodes.push(node)
    }

    function onDown(e) {
      e.preventDefault()
      if (!live || kind !== "catch") return
      var s = ctrl.state()
      if (Math.hypot(e.clientX - s.x, e.clientY - s.y) < s.width * 0.55) {
        score++
        burst(s.x, s.y)
        float(e.clientX, e.clientY, "+1")
        ctrl.scatter()
        ctrl.setLevel(1 + score * 0.3)
      } else {
        float(e.clientX, e.clientY, "miss", true)
      }
    }

    function onKey(e) {
      if (e.key === "Escape") end(null)
    }

    function onLeave(e) {
      if (live && kind === "evade" && !e.relatedTarget) end("You left the vault.")
    }

    layer.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    document.addEventListener("mouseout", onLeave)

    function end(reason) {
      if (!running) return
      running = null
      cancelAnimationFrame(raf)
      layer.remove()
      hud.remove()
      count.remove()
      nodes.forEach(function (node) { node.el.remove() })
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mouseout", onLeave)
      ctrl.stop()
      if (reason === null) return // quit with Esc: no results screen

      var final = kind === "evade" ? Math.round(elapsed * 10) / 10 : score
      var prev = best(kind)
      var top = best(kind, final)
      var record = final > prev && final > 0
      var box = modal(
        '<p class="cg-eyebrow">' + reason + "</p><h2>" + g.title + "</h2>" +
          '<p class="cg-big">' + fmt(kind, final) + "</p>" +
          '<p class="cg-sub">' + g.unit + (record ? " — new best!" : " · best " + fmt(kind, top)) + "</p>" +
          '<div class="cg-row"><button class="cg-btn cg-primary" data-a="again">Play again</button>' +
          '<button class="cg-btn" data-a="pick">Other games</button>' +
          '<button class="cg-btn cg-ghost" data-a="close">Done</button></div>',
      )
      box.addEventListener("click", function (e) {
        var a = e.target.closest("[data-a]")
        if (!a) return
        if (a.dataset.a === "again") start(kind)
        else if (a.dataset.a === "pick") open()
        else closeUI()
      })
    }
  }

  // ---- Restlessness detector ------------------------------------------------------
  // A moment is "erratic" when the last 1.4s of movement has many sharp direction
  // reversals and covers a lot of ground. The prompt needs that to hold for more
  // than RESTLESS_MS without a break; a pause longer than GRACE_MS resets it.
  // Ordinary reading, scrolling or pointing never gets close.
  var RESTLESS_MS = 5000
  var GRACE_MS = 700
  var samples = []
  var lastDx = 0, lastDy = 0
  var armedAt = 0
  var restlessSince = 0
  var lastErratic = 0

  function onMove(e) {
    if (e.pointerType !== "mouse") return
    var now = performance.now()
    if (mx >= 0) {
      var dx = e.clientX - mx, dy = e.clientY - my
      var turn = (Math.abs(dx) > 3 && dx * lastDx < 0) || (Math.abs(dy) > 3 && dy * lastDy < 0)
      samples.push({ t: now, d: Math.hypot(dx, dy), turn: turn })
      if (Math.abs(dx) > 3) lastDx = dx
      if (Math.abs(dy) > 3) lastDy = dy
    }
    mx = e.clientX
    my = e.clientY
    while (samples.length && now - samples[0].t > 1400) samples.shift()
    if (ui || running || now < armedAt) { restlessSince = 0; return }
    var turns = 0, path = 0
    for (var i = 0; i < samples.length; i++) { path += samples[i].d; if (samples[i].turn) turns++ }
    var erratic = turns >= 6 && path >= 900

    if (erratic) {
      if (!restlessSince || now - lastErratic > GRACE_MS) restlessSince = now
      lastErratic = now
      if (now - restlessSince >= RESTLESS_MS) {
        restlessSince = 0
        samples = []
        offer()
      }
    } else if (now - lastErratic > GRACE_MS) {
      restlessSince = 0
    }
  }

  function attach() {
    if (attached || !canPlay()) return
    attached = true
    if (!document.getElementById("cg-style")) {
      var style = el("style")
      style.id = "cg-style"
      style.textContent = CSS
      document.head.appendChild(style)
    }
    // Give the page a moment before listening: the teaser's intro, the hero.
    armedAt = performance.now() + 4000
    document.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && ui && !running) closeUI()
    })
  }

  window.CicadaGames = {
    attach: attach,
    open: function () {
      if (!canPlay()) return
      attach()
      open()
    },
  }
})()
