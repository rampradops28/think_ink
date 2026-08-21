import { useEffect, useRef } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import style from './style.module.scss';

const PopUp = ({ closeSign, children }) => {
	const coverRef = useRef(null);

	// Close on Escape, and stop the page behind the dialog from scrolling while
	// it is open.
	useEffect(() => {
		const onKeyDown = (event) => {
			if (event.key === 'Escape') closeSign();
		};
		document.addEventListener('keydown', onKeyDown);

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [closeSign]);

	// Comparing against an element id meant any nested element carrying that id
	// could dismiss the dialog. Comparing against the backdrop node itself is
	// exact.
	const handleBackdropClick = (e) => {
		if (e.target === coverRef.current) closeSign();
	};

	return (
		<div
			ref={coverRef}
			onClick={handleBackdropClick}
			className={style.cover}
			role='dialog'
			aria-modal='true'>
			<div className={style.popup}>
				<button
					type='button'
					onClick={closeSign}
					className={style.close}
					aria-label='Close'>
					<IoCloseCircle />
				</button>
				{children}
			</div>
		</div>
	);
};

export default PopUp;
