import style from './style.module.scss';

/**
 * `disabled` and `type` were previously dropped on the floor - the component
 * hardcoded `type="submit"` and forwarded nothing else, so a disabled prop had
 * no effect and buttons outside a form still behaved as submit buttons.
 */
const Button = ({
	onClick,
	children,
	type = 'submit',
	disabled = false,
	className = '',
	...rest
}) => {
	return (
		<button
			onClick={onClick}
			type={type}
			disabled={disabled}
			className={`${style.btn} ${className}`.trim()}
			{...rest}>
			{children}
		</button>
	);
};

export default Button;
