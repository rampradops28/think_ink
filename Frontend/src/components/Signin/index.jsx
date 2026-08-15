import { useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as api from '../../api/index.js';
import style from './style.module.scss';
import { useGlobalContext } from '../../context';

//Components
import Button from '../Button';

const EMAIL_RE =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[?)([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;

const Signin = ({ toogleSignIn, closeSign }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const { signIn } = useGlobalContext();

	// This used to only type the demo credentials into the fields, leaving the
	// user to submit them - and they failed, because the demo account does not
	// exist until something creates it. The server now provisions it on first
	// use, so one click signs straight in.
	const handleDemoLogin = async () => {
		if (submitting) return;

		setSubmitting(true);
		try {
			await api.handler(api.demoLogin, (data) => {
				signIn(data);
				closeSign();
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (submitting) return;

		if (email === '' && password === '') {
			toast.error('Please enter email and password');
			return;
		} else if (email === '') {
			toast.error('Please enter email');
			return;
		} else if (password === '') {
			toast.error('Please enter password');
			return;
		} else if (!EMAIL_RE.test(email)) {
			toast.error('Please enter a valid email');
			return;
		}

		// Without this guard a double-click fired two sign-in requests.
		setSubmitting(true);
		try {
			await api.handler(
				api.signIn,
				(data) => {
					signIn(data);
					closeSign();
				},
				{ email, password }
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={style.wrapper}>
			<div className={style.headContainer}>
				<h1 className={style.heading}>Welcome back</h1>
				<p className={style.subheading}>Sign in to get back to your boards.</p>
			</div>

			<button
				type='button'
				className={style.dummyLogin}
				onClick={handleDemoLogin}
				disabled={submitting}>
				✨ Try the demo — no signup needed
			</button>

			<form
				onSubmit={handleSubmit}
				className={style.form}
				noValidate>
				<div className={style.inputContainer}>
					<label htmlFor='signin-email'>Email</label>
					<input
						id='signin-email'
						name='email'
						onChange={(e) => setEmail(e.target.value)}
						placeholder='you@example.com'
						type='email'
						autoComplete='email'
						value={email}
					/>
				</div>

				<div className={style.inputContainer}>
					<label htmlFor='signin-password'>Password</label>
					<div className={style.passwordField}>
						<input
							id='signin-password'
							name='password'
							onChange={(e) => setPassword(e.target.value)}
							placeholder='Enter your password'
							type={showPassword ? 'text' : 'password'}
							autoComplete='current-password'
							value={password}
						/>
						<button
							type='button'
							className={style.revealButton}
							onClick={() => setShowPassword((prev) => !prev)}
							aria-label={showPassword ? 'Hide password' : 'Show password'}>
							{showPassword ? <MdVisibilityOff /> : <MdVisibility />}
						</button>
					</div>
				</div>

				<div className={style.actoinContainer}>
					<Button disabled={submitting}>
						<AiOutlineUser />
						{submitting ? 'Signing in…' : 'LOGIN'}
					</Button>
				</div>
			</form>

			<div className={style.switchRow}>
				<span>Not registered yet?</span>
				<button
					type='button'
					onClick={() => toogleSignIn('signup')}
					className={style.hoverUnderline}>
					Sign Up
				</button>
			</div>
		</div>
	);
};

export default Signin;
