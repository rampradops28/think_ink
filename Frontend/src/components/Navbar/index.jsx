import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import { Link, NavLink } from 'react-router-dom';
import { useGlobalContext } from '../../context';

import Sign from '../Sign';
import PopUp from '../PopUp';
import Button from '../Button';
import JoinRoom from '../JoinRoom';
import data from '../../../data';

import { FaBars } from 'react-icons/fa';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

import fallbackAvatar from '../../assets/profileImage.png';

const Navbar = () => {
	const [joinRoom, setJoinRoom] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [showSign, setShowSign] = useState(false);
	const [isMobile, setIsMobile] = useState(
		() => typeof window !== 'undefined' && window.innerWidth < 768
	);

	// A resize listener that stores the raw width re-rendered the whole navbar
	// on every pixel of a drag. This only re-renders when the breakpoint is
	// actually crossed.
	useEffect(() => {
		const query = window.matchMedia('(max-width: 767px)');
		const onChange = (event) => setIsMobile(event.matches);

		setIsMobile(query.matches);
		query.addEventListener('change', onChange);
		return () => query.removeEventListener('change', onChange);
	}, []);

	// Collapse the drawer when moving back up to the desktop layout, otherwise
	// it stays mounted and open behind the desktop nav.
	useEffect(() => {
		if (!isMobile) setMenuOpen(false);
	}, [isMobile]);

	const { isSignedIn, name, bio, profileImage, colorMode, toggleColorMode } =
		useGlobalContext();

	const links = (
		<ul className={style.links}>
			<li>
				<NavLink
					to='/'
					className={({ isActive }) => (isActive ? style.active : undefined)}>
					Home
				</NavLink>
			</li>
			<li>
				<NavLink
					to='/dashboard'
					className={({ isActive }) => (isActive ? style.active : undefined)}>
					Dashboard
				</NavLink>
			</li>
			<li>
				<button
					type='button'
					className={style.linkButton}
					onClick={() => setJoinRoom((prev) => !prev)}>
					Join Room
				</button>
			</li>
		</ul>
	);

	return (
		<>
			{joinRoom && (
				<PopUp closeSign={() => setJoinRoom(false)}>
					<JoinRoom />
				</PopUp>
			)}
			{showSign && <Sign closeSign={() => setShowSign(false)} />}

			<nav className={style.nav}>
				<div className={style.navHeader}>
					{isMobile && (
						<button
							type='button'
							className={style.navToggle}
							aria-label='Toggle navigation'
							aria-expanded={menuOpen}
							onClick={() => setMenuOpen((prev) => !prev)}>
							<FaBars
								className={style.icon}
								style={{ transform: `rotate(${menuOpen ? 90 : 0}deg)` }}
							/>
						</button>
					)}
					<Link
						to='/'
						className={style.brand}>
						<h1>{data.title}</h1>
					</Link>
				</div>

				<div className={style.action}>
					<button
						type='button'
						className={style.themeToggle}
						onClick={toggleColorMode}
						aria-label={
							colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
						}>
						{colorMode === 'dark' ? (
							<MdLightMode className={style.icon} />
						) : (
							<MdDarkMode className={style.icon} />
						)}
					</button>

					{isMobile ? (
						<div
							className={`${style.navCon} ${menuOpen ? style.show : ''}`}
							onClick={() => setMenuOpen(false)}>
							<div className={style.user}>
								{isSignedIn ? (
									<>
										<img
											src={profileImage || fallbackAvatar}
											alt=''
											className={style.profileImage}
										/>
										<span>
											<h2>{name}</h2>
											<p>{bio && (bio.length > 100 ? `${bio.slice(0, 100)}…` : bio)}</p>
										</span>
									</>
								) : (
									<Button onClick={() => setShowSign(true)}>
										<AiOutlineUserAdd />
										Sign Up
									</Button>
								)}
							</div>
							{links}
						</div>
					) : (
						links
					)}

					<User onSignInClick={() => setShowSign(true)} />
				</div>
			</nav>
		</>
	);
};

const User = ({ onSignInClick }) => {
	const { isSignedIn, name, signOut, profileImage } = useGlobalContext();

	if (!isSignedIn) {
		return (
			<Button onClick={onSignInClick}>
				<AiOutlineUserAdd />
				Sign Up/Sign In
			</Button>
		);
	}

	return (
		<div className={style.userChip}>
			<img
				src={profileImage || fallbackAvatar}
				alt=''
				className={style.profileImage}
			/>
			<span>
				{/* `name` can be briefly empty between sign-in and the profile fetch. */}
				<p>{name ? name.split(' ')[0] : 'User'}</p>
				<button
					type='button'
					onClick={signOut}
					className={style.signOutButton}>
					Sign Out
				</button>
			</span>
		</div>
	);
};

export default Navbar;
