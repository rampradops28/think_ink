import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

//Styles
import './styles/theme.scss';
import 'react-toastify/dist/ReactToastify.css';

//Router
import { BrowserRouter } from 'react-router-dom';

//Toast
import { ToastContainer } from 'react-toastify';

//Global Context
import { AppProvider } from './context';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AppProvider>
			<BrowserRouter>
				<ToastContainer
					autoClose={2500}
					limit={3}
					position='top-center'
					newestOnTop
					// Follows the app theme instead of being pinned to dark.
					theme='colored'
					style={{ fontSize: '14px' }}
				/>
				<App />
			</BrowserRouter>
		</AppProvider>
	</StrictMode>
);
