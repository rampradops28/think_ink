import { useState } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../../context';
import * as api from '../../api/index.js';
import style from './style.module.scss';

//Components
import Button from '../Button';

const InitState = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

const EMAIL_RE =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[?)([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;

function Signup({ toogleSignIn, closeSign }) {
	const [sForm, setsForm] = useState(InitState);
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const { signIn } = useGlobalContext();

	const handleChange = (e) =>
		setsForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (submitting) return;

		const { name, email, password, confirmPassword } = sForm;

		if (!name || !email || !password || !confirmPassword) {
			toast.error('Please enter all details');
			return;
		}
		// The name field is validated server-side at 3 characters; checking here
		// too avoids a round trip to find that out.
		if (name.trim().length < 3) {
			toast.error('Name must be at least 3 characters long');
			return;
		}
		if (!EMAIL_RE.test(email)) {
			toast.error('Please enter a valid email');
			return;
		}
		if (password.length < 8) {
			toast.error('Password must be at least 8 characters long');
			return;
		}
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			setsForm((prev) => ({ ...prev, confirmPassword: '' }));
			return;
		}

		setSubmitting(true);
		try {
			await api.handler(
				api.signUp,
				(data) => {
					signIn(data);
					closeSign();
				},
				sForm
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={style.wrapper}>
			<div className={style.headContainer}>
				<h1 className={style.heading}>Create your account</h1>
				<p className={style.subheading}>
					Start sketching with your team in seconds.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className={style.form}
				noValidate>
				<div className={style.inputContainer}>
					<label htmlFor='signup-name'>Full Name</label>
					<input
						id='signup-name'
						name='name'
						value={sForm.name}
						onChange={handleChange}
						placeholder='Enter your full name'
						type='text'
						autoComplete='name'
					/>
				</div>

				<div className={style.inputContainer}>
					<label htmlFor='signup-email'>Email</label>
					<input
						id='signup-email'
						name='email'
						value={sForm.email}
						onChange={handleChange}
						placeholder='you@example.com'
						type='email'
						autoComplete='email'
					/>
				</div>

				<div className={style.inputContainer}>
					<label htmlFor='signup-password'>Password</label>
					<div className={style.passwordField}>
						<input
							id='signup-password'
							name='password'
							value={sForm.password}
							onChange={handleChange}
							placeholder='At least 8 characters'
							type={showPassword ? 'text' : 'password'}
							autoComplete='new-password'
						/>
						<button
							type='button'
							className={style.revealButton}
							onClick={() => setShowPassword((prev) => !prev)}
							aria-label={showPassword ? 'Hide password' : 'Show password'}>
							{showPassword ? <MdVisibilityOff /> : <MdVisibility />}
						</button>
					</div>
					<span className={style.hint}>Minimum 8 characters.</span>
				</div>

				<div className={style.inputContainer}>
					<label htmlFor='signup-confirm'>Confirm Password</label>
					<input
						id='signup-confirm'
						name='confirmPassword'
						value={sForm.confirmPassword}
						onChange={handleChange}
						placeholder='Retype your password'
						type={showPassword ? 'text' : 'password'}
						autoComplete='new-password'
					/>
				</div>

				<div className={style.actoinContainer}>
					<Button disabled={submitting}>
						<AiOutlineUserAdd />
						{submitting ? 'Creating account…' : 'REGISTER'}
					</Button>
				</div>
			</form>

			<div className={style.switchRow}>
				<span>Already signed up?</span>
				<button
					type='button'
					onClick={() => toogleSignIn('signin')}
					className={style.hoverUnderline}>
					Sign In
				</button>
			</div>
		</div>
	);
}

export default Signup;
