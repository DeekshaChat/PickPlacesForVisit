import { useRef, useState, useCallback } from 'react';
import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchUserPlaces, getUserPlaces } from './Request.js';
import Error from './components/Error.jsx';
import { useFetch } from './hooks/useFetch.js';

const storedPickedPlaces = localStorage.getItem('pickedPlaces') ? localStorage.getItem('pickedPlaces') : [];
const storedPlacesinJSON = storedPickedPlaces && storedPickedPlaces.length > 0 ?  JSON.parse(storedPickedPlaces): [];
localStorage.setItem('pickedPlaces', JSON.stringify(storedPlacesinJSON));

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const {fetchedData: pickedPlaces, error, setFetchedData: setPickedPlaces} = useFetch(getUserPlaces, storedPlacesinJSON);

  function handleStartRemovePlace(place) {
    setIsOpen(true);
    selectedPlace.current = place.id;
  }

  function handleStopRemovePlace() {
    setIsOpen(false);
  }

  async function handleSelectPlace(place) {
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
    try {
      await fetchUserPlaces([place, ...pickedPlaces]);
    } catch (error) {
      setError({ message: 'Error in updating user places' });
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) => {
     const updatedPlaces = prevPickedPlaces.filter((place) => place.id !== selectedPlace.current);
     fetchUserPlaces(updatedPlaces);
     return updatedPlaces;
    }
    );
    setIsOpen(false);
  },[]);

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
        {error ? 
        <Error message={error.message}/> 
        : 
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        }
        <AvailablePlaces
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
