import type { Member } from '../content/bio';
import { photoUrl } from '../content/photos';

const MemberPhoto = ({ member }: { member: Member }) =>
	member.photo ? (
		<div class="sc-lineup__photo">
			<img
				src={photoUrl(member.photo, 'small')}
				alt={member.photo.alt}
				width={member.photo.width}
				height={member.photo.height}
				loading="lazy"
			/>
		</div>
	) : (
		// Until there is a portrait, the initial keeps every tile the same height.
		<div class="sc-lineup__photo sc-lineup__photo--empty" aria-hidden="true">
			{member.name.charAt(0)}
		</div>
	);

// Flush tiles, one per band member: a square portrait above the role in stamp
// type, the name, and an optional short bio.
export const LineUp = ({ members }: { members: Member[] }) => (
	<ul class="sc-lineup">
		{members.map((member) => (
			<li class="sc-lineup__member">
				<MemberPhoto member={member} />
				<div class="sc-lineup__text">
					<span class="sc-lineup__role">{member.role}</span>
					<h3 class="sc-lineup__name">{member.name}</h3>
					{member.bio && <p class="sc-lineup__bio">{member.bio}</p>}
				</div>
			</li>
		))}
	</ul>
);
