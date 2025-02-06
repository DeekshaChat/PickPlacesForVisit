import { useEffect, useState } from "react";
import Places from "./Places";
import Error from "./Error";
import { sortPlacesByDistance } from "../loc";

export default function AvailablePlaces({ onSelectPlace }) {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
  async function fetchData() {
    try {
      const apiData = await fetch('http://localhost:3000/places');
      if (apiData?.ok) {
        const data = await apiData?.json();
        navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const sortedPlaces = sortPlacesByDistance(data?.places, latitude, longitude);
        setPlaces(sortedPlaces);
      });
      } else {
        setError({ message: 'Something went wrong' });
      }
    } catch (error) {
      setError({ message: error?.message });
    }}

  fetchData();
  }, []);

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