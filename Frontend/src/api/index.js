import axios from 'axios';
import config from '../../config';
import { toast } from 'react-toastify';

// `process` does not exist in the browser; Vite exposes build flags on
// `import.meta.env`. The prod/dev split is already resolved inside config.
const API = axios.create({ baseURL: config.serverAPIURL });

const getToken = () => {
	try {
		return JSON.parse(localStorage.getItem('token')) || null;
	} catch {
		return null;
	}
};

// Every authenticated call used to re-read the token and hand-build the same
// Authorization header. One interceptor covers all of them.
API.interceptors.request.use((request) => {
	const token = getToken();
	if (token) request.headers.Authorization = `Bearer ${token}`;
	return request;
});

export const signIn = (data) => API.post('/auth/signin', data);
export const signUp = (data) => API.post('/auth/signup', data);
export const signinToken = (token) => API.post('/auth/signin/token', { token });
export const signOut = () => API.post('/auth/signout');
export const demoLogin = () => API.post('/auth/demo');

export const isRoomIdValid = (roomId) => API.post('/room/isValid', { roomId });
export const getDemoRoom = () => API.get('/room/demo');

export const getRooms = () => API.get('/user/getrooms');
export const createRoom = (roomName) => API.post('/user/createroom', { roomName });
export const deleteRoom = (roomId) => API.post('/user/deleteroom', { roomId });
export const removeRoom = (roomId) => API.post('/user/removeroom', { roomId });

export const updateName = (name) => API.patch('/user/updatename', { name });
export const updateBio = (bio) => API.patch('/user/updatebio', { bio });

export const updateImage = (profileImage) => {
	const formData = new FormData();
	formData.append('profileImage', profileImage);
	// Let the browser set the multipart boundary itself.
	return API.patch('/user/updateimage', formData);
};

/**
 * Runs an API call and reports the outcome as a toast.
 *
 * `silent: true` suppresses the toasts - used for background calls such as
 * restoring a session from a stored token, where a failure just means "not
 * signed in" and should not surface as an error the user did not cause.
 */
export const handler = async (task, onSuccess, data, onFailure, options = {}) => {
	const { silent = false } = options;

	try {
		const res = await task(data);
		if (res.data.success) {
			onSuccess(res.data?.data);
			if (!silent) toast.success(res.data.msg, { toastId: res.data.msg });
		} else {
			if (!silent) toast.error(res.data.msg);
			if (onFailure) onFailure(res.data.msg);
		}
	} catch (error) {
		const message = error.response
			? error.response.data?.msg || 'Request failed'
			: 'Server offline: Network Error';
		if (!silent) toast.error(message);
		if (onFailure) onFailure(message);
	}
};
