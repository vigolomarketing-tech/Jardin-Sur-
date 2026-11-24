/* Jardín Sur — lógica de la web. Todo el contenido sale de CONFIG (data.js). */
(() => {
  const C = CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => "$ " + Math.round(n).toLocaleString("es-AR");
  const wa = msg => `https://wa.me/${C.contacto.whatsapp}?text=${encodeURIComponent(msg)}`;
  const el = (tag, attrs = {}, html = "") => {
    const e = document.createElement(tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html) e.innerHTML = html;
    return e;
  };
  const planTotal = (precio, p) => Math.round(precio * p.factor / 1000) * 1000;

  /* ---------- Config básica: colores, textos, enlaces ---------- */
  const root = document.documentElement.style;
  root.setProperty("--c1", C.colores.primario);
  root.setProperty("--wood", C.colores.madera);
  root.setProperty("--bg", C.colores.fondo);
  root.setProperty("--text", C.colores.texto);
  document.title = C.seo.titulo;

  $$('[data-cfg="eslogan"]').forEach(e => (e.textContent = C.negocio.eslogan));
  $$('[data-cfg="rubro-localidad"]').forEach(e => (e.textContent = `${C.negocio.rubro} · ${C.negocio.localidad}`));
  $$("[data-wa]").forEach(a => {
    a.href = wa(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $("#anio").textContent = new Date().getFullYear();

  /* ---------- Menú celular ---------- */
  const menu = $("#menu"), mbtn = $(".menu-btn");
  const setMenu = open => {
    menu.classList.toggle("open", open);
    mbtn.setAttribute("aria-expanded", open);
    mbtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mbtn.firstElementChild.firstElementChild.setAttribute("href", open ? "#i-close" : "#i-menu");
  };
  mbtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Horarios y "abierto ahora" (hora de Argentina) ---------- */
  const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const toMin = h => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
  function ahoraAR() {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Argentina/Buenos_Aires", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const g = t => parts.find(p => p.type === t).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday"));
    return { day, min: +g("hour") * 60 + +g("minute") };
  }
  function estado() {
    const { day, min } = ahoraAR();
    const now = day * 1440 + min, WEEK = 10080;
    let open = null, nextStart = Infinity;
    for (let d = 0; d < 7; d++) {
      for (const [a, b] of C.horarios[d] || []) {
        const s = d * 1440 + toMin(a);
        let e = d * 1440 + toMin(b);
        if (e <= s) e += 1440;
        for (const off of [0, WEEK]) {
          if (now + off >= s && now + off < e) open = e - off;
          const ns = s - now + (s - now < 0 ? WEEK : 0);
          if (ns >= 0 && ns < nextStart) nextStart = ns;
        }
      }
    }
    const fmt = m => { m = ((m % 1440) + 1440) % 1440; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; };
    if (open !== null) return { abierto: true, texto: `Abierto ahora · cerramos a las ${fmt(open)} hs` };
    if (nextStart === Infinity) return { abierto: false, texto: "Cerrado" };
    const t = now + nextStart, dia = Math.floor((t % WEEK) / 1440);
    const cuando = dia === day && nextStart < 1440 ? "hoy" : dia === (day + 1) % 7 ? "mañana" : DIAS[dia].toLowerCase();
    return { abierto: false, texto: `Cerrado ahora · abrimos ${cuando} a las ${fmt(t)} hs` };
  }
  function pintarEstado() {
    const s = estado();
    $$("#openBadge,#openBadge2").forEach(b => { b.textContent = s.texto; b.classList.toggle("is-open", s.abierto); });
  }
  pintarEstado(); setInterval(pintarEstado, 60000);

  const hoy = ahoraAR().day;
  $("#hours").innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => {
    const t = (C.horarios[d] || []);
    const txt = t.length ? t.map(([a, b]) => `${a.replace(/^0/, "")} a ${b.replace(/^0/, "")}`).join(" y ") + " hs" : "Cerrado";
    return `<tr class="${d === hoy ? "hoy" : ""}"><td>${DIAS[d]}</td><td>${txt}</td></tr>`;
  }).join("");

  /* ---------- Stats con contador ---------- */
  const statsBox = $("#stats");
  C.stats.forEach(s => {
    const d = el("div", { class: "stat reveal" }, `<div class="n" data-v="${s.valor}" data-p="${s.prefijo}" data-s="${s.sufijo}">${s.prefijo}${s.valor}${s.sufijo}</div><div class="l">${s.etiqueta}</div>`);
    statsBox.append(d);
  });
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function contar(n) {
    if (reduce) return;
    const v = +n.dataset.v, t0 = performance.now(), dur = 1200;
    const paso = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      n.textContent = n.dataset.p + Math.round(v * e) + n.dataset.s;
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  /* ---------- Catálogo ---------- */
  const grid = $("#catalogo"), filtros = $("#filtros");
  const cuotaMax = C.financiacion.planes[C.financiacion.planes.length - 1];
  function precioHtml(p) {
    if (p.precio == null) return `<div class="price">Consultá el precio<small>Se presupuesta según tus medidas</small></div>`;
    const t = planTotal(p.precio, cuotaMax);
    return `<div class="price">${money(p.precio)}<small>${C.financiacion.contado} · o ${cuotaMax.cuotas} cuotas de ${money(t / cuotaMax.cuotas)}</small></div>`;
  }
  function tarjeta(p) {
    const a = el("article", { class: "card", "data-cat": p.categoria });
    a.innerHTML = `
      <button class="card-media" type="button" data-open="${p.id}" aria-label="Ver detalle de ${p.nombre}">
        <img src="${p.fotos[0]}" alt="${p.nombre}: ${p.subtitulo.toLowerCase()}" width="800" height="1000" loading="lazy">
        ${p.etiqueta ? `<span class="badge">${p.etiqueta}</span>` : ""}
        ${p.fotos.length > 1 ? `<span class="fotos-n">${p.fotos.length} fotos</span>` : ""}
      </button>
      <div class="card-body">
        <p class="card-cat">${p.categoria}</p>
        <h3>${p.nombre}</h3>
        <p class="card-sub">${p.subtitulo}</p>
        ${precioHtml(p)}
      </div>
      <div class="card-actions">
        <button class="btn btn-ghost" type="button" data-open="${p.id}">Ver detalle</button>
        <a class="btn wa-mini" href="${wa(consulta(p))}" target="_blank" rel="noopener" aria-label="Consultar por ${p.nombre} por WhatsApp"><svg class="ico"><use href="#i-wa"/></svg></a>
      </div>`;
    return a;
  }
  function consulta(p) {
    return `¡Hola Jardín Sur! Vi su web y quiero consultar por ${p.nombre}${p.precio != null ? " (" + money(p.precio) + ")" : ""}. ¿Está disponible?`;
  }
  function pintarCatalogo(cat) {
    grid.innerHTML = "";
    C.productos.filter(p => cat === "Todos" || p.categoria === cat).forEach(p => grid.append(tarjeta(p)));
    $$(".chip", filtros).forEach(c => c.setAttribute("aria-pressed", c.dataset.cat === cat));
  }
  ["Todos", ...C.categorias].forEach(c => filtros.append(el("button", { class: "chip", type: "button", "data-cat": c, "aria-pressed": c === "Todos" }, c)));
  filtros.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) pintarCatalogo(b.dataset.cat); });
  pintarCatalogo("Todos");
  $("#tambien").innerHTML = `<b>También fabricamos:</b> ${C.tambien.join(" · ")}. Consultanos por WhatsApp.`;

  /* ---------- Modal de producto ---------- */
  const modal = $("#modal");
  function abrir(id) {
    const p = C.productos.find(x => x.id === id); if (!p) return;
    $("#mCat").textContent = p.categoria;
    $("#mTitulo").textContent = p.nombre;
    $("#mSub").textContent = p.subtitulo;
    $("#mDesc").textContent = p.descripcion;
    $("#mChips").innerHTML = p.caracteristicas.map(c => `<li>${c}</li>`).join("");
    $("#mTrack").innerHTML = p.fotos.map((f, i) => `<img src="${f}" alt="${p.nombre}, foto ${i + 1}" width="800" height="1000" ${i ? 'loading="lazy"' : ""}>`).join("");
    $("#mTrack").scrollLeft = 0;
    $("#mThumbs").innerHTML = p.fotos.length > 1 ? p.fotos.map((f, i) => `<button type="button" data-i="${i}" aria-label="Ver foto ${i + 1}" ${i === 0 ? 'aria-current="true"' : ""}><img src="${f}" alt="" width="64" height="64"></button>`).join("") : "";
    if (p.precio == null) {
      $("#mPrecio").innerHTML = `<div class="m-consulta">Este trabajo se presupuesta según tus medidas. Escribinos y te pasamos el precio.</div>`;
    } else {
      const filas = C.financiacion.planes.map(pl => { const t = planTotal(p.precio, pl); return `<tr><td>${pl.cuotas} cuotas de ${money(t / pl.cuotas)}</td><td>${money(t)}</td></tr>`; }).join("");
      $("#mPrecio").innerHTML = `<div class="m-price"><div class="big">${money(p.precio)}<small>${C.financiacion.contado}</small></div><table><tbody>${filas}</tbody></table></div>`;
    }
    $("#mWa").href = wa(consulta(p));
    modal.showModal();
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) abrir(b.dataset.open); });
  modal.addEventListener("click", e => {
    if (e.target === modal || e.target.closest("[data-close]")) return modal.close();
    const t = e.target.closest("#mThumbs button");
    if (t) { const tr = $("#mTrack"); tr.scrollTo({ left: tr.clientWidth * t.dataset.i, behavior: "smooth" }); }
  });
  $("#mTrack").addEventListener("scroll", e => {
    const i = Math.round(e.target.scrollLeft / e.target.clientWidth);
    $$("#mThumbs button").forEach((b, k) => b.setAttribute("aria-current", k === i ? "true" : "false"));
  }, { passive: true });

  /* ---------- Calculadora de cuotas ---------- */
  const conPrecio = C.productos.filter(p => p.precio != null);
  const sel = $("#calcModelo"), planesBox = $("#calcPlanes");
  sel.innerHTML = conPrecio.map(p => `<option value="${p.id}">${p.nombre} — ${money(p.precio)}</option>`).join("");
  const planes = [{ cuotas: 0, factor: 1 }, ...C.financiacion.planes];
  planesBox.innerHTML = planes.map((pl, i) => `<label class="plan"><input type="radio" name="plan" value="${pl.cuotas}" ${i === planes.length - 1 ? "checked" : ""}><span>${pl.cuotas ? pl.cuotas : "Contado"}<small>${pl.cuotas ? "cuotas" : "efectivo / transf."}</small></span></label>`).join("");
  function calcular() {
    const p = conPrecio.find(x => x.id === sel.value);
    const pl = planes.find(x => x.cuotas === +$('input[name="plan"]:checked', planesBox).value);
    const total = planTotal(p.precio, pl);
    if (pl.cuotas) {
      $("#outLabel").textContent = `Tu cuota · ${pl.cuotas} cuotas`;
      $("#outBig").textContent = money(total / pl.cuotas);
      $("#outSub").textContent = `Total financiado: ${money(total)}`;
    } else {
      $("#outLabel").textContent = "Pagás de contado";
      $("#outBig").textContent = money(total);
      $("#outSub").textContent = "Efectivo o transferencia";
    }
    $("#calcWa").href = wa(`¡Hola Jardín Sur! Me interesa ${p.nombre} ${pl.cuotas ? "en " + pl.cuotas + " cuotas (" + money(total) + " en total)" : "de contado (" + money(total) + ")"}. ¿Cómo seguimos?`);
  }
  sel.addEventListener("change", calcular);
  planesBox.addEventListener("change", calcular);
  calcular();

  /* ---------- Formulario a medida → WhatsApp ---------- */
  $("#formMedida").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, nombre = f.nombre.value.trim(), loc = f.localidad.value.trim();
    [f.nombre, f.localidad].forEach(i => i.classList.toggle("invalid", !i.value.trim()));
    if (!nombre || !loc) { $("#formNote").textContent = "Completá tu nombre y tu localidad para poder escribirte."; return; }
    $("#formNote").textContent = "";
    const msg = `¡Hola Jardín Sur! Quiero pedir un presupuesto a medida.\n• Nombre: ${nombre}\n• Localidad: ${loc}\n• Necesito: ${f.tipo.value}\n• Medidas / comentarios: ${f.comentario.value.trim() || "(te las mando por acá)"}`;
    window.open(wa(msg), "_blank", "noopener");
  });

  /* ---------- Reseñas (si hay) ---------- */
  if (C.resenas.length) {
    $("#resenas").hidden = false;
    $("#reviews").innerHTML = C.resenas.map(r => `<figure class="review reveal" style="margin:0"><div class="stars" aria-label="${r.estrellas} estrellas">${"★".repeat(r.estrellas)}</div><blockquote style="margin:0">${r.texto}</blockquote><b>${r.autor}</b></figure>`).join("");
  }

  /* ---------- Instagram ---------- */
  $("#igBtn").href = C.contacto.instagram;
  $("#igBtn span").textContent = `Seguinos ${C.contacto.instagramUsuario}`;
  $("#igGrid").innerHTML = C.instagramFotos.map(f => `<a href="${C.contacto.instagram}" target="_blank" rel="noopener" aria-label="Ver más en Instagram"><img src="${f.src}" alt="${f.alt}" width="400" height="400" loading="lazy"></a>`).join("");

  /* ---------- Showroom, FAQ, footer ---------- */
  $("#showroomTxt").textContent = `${C.showroom.detalle} ${C.contacto.referencia}.`;
  const si = $("#showroomImg"); si.src = C.showroom.foto; si.alt = C.showroom.alt;
  $("#addr").textContent = `${C.contacto.direccion} (${C.contacto.referencia})`;
  $("#comoLlegar").href = C.contacto.mapsLink;
  $("#llamar").href = "tel:" + C.contacto.telefono.replace(/[^\d+]/g, "");
  $("#mapa").src = C.contacto.mapsEmbed;
  $("#faqList").innerHTML = C.faq.map(q => `<details class="reveal"><summary>${q.p}</summary><p>${q.r}</p></details>`).join("");
  $("#fWa").href = wa(C.contacto.mensajeWhatsapp);
  const ft = $("#fTel"); ft.href = "tel:" + C.contacto.telefono.replace(/[^\d+]/g, ""); ft.textContent = C.contacto.telefono;
  const fi = $("#fIg"); fi.href = C.contacto.instagram; fi.textContent = "Instagram " + C.contacto.instagramUsuario;
  $("#fDir").textContent = C.contacto.direccion;
  $("#fMapa").href = C.contacto.mapsLink;

  /* ---------- SEO: JSON-LD desde CONFIG ---------- */
  const [calle, loc, region] = C.contacto.direccion.split(",").map(s => s.trim());
  const ld = {
    "@context": "https://schema.org", "@type": C.seo.tipoSchema, name: C.negocio.nombre,
    description: C.seo.descripcion, image: new URL(C.seo.ogImage, location.href).href, url: location.href.split("#")[0],
    telephone: C.contacto.telefono, sameAs: [C.contacto.instagram],
    address: { "@type": "PostalAddress", streetAddress: calle, addressLocality: loc, addressRegion: region, addressCountry: "AR" },
    openingHoursSpecification: Object.entries(C.horarios).flatMap(([d, ts]) => ts.map(([a, b]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d], opens: a, closes: b }))),
  };
  document.head.append(Object.assign(document.createElement("script"), { type: "application/ld+json", textContent: JSON.stringify(ld) }));

  /* ---------- Reveal + contadores ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    const n = $(".n", en.target); if (n) contar(n);
    io.unobserve(en.target);
  }), { threshold: .15 });
  $$(".reveal").forEach(x => io.observe(x));

  /* ---------- Brasas en el hero ---------- */
  const cv = $("#embers");
  if (cv && !reduce) {
    const ctx = cv.getContext("2d"), hero = $(".hero");
    const spr = document.createElement("canvas"); spr.width = spr.height = 32;
    const sc = spr.getContext("2d"), g = sc.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(255,210,120,1)"); g.addColorStop(.35, "rgba(255,110,30,.7)"); g.addColorStop(1, "rgba(255,80,10,0)");
    sc.fillStyle = g; sc.fillRect(0, 0, 32, 32);
    let W, H, ps = [], run = false, raf;
    const size = () => { const r = hero.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = cv.width = r.width * d; H = cv.height = r.height * d; cv.dpr = d; };
    const nuevo = (y) => ({ x: Math.random() * W, y: y ?? H + Math.random() * 40, r: (3 + Math.random() * 9) * cv.dpr, v: (.25 + Math.random() * .8) * cv.dpr, a: .25 + Math.random() * .6, f: Math.random() * 6.28 });
    const init = () => { size(); ps = Array.from({ length: Math.round(Math.min(46, W / 28 / cv.dpr + 12)) }, () => nuevo(Math.random() * H)); };
    const tick = t => {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.y -= p.v; p.x += Math.sin(t / 900 + p.f) * .4 * cv.dpr;
        if (p.y < -20) Object.assign(p, nuevo());
        ctx.globalAlpha = p.a * Math.min(1, p.y / (H * .5));
        ctx.drawImage(spr, p.x, p.y, p.r * 2, p.r * 2);
      }
      raf = run ? requestAnimationFrame(tick) : 0;
    };
    init();
    new IntersectionObserver(([en]) => { run = en.isIntersecting; if (run && !raf) raf = requestAnimationFrame(tick); }).observe(hero);
    addEventListener("resize", init);
  }
})();
