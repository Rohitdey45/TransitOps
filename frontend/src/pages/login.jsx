// ==============================
// Sidebar Active Menu
// ==============================

const menuItems = document.querySelectorAll(".menu li");

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        menuItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
    });
});

// ==============================
// Notification Button
// ==============================

const notifyBtn = document.querySelector(".icon-btn");

notifyBtn.addEventListener("click", () => {
    alert("🔔 No new notifications.");
});

// ==============================
// Card Hover Animation
// ==============================

const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-8px)";
        card.style.transition = "0.3s";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
    });
});

// ==============================
// Fleet Utilization Chart
// ==============================

const fleetChart = document.getElementById("fleetChart");

if (fleetChart) {
    new Chart(fleetChart, {
        type: "line",
        data: {
            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
            ],
            datasets: [
                {
                    label: "Fleet Utilization %",
                    data: [65, 70, 82, 76, 91, 86, 89],
                    borderColor: "#2563EB",
                    backgroundColor: "rgba(37,99,235,.12)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: "#2563EB",
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });
}

// ==============================
// Vehicle Status Chart
// ==============================

const statusChart = document.getElementById("statusChart");

if (statusChart) {
    new Chart(statusChart, {
        type: "doughnut",
        data: {
            labels: [
                "Available",
                "On Trip",
                "Maintenance",
            ],
            datasets: [
                {
                    data: [62, 28, 10],
                    backgroundColor: [
                        "#22C55E",
                        "#2563EB",
                        "#F59E0B",
                    ],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            cutout: "70%",
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
        },
    });
}

// ==============================
// Search Function
// ==============================

const search = document.querySelector(".search input");

search.addEventListener("keyup", function () {

    let value = this.value.toLowerCase();

    document.querySelectorAll(".menu li").forEach((item) => {

        let text = item.innerText.toLowerCase();

        if (text.includes(value)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }

    });

});

// ==============================
// Animated Counter
// ==============================

const counters = document.querySelectorAll(".card h1");

counters.forEach((counter) => {

    const target = parseInt(counter.innerText);

    if (isNaN(target)) return;

    let count = 0;

    const speed = target / 50;

    const update = () => {

        count += speed;

        if (count < target) {
            counter.innerText = Math.floor(count);
            requestAnimationFrame(update);
        } else {
            counter.innerText = target;
        }

    };

    update();

});

// ==============================
// Greeting
// ==============================

const hour = new Date().getHours();

let greet = "Welcome";

if (hour < 12) greet = "Good Morning";
else if (hour < 18) greet = "Good Afternoon";
else greet = "Good Evening";

console.log(`${greet}, Fleet Manager!`);