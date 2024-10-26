document.addEventListener("DOMContentLoaded", function () {
  loadTable();
});

function loadTable() {
  if (!localStorage.getItem("trips")) {
    generateDates();
  }
  const trips = JSON.parse(localStorage.getItem("trips")) || [];

  const today = new Date().toISOString().split("T")[0];
  trips.sort((a, b) => {
    if (a.date === today) return -1;
    if (b.date === today) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const tableBody = document.querySelector("#tripTable tbody");
  tableBody.innerHTML = "";

  trips.forEach((trip) => {
    const row = document.createElement("tr");
    if (trip.date === today) {
      row.id = "today";
    }

    for (const value of Object.values(trip)) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  });

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
