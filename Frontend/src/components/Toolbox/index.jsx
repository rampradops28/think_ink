import { useState } from 'react';
import style from './style.module.scss';
import { IoIosUndo, IoIosRedo } from 'react-icons/io';
import { GrClearOption } from 'react-icons/gr';
import { MdContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';
import ColorPicker from '../ColorPicker';
// import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineClear } from 'react-icons/ai';
import {
	FaShareAlt,
	FaPencilAlt,
	FaSlash,
	FaRegSquare,
	FaRegCircle,
} from 'react-icons/fa';
const Toolbox = ({
	isConnected,
	toogleConnection,
	elements,
	history,
	handleUndo,
	handleRedo,
	clearCanvas,
	toolbox,
	setToolbox,
	roomId,
	roomName,
	roomUsers,
	curUser,
}) => {
	const [collapsed, setCollapsed] = useState(false);

	const handleChange = (e) => {
		setToolbox((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};
	const handleCopy = () => {
		toast.info('Room Id copied to clipboard');
		navigator.clipboard.writeText(roomId);
	};
	const handleShare = () => {
		toast.info('Link copied to clipboard');
		navigator.clipboard.writeText(window.location.href);
	};
	return (
		<div className={`${style.wrapper} ${collapsed ? style.hide : ''}`}>
			{/*
			  This previously toggled the class via the implicit `window.wrapper`
			  global that browsers create for elements with an id - it worked by
			  accident and broke whenever the id changed. React state now owns it.
			*/}
			<button
				type='button'
				className={style.toolToggle}
				aria-label={collapsed ? 'Show toolbox' : 'Hide toolbox'}
				aria-expanded={!collapsed}
				onClick={() => setCollapsed((prev) => !prev)}>
				<AiOutlineClear className={style.toolicon} />
			</button>
			<div
				id='tool'
				className={style.container}>
				<div className={style.heading}>
					<button
						className={`${style.button} ${
							isConnected ? style.connected : style.disconnected
						}`}
						onClick={toogleConnection}>
						{isConnected ? 'Connected' : 'Disconnected'}
					</button>
					<span className={style.roomName}>
						<p>Room: </p>
						{roomName ? <b>{roomName}</b> : 'Unknown'}
					</span>
					<span className={style.roomName}>
						<p>Name: </p>
						<p>{curUser.name ? <b>{curUser.name}</b> : 'Unknown'}</p>
					</span>
					<div className={style.share}>
						<button
							className={style.button}
							onClick={handleCopy}>
							<MdContentCopy className={style.icon} /> RoomID
						</button>
						<button
							className={style.button}
							onClick={handleShare}>
							<FaShareAlt className={style.icon} /> Share
						</button>
					</div>
				</div>
				<div className={style.toolbox}>
					{/* `htmlFor` pointed at ids that do not exist on form controls,
					    so the labels were inert. Grouping semantics instead. */}
					<section
						className={style.tools}
						role='group'
						aria-label='Drawing tools'>
						<span className={style.label}>Tools: </span>
						<span>
							<button
								className={`${style.button} ${
									toolbox.tool === 'pencil' ? style.active : ''
								}`}
								name='tool'
								value='pencil'
								onClick={handleChange}>
								<FaPencilAlt />
							</button>
							<button
								className={`${style.button} ${
									toolbox.tool === 'line' ? style.active : ''
								}`}
								name='tool'
								value='line'
								onClick={handleChange}>
								<FaSlash />
							</button>
							<button
								className={`${style.button} ${
									toolbox.tool === 'rectangle' ? style.active : ''
								}`}
								name='tool'
								value='rectangle'
								onClick={handleChange}>
								<FaRegSquare />
							</button>
							<button
								className={`${style.button} ${
									toolbox.tool === 'circle' ? style.active : ''
								}`}
								name='tool'
								value='circle'
								onClick={handleChange}>
								<FaRegCircle />
							</button>
						</span>
					</section>
					<section className={style.lineWidth}>
						<label htmlFor='lineWidth'>LineWidth:</label>
						<input
							id='lineWidth'
							type='number'
							name='lineWidth'
							value={toolbox.lineWidth}
							min={1}
							max={100}
							onChange={handleChange}
						/>
					</section>
					<section className={style.color}>
						<span className={style.label}>Color:</span>
						<ColorPicker
							label='stroke colour'
							color={toolbox.strokeStyle}
							changeColor={(color) => {
								setToolbox((prevState) => ({
									...prevState,
									strokeStyle: color,
								}));
							}}
						/>
					</section>
					<section className={style.color}>
						<span className={style.label}>Fill Color:</span>
						<ColorPicker
							label='fill colour'
							color={toolbox.fillStyle}
							changeColor={(color) => {
								setToolbox((prevState) => ({
									...prevState,
									fillStyle: color,
								}));
							}}
						/>
					</section>
					<section className={style.buttonsSection}>
						<button
							type='button'
							className={style.button}
							disabled={elements.length < 1}
							onClick={handleUndo}>
							<IoIosUndo />
							Undo
						</button>
						<button
							type='button'
							className={style.button}
							disabled={history.length < 1}
							onClick={handleRedo}>
							<IoIosRedo />
							Redo
						</button>
						<button
							type='button'
							className={style.button}
							disabled={elements.length < 1}
							onClick={clearCanvas}>
							<GrClearOption />
							Clear Canvas
						</button>
					</section>
				</div>
			</div>
			<Users
				users={roomUsers}
				curUser={curUser}
			/>
		</div>
	);
};

const Users = ({ users, curUser }) => {
	return (
		<>
			<div
				id='user'
				className={style.userdiv}>
				<h3>Users</h3>
				<ul className={style.users}>
					{users.map((user) => (
						<li
							key={user.userId}
							className={user.isOnline ? style.green : style.red}>
							<p>
								{user.name}
								{user.userId === curUser.userId ? ' (You)' : ''}
							</p>
							<p>
								{user.isGuest ? (
									<span> (Guest) </span>
								) : user.isAdmin ? (
									<span> (Admin) </span>
								) : (
									''
								)}
							</p>
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default Toolbox;
