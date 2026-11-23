import type { Member } from '../db';
import { CrewLayout } from './layout';

export type PublishState = 'sent' | 'failed' | 'unconfigured';

export type SettingsPageProps = {
	member: Member;
	feedUrl: string | null;
	publish?: PublishState;
	canPublish: boolean;
};

const publishMessages: Record<PublishState, string> = {
	sent: 'Publishing. The site updates in a few minutes.',
	failed: "Publishing didn't start. Try again, or ask Dan to check GitHub.",
	unconfigured: 'Publishing is not set up yet.',
};

export const SettingsPage = ({
	member,
	feedUrl,
	publish,
	canPublish,
}: SettingsPageProps) => (
	<CrewLayout title="Feed & publishing" member={member} current="settings">
		<section class="crew-form" aria-labelledby="feed-title">
			<h1 class="crew-form__title" id="feed-title">
				Calendar feed
			</h1>
			<p class="prose">
				Subscribe to this link in your phone's calendar app to see every event
				there. It's your own link: anyone with it can read the calendar, so
				don't share it. Making a new one stops the old one working.
			</p>
			{feedUrl ? (
				<p class="crew-feed">
					<label for="feed-url">Your feed link</label>
					<input id="feed-url" type="text" readonly value={feedUrl} />
				</p>
			) : (
				<p class="prose">You don't have a feed link yet.</p>
			)}
			<form method="post" action="/crew/settings/feed">
				<button class="sc-btn sc-btn--secondary" type="submit">
					{feedUrl ? 'Make a new link' : 'Make my link'}
				</button>
			</form>

			<h2 class="crew-form__title" id="publish-title">
				Publish gigs
			</h2>
			<p class="prose">
				Gigs ticked "Show this gig on scarletts.uk" go on the public site when
				it next rebuilds. That happens every morning, or straight away with this
				button.
			</p>
			{publish && (
				<p class="crew-notice" role="status">
					{publishMessages[publish]}
				</p>
			)}
			<form method="post" action="/crew/publish">
				<button
					class="sc-btn sc-btn--primary"
					type="submit"
					disabled={!canPublish}
				>
					Publish now
				</button>
			</form>
		</section>
	</CrewLayout>
);
