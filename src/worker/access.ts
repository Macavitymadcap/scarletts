import { Temporal } from 'temporal-polyfill';

/**
 * Verifies the JWT that Cloudflare Access adds to every request it lets
 * through. Access already blocks everyone else at the edge; checking the token
 * here means a misconfigured Access policy fails closed instead of open.
 */

export type Jwk = JsonWebKey & { kid?: string };

export type AccessConfig = {
	/** e.g. "scarletts.cloudflareaccess.com" */
	teamDomain: string;
	/** The Access application's audience (AUD) tag. */
	audience: string;
};

export type KeySource = () => Promise<Jwk[]>;

type Header = { alg?: string; kid?: string };
type Claims = {
	aud?: string | string[];
	iss?: string;
	exp?: number;
	nbf?: number;
	email?: string;
};

const decoder = new TextDecoder();

const base64UrlToBytes = (value: string): Uint8Array<ArrayBuffer> => {
	const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
	const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
	return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const decodeJson = <T>(segment: string): T | null => {
	try {
		return JSON.parse(decoder.decode(base64UrlToBytes(segment))) as T;
	} catch {
		return null;
	}
};

const verifySignature = async (
	key: Jwk,
	signedPart: string,
	signature: string,
): Promise<boolean> => {
	try {
		const cryptoKey = await crypto.subtle.importKey(
			'jwk',
			key,
			{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
			false,
			['verify'],
		);
		return await crypto.subtle.verify(
			'RSASSA-PKCS1-v1_5',
			cryptoKey,
			base64UrlToBytes(signature),
			new TextEncoder().encode(signedPart),
		);
	} catch {
		return false;
	}
};

const claimsAreValid = (
	claims: Claims,
	config: AccessConfig,
	nowSeconds: number,
): boolean => {
	const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
	if (!audiences.includes(config.audience)) return false;
	if (claims.iss !== `https://${config.teamDomain}`) return false;
	if (typeof claims.exp !== 'number' || claims.exp <= nowSeconds) return false;
	if (typeof claims.nbf === 'number' && claims.nbf > nowSeconds) return false;
	return true;
};

/** Returns the signed-in email address, or null if the token is not valid. */
export const verifyAccessJwt = async (
	token: string,
	config: AccessConfig,
	keys: KeySource,
	now: Temporal.Instant = Temporal.Now.instant(),
): Promise<string | null> => {
	const [headerPart, payloadPart, signature, ...rest] = token.split('.');
	if (!headerPart || !payloadPart || !signature || rest.length > 0) {
		return null;
	}

	const header = decodeJson<Header>(headerPart);
	const claims = decodeJson<Claims>(payloadPart);
	if (header?.alg !== 'RS256' || !claims) return null;

	const key = (await keys()).find((candidate) => candidate.kid === header.kid);
	if (!key) return null;

	const signed = await verifySignature(
		key,
		`${headerPart}.${payloadPart}`,
		signature,
	);
	if (!signed) return null;
	if (
		!claimsAreValid(claims, config, Math.floor(now.epochMilliseconds / 1000))
	) {
		return null;
	}
	return typeof claims.email === 'string' ? claims.email : null;
};

const KEY_CACHE_TIME = { minutes: 10 };

/** Fetches the team's signing keys, caching them for the life of the isolate. */
export const accessKeys = (teamDomain: string): KeySource => {
	let cached: { keys: Jwk[]; expires: Temporal.Instant } | undefined;
	return async () => {
		const now = Temporal.Now.instant();
		if (cached && Temporal.Instant.compare(cached.expires, now) > 0) {
			return cached.keys;
		}
		const response = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
		if (!response.ok) return [];
		const body = (await response.json()) as { keys?: Jwk[] };
		cached = { keys: body.keys ?? [], expires: now.add(KEY_CACHE_TIME) };
		return cached.keys;
	};
};
