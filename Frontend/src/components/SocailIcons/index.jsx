import style from './style.module.scss';
import {
	FaTwitter,
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaGithub,
} from 'react-icons/fa';
import data from '../../../data';

// Driven by a table so adding a network is one entry rather than another
// copy-pasted conditional block.
const NETWORKS = [
	{ key: 'github', label: 'GitHub', Icon: FaGithub },
	{ key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedin },
	{ key: 'twitter', label: 'Twitter', Icon: FaTwitter },
	{ key: 'facebook', label: 'Facebook', Icon: FaFacebook },
	{ key: 'instagram', label: 'Instagram', Icon: FaInstagram },
];

function SocialIcons() {
	const socials = data.socials ?? {};
	const available = NETWORKS.filter(({ key }) => socials[key]);

	if (available.length === 0) return null;

	return (
		<ul className={style.socialIcons}>
			{available.map(({ key, label, Icon }) => (
				<li key={key}>
					<a
						href={socials[key]}
						target='_blank'
						// Without `noopener` the opened page can reach back through
						// `window.opener` and navigate this tab.
						rel='noopener noreferrer'
						aria-label={label}
						title={label}>
						<Icon className={style.icon} />
					</a>
				</li>
			))}
		</ul>
	);
}

export default SocialIcons;
