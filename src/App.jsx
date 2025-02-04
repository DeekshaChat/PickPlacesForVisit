import { useRef, useState, useEffect, useCallback } from 'react';
import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

const storedPickedPlaces = localStorage.getItem('pickedPlaces') ? localStorage.getItem('pickedPlaces') : [];
const storedPlacesinJSON = storedPickedPlaces && storedPickedPlaces.length > 0 ?  JSON.parse(storedPickedPlaces): [];
localStorage.setItem('pickedPlaces', JSON.stringify(storedPlacesinJSON));

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlacesinJSON);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  function handleStartRemovePlace(id) {
    setIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsOpen(false);
  }

  function handleSelectPlace(id) {
    
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      const tempPlaces = [place, ...prevPickedPlaces];
      localStorage.setItem('pickedPlaces', JSON.stringify(tempPlaces));
      return tempPlaces;
    });
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) => {
     const updatedPlaces = prevPickedPlaces.filter((place) => place.id !== selectedPlace.current);
     localStorage.setItem('pickedPlaces', JSON.stringify(updatedPlaces));
     return updatedPlaces;
    }
    );
    setIsOpen(false);
  },[]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, latitude, longitude);
      setAvailablePlaces(sortedPlaces);
    });
  }, []);
  

  return (
    <>
      <Modal ref={modal} open={isOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
