function submitForm() {
    const date = document.getElementById('date').value;
    const groundTransport = document.getElementById('groundTransport').value;
    const trains = document.getElementById('trains').value;
    const additionalMetro = document.getElementById('additionalMetro').value;
    const additionalTrains = document.getElementById('additionalTrains').value;

    const total = parseInt(groundTransport) + parseInt(trains) + parseInt(additionalMetro) + parseInt(additionalTrains);

    const tripData = {
        date: date,
        groundTransport: groundTransport,
        trains: trains,
        additionalMetro: additionalMetro,
        additionalTrains: additionalTrains,
        total: total
    };

    let trips = JSON.parse(localStorage.getItem('trips')) || [];
    trips.push(tripData);
    localStorage.setItem('trips', JSON.stringify(trips));
    window.location.href = 'table.html';
}

function loadTable() {
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
    let csvContent = 'data:text/csv;charset=utf-8,Дата,Наземный транспорт,Электрички,Доп. поездки на метро,Доп. поездки на электричке,Итого\n';

    trips.forEach(trip => {
        csvContent += `${trip.date},${trip.groundTransport},${trip.trains},${trip.additionalMetro},${trip.additionalTrains},${trip.total}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'trips.csv');
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

// Загружаем данные в таблицу при открытии страницы table.html
if (document.querySelector('#tripTable')) {
    loadTable();
}
