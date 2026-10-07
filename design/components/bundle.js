/* @ds-bundle: {"format":4,"namespace":"Scarletts","components":[{"name":"Button"},{"name":"Nav"},{"name":"Tape"},{"name":"Sticker"},{"name":"GigCard"},{"name":"Photo"},{"name":"PhotoGrid"},{"name":"Checkerboard"},{"name":"Tricolour"},{"name":"TrackList"},{"name":"LineUp"}]} */
(() => {
	var {
			defineProperty: l,
			getOwnPropertyNames: w,
			getOwnPropertyDescriptor: S,
		} = Object,
		T = Object.prototype.hasOwnProperty;
	function C(a) {
		return this[a];
	}
	var G = (a) => {
			var s = (m ??= new WeakMap()).get(a),
				t;
			if (s) return s;
			if (
				((s = l({}, "__esModule", { value: !0 })),
				(a && typeof a === "object") || typeof a === "function")
			) {
				for (var r of w(a))
					if (!T.call(s, r))
						l(s, r, {
							get: C.bind(a, r),
							enumerable: !(t = S(a, r)) || t.enumerable,
						});
			}
			return m.set(a, s), s;
		},
		m;
	var L = (a) => a;
	function B(a, s) {
		this[a] = L.bind(null, s);
	}
	var F = (a, s) => {
		for (var t in s)
			l(a, t, {
				get: s[t],
				enumerable: !0,
				configurable: !0,
				set: B.bind(s, t),
			});
	};
	var U = {};
	F(U, {
		Button: () => p,
		Checkerboard: () => f,
		GigCard: () => y,
		LineUp: () => b,
		Nav: () => N,
		Photo: () => k,
		PhotoGrid: () => x,
		Sticker: () => d,
		Tape: () => c,
		TrackList: () => P,
		Tricolour: () => v,
	});
	var _ = window.React,
		{ createElement: e, Fragment: z } = _,
		o = (...a) => a.filter(Boolean).join(" ");
	function p({
		variant: a = "primary",
		href: s,
		children: t,
		className: r,
		...i
	}) {
		const n = o("sc-btn", `sc-btn--${a}`, r);
		return s
			? e("a", { ...i, href: s, className: n }, t)
			: e("button", { type: "button", ...i, className: n }, t);
	}
	function N({ links: a, homeHref: s = "/" }) {
		return e(
			"nav",
			{ className: "sc-nav", "aria-label": "Main" },
			e("a", { className: "sc-nav__name", href: s }, "Scarletts"),
			e(
				"ul",
				{ className: "sc-nav__links" },
				a.map((t) =>
					e(
						"li",
						{ key: t.href },
						e(
							"a",
							{ href: t.href, "aria-current": t.current ? "page" : void 0 },
							t.label,
						),
					),
				),
			),
		);
	}
	function c({ tone: a = "ink", tilt: s = "left", children: t }) {
		return e(
			"span",
			{ className: o("sc-tape", `sc-tape--${a}`, `sc-tape--${s}`) },
			t,
		);
	}
	function d({ tone: a = "gold", children: s }) {
		return e("span", { className: o("sc-sticker", `sc-sticker--${a}`) }, s);
	}
	function y({
		weekday: a,
		day: s,
		month: t,
		venue: r,
		city: i,
		details: n,
		status: g = "on-sale",
		ticketsHref: u,
	}) {
		return e(
			"article",
			{ className: "sc-gig" },
			e(
				"div",
				{ className: "sc-gig__date" },
				e("span", { className: "sc-gig__weekday" }, a),
				e("span", { className: "sc-gig__day" }, s),
				e("span", { className: "sc-gig__month" }, t),
			),
			e(
				"div",
				{ className: "sc-gig__body" },
				e("h3", { className: "sc-gig__venue" }, r),
				e("p", { className: "sc-gig__city" }, i),
				n && e("p", { className: "sc-gig__details" }, n),
				e(
					"div",
					{ className: "sc-gig__action" },
					g === "sold-out"
						? e(c, { tone: "ink", tilt: "left" }, "Sold out")
						: g === "free"
							? e(c, { tone: "scarlet", tilt: "right" }, "Free entry")
							: u
								? e(p, { href: u }, "Get tickets")
								: null,
				),
			),
		);
	}
	function k({ src: a, alt: s, width: t, height: r, credit: i, sticker: n }) {
		return e(
			"figure",
			{ className: "sc-photo" },
			e(
				"div",
				{ className: "sc-photo__frame" },
				e("img", { src: a, alt: s, width: t, height: r, loading: "lazy" }),
				n && e("span", { className: "sc-photo__sticker" }, e(d, null, n)),
			),
			i && e("figcaption", { className: "sc-photo__credit" }, i),
		);
	}
	function f({ rows: a = 1 }) {
		return e("div", {
			className: "sc-checker",
			"aria-hidden": "true",
			style: { height: `calc(var(--space-8) * ${a})` },
		});
	}
	function v() {
		return e(
			"div",
			{ className: "sc-tricolour", "aria-hidden": "true" },
			e("span", null),
			e("span", null),
			e("span", null),
		);
	}
	function P({ tracks: a }) {
		return e(
			"ol",
			{ className: "sc-tracks" },
			a.map((s, t) =>
				e(
					"li",
					{ className: "sc-track", key: s.src },
					e(
						"span",
						{ className: "sc-track__num", "aria-hidden": "true" },
						String(t + 1).padStart(2, "0"),
					),
					e(
						"div",
						{ className: "sc-track__info" },
						e(
							"div",
							{ className: "sc-track__head" },
							e("h3", { className: "sc-track__title" }, s.title),
							s.isNew && e(c, { tone: "scarlet", tilt: "right" }, "New"),
						),
						s.note && e("p", { className: "sc-track__note" }, s.note),
					),
					e(
						"span",
						{ className: "sc-track__time" },
						e("span", { className: "sc-visually-hidden" }, "Length "),
						s.duration,
					),
					e("audio", {
						className: "sc-track__audio",
						controls: !0,
						preload: "none",
						src: s.src,
						"aria-label": `Play ${s.title}`,
					}),
				),
			),
		);
	}
	function b({ members: a }) {
		return e(
			"ul",
			{ className: "sc-lineup" },
			a.map((s) =>
				e(
					"li",
					{ className: "sc-lineup__member", key: s.name },
					e("span", { className: "sc-lineup__role" }, s.role),
					e("span", { className: "sc-lineup__name" }, s.name),
				),
			),
		);
	}
	function x({ photos: a, feature: s = !0 }) {
		return e(
			"ul",
			{ className: o("sc-grid", s && "sc-grid--feature") },
			a.map((t) =>
				e(
					"li",
					{ className: "sc-grid__item", key: t.src },
					e(
						"a",
						{ className: "sc-grid__link", href: t.full ?? t.src },
						e("img", {
							src: t.src,
							alt: t.alt,
							width: t.width,
							height: t.height,
							loading: "lazy",
						}),
					),
				),
			),
		);
	}
	var M = {
		Button: p,
		Nav: N,
		Tape: c,
		Sticker: d,
		GigCard: y,
		Photo: k,
		Checkerboard: f,
		Tricolour: v,
		TrackList: P,
		LineUp: b,
		PhotoGrid: x,
	};
	window.Scarletts = Object.assign(window.Scarletts || {}, M);
})();
