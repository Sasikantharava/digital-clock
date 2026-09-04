/* ========================================
   ELEMENTS
======================================== */

const hoursElement =
    document.getElementById("hours");

const minutesElement =
    document.getElementById("minutes");

const secondsElement =
    document.getElementById("seconds");

const ampmElement =
    document.getElementById("ampm");


const hourRing =
    document.getElementById("hour-ring");

const minuteRing =
    document.getElementById("minute-ring");

const secondRing =
    document.getElementById("second-ring");


const hourDot =
    document.querySelector(".hours-card .moving-dot");

const minuteDot =
    document.querySelector(".minutes-card .moving-dot");

const secondDot =
    document.querySelector(".seconds-card .moving-dot");


/* ========================================
   CIRCLE CONFIGURATION
======================================== */

const radius = 72;

const circumference =
    2 * Math.PI * radius;


/*
    Prepare SVG rings
*/

[
    hourRing,
    minuteRing,
    secondRing
].forEach(ring => {

    ring.style.strokeDasharray =
        circumference;

    ring.style.strokeDashoffset =
        circumference;

});


/* ========================================
   CREATE TICKS
======================================== */

function createTicks(element, count) {

    for (let i = 0; i < count; i++) {

        const tick =
            document.createElement("span");

        tick.classList.add("tick");

        tick.style.transform =
            `rotate(${i * (360 / count)}deg)`;

        element.appendChild(tick);

    }

}


createTicks(
    document.getElementById("hour-ticks"),
    12
);

createTicks(
    document.getElementById("minute-ticks"),
    60
);

createTicks(
    document.getElementById("second-ticks"),
    60
);


/* ========================================
   FORMAT NUMBER
======================================== */

function formatNumber(number) {

    return number
        .toString()
        .padStart(2, "0");

}


/* ========================================
   UPDATE RING
======================================== */

function updateRing(ring, progress) {

    const offset =
        circumference -
        progress * circumference;

    ring.style.strokeDashoffset =
        offset;

}


/* ========================================
   MOVE DOT
======================================== */

function moveDot(dot, progress) {

    const angle =
        progress * 360 - 90;

    const radians =
        angle * Math.PI / 180;

    const x =
        108 * Math.cos(radians);

    const y =
        108 * Math.sin(radians);

    dot.style.transform =
        `translate(
            calc(-50% + ${x}px),
            calc(-50% + ${y}px)
        )`;

}


/* ========================================
   NUMBER PULSE
======================================== */

let previousSecond = -1;


function pulseNumber(element) {

    element.classList.remove("pulse");

    /*
        Force browser reflow so the animation
        can restart every second.
    */

    void element.offsetWidth;

    element.classList.add("pulse");

}


/* ========================================
   CLOCK UPDATE
======================================== */

function updateClock() {

    const now =
        new Date();


    let hours =
        now.getHours();

    const minutes =
        now.getMinutes();

    const seconds =
        now.getSeconds();

    const milliseconds =
        now.getMilliseconds();


    /* ========================================
       AM / PM
    ======================================== */

    const ampm =
        hours >= 12
            ? "PM"
            : "AM";


    /*
        Convert to 12-hour format
    */

    hours =
        hours % 12 || 12;


    /* ========================================
       DISPLAY
    ======================================== */

    hoursElement.textContent =
        formatNumber(hours);

    minutesElement.textContent =
        formatNumber(minutes);

    secondsElement.textContent =
        formatNumber(seconds);

    ampmElement.textContent =
        ampm;


    /* ========================================
       PRECISE PROGRESS
    ======================================== */

    /*
        Hours
        12 hours = 1 complete circle
    */

    const hourProgress =
        (
            (hours % 12) +
            minutes / 60 +
            seconds / 3600
        ) / 12;


    /*
        Minutes
        60 minutes = 1 complete circle
    */

    const minuteProgress =
        (
            minutes +
            seconds / 60 +
            milliseconds / 60000
        ) / 60;


    /*
        Seconds
        60 seconds = 1 complete circle
    */

    const secondProgress =
        (
            seconds +
            milliseconds / 1000
        ) / 60;


    /* ========================================
       UPDATE RINGS
    ======================================== */

    updateRing(
        hourRing,
        hourProgress
    );

    updateRing(
        minuteRing,
        minuteProgress
    );

    updateRing(
        secondRing,
        secondProgress
    );


    /* ========================================
       UPDATE DOTS
    ======================================== */

    moveDot(
        hourDot,
        hourProgress
    );

    moveDot(
        minuteDot,
        minuteProgress
    );

    moveDot(
        secondDot,
        secondProgress
    );


    /* ========================================
       SECOND CHANGE ANIMATION
    ======================================== */

    if (seconds !== previousSecond) {

        pulseNumber(
            secondsElement
        );

        previousSecond =
            seconds;

    }


    /*
        Continue animation.
        This makes the second hand/ring smooth
        instead of jumping every second.
    */

    requestAnimationFrame(
        updateClock
    );

}


/* ========================================
   START CLOCK
======================================== */

updateClock();