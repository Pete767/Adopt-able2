import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const FIREBASE_DOMAIN = db.ref();

export async function addToFavorites(petData) {

    const response = await fetch(`${FIREBASE_DOMAIN}/favorites/${petData.userId}.json`, {
        method: 'POST',
        body: JSON.stringify({
            petId: petData.petId,
            pet: petData.pet,
            name: petData.name,
            image: petData.image,
            breeds: petData.breeds,
            gender: petData.gender,
            age: petData.age,
            distance: petData.distance
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('Could not save favourite');
    }
    return data.name;
}

export async function getUserFavorites(userId) {
    const response = await fetch(`${FIREBASE_DOMAIN}/favorites/${userId}.json`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error('Could not get favorites from database');
    }

    const userFavorites = [];

    for (const key in data) {
        const favObj = {
            fbId: key,
            petId: data[key].petId,
            pet: data[key].pet,
            name: data[key].name,
            image: data[key].image,
            breeds: data[key].breeds,
            gender: data[key].gender,
            age: data[key].age,
            distance: data[key].distance
        }
        userFavorites.push(favObj);
    }

    return userFavorites;
}

export async function deleteFBUserFavourite(petData) {

    const response = await fetch(`${FIREBASE_DOMAIN}/favorites/${petData.userId}/${petData.fbId}.json`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Could not delete favourite');
    }
}