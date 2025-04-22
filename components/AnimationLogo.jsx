import React, { useState } from "react";
import { useEffect } from "react";
import { Logo1,Logo2,Logo3,Logo4 } from "../assets/svg/logos";
import "../style/AnimationLogo.css";


const AnimationLogo = () => {
    const [currentLogo, setCurrentLogo] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false); // state to control the animation
    const logos = [<Logo1 />, <Logo2 />, <Logo3 />, <Logo4 />];

    useEffect(() => {
        const animate = () => {
            const allpath = document.querySelectorAll("path");
            allpath.forEach((path) => {
                const length = path.getTotalLength();
                path.style.transition = "none";
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
            });

            setTimeout(() => {
                setIsAnimating(true); 
                allpath.forEach((path) => {
                    path.style.transition = "stroke-dashoffset 3s ease-in-out";
                    path.style.strokeDashoffset = "0";
                });
            }, 100);
        };

        animate(); // start animate

        const interval = setInterval(() => {
            setIsAnimating(false); //hide the previous logo
            setTimeout(() => {
                setCurrentLogo((prev) => (prev + 1) % logos.length); // change logo
                setTimeout(animate, 100); // initialize the animation after the logos has been switched
            }, 400); // waite after the logo has been switched
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ opacity: isAnimating ? 1 : 0, transition: "opacity 0.3s" }}>
            {logos[currentLogo]}
        </div>
    );
};

export default AnimationLogo;
