import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Error from '../components/Error';
import { useDispatch, useSelector } from "react-redux";
import '../styles/Profile.css'
import Diagram from '../components/Diagram';
import { fetchHasReadingTimeAnytime } from "../reducers/readingTimeForTodaySlice";
import UserProfile from '../components/UserProfile';

function Profile() {
    const [isLoadingGlobal, setIsLoadingGlobal] = useState(true);
    const { user } = useAuthContext();
    const dispatchRedux = useDispatch();
    const { hasReadingTimeAnytime } = useSelector((state) => state.readingTimeForToday);

    useEffect(() => {
        document.title = `User's profile`;
        dispatchRedux(fetchHasReadingTimeAnytime(user));
    }, [dispatchRedux, user]);

    return (
        <>
            <NavBar />
            <main>
                {isLoadingGlobal ? null :
                    <Header title={`Profile`} />
                }
                <Error />
                <div className="profile__container">
                    <UserProfile isLoadingGlobal={isLoadingGlobal} setIsLoadingGlobal={setIsLoadingGlobal} />
                    {hasReadingTimeAnytime ?
                        <Diagram />
                        : null}
                </div>
            </main>
        </>
    )
}

export default Profile;