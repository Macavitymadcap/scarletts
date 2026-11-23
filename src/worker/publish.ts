export const PUBLISH_EVENT = 'publish-gigs';

/**
 * Asks GitHub Actions to rebuild and deploy the site, which pulls public gigs
 * from D1 at build time. Returns whether GitHub accepted the request.
 */
export const requestPublish = async (
	repo: string,
	token: string,
	fetcher: typeof fetch = fetch,
): Promise<boolean> => {
	const response = await fetcher(
		`https://api.github.com/repos/${repo}/dispatches`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				'User-Agent': 'scarletts-crew',
				'X-GitHub-Api-Version': '2022-11-28',
			},
			body: JSON.stringify({ event_type: PUBLISH_EVENT }),
		},
	);
	return response.status === 204;
};
