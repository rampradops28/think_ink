import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

//Styles
import style from './global.module.scss';

//Components
import Navbar from './components/Navbar';

//Pages
//
// Only the homepage ships in the initial bundle. The whiteboard pulls in the
// canvas engine and Socket.IO wiring, which nobody needs until they open a
// room, so each route is fetched on demand.
const Homepage = lazy(() => import('./Pages/HomePage'));
const WhiteBoard = lazy(() => import('./Pages/WhiteBoard'));
const DashBoard = lazy(() => import('./Pages/DashBoard'));
const ErrorPage = lazy(() => import('./Pages/ErrorPage'));

const RouteFallback = () => (
	<div className={style.routeFallback}>
		<span
			className={style.spinner}
			role='status'
			aria-label='Loading'
		/>
	</div>
);

function App() {
	return (
		<div className={style.app}>
			<Navbar />
			<Suspense fallback={<RouteFallback />}>
				<Routes>
					<Route
						path='/'
						element={<Homepage />}
					/>
					<Route
						path='/room/:roomId'
						element={<WhiteBoard />}
					/>
					<Route
						path='/dashboard'
						element={<DashBoard />}
					/>
					<Route
						path='/*'
						element={<ErrorPage />}
					/>
				</Routes>
			</Suspense>
		</div>
	);
}

export default App;
