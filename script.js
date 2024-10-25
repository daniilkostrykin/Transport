/*В приложении норм, на сайте нет*/
document.body.classList.add("dark-theme");

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toLocaleDateString("en-CA"); // Формат YYYY-MM-DD
    dateInput.value = today;
  }

  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);

  updateTotalTrips();

  // Load the table with today's date at the top
  loadTable();
  scrollToToday();
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

  // Очистка формы, кроме поля даты
  document.getElementById("groundTransport").value = "";
  document.getElementById("trains").value = "";
  document.getElementById("additionalMetro").value = "";
  document.getElementById("additionalTrains").value = "";

  // Показать сообщение об успешной отправке
  document.getElementById("success-message").style.display = "block";
  setTimeout(() => {
    document.getElementById("success-message").style.display = "none";
  }, 2000); // Скрыть сообщение через 2 секунды
}

function calculateTripCost(
  groundTransport,
  trains,
  additionalMetro,
  additionalTrains
) {
  const groundTransportCost = groundTransport * 57; // Коэффициент для наземного транспорта
  const trainsCost = trains * 76; // Коэффициент для электричек
  const additionalMetroCost = additionalMetro * 57; // Коэффициент для доп. поездок на метро
  const additionalTrainsCost = additionalTrains * 76; // Коэффициент для доп. поездок на электричке
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
  const passCost = 2123; // Цена проездного, заданная разработчиком
  const savings = totalCost - passCost;

  // Используем alert для передачи данных
  alert("Сэкономлено: " + savings + " рублей");

  // Можно использовать console.log для отладки
  console.log("Сэкономлено: " + savings + " рублей");
}

function generateDates() {
  const startDate = new Date("2024-09-22");
  const endDate = new Date("2024-12-21");
  const dates = [];

  while (startDate <= endDate) {
    dates.push({
      date: startDate.toLocaleDateString("en-CA"), // Формат YYYY-MM-DD
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

function loadTable() {
  if (!localStorage.getItem("trips")) {
    generateDates();
  }
  const trips = JSON.parse(localStorage.getItem("trips")) || [];

  // Сортировка поездок так, чтобы текущая дата была на первом месте
  const today = new Date().toISOString().split("T")[0];
  trips.sort((a, b) => {
    if (a.date === today) return -1;
    if (b.date === today) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const tableBody = document.querySelector("#tripTable tbody");
  tableBody.innerHTML = "";

  // Обновляем таблицу
  trips.forEach((trip) => {
    const row = document.createElement("tr");
    if (trip.date === today) {
      row.id = "today"; // Присваиваем идентификатор строке с текущей датой
    }

    for (const value of Object.values(trip)) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  });

  // Генерация карточек для мобильных устройств
  const tableContainer = document.querySelector(".table-container");
  if (window.innerWidth <= 768) {
    const cardContainer = document.createElement("div");
    cardContainer.className = "card-container";
    trips.forEach((trip) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
                <div><span>Дата:</span> ${trip.date}</div>
                <div><span>Наземный транспорт:</span> ${trip.groundTransport}</div>
                <div><span>Электрички:</span> ${trip.trains}</div>
                <div><span>Доп. поездки на метро:</span> ${trip.additionalMetro}</div>
                <div><span>Доп. поездки на электричке:</span> ${trip.additionalTrains}</div>
                <div><span>Итого:</span> ${trip.total}</div>
                <div><span>Стоимость поездок за день:</span> ${trip.tripCost}</div>
            `;
      cardContainer.appendChild(card);
    });
    tableContainer.appendChild(cardContainer);
  }
}

function scrollToToday() {
  const todayRow = document.getElementById("today");
  if (todayRow) {
    todayRow.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function downloadExcel() {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  const worksheet = XLSX.utils.json_to_sheet(trips);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Trips");
  XLSX.writeFile(workbook, "trips.xlsx");
}

document.addEventListener("DOMContentLoaded", function () {
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

  // Установите начальный текст кнопки в зависимости от начальной темы
  if (document.body.classList.contains("light-theme")) {
    themeToggle.textContent = "D";
  } else {
    themeToggle.textContent = "L";
  }
});
