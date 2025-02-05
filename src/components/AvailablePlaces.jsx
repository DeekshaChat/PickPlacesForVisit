import { useEffect, useState } from "react";
import Places from "./Places";

export default function AvailablePlaces({ onSelectPlace }) {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/places')
    .then(response => response.json())
    .then(data => {
      console.log('data=====>',data)
      setPlaces(data.places);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

  return (
    <Places
      title="Available Places"
      places={places}
      onSelectPlace={onSelectPlace}
    />
  )
}