import React from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as api from '../../api';
//Components
import Sign from '../../components/Sign';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import JoinRoom from '../../components/JoinRoom';
import CreateRoom from '../../components/CreateRoom';

//Images
import heroImage from '../../assets/bg1.png';
import fallbackAvatar from '../../assets/profileImage.png';

//Demo clip. Was a 2MB animated GIF; re-encoded to video, which the browser can
//also decode incrementally instead of holding every frame in memory.
import demoWebm from '../../assets/demo.webm';
import demoMp4 from '../../assets/demo.mp4';
import demoPoster from '../../assets/demo-poster.webp';

//Data
import data from '../../../data';

//Icons
import { useGlobalContext } from '../../context';
import { MdEmojiEmotions } from 'react-icons/md';

const features = [
	{
		title: '🎨 Collaborative Whiteboard',
		description: 'Real-time shared sketching and brainstorming.',
	},
	{
		title: '💬 Group Chat',
		description: 'Organized, productive group conversations.',
	},
	{
		title: '🚀 Effortless Sharing',
		description: 'Seamless sharing of creations and discussions.',
	},
	{
		title: '🌐 Global Collaboration',
		description: 'Connect worldwide, breaking barriers.',
	},
	{
		title: '🔒 Secure and Private',
		description: 'Token-based auth and scoped rooms keep your work yours.',
	},
];

const points = [
	'🎨 Draw with rectangles, lines, circles and a freehand pencil.',
	'🤝 Collaborate remotely over Socket.IO: draw, chat, share ideas.',
	'💬 Real-time group chat for instant interaction.',
	'↩️ Undo and redo to correct mistakes.',
	'🖼️ Upload a profile image for a personal touch.',
	'✏️ Edit your details whenever you like.',
	'🌓 Switch between dark and light modes.',
	'👥 See everyone active in the room.',
	'👤 Let guests join without an account.',
];

const Homepage = () => {
	const [signup, setSignup] = React.useState(false);

	const { isSignedIn, name, bio, profileImage } = useGlobalContext();

	return (
		<>
			{signup && (
				<Sign
					closeSign={() => setSignup(false)}
					page='signup'
				/>
			)}
			<div className={style.homepage}>
				<header className={style.header}>
					<div className={style.headerContent}>
						<h1>
							Welcome to <b>{data.title}</b>
							<i>{data.description}</i>
						</h1>
						{/*
						  Intrinsic dimensions reserve the right box before the image
						  arrives, so the hero copy does not jump when it loads.
						*/}
						<img
							src={heroImage}
							alt='A shared ThinkInk canvas with several people sketching together'
							width={2145}
							height={1515}
							fetchPriority='high'
							decoding='async'
						/>
					</div>
				</header>

				<div className={style.featuredBox}>
					{isSignedIn ? (
						<>
							<div className={style.user}>
								<img
									src={profileImage || fallbackAvatar}
									alt=''
									width={100}
									height={100}
									className={style.profileImage}
								/>
								<h2>
									<i>Hi, </i>
									{name}
								</h2>
								{bio && <p>{bio}</p>}
							</div>
							<div className={style.joinroom}>
								<JoinRoom />
								<CreateRoom />
							</div>
						</>
					) : (
						<ul className={style.features}>
							{features.map((feature) => (
								<li
									className={style.feature}
									key={feature.title}>
									<h2>{feature.title}</h2>
									<p>{feature.description}</p>
								</li>
							))}
						</ul>
					)}
				</div>

				<section className={style.points}>
					<div className={style.pointsContainer}>
						<h3>Everything you can do</h3>
						<ul className={style.pointsList}>
							{points.map((point) => (
								<li key={point}>{point}</li>
							))}
						</ul>
					</div>
				</section>

				<section className={style.cta}>
					<h2>Ready to Revolutionize Collaboration?</h2>
				</section>

				<div className={style.demo}>
					<p>Join a demo room now to see how it works.</p>
					<DemoButton />
				</div>

				<div className={style.imageDiv}>
					{/*
					  `preload="none"` keeps the clip off the initial page load
					  entirely - it sits below the fold, so nothing is fetched until
					  the poster scrolls into view and playback starts.

					  WebM is listed first so browsers that support VP9 take the
					  smaller file; Safari falls through to the H.264 MP4.
					*/}
					<video
						className={style.demoVideo}
						poster={demoPoster}
						width={1280}
						height={720}
						autoPlay
						loop
						muted
						playsInline
						preload='none'
						aria-label={`${data.title} being used to sketch and chat in real time`}>
						<source
							src={demoWebm}
							type='video/webm'
						/>
						<source
							src={demoMp4}
							type='video/mp4'
						/>
					</video>
				</div>
			</div>
			<Footer />
		</>
	);
};

const DemoButton = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(false);

	// The room id used to be hardcoded to one from the upstream project, so on a
	// fresh database this button always landed on "Room not found". The server
	// now resolves (and creates on first use) the shared demo room.
	const openDemo = async () => {
		setLoading(true);
		try {
			const res = await api.getDemoRoom();
			if (res.data?.success) {
				navigate(`/room/${res.data.data.roomId}`);
				return;
			}
			toast.error(res.data?.msg || 'Could not open the demo room');
		} catch {
			toast.error('Could not reach the server. Is it running?');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button
			onClick={openDemo}
			disabled={loading}>
			<MdEmojiEmotions />
			{loading ? 'Opening…' : 'Join Demo Room'}
		</Button>
	);
};

export default Homepage;
