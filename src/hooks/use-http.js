import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createClient } from 'petfinder-js';

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    let userToken = '';
    let userTokenExpiry = useSelector(state => state.user.userTokenExpiry);

    const client = createClient({
        apiKey: process.env.REACT_APP_PETFINDER_API,
        secret: process.env.REACT_APP_PETFINDER_SECRET,
    });

    useEffect(() => {
        const localUserItems = localStorage.getItem("petfinder");

        if (localUserItems) {
            const parsedLocalUserItems = JSON.parse(localUserItems);
// eslint-disable-next-line
            userToken = parsedLocalUserItems.token;
            // eslint-disable-next-line
            userTokenExpiry = parsedLocalUserItems.tokenExpiry;
        }
    }, []);

    const getToken = async () => {
        try {
            const data = await client.authenticate();      
            const tokenExpiry = new Date().getTime() + data.expires_in * 1000;

            localStorage.setItem('petfinder',
                JSON.stringify({
                    token: data.access_token,
                    tokenExpiry: tokenExpiry
                })
            );
            return data.access_token;
        }
        catch (error) {
            setError(error.message)
        }

    };

    const fetchData = useCallback(async (url) => {
        setIsLoading(true);
        setError(null);

        if (!userToken) {
            // eslint-disable-next-line
            userToken = await getToken();
        }
        else {
            const currentTime = new Date().getTime();
            if (currentTime > userTokenExpiry) {
                // eslint-disable-next-line
                userToken = await getToken();
            }
        }

        try {
            const data = await client.animal.search();
            setResult(data);
        }
        catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, [userToken, userTokenExpiry]);


    return {
        isLoading,
        error,
        fetchData,
        result
    };
};

export default useHttp;