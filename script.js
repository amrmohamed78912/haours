document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#hoursTable tbody');
    const calculateButton = document.getElementById('calculateButton');
    const resetButton = document.getElementById('resetButton');

    // Create rows for 31 days
    for (let i = 1; i <= 31; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="time" class="check-in"></td>
            <td><input type="time" class="check-out"></td>
            <td class="hours-worked">0</td>
        `;
        tableBody.appendChild(row);
    }

    // Calculate daily hours worked
    function calculateDailyHours() {
        const rows = document.querySelectorAll('#hoursTable tbody tr');
        rows.forEach(row => {
            const checkInTime = row.querySelector('.check-in').value;
            const checkOutTime = row.querySelector('.check-out').value;
            const hoursWorkedCell = row.querySelector('.hours-worked');

            if (checkInTime && checkOutTime) {
                const checkIn = new Date(`1970-01-01T${checkInTime}:00`);
                const checkOut = new Date(`1970-01-01T${checkOutTime}:00`);
                let diff = (checkOut - checkIn) / (1000 * 60 * 60);
                if (diff < 0) diff += 24; // Adjust for overnight shifts
                hoursWorkedCell.textContent = diff.toFixed(2);
            }
        });
        saveData();
    }

    // Calculate total hours for 31 days
    calculateButton.addEventListener('click', () => {
        calculateDailyHours();
        const rows = document.querySelectorAll('#hoursTable tbody tr');
        let totalHours = 0;
        rows.forEach(row => {
            const hoursWorked = parseFloat(row.querySelector('.hours-worked').textContent);
            if (!isNaN(hoursWorked)) {
                totalHours += hoursWorked;
            }
        });
        alert(`إجمالي الساعات لشهر كامل: ${totalHours.toFixed(2)}`);
    });

    // Reset the table
    resetButton.addEventListener('click', () => {
        const rows = document.querySelectorAll('#hoursTable tbody tr');
        rows.forEach(row => {
            row.querySelector('.check-in').value = '';
            row.querySelector('.check-out').value = '';
            row.querySelector('.hours-worked').textContent = '0';
        });
        saveData();
    });

    // Save changes to local storage
    function saveData() {
        const data = [];
        const rows = document.querySelectorAll('#hoursTable tbody tr');
        rows.forEach(row => {
            data.push({
                checkIn: row.querySelector('.check-in').value,
                checkOut: row.querySelector('.check-out').value,
                hoursWorked: row.querySelector('.hours-worked').textContent
            });
        });
        localStorage.setItem('hoursData', JSON.stringify(data));
    }

    // Load changes from local storage
    function loadData() {
        const data = JSON.parse(localStorage.getItem('hoursData'));
        if (data) {
            const rows = document.querySelectorAll('#hoursTable tbody tr');
            data.forEach((item, index) => {
                const row = rows[index];
                row.querySelector('.check-in').value = item.checkIn;
                row.querySelector('.check-out').value = item.checkOut;
                row.querySelector('.hours-worked').textContent = item.hoursWorked;
            });
        }
    }

    // Load data when the page is loaded
    window.addEventListener('load', loadData);

    // Save data when the page is about to be unloaded
    window.addEventListener('beforeunload', saveData);

    // Calculate daily hours on time input change
    tableBody.addEventListener('input', calculateDailyHours);
});
