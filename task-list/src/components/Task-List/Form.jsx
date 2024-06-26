import { useState, useEffect, useRef } from "react";
import { Fade } from "react-reveal";
import MyCalendar from "./MyCalendar";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";

export const Form = ({
    handleSubmit,
    setInputName,
    selectedDate,
    setSelectedDate,
    handleDateChange,
}) => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [showSecondHeader, setShowSecondHeader] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(e.target)
            ) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setInputName(e.target.value);
    };

    const handleShowCalendar = () => {
        setShowCalendar(true);
    };

    const calendarRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSecondHeader(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleLogOut = async () => {
        try {
            const logOut = await axios.post(
                "https://task-listing.onrender.com/api/task-list/logout"
            );
            Cookies.remove("jwtToken");
            if (logOut.status === 200) {
                logout();
                navigate("/Login");
            }
        } catch (e) {
            console.error("Unable to Logout", e);
        }
    };
    // Check if token has expired, if yes log the user out
    useEffect(() => {
        const token = Cookies.get("jwtToken");
        if (token) {
            const decodedToken = jwt_decode(token);
            const currentTime = Date.now() / 1000; // Current time in seconds
            if (decodedToken.exp < currentTime) {
                // Token has expired, log the user out
                logout();
            }
        }
    }, [isLoggedIn, logout]);

    return (
        <>
            <div className="User-Login">
                <i className="fa-solid fa-user"></i>
                {isLoggedIn ? (
                    <p onClick={handleLogOut}>Log out</p>
                ) : (
                    <p onClick={() => navigate("/Login")}>Log in</p>
                )}
            </div>
            <div className="Form-Container">
                {!showSecondHeader && (
                    <Fade duration={2000} delay={500}>
                        <h1 className="list-header">
                            Welcome to your task list.
                        </h1>
                    </Fade>
                )}
                {showSecondHeader && (
                    <Fade duration={2000}>
                        <h1 className="list-header">Let's plan something...</h1>
                    </Fade>
                )}

                <form onSubmit={handleSubmit}>
                    <i
                        className="fa-solid fa-calendar-day"
                        onClick={handleShowCalendar}
                        ref={calendarRef}
                    ></i>

                    <div className="Calendar" ref={calendarRef}>
                        {showCalendar && (
                            <MyCalendar
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                handleDateChange={handleDateChange}
                            />
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder="Add a task"
                        onChange={handleChange}
                    ></input>
                    <button type="submit" className="btn">
                        Add
                    </button>
                </form>
            </div>
        </>
    );
};
