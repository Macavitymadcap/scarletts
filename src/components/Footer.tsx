import { site, socials } from '../site';

export const Footer = () => (
	<footer class="footer">
		{socials.length > 0 && (
			<ul class="footer__links">
				{socials.map((social) => (
					<li>
						<a href={social.href}>{social.label}</a>
					</li>
				))}
			</ul>
		)}
		<p class="footer__mail">
			Bookings:{' '}
			<a href={`mailto:${site.bookingsEmail}`}>{site.bookingsEmail}</a>
		</p>
	</footer>
);
