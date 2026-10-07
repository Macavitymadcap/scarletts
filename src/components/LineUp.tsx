import type { Member } from '../content/bio';

// Flush tiles, one per band member: role in stamp type above the name.
export const LineUp = ({ members }: { members: Member[] }) => (
	<ul class="sc-lineup">
		{members.map((member) => (
			<li class="sc-lineup__member">
				<span class="sc-lineup__role">{member.role}</span>
				<span class="sc-lineup__name">{member.name}</span>
			</li>
		))}
	</ul>
);
