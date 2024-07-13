document.body.classList.add('dark-theme');


document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    updateTotalTrips();
});

function updateCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleTimeString();
    }
}

function updateTotalTrips() {
    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    const totalTrips = trips.reduce((total, trip) => total + trip.total, 0);

    const totalTripsElement = document.getElementById('totalTrips');
    if (totalTripsElement) {
        totalTripsElement.textContent = `Всего поездок: ${totalTrips}`;
    }
}

function submitForm() {
    const date = document.getElementById('date').value;
    const groundTransport = document.getElementById('groundTransport').value;
    const trains = document.getElementById('trains').value;
    const additionalMetro = document.getElementById('additionalMetro').value;
    const additionalTrains = document.getElementById('additionalTrains').value;

    const total = parseInt(groundTransport) + parseInt(trains) + parseInt(additionalMetro) + parseInt(additionalTrains);
    const tripCost = calculateTripCost(groundTransport, trains, additionalMetro, additionalTrains);

    const tripData = {
        date: date,
        groundTransport: parseInt(groundTransport),
        trains: parseInt(trains),
        additionalMetro: parseInt(additionalMetro),
        additionalTrains: parseInt(additionalTrains),
        total: total,
        tripCost: tripCost.toFixed(2)
    };

    let trips = JSON.parse(localStorage.getItem('trips')) || [];
    const index = trips.findIndex(trip => trip.date === date);

    if (index !== -1) {
        trips[index] = tripData;
    } else {
        trips.push(tripData);
    }

    localStorage.setItem('trips', JSON.stringify(trips));
    updateTotalTrips();
    window.location.href = 'table.html';
}

function calculateTripCost(groundTransport, trains, additionalMetro, additionalTrains) {
    const groundTransportCost = groundTransport * 57; // Коэффициент для наземного транспорта
    const trainsCost = trains * 76; // Коэффициент для электричек
    const additionalMetroCost = additionalMetro * 57; // Коэффициент для доп. поездок на метро
    const additionalTrainsCost = additionalTrains * 76; // Коэффициент для доп. поездок на электричке
    return groundTransportCost + trainsCost + additionalMetroCost + additionalTrainsCost;
}

function calculateSavings() {
    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    const totalCost = trips.reduce((total, trip) => total + parseFloat(trip.tripCost), 0);
    const passCost = 2123; // Цена проездного, заданная разработчиком
    const savings = totalCost - passCost;
    alert(`Сэкономлено на транспорте: ${savings.toFixed(2)} руб.`);
}

function generateDates() {
    const startDate = new Date('2024-06-25');
    const endDate = new Date('2024-09-22');
    const dates = [];

    while (startDate <= endDate) {
        dates.push({
            date: startDate.toISOString().split('T')[0],
            groundTransport: 0,
            trains: 0,
            additionalMetro: 0,
            additionalTrains: 0,
            total: 0,
            tripCost: (0).toFixed(2)
        });
        startDate.setDate(startDate.getDate() + 1);
    }

    localStorage.setItem('trips', JSON.stringify(dates));
}

function loadTable() {
    if (!localStorage.getItem('trips')) {
        generateDates();
    }
    const trips = JSON.parse(localStorage.getItem('trips')) || [];

    const tableBody = document.querySelector('#tripTable tbody');
    tableBody.innerHTML = '';

    trips.forEach(trip => {
        const row = document.createElement('tr');
        
        for (const value of Object.values(trip)) {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        }
        
        tableBody.appendChild(row);
    });
}

function downloadExcel() {
    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    const worksheet = XLSX.utils.json_to_sheet(trips);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Trips");
    XLSX.writeFile(workbook, "trips.xlsx");
}

if (document.querySelector('#tripTable')) {
    loadTable();
}
/*
document.getElementById('themeToggle').addEventListener('click', function() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
    if (currentTheme === 'dark-theme') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
    });*/
    document.addEventListener("DOMContentLoaded", function() {
        const themeToggle = document.getElementById("themeToggle");
      
        themeToggle.addEventListener("click", function() {
          document.body.classList.toggle("light-theme");
          document.body.classList.toggle("dark-theme");
      
          if (document.body.classList.contains("light-theme")) {
            themeToggle.textContent = "Dark";
          } else {
            themeToggle.textContent = "Light";
          }
        });
      
        // Установите начальный текст кнопки в зависимости от начальной темы
        if (document.body.classList.contains("light-theme")) {
          themeToggle.textContent = "Dark";
        } else {
          themeToggle.textContent = "Light";
        }
      });
      