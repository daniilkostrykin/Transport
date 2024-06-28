document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
});

function submitForm() {
    const date = document.getElementById('date').value;
    const groundTransport = document.getElementById('groundTransport').value;
    const trains = document.getElementById('trains').value;
    const additionalMetro = document.getElementById('additionalMetro').value;
    const additionalTrains = document.getElementById('additionalTrains').value;

    const total = parseInt(groundTransport) + parseInt(trains) + parseInt(additionalMetro) + parseInt(additionalTrains);

    const tripData = {
        date: date,
        groundTransport: parseInt(groundTransport),
        trains: parseInt(trains),
        additionalMetro: parseInt(additionalMetro),
        additionalTrains: parseInt(additionalTrains),
        total: total
    };

    let trips = JSON.parse(localStorage.getItem('trips')) || [];
    const index = trips.findIndex(trip => trip.date === date);

    if (index !== -1) {
        trips[index] = tripData;
    } else {
        trips.push(tripData);
    }

    localStorage.setItem('trips', JSON.stringify(trips));
    window.location.href = 'table.html';
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
            total: 0
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

// Загружаем данные в таблицу при открытии страницы table.html
if (document.querySelector('#tripTable')) {
    loadTable();
}
