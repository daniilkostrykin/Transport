document.body.classList.add("dark-theme");

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toISOString().slice(0, 10);
    dateInput.value = today;
  }

  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);

  updateTotalTrips();

  // Код для переключения темы
  const themeToggle = document.getElementById("themeToggle");

  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("light-theme")) {
      themeToggle.textContent = "D";
    } else {
      themeToggle.textContent = "L";
    }
  });

  if (document.body.classList.contains("light-theme")) {
    themeToggle.textContent = "D";
  } else {
    themeToggle.textContent = "L";
  }
});

function updateCurrentTime() {
  const currentTimeElement = document.getElementById("currentTime");
  if (currentTimeElement) {
    const now = new Date();
    currentTimeElement.textContent = now.toLocaleTimeString();
  }
}

function updateTotalTrips() {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  const totalTrips = trips.reduce((total, trip) => total + trip.total, 0);

  const totalTripsElement = document.getElementById("totalTrips");
  if (totalTripsElement) {
    totalTripsElement.textContent = `Всего поездок: ${totalTrips}`;
  }
}

function submitForm() {
  const date = document.getElementById("date").value;
  const groundTransport =
    parseInt(document.getElementById("groundTransport").value) || 0;
  const trains = parseInt(document.getElementById("trains").value) || 0;
  const additionalMetro =
    parseInt(document.getElementById("additionalMetro").value) || 0;
  const additionalTrains =
    parseInt(document.getElementById("additionalTrains").value) || 0;

  const total = groundTransport + trains + additionalMetro + additionalTrains;
  const tripCost = calculateTripCost(
    groundTransport,
    trains,
    additionalMetro,
    additionalTrains
  );

  const tripData = {
    date: date,
    groundTransport: groundTransport,
    trains: trains,
    additionalMetro: additionalMetro,
    additionalTrains: additionalTrains,
    total: total,
    tripCost: tripCost.toFixed(2),
  };

  let trips = JSON.parse(localStorage.getItem("trips")) || [];
  const index = trips.findIndex((trip) => trip.date === date);

  if (index !== -1) {
    trips[index] = tripData;
  } else {
    trips.push(tripData);
  }

  console.log(tripData);
  localStorage.setItem("trips", JSON.stringify(trips));

  updateTotalTrips();

  document.getElementById("groundTransport").value = "";
  document.getElementById("trains").value = "";
  document.getElementById("additionalMetro").value = "";
  document.getElementById("additionalTrains").value = "";

  document.getElementById("success-message").style.display = "block";
  setTimeout(() => {
    document.getElementById("success-message").style.display = "none";
  }, 2000);
}

function calculateTripCost(
  groundTransport,
  trains,
  additionalMetro,
  additionalTrains
) {
  const groundTransportCost = groundTransport * 57;
  const trainsCost = trains * 76;
  const additionalMetroCost = additionalMetro * 57;
  const additionalTrainsCost = additionalTrains * 76;
  return (
    groundTransportCost +
    trainsCost +
    additionalMetroCost +
    additionalTrainsCost
  );
}

function calculateSavings() {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  const totalCost = trips.reduce(
    (total, trip) => total + parseFloat(trip.tripCost),
    0
  );
  const passCost = 2123;
  const savings = totalCost - passCost;

  alert("Сэкономлено: " + savings + " рублей");

  console.log("Сэкономлено: " + savings + " рублей");
}

function generateDates() {
  const startDate = new Date("2024-09-22");
  const endDate = new Date("2024-12-21");
  const dates = [];

  while (startDate <= endDate) {
    dates.push({
      date: startDate.toISOString().slice(0, 10),
      groundTransport: 0,
      trains: 0,
      additionalMetro: 0,
      additionalTrains: 0,
      total: 0,
      tripCost: (0).toFixed(2),
    });
    startDate.setDate(startDate.getDate() + 1);
  }

  localStorage.setItem("trips", JSON.stringify(dates));
}
