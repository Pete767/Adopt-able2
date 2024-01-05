import { HeartIcon, RefreshIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { uiActions } from '../../store/ui-slice';
import { addToFavorites, deleteFBUserFavourite } from '../../lib/api';
import { useState } from 'react';
import { userActions } from '../../store/user-slice';

const AnimalCard = ({ loading, pet, petId, image, name, breeds, age, gender, distance }) => {
    const userLoggedIn = useSelector(state => state.user.userIsLoggedIn);
    const userId = useSelector(state => state.user.userId);
    const userFavorites = useSelector(state => state.user.userFavorites);
    const [addingFav, setAddingFav] = useState(false);

    const dispatch = useDispatch();


    const isthisFavPet = () => {
        return !!(userFavorites.find(favorites => favorites.petId === petId));
    }

    const addToFavoritesHandler = () => {
        if (!userLoggedIn) {
            dispatch(uiActions.toggleLogin());
        }
        else {
            setAddingFav(true);
            const existFavPet = isthisFavPet();

            if (existFavPet) {
                const petToDelete = userFavorites.find(favorites => favorites.petId === petId);
                dispatch(userActions.deleteUserFavourite(petToDelete.fbId));
                deleteFBUserFavourite({
                    fbId: petToDelete.fbId,
                    userId: userId
                });
                setAddingFav(false);
            }
            else {
                const addPet = async () => {
                    const fbId = await addToFavorites({
                        userId,
                        petId,
                        pet,
                        name,
                        image,
                        breeds,
                        gender,
                        age,
                        distance
                    });
                    dispatch(userActions.setUserFavorites([{
                        fbId: fbId,
                        petId,
                        pet,
                        name,
                        image,
                        breeds,
                        gender,
                        age,
                        distance
                    }]));
                    setAddingFav(false);
                }
                addPet();
            }
        }
    }


    return (
        <div className='relative w-full max-w-[90%] sm:max-w-[275px] xl:max-w-[325px] sm:mx-2 2xl:mx-5'>
            <Link to={`/${pet}/${petId}`} className={`flex flex-col  rounded-lg overflow-hidden mb-20 bg-white drop-shadow-md ${loading && 'animate-pulse'}`}>
                <div className='relative overflow-hidden h-80 bg-gray-400'>
                    <img src={image} alt={name} className='absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 object-cover w-full h-full' />
                </div>
                <div className='p-4'>
                    <h2 className='font-semibold text-stone-900 text-lg	'>{name}</h2>
                    <span className='text-slate-500 text-sm block mb-3'>{breeds}</span>
                    <div className='flex flex-col xl:flex-row justify-between'>
                        <span className='bg-orange-200 text-orange-900 text-sm font-medium px-3 py-1 rounded-xl mt-2 inline-block text-center xl:text-left'>
                            {age} | {gender}
                        </span>
                        <span className='border-slate-200 text-gray-700 text-sm font-normal px-2 py-1 rounded-sm mt-2 inline-block text-center xl:text-left'>
                            {distance} km Away
                        </span>
                    </div>
                </div>
            </Link>
            <button
                type='button'
                className={`absolute top-0 right-0 bg-black bg-opacity-50 p-1 m-2 rounded shadow`}
                onClick={addToFavoritesHandler}
                disabled={addingFav === true ? true : false}
            >
                {!addingFav &&
                    <HeartIcon className={`stroke-white stroke-2 h-6 ${isthisFavPet() ? 'fill-white hover:fill-white/50' : 'fill-transparent hover:fill-white/50'} `} />
                }
                {addingFav &&
                    <RefreshIcon className={`fill-white/90 h-6 animate-spin`} />
                }
            </button>
        </div>
    );
}

export default AnimalCard;