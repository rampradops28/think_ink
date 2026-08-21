import { useState, useRef, useEffect, useCallback } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import style from './style.module.scss';

const DEFAULT_COLOR = { r: 0, g: 0, b: 0, a: 1 };

// Toolbox state stores colours as `rgba(r, g, b, a)` strings so they can be
// handed straight to the canvas context; react-colorful works with objects.
const parseRgba = (value) => {
	if (!value || typeof value !== 'string') return DEFAULT_COLOR;
	const match = value.match(
		/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/i
	);
	if (!match) return DEFAULT_COLOR;
	return {
		r: Number(match[1]),
		g: Number(match[2]),
		b: Number(match[3]),
		a: match[4] === undefined ? 1 : Number(match[4]),
	};
};

const toRgbaString = ({ r, g, b, a }) => `rgba(${r}, ${g}, ${b}, ${a})`;

function ColorPickerComponent({ color, changeColor, label }) {
	const [pickerColor, setPickerColor] = useState(() => parseRgba(color));
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef(null);

	// Keep in sync when the colour is changed elsewhere (e.g. tool reset).
	useEffect(() => {
		setPickerColor(parseRgba(color));
	}, [color]);

	const close = useCallback(() => setIsOpen(false), []);

	// Close on outside click and on Escape - the old implementation had no way
	// to dismiss the picker except re-clicking the swatch.
	useEffect(() => {
		if (!isOpen) return;

		const handlePointerDown = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				close();
			}
		};
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') close();
		};

		document.addEventListener('mousedown', handlePointerDown);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, close]);

	const handleChange = (newColor) => {
		setPickerColor(newColor);
		changeColor(toRgbaString(newColor));
	};

	return (
		<div
			className={style.wrapper}
			ref={containerRef}>
			<button
				type='button'
				className={style.swatch}
				aria-label={label ? `Choose ${label}` : 'Choose colour'}
				aria-expanded={isOpen}
				onClick={() => setIsOpen((prev) => !prev)}>
				<span
					className={style.swatchFill}
					style={{ backgroundColor: toRgbaString(pickerColor) }}
				/>
			</button>
			{isOpen && (
				<div className={style.popover}>
					<RgbaColorPicker
						color={pickerColor}
						onChange={handleChange}
					/>
					<div className={style.value}>{toRgbaString(pickerColor)}</div>
				</div>
			)}
		</div>
	);
}

export default ColorPickerComponent;
