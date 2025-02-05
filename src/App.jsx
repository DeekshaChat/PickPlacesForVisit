import { useRef, useState, useEffect, useCallback } from 'react';
import Places from './components/Places.jsx';
// import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';
import AvailablePlaces from './components/AvailablePlaces.jsx';

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

  function handleSelectPlace(place) {
    setPickedPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((val) => val.id === place.id)) {
        return prevPickedPlaces;
      }
      const pickPlace = prevPickedPlaces && prevPickedPlaces.length > 0 && prevPickedPlaces.find((val) => val.id === place.id) 
        ? prevPickedPlaces.find((val) => val.id === place.id)
        : place;
      const tempPlaces = [pickPlace, ...prevPickedPlaces];
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
    // navigator.geolocation.getCurrentPosition((position) => {
    //   const { latitude, longitude } = position.coords;
    //   const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, latitude, longitude);
    //   setAvailablePlaces(sortedPlaces);
    // });
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
        <AvailablePlaces
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
