import Places from "./Places";
import Error from "./Error";
import { sortPlacesByDistance } from "../loc";
import fetchAvailablePlaces from "../Request";
import { useFetch } from "../hooks/useFetch";

function fetchAndSortPlaces() {
  return new Promise(async (resolve) => {
    const data = await fetchAvailablePlaces();
    if (data) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const sortedPlaces = sortPlacesByDistance(data?.places, latitude, longitude);
        const temp = {places: sortedPlaces};
        resolve(temp);
      });
    }
  });
}

export default function AvailablePlaces({ onSelectPlace }) {
  const {fetchedData: places, error } = useFetch(fetchAndSortPlaces, []);

  if (error) {
    return <Error title={error.title} message={error.message} />
  }

  return (
    <Places
      title="Available Places"
      places={places}
      onSelectPlace={onSelectPlace}
    />
  )
}