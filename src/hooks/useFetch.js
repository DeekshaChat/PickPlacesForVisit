import { useEffect, useState } from "react";

export function useFetch(fetchFn, initialValue) {

  const [fetchedData, setFetchedData] = useState(initialValue);
  const [error, setError] = useState();

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchFn();
        setFetchedData(data?.places);
      } catch (error) {
        setError({ message: 'Error in fetching user places' });
      }
    }

    getData();

  }, []);

  return { fetchedData, error, setFetchedData };
}