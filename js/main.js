(function () {
  "use strict";

  /* ---------------- helpers ---------------- */
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (v) =>
    String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Only allow safe URL schemes in links / images from js/data.js
  function safeUrl(u) {
    if (!u) return "";
    try {
      // Relative paths (e.g. "assets/resume.pdf") can't carry a dangerous scheme, so allow them as-is
      if (!/^[a-z][a-z0-9+.-]*:/i.test(String(u).trim())) return new URL(String(u), location.href).href;
      const url = new URL(String(u), location.href);
      return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.href : "";
    } catch (_) {
      return "";
    }
  }

  const asArray = (v) => (Array.isArray(v) ? v : typeof v === "string" && v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
  const range = (a, b) => [a, b].filter(Boolean).join(" — ");
  function toRoman(n) {
    const map = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let out = "";
    for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
    return out;
  }
  // First and last name initials: "Joseph Lawrence A. Santos" -> "JS"
  const initials = (name) => {
    const parts = String(name || "?").split(/\s+/).filter(Boolean);
    const picked = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
    return picked.map((p) => p[0].toUpperCase()).join("");
  };

  const ICONS = {
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    twitter: '<path d="M4 4l16 16M20 4 4 20"/>',
    website: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    location: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    award: '<circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  };
  const icon = (name, size = 20) =>
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  /* ---------------- toast ---------------- */
  let toastTimer;
  function toast(msg, type = "") {
    const el = $("#toast");
    el.textContent = msg;
    el.className = "toast is-visible" + (type ? " is-" + type : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.className = "toast"), 3800);
  }

  /* ---------------- data ---------------- */
  // All content lives in js/data.js — edit that file to update the site.
  function loadData() {
    return window.PORTFOLIO_DATA || {};
  }

  /* ---------------- section visibility ---------------- */
  function toggleSection(id, hasItems) {
    const section = document.getElementById(id);
    const link = $(`.nav__links a[href="#${id}"]`);
    if (section) section.hidden = !hasItems;
    if (link) link.hidden = !hasItems;
  }

  /* ---------------- renderers ---------------- */
  function socialLinks(p) {
    const items = [
      ["facebook", p.facebook, "Facebook"],
      ["github", p.github, "GitHub"],
      ["linkedin", p.linkedin, "LinkedIn"],
      ["twitter", p.twitter, "X / Twitter"],
      ["website", p.website, "Website"],
      ["mail", p.email ? "mailto:" + p.email : "", "Email"],
    ];
    return items
      .map(([ic, href, label]) => {
        const url = safeUrl(href);
        if (!url) return "";
        const ext = url.startsWith("http") ? ' target="_blank" rel="noopener"' : "";
        return `<a href="${esc(url)}" aria-label="${label}" title="${label}"${ext}>${icon(ic, 18)}</a>`;
      })
      .join("");
  }

  function renderProfile(p) {
    const name = p.full_name || "Your Name";
    document.title = p.role ? `${name} — ${p.role}` : name;
    const shortName = p.short_name || name;
    $("#brandName").textContent = shortName;
    $(".nav__logo").textContent = initials(name).charAt(0);
    $("#footerName").textContent = shortName;
    $("#heroName").textContent = name;
    $("#heroTagline").textContent = p.tagline || "";

    const avatar = safeUrl(p.avatar_url);
    $("#heroAvatar").innerHTML = avatar
      ? `<img src="${esc(avatar)}" alt="Portrait of ${esc(name)}" />`
      : `<div class="avatar__initials"><span class="gradient-text">${esc(initials(name))}</span></div>`;

    const resume = safeUrl(p.resume_url);
    const resumeBtn = $("#resumeBtn");
    if (resume) {
      resumeBtn.href = resume;
      resumeBtn.hidden = false;
    }

    const socials = socialLinks(p);
    $("#heroSocials").innerHTML = socials;
    $("#footerSocials").innerHTML = socials;

    $("#aboutBio").textContent = p.bio || "";

    const facts = [
      ["briefcase", "Current role", p.role],
      ["location", "Based in", p.location],
      ["mail", "Email", p.email],
      ["phone", "Phone", p.phone],
    ].filter((f) => f[2]);
    $("#aboutFacts").innerHTML = facts
      .map(([ic, label, val]) => `<li>${icon(ic)}<div><small>${label}</small>${esc(val)}</div></li>`)
      .join("");

    const contacts = [];
    if (p.email) contacts.push(`<li><a href="mailto:${esc(p.email)}">${icon("mail")}${esc(p.email)}</a></li>`);
    if (p.phone) contacts.push(`<li><a href="tel:${esc(String(p.phone).replace(/[^\d+]/g, ""))}">${icon("phone")}${esc(p.phone)}</a></li>`);
    const fb = safeUrl(p.facebook);
    if (fb) contacts.push(`<li><a href="${esc(fb)}" target="_blank" rel="noopener">${icon("facebook")}Facebook</a></li>`);
    if (p.location) contacts.push(`<li><span>${icon("location")}${esc(p.location)}</span></li>`);
    $("#contactList").innerHTML = contacts.join("");
  }

  function renderSkills(skills) {
    toggleSection("skills", skills.length > 0);
    const categories = ["All", ...new Set(skills.map((s) => s.category || "Other"))];
    const filters = $("#skillFilters");
    const grid = $("#skillsGrid");

    const draw = (cat) => {
      const shown = cat === "All" ? skills : skills.filter((s) => (s.category || "Other") === cat);
      grid.innerHTML = shown
        .map((s) => {
          // No level given: show the skill as a plain tile without a progress bar
          if (s.level == null || s.level === "") {
            return `<div class="card skill skill--plain reveal"><span class="skill__mark" aria-hidden="true"></span>${esc(s.name)}</div>`;
          }
          const lvl = Math.max(0, Math.min(100, Number(s.level) || 0));
          return `<div class="card skill reveal" style="--level:${lvl}%">
              <div class="skill__top"><span>${esc(s.name)}</span><span>${lvl}%</span></div>
              <div class="bar" role="progressbar" aria-label="${esc(s.name)}" aria-valuenow="${lvl}" aria-valuemin="0" aria-valuemax="100"><span></span></div>
            </div>`;
        })
        .join("");
      observeReveal(grid);
    };

    filters.innerHTML = categories
      .map((c, i) => `<button type="button" class="chip${i === 0 ? " is-active" : ""}" role="tab" aria-selected="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`)
      .join("");
    filters.onclick = (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      $$(".chip", filters).forEach((c) => {
        c.classList.toggle("is-active", c === btn);
        c.setAttribute("aria-selected", c === btn);
      });
      draw(btn.dataset.cat);
    };
    draw("All");
  }

  function renderProjects(items) {
    toggleSection("projects", items.length > 0);
    $("#projectsGrid").innerHTML = items
      .map((x) => {
        const highlights = asArray(x.highlights);
        const tech = asArray(x.tech);
        const url = safeUrl(x.url);
        return `<article class="card card--hover project reveal">
          <div class="project__role">${esc(x.role)}</div>
          <h3>${esc(x.title)}</h3>
          ${x.description ? `<p class="muted">${esc(x.description)}</p>` : ""}
          ${highlights.length ? `<ul class="project__list">${highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
          <div class="project__foot">
            ${tech.length ? `<div class="project__tech">${tech.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
            ${url ? `<a class="project__link" href="${esc(url)}" target="_blank" rel="noopener">View project ${icon("external", 14)}</a>` : ""}
          </div>
        </article>`;
      })
      .join("");
  }

  function renderExperience(items) {
    toggleSection("leadership", items.length > 0);
    $("#experienceList").innerHTML = items
      .map((x) => {
        const highlights = asArray(x.highlights);
        return `<li class="card timeline__item reveal">
          <div class="timeline__meta">
            <span>${icon("calendar", 16)} ${esc(range(x.start_date, x.end_date))}</span>
            ${x.location ? `<span>${icon("location", 16)} ${esc(x.location)}</span>` : ""}
          </div>
          <h3>${esc(x.role)}</h3>
          <div class="timeline__company">${esc(x.company)}</div>
          ${x.description ? `<p class="muted">${esc(x.description)}</p>` : ""}
          ${highlights.length ? `<ul>${highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
        </li>`;
      })
      .join("");
  }

  function renderEducation(items) {
    toggleSection("education", items.length > 0);
    $("#educationList").innerHTML = items
      .map((e) => {
        const logo = safeUrl(e.logo_url);
        return `<article class="card card--hover edu__card reveal">
          <div class="edu__top">
            <div class="edu__logo">${logo ? `<img src="${esc(logo)}" alt="" loading="lazy" />` : icon("cap", 24)}</div>
            <div>
              <div class="edu__date">${esc([range(e.start_date, e.end_date), e.location].filter(Boolean).join(" · "))}</div>
              ${e.grade ? `<span class="tag">${esc(e.grade)}</span>` : ""}
            </div>
          </div>
          <h3>${esc(e.degree)}${e.field ? ` in ${esc(e.field)}` : ""}</h3>
          <div class="edu__school">${esc(e.institution)}</div>
          ${e.description ? `<p>${esc(e.description)}</p>` : ""}
        </article>`;
      })
      .join("");
  }

  function renderCertificates(certs) {
    toggleSection("certificates", certs.length > 0);
    if (!certs.length) return;
    const carousel = $("#certCarousel");
    const track = $("#certificatesTrack");
    const dots = $("#certDots");
    const count = $("#certCount");
    const total = certs.length;

    track.innerHTML = certs
      .map((c, i) => {
        const img = safeUrl(c.image_url);
        const meta = [c.issuer, c.issue_date].filter(Boolean).map(esc).join(" · ");
        return `<li class="carousel__slide" aria-roledescription="slide" aria-label="${i + 1} of ${total}">
          <button type="button" class="card cert" data-index="${i}" aria-label="View certificate: ${esc(c.title)}">
            <div class="cert__media">
              ${img ? `<img src="${esc(img)}" alt="" loading="lazy" decoding="async" />` : `<div class="cert__placeholder">${icon("award", 56)}</div>`}
            </div>
            <div class="cert__body">
              ${c.kind ? `<span class="cert__kind">${esc(c.kind)}</span>` : ""}
              <h3>${esc(c.title)}</h3>
              ${meta ? `<span class="cert__date">${meta}</span>` : ""}
            </div>
          </button>
        </li>`;
      })
      .join("");
    dots.innerHTML = certs
      .map((c, i) => `<button type="button" class="carousel__dot" data-go="${i}" aria-label="Show certificate ${i + 1}: ${esc(c.title)}"></button>`)
      .join("");

    const slides = $$(".carousel__slide", track);
    const dotBtns = $$(".carousel__dot", dots);
    let current = -1;

    function setActive(i) {
      if (i === current) return;
      current = i;
      slides.forEach((s, k) => {
        const on = k === i;
        s.classList.toggle("is-active", on);
        // Only the centred certificate is tabbable; arrows and dots reach the rest
        $(".cert", s).tabIndex = on ? 0 : -1;
        s.setAttribute("aria-hidden", on ? "false" : "true");
      });
      dotBtns.forEach((d, k) => d.setAttribute("aria-current", k === i ? "true" : "false"));
      // Load the current slide and its neighbours so they're ready before they slide in
      [i - 1, i, i + 1].forEach((k) => {
        const im = $("img", slides[(k + total) % total]);
        if (im) im.loading = "eager";
      });
      count.textContent = `${toRoman(i + 1)} / ${toRoman(total)}`;
      count.title = `${i + 1} of ${total}`;
    }

    // While we scroll programmatically, don't let scroll-sync flick through the slides in between
    let steering = false, steerTimer = 0;
    const release = () => { steering = false; clearTimeout(steerTimer); };
    track.addEventListener("scrollend", release);

    function goTo(i, smooth = true) {
      const idx = (i + total) % total;
      const s = slides[idx];
      steering = true;
      clearTimeout(steerTimer);
      steerTimer = setTimeout(release, 900);
      track.scrollTo({
        left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2,
        behavior: smooth && !reduceMotion ? "smooth" : "auto",
      });
      setActive(idx);
    }

    // Keep the active slide in sync with swipes / trackpad scrolling
    let raf = 0;
    track.addEventListener(
      "scroll",
      () => {
        if (steering) return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const mid = track.scrollLeft + track.clientWidth / 2;
          let best = 0, bestDist = Infinity;
          slides.forEach((s, k) => {
            const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
            if (d < bestDist) { bestDist = d; best = k; }
          });
          setActive(best);
        });
      },
      { passive: true }
    );

    $$(".carousel__btn", carousel).forEach((b) =>
      b.addEventListener("click", () => {
        goTo(current + Number(b.dataset.dir));
        restart();
      })
    );
    dots.addEventListener("click", (e) => {
      const d = e.target.closest("[data-go]");
      if (!d) return;
      goTo(Number(d.dataset.go));
      restart();
    });
    carousel.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.target.closest("input, textarea")) return;
      e.preventDefault();
      goTo(current + (e.key === "ArrowRight" ? 1 : -1));
      const btn = $(".cert", slides[current]);
      if (track.contains(document.activeElement)) btn.focus({ preventScroll: true });
      restart();
    });

    /* --- autoplay: pauses on hover/focus, off-screen, hidden tab, or by the user --- */
    const DELAY = 5500;
    let timer = 0, userPaused = reduceMotion, hovering = false, focused = false, inView = false;
    const canPlay = () => !userPaused && !hovering && !focused && inView && !document.hidden && !$("#certModal").open;
    function restart() {
      clearInterval(timer);
      if (canPlay()) timer = setInterval(() => canPlay() && goTo(current + 1), DELAY);
    }
    carousel.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovering = true; restart(); } });
    carousel.addEventListener("pointerleave", () => { hovering = false; restart(); });
    carousel.addEventListener("focusin", () => { focused = true; restart(); });
    carousel.addEventListener("focusout", (e) => { if (!carousel.contains(e.relatedTarget)) { focused = false; restart(); } });
    track.addEventListener("touchstart", () => { userPaused = true; restart(); }, { passive: true });
    document.addEventListener("visibilitychange", restart);
    const loadAll = () => $$("img", track).forEach((im) => (im.loading = "eager"));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((en) => { inView = en[0].isIntersecting; restart(); }, { threshold: 0.35 }).observe(carousel);
      // Fetch every certificate image once the visitor is getting close, so slides never arrive blank
      const near = new IntersectionObserver((en) => { if (en[0].isIntersecting) { loadAll(); near.disconnect(); } }, { rootMargin: "800px 0px" });
      near.observe(carousel);
    } else { inView = true; loadAll(); }

    // Re-centre after layout changes (resize, font load)
    window.addEventListener("resize", () => current >= 0 && goTo(current, false));
    setActive(0);
    requestAnimationFrame(() => goTo(0, false));

    /* --- viewer --- */
    const modal = $("#certModal");
    track.onclick = (e) => {
      const card = e.target.closest(".cert");
      if (!card) return;
      const i = Number(card.dataset.index);
      // Clicking a peeking neighbour brings it to the centre instead of opening it
      if (i !== current) {
        goTo(i);
        restart();
        return;
      }
      const c = certs[i];
      const img = safeUrl(c.image_url);
      const verify = safeUrl(c.credential_url);
      $("#certModalContent").innerHTML = `
        ${img ? `<img class="modal__img" src="${esc(img)}" alt="Certificate: ${esc(c.title)}" />` : ""}
        <p class="eyebrow">${esc(c.kind || "Certificate")}</p>
        <h3 id="certModalTitle" style="font-size:1.4rem;padding-right:40px">${esc(c.title)}</h3>
        ${c.description ? `<p class="muted">${esc(c.description)}</p>` : ""}
        <dl>
          ${c.issuer ? `<dt>Issued by</dt><dd>${esc(c.issuer)}</dd>` : ""}
          ${c.issue_date ? `<dt>Issued</dt><dd>${esc(c.issue_date)}</dd>` : ""}
          ${c.credential_id ? `<dt>Credential ID</dt><dd>${esc(c.credential_id)}</dd>` : ""}
        </dl>
        ${verify ? `<a class="btn btn--primary" href="${esc(verify)}" target="_blank" rel="noopener">${icon("external", 16)} Verify credential</a>` : ""}`;
      if (typeof modal.showModal === "function") modal.showModal();
      else modal.setAttribute("open", "");
      restart();
    };
    modal.addEventListener("click", (e) => {
      // close on backdrop click or close button
      if (e.target === modal || e.target.closest("[data-close]")) modal.close();
    });
    modal.addEventListener("close", restart);
  }

  /* ---------------- reveal on scroll ---------------- */
  const revealObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (en.isIntersecting) {
                en.target.classList.add("is-visible");
                revealObserver.unobserve(en.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        )
      : null;

  function observeReveal(root = document) {
    $$(".reveal:not(.is-visible)", root).forEach((el, i) => {
      if (!revealObserver) return el.classList.add("is-visible");
      el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
      revealObserver.observe(el);
    });
  }

  /* ---------------- UI chrome ---------------- */
  function setupTheme() {
    const btn = $("#themeToggle");
    const current = () =>
      document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    btn.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (_) {}
    });
  }

  function setupNav() {
    const nav = $("#nav");
    const links = $("#navLinks");
    const menuBtn = $("#menuToggle");
    const progress = $("#scrollProgress");
    const toTop = $("#toTop");

    const closeMenu = () => {
      links.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    };
    menuBtn.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", (e) => e.target.closest("a") && closeMenu());
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
          nav.classList.toggle("is-scrolled", y > 8);
          toTop.classList.toggle("is-visible", y > 600);
          ticking = false;
        });
      },
      { passive: true }
    );
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    // Highlight the nav link of the section in view
    if ("IntersectionObserver" in window) {
      const map = new Map($$(".nav__links a").map((a) => [a.getAttribute("href").slice(1), a]));
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            map.forEach((a) => a.classList.remove("is-active"));
            const link = map.get(en.target.id);
            if (link) link.classList.add("is-active");
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      $$("main section[id]").forEach((s) => spy.observe(s));
    }
  }

  // No backend: the form composes an email in the visitor's mail app, addressed to profile.email
  function setupContact(profile) {
    const form = $("#contactForm");
    const note = $("#formNote");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (data.company) return; // honeypot triggered — silently ignore bots

      // validation
      let ok = true;
      $$(".field", form).forEach((f) => f.classList.remove("has-error"));
      const fail = (name) => {
        form.elements[name].closest(".field").classList.add("has-error");
        ok = false;
      };
      if (!String(data.name || "").trim()) fail("name");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email || "").trim())) fail("email");
      if (!String(data.message || "").trim()) fail("message");
      if (!ok) {
        note.textContent = "Please fill in your name, a valid email and a message.";
        return;
      }
      if (!profile.email) {
        toast("No contact email is set in js/data.js.", "error");
        return;
      }

      const name = data.name.trim();
      const email = data.email.trim();
      const subject = String(data.subject || "").trim() || "Hello from your portfolio";
      const body = `${data.message.trim()}\n\n— ${name} (${email})`;
      location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      note.textContent = "Opening your email app…";
    });
  }

  /* ---------------- boot ---------------- */
  function init() {
    const year = new Date().getFullYear();
    const yearEl = $("#year");
    yearEl.textContent = toRoman(year);
    yearEl.title = String(year);
    setupTheme();
    setupNav();
    observeReveal();

    const data = loadData();
    renderProfile(data.profile || {});
    renderSkills(data.skills || []);
    renderProjects(data.projects || []);
    renderExperience(data.leadership || data.experience || []);
    renderEducation(data.education || []);
    renderCertificates(data.certificates || []);
    observeReveal();
    setupContact(data.profile || {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
