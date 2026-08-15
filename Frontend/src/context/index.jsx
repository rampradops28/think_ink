import React, { useContext, useReducer, useEffect } from 'react';
import customConfirmation from '../components/customConfirmation';
import * as api from '../api/index.js';
import reducer from './userReducer.jsx';
import { socket } from '../socket';
import setCSSValues, { getInitialColorMode } from '../utils/setCSS.js';

const AppContext = React.createContext();
export const userInitialState = {
	signedIn: false,
	userId: '',
	name: '',
	email: '',
	bio: '',
	profileImage: '',
	token: '',
};

const AppProvider = ({ children }) => {
	const [user, dispatch] = useReducer(reducer, userInitialState);

	// Resolves a stored preference, then the OS setting, instead of always
	// starting dark and overwriting the user's last choice on every reload.
	const [colorMode, setColorMode] = React.useState(getInitialColorMode);

	// Restoring a session runs on every page load. A stored token that has
	// expired (or was signed with an older JWT_SECRET) simply means "not signed
	// in" - it used to raise an error toast on load, so it runs silently now and
	// just clears the dead token.
	const initialFromLocalStorage = async (tokenValue) => {
		await api.handler(
			api.signinToken,
			(data) => signIn(data),
			tokenValue,
			() => localStorage.removeItem('token'),
			{ silent: true }
		);
	};

	useEffect(() => {
		setCSSValues(colorMode);
		const token = JSON.parse(localStorage.getItem('token')) || null;
		if (token) initialFromLocalStorage(token);
	}, []);

	useEffect(() => {
		socket.on('connect', () => {
			console.log('socket connected');
		});
		socket.on('disconnect', () => {
			console.log('socket disconnected');
		});
		return () => {
			socket.off('connect');
			socket.off('disconnect');
		};
	}, []);

	//update functions
	const updateUser = (newUser) => {
		dispatch({ type: 'UPDATE_USER', payload: newUser });
	};
	const signIn = ({ userId, name, token, email, bio, profileImage }) => {
		// console.log('signing in');
		if (!userId || !name || !token || !email) {
			console.error('Error Signing in, invalid data');
			return false;
		}
		dispatch({
			type: 'SIGN_IN',
			payload: { userId, name, token, email, bio, profileImage },
		});
		return true;
	};
	const signOut = async () => {
		const _signOut = async () => {
			if (socket.connected) socket.disconnect();
			const res = await api.signOut();
			dispatch({ type: 'SIGN_OUT' });
		};

		customConfirmation({
			message: 'Are you sure you want to Sign Out?',
			onConfirm: _signOut,
			toastId: 'signOut',
		});
	};
	const toggleColorMode = () => {
		setColorMode((prevMode) => {
			const nextMode = prevMode === 'dark' ? 'light' : 'dark';
			setCSSValues(nextMode);
			return nextMode;
		});
	};

	// console.log('hello from context');

	return (
		<AppContext.Provider
			value={{
				socket,
				userId: user.userId,
				name: user.name,
				email: user.email,
				profileImage: user.profileImage,
				bio: user.bio,
				colorMode,
				isSignedIn: user.signedIn,
				token: user.token,
				toggleColorMode,
				signIn,
				signOut,
				updateUser,
				// getRoomId,
				// updateRoomId,
			}}>
			{children}
		</AppContext.Provider>
	);
};
const useGlobalContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
