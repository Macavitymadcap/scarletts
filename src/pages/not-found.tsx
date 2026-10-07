import { Layout } from '../components/Layout';
import { Button, Tape } from '../components/ui';

export const NotFound = () => (
	<Layout title="Page not found" description="There's nothing at this address.">
		<div class="lost">
			<div class="lost__code" aria-hidden="true">
				404
			</div>
			<div class="lost__text">
				<Tape tilt="left">Page not found</Tape>
				<h1>Wrong turn</h1>
				<p>
					There's nothing at this address. It may have moved, or the link may be
					wrong.
				</p>
				<div class="lost__links">
					<Button href="/">Back to home</Button>
					<Button variant="secondary" href="/bio">
						Read the bio
					</Button>
				</div>
			</div>
		</div>
	</Layout>
);
