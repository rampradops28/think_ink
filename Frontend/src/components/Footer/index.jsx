import style from './style.module.scss';
import SocialIcons from '../SocailIcons';
import data from '../../../data';

const Footer = () => {
	return (
		<footer className={style.footer}>
			<p>
				&copy; {new Date().getFullYear()} {data.title}. All rights reserved.
			</p>
			<SocialIcons />
		</footer>
	);
};

export default Footer;
