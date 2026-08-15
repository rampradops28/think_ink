import React from 'react';
import Signin from '../Signin';
import Signup from '../Signup';
import PopUp from '../PopUp';
import { useGlobalContext } from '../../context';

const Sign = ({ closeSign, page }) => {
	const [mode, setMode] = React.useState(page === 'signup' ? 'signup' : 'signin');

	const { isSignedIn } = useGlobalContext();

	// This used to call `closeSign()` inline during render, which updates the
	// parent while this component is rendering - React 19 warns on it and it can
	// loop. Closing as an effect runs it after the commit instead.
	//
	// `closeSign` is passed as an inline arrow, so it is a new function every
	// render; keeping it in a ref stops it from retriggering the effect.
	const closeRef = React.useRef(closeSign);
	closeRef.current = closeSign;

	React.useEffect(() => {
		if (isSignedIn) closeRef.current();
	}, [isSignedIn]);

	const Form = mode === 'signup' ? Signup : Signin;

	return (
		<PopUp closeSign={closeSign}>
			<Form
				toogleSignIn={setMode}
				closeSign={closeSign}
			/>
		</PopUp>
	);
};

export default Sign;
