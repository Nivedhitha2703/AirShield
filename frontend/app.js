const API = "http://127.0.0.1:8000";

const $ = id => document.getElementById(id);


// Cursor atmosphere
const glow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", e => {

    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;

    gsap.to(".orbital-system", {
        x: (e.clientX / innerWidth - .5) * 25,
        y: (e.clientY / innerHeight - .5) * 25,
        duration: 1.2,
        ease: "power3.out"
    });

});


// Atmospheric motion
gsap.to(".fog-one", {
    x: 350,
    y: 100,
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

gsap.to(".fog-two", {
    x: -300,
    y: -80,
    duration: 15,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

gsap.to(".fog-three", {
    x: 250,
    duration: 18,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});


// Orbital system
gsap.to(".orbit-one", {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: "none"
});

gsap.to(".orbit-two", {
    rotation: -360,
    duration: 30,
    repeat: -1,
    ease: "none"
});


// Sensor nodes
gsap.to(".node", {
    y: -12,
    duration: 2,
    stagger: .3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});


// Clock
function updateClock() {

    $("clock").textContent =
        new Date().toLocaleTimeString("en-IN", {
            hour12: false
        });

}

setInterval(updateClock, 1000);
updateClock();


// API helper
async function api(endpoint) {

    const response = await fetch(`${API}${endpoint}`);

    if (!response.ok)
        throw new Error("API request failed");

    return response.json();
}


// Load backend data
async function loadData() {

    try {

        $("systemState").textContent = "SYNC";

        const [
            health,
            sensors,
            anomalies,
            events
        ] = await Promise.all([
            api("/health"),
            api("/sensors"),
            api("/anomalies"),
            api("/events")
        ]);

        updateMetrics(sensors, anomalies, events);

        renderEvents(events);

        $("systemState").textContent = "LIVE";

        gsap.from(".metric-card", {
            y: 15,
            opacity: 0,
            duration: .5,
            stagger: .08
        });

    } catch (error) {

        console.error(error);

        $("systemState").textContent = "OFFLINE";

    }

}


function updateMetrics(sensors, anomalies, events) {

    const sensorData = Array.isArray(sensors)
        ? sensors
        : sensors?.data || [];

    const anomalyData = Array.isArray(anomalies)
        ? anomalies
        : anomalies?.data || [];

    const eventData = Array.isArray(events)
        ? events
        : events?.data || [];

    $("sensorCount").textContent = sensorData.length;

    $("anomalyCount").textContent = anomalyData.length;

    $("eventCount").textContent = eventData.length;


    if (sensorData.length) {

        const first = sensorData[0];

        const pm =
            first.pm25 ??
            first.PM25 ??
            first.pm_25;

        if (pm !== undefined)
            $("pm25").textContent = Number(pm).toFixed(0);

    }

}


function renderEvents(events) {

    const list = $("eventsList");

    const data = Array.isArray(events)
        ? events
        : events?.data || [];

    if (!data.length) {

        list.innerHTML =
            `<div class="loading">
                No pollution events detected.
            </div>`;

        return;

    }

    list.innerHTML = data
        .slice(0, 6)
        .map((event, index) => {

            const sensor =
                event.sensor_id ||
                event.sensor ||
                `NODE-${index + 1}`;

            const risk =
                event.risk_level ||
                event.risk ||
                "MONITOR";

            return `
                <div class="event-row">
                    <strong>${sensor}</strong>
                    <span>${risk}</span>
                    <span class="event-tag">● DETECTED</span>
                </div>
            `;

        })
        .join("");

}


// Image preview
$("imageInput").addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;

    const preview = $("visualPreview");

    const url = URL.createObjectURL(file);

    preview.style.background =
        `linear-gradient(180deg, transparent, rgba(0,0,0,.5)),
         url("${url}") center/cover`;

    $("imageResult").textContent =
        `${file.name} ready for AI analysis`;

});


// Scroll
function scrollToSensors() {

    document
        .getElementById("sensors")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// Entrance animation
gsap.from(".hero-copy > *", {
    y: 35,
    opacity: 0,
    duration: .8,
    stagger: .12,
    ease: "power3.out"
});

gsap.from(".orbital-system", {
    scale: .8,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
});


// Start backend connection
loadData();

setInterval(loadData, 30000);