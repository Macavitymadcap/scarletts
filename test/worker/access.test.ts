import { beforeAll, describe, expect, test } from 'bun:test';
import { Temporal } from 'temporal-polyfill';
import {
	type AccessConfig,
	type Jwk,
	verifyAccessJwt,
} from '../../src/worker/access';

const config: AccessConfig = {
	teamDomain: 'team.cloudflareaccess.com',
	audience: 'crew-aud',
};
const NOW = Temporal.Instant.from('2026-11-23T12:00:00Z');
const nowSeconds = NOW.epochMilliseconds / 1000;

let privateKey: CryptoKey;
let publicJwk: Jwk;

const base64Url = (bytes: Uint8Array): string =>
	btoa(String.fromCharCode(...bytes))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

const encodeJson = (value: unknown): string =>
	base64Url(new TextEncoder().encode(JSON.stringify(value)));

const sign = async (
	claims: Record<string, unknown>,
	kid = 'key-1',
): Promise<string> => {
	const signed = `${encodeJson({ alg: 'RS256', kid })}.${encodeJson(claims)}`;
	const signature = await crypto.subtle.sign(
		'RSASSA-PKCS1-v1_5',
		privateKey,
		new TextEncoder().encode(signed),
	);
	return `${signed}.${base64Url(new Uint8Array(signature))}`;
};

const validClaims = {
	aud: ['crew-aud'],
	iss: 'https://team.cloudflareaccess.com',
	exp: nowSeconds + 600,
	email: 'dan@example.com',
};

const keys = async () => [publicJwk];

beforeAll(async () => {
	const pair = await crypto.subtle.generateKey(
		{
			name: 'RSASSA-PKCS1-v1_5',
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: 'SHA-256',
		},
		true,
		['sign', 'verify'],
	);
	privateKey = pair.privateKey;
	publicJwk = {
		...(await crypto.subtle.exportKey('jwk', pair.publicKey)),
		kid: 'key-1',
	};
});

describe('verifyAccessJwt', () => {
	test('returns the email from a valid token', async () => {
		// Arrange
		const token = await sign(validClaims);

		// Act
		const email = await verifyAccessJwt(token, config, keys, NOW);

		// Assert
		expect(email).toBe('dan@example.com');
	});

	test('rejects an expired token', async () => {
		// Arrange
		const token = await sign({ ...validClaims, exp: nowSeconds - 1 });

		// Act
		const email = await verifyAccessJwt(token, config, keys, NOW);

		// Assert
		expect(email).toBeNull();
	});

	test('rejects a token for another Access application', async () => {
		// Arrange
		const token = await sign({ ...validClaims, aud: ['other-app'] });

		// Act
		const email = await verifyAccessJwt(token, config, keys, NOW);

		// Assert
		expect(email).toBeNull();
	});

	test('rejects a token from another team', async () => {
		// Arrange
		const token = await sign({
			...validClaims,
			iss: 'https://other.cloudflareaccess.com',
		});

		// Act
		const email = await verifyAccessJwt(token, config, keys, NOW);

		// Assert
		expect(email).toBeNull();
	});

	test('rejects a token whose claims were changed after signing', async () => {
		// Arrange
		const [header, , signature] = (await sign(validClaims)).split('.');
		const forged = `${header}.${encodeJson({ ...validClaims, email: 'eve@example.com' })}.${signature}`;

		// Act
		const email = await verifyAccessJwt(forged, config, keys, NOW);

		// Assert
		expect(email).toBeNull();
	});

	test('rejects a token signed with an unknown key', async () => {
		// Arrange
		const token = await sign(validClaims, 'key-2');

		// Act
		const email = await verifyAccessJwt(token, config, keys, NOW);

		// Assert
		expect(email).toBeNull();
	});

	test('rejects something that is not a JWT', async () => {
		// Act
		const email = await verifyAccessJwt('not-a-token', config, keys, NOW);

		// Assert
		expect(email).toBeNull();
	});
});
