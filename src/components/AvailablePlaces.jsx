import { useEffect, useState } from 'react';
import { fetchAvailablePlaces } from '../http.js';
import { sortPlacesByDistance } from '../loc.js';
import ErrorPage from './Error.jsx';
import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
	const [isFetching, setIsFetching] = useState(false);
	const [availablePlaces, setAvailablePlaces] = useState([]);
	const [error, setError] = useState();

	useEffect(() => {
		async function fetchPlaces() {
			setIsFetching(true);

			try {
				const places = await fetchAvailablePlaces();

				navigator.geolocation.getCurrentPosition(position => {
					const sortedPlaces = sortPlacesByDistance(
						places,
						position.coords.latitude,
						position.coords.longitude
					);
					setAvailablePlaces(sortedPlaces);
					setIsFetching(false);
				});
			} catch (error) {
				setError({
					message:
						error.message || 'Could not fetch places, please try again later.',
				});
				setIsFetching(false);
			}
		}

		fetchPlaces();
	}, []);

	if (error) {
		return (
			<ErrorPage
				title="An error occured!"
				message={error.message}
				onConfirm={() => setError(null)}
			/>
		);
	}

	return (
		<Places
			title="Available Places"
			places={availablePlaces}
			isLoading={isFetching}
			loadingText="Fetching place data..."
			fallbackText="No places available."
			onSelectPlace={onSelectPlace}
		/>
	);
}
