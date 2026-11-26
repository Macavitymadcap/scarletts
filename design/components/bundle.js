/* @ds-bundle: {"format":4,"namespace":"Scarletts","components":[{"name":"Button"},{"name":"Nav"},{"name":"Tape"},{"name":"Sticker"},{"name":"GigCard"},{"name":"Photo"},{"name":"Checkerboard"},{"name":"Tricolour"},{"name":"TrackList"},{"name":"LineUp"},{"name":"Reviews"},{"name":"PhotoGrid"}]} */
/* @ds-source-sha256: 7887175b8dc5986d83553d064ff7ccdc4f7716051d1bd3b3443096bae71f8e6f */
(() => {
  var { defineProperty: d, getOwnPropertyNames: C, getOwnPropertyDescriptor: G } = Object, L = Object.prototype.hasOwnProperty;
  function R(s) {
    return this[s];
  }
  var B = (s) => {
    var t = (_ ??= /* @__PURE__ */ new WeakMap).get(s), a;
    if (t)
      return t;
    if (t = d({}, "__esModule", { value: !0 }), s && typeof s === "object" || typeof s === "function") {
      for (var r of C(s))
        if (!L.call(t, r))
          d(t, r, {
            get: R.bind(s, r),
            enumerable: !(a = G(s, r)) || a.enumerable
          });
    }
    return _.set(s, t), t;
  }, _;
  var M = (s) => s;
  function z(s, t) {
    this[s] = M.bind(null, t);
  }
  var q = (s, t) => {
    for (var a in t)
      d(s, a, {
        get: t[a],
        enumerable: !0,
        configurable: !0,
        set: z.bind(t, a)
      });
  };

  // design/components/src/index.tsx
  var U = {};
  q(U, {
    Button: () => o,
    Checkerboard: () => k,
    GigCard: () => f,
    LineUp: () => x,
    Nav: () => v,
    Photo: () => y,
    PhotoGrid: () => S,
    ReviewQuote: () => P,
    Reviews: () => T,
    Sticker: () => g,
    Tape: () => p,
    TrackList: () => w,
    Tricolour: () => b
  });
  var N = window.React, { createElement: e, Fragment: E } = N, l = (...s) => s.filter(Boolean).join(" ");
  function o({
    variant: s = "primary",
    href: t,
    children: a,
    className: r,
    ...n
  }) {
    let i = l("sc-btn", `sc-btn--${s}`, r);
    return t ? /* @__PURE__ */ e("a", {
      ...n,
      href: t,
      className: i
    }, a) : /* @__PURE__ */ e("button", {
      type: "button",
      ...n,
      className: i
    }, a);
  }
  function v({ links: s, homeHref: t = "/" }) {
    return /* @__PURE__ */ e("nav", {
      className: "sc-nav",
      "aria-label": "Main"
    }, /* @__PURE__ */ e("a", {
      className: "sc-nav__name",
      href: t
    }, "Scarletts"), /* @__PURE__ */ e("ul", {
      className: "sc-nav__links"
    }, s.map((a) => /* @__PURE__ */ e("li", {
      key: a.href
    }, /* @__PURE__ */ e("a", {
      href: a.href,
      "aria-current": a.current ? "page" : void 0
    }, a.label)))));
  }
  function p({ tone: s = "ink", tilt: t = "left", children: a }) {
    return /* @__PURE__ */ e("span", {
      className: l("sc-tape", `sc-tape--${s}`, `sc-tape--${t}`)
    }, a);
  }
  function g({ tone: s = "gold", children: t }) {
    return /* @__PURE__ */ e("span", {
      className: l("sc-sticker", `sc-sticker--${s}`)
    }, t);
  }
  function f({
    date: s,
    weekday: t,
    day: a,
    month: r,
    venue: n,
    city: i,
    details: c,
    ticket: u,
    eventHref: m
  }) {
    return /* @__PURE__ */ e("article", {
      className: "sc-gig"
    }, /* @__PURE__ */ e("time", {
      className: "sc-gig__date",
      dateTime: s
    }, /* @__PURE__ */ e("span", {
      className: "sc-gig__weekday"
    }, t), /* @__PURE__ */ e("span", {
      className: "sc-gig__day"
    }, a), /* @__PURE__ */ e("span", {
      className: "sc-gig__month"
    }, r)), /* @__PURE__ */ e("div", {
      className: "sc-gig__body"
    }, /* @__PURE__ */ e("h3", {
      className: "sc-gig__venue"
    }, n), /* @__PURE__ */ e("p", {
      className: "sc-gig__city"
    }, i), c && /* @__PURE__ */ e("p", {
      className: "sc-gig__details"
    }, c), /* @__PURE__ */ e("div", {
      className: "sc-gig__action"
    }, u?.status === "on-sale" ? /* @__PURE__ */ e(o, {
      href: u.href
    }, "Get tickets") : u?.status === "sold-out" ? /* @__PURE__ */ e(p, {
      tone: "ink",
      tilt: "left"
    }, "Sold out") : m ? /* @__PURE__ */ e(o, {
      href: m
    }, "Event page") : null)));
  }
  function y({
    src: s,
    full: t,
    alt: a,
    width: r,
    height: n,
    credit: i,
    sticker: c
  }) {
    return /* @__PURE__ */ e("figure", {
      className: "sc-photo"
    }, /* @__PURE__ */ e("div", {
      className: "sc-photo__frame"
    }, /* @__PURE__ */ e("img", {
      src: s,
      srcSet: t ? `${s} 800w, ${t} 1600w` : void 0,
      sizes: t ? "(min-width: 800px) 40vw, 100vw" : void 0,
      alt: a,
      width: r,
      height: n,
      loading: "lazy"
    }), c && /* @__PURE__ */ e("span", {
      className: "sc-photo__sticker"
    }, /* @__PURE__ */ e(g, null, c))), i && /* @__PURE__ */ e("figcaption", {
      className: "sc-photo__credit"
    }, i));
  }
  function k({ rows: s = 1 }) {
    return /* @__PURE__ */ e("div", {
      className: "sc-checker",
      "aria-hidden": "true",
      style: { height: `calc(var(--space-8) * ${s})` }
    });
  }
  function b() {
    return /* @__PURE__ */ e("div", {
      className: "sc-tricolour",
      "aria-hidden": "true"
    }, /* @__PURE__ */ e("span", null), /* @__PURE__ */ e("span", null), /* @__PURE__ */ e("span", null));
  }
  function w({ tracks: s }) {
    return /* @__PURE__ */ e("ol", {
      className: "sc-tracks"
    }, s.map((t, a) => /* @__PURE__ */ e("li", {
      className: "sc-track",
      key: t.src
    }, /* @__PURE__ */ e("span", {
      className: "sc-track__num",
      "aria-hidden": "true"
    }, String(a + 1).padStart(2, "0")), /* @__PURE__ */ e("div", {
      className: "sc-track__info"
    }, /* @__PURE__ */ e("div", {
      className: "sc-track__head"
    }, /* @__PURE__ */ e("h3", {
      className: "sc-track__title"
    }, t.title), t.isNew && /* @__PURE__ */ e(p, {
      tone: "scarlet",
      tilt: "right"
    }, "New")), t.note && /* @__PURE__ */ e("p", {
      className: "sc-track__note"
    }, t.note)), /* @__PURE__ */ e("span", {
      className: "sc-track__time"
    }, /* @__PURE__ */ e("span", {
      className: "sc-visually-hidden"
    }, "Length "), t.duration), /* @__PURE__ */ e("audio", {
      className: "sc-track__audio",
      controls: !0,
      preload: "none",
      src: t.src,
      "aria-label": `Play ${t.title}`
    }))));
  }
  function x({ members: s }) {
    return /* @__PURE__ */ e("ul", {
      className: "sc-lineup"
    }, s.map((t) => /* @__PURE__ */ e("li", {
      className: "sc-lineup__member",
      key: t.name
    }, t.photo ? /* @__PURE__ */ e("div", {
      className: "sc-lineup__photo"
    }, /* @__PURE__ */ e("img", {
      src: t.photo.src,
      alt: t.photo.alt,
      width: t.photo.width,
      height: t.photo.height,
      loading: "lazy"
    })) : /* @__PURE__ */ e("div", {
      className: "sc-lineup__photo sc-lineup__photo--empty",
      "aria-hidden": "true"
    }, t.name.charAt(0)), /* @__PURE__ */ e("div", {
      className: "sc-lineup__text"
    }, /* @__PURE__ */ e("span", {
      className: "sc-lineup__role"
    }, t.role), /* @__PURE__ */ e("h3", {
      className: "sc-lineup__name"
    }, t.name), t.bio && /* @__PURE__ */ e("p", {
      className: "sc-lineup__bio"
    }, t.bio)))));
  }
  function P({ review: s }) {
    return /* @__PURE__ */ e("figure", {
      className: "sc-review"
    }, /* @__PURE__ */ e("blockquote", {
      className: "sc-review__quote",
      cite: s.citation
    }, /* @__PURE__ */ e("p", {
      className: "sc-review__content"
    }, s.content)), /* @__PURE__ */ e("figcaption", {
      className: "sc-review__source"
    }, s.citation ? /* @__PURE__ */ e("a", {
      href: s.citation
    }, s.source) : s.source));
  }
  function T({ reviews: s }) {
    return /* @__PURE__ */ e("ul", {
      className: "sc-reviews"
    }, s.map((t) => /* @__PURE__ */ e("li", {
      className: "sc-reviews__item",
      key: t.content
    }, /* @__PURE__ */ e(P, {
      review: t
    }))));
  }
  function S({ photos: s, feature: t = !0 }) {
    return /* @__PURE__ */ e("ul", {
      className: l("sc-grid", t && "sc-grid--feature")
    }, s.map((a) => /* @__PURE__ */ e("li", {
      className: "sc-grid__item",
      key: a.src
    }, /* @__PURE__ */ e("a", {
      className: "sc-grid__link",
      href: a.full ?? a.src
    }, /* @__PURE__ */ e("img", {
      src: a.src,
      alt: a.alt,
      width: a.width,
      height: a.height,
      loading: "lazy"
    })))));
  }
  var F = {
    Button: o,
    Nav: v,
    Tape: p,
    Sticker: g,
    GigCard: f,
    Photo: y,
    Checkerboard: k,
    Tricolour: b,
    TrackList: w,
    LineUp: x,
    Reviews: T,
    PhotoGrid: S
  };
  window.Scarletts = Object.assign(window.Scarletts || {}, F);
})();
