import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    let userToken = '';
    let userTokenExpiry = useSelector(state => state.user.userTokenExpiry);

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
            const response = await fetch('https://api.petfinder.com/v2/oauth2/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials&client_id=gMdiq0jIAMHEi4KjQJJ73oYKgfcxm1TwtUYBo68BZGheADtiWY&client_secret=4qHKXgfSzVbPVrZADVtJrJrsoPWjmTF6VcTGLVPk`
        });
            if (!response.ok) {
                throw new Error('Could not fetch token from petfinder.');
            }

            const data = await response.json();
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
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                }
            }
            );
            const data = await response.json();

            if (!response.ok) {
                let errorTitle = data.title;
                if (data.status === 400 && data['invalid-params'][0].message) {
                    errorTitle = data['invalid-params'][0].message;
                }
                throw new Error('Error fetching data from PETFINDER! ' + errorTitle);
            }

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