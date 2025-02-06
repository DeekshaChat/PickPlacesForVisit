const BASE_URL = 'http://localhost:3000/';
export default async function fetchAvailablePlaces () {
  const apiData = await fetch(`${BASE_URL}places`);
  if (apiData?.ok) {
    const data = await apiData?.json();
    return data;
  } else {
    console.log('hereeee');
    
    throw new Error('Something went wrong');
  }
}


export async function fetchUserPlaces (places) {
  const apiData = await fetch(`${BASE_URL}user-places`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({places})
  });
  if (apiData?.ok) {
    const data = await apiData?.json();
    return data;
  } else {
    throw new Error('Something went wrong');
  }
}

export async function getUserPlaces () {
  const apiData = await fetch(`${BASE_URL}user-places`);
  if (apiData?.ok) {
    const data = await apiData?.json();
    return data;
  } else {
    throw new Error('Something went wrong');
  }
}