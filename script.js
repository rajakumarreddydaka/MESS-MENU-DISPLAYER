let menuData = [];
let currentContext = {
    mode: 'today', 
    dateStr: null   
};

// Initial Load
fetch('updated_data.json')
    .then(res => res.json())
    .then(data => {
        menuData = data;
        // Default to showing today's menu on load
        const today = getFormattedDate(new Date());
        currentContext.dateStr = today;
        displayFullDay(today, "Today's Menu");
    });

const output = document.getElementById('output');
const dateInput = document.getElementById('date');

function getFormattedDate(dateObj) {
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}-${m}-${y}`;
}

// Today
document.getElementById('tm').addEventListener('click', () => {
    const today = getFormattedDate(new Date());
    currentContext = { mode: 'today', dateStr: today };
    displayFullDay(today, "Today's Menu");
});

// Tomorrow
document.getElementById('tom').addEventListener('click', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = getFormattedDate(tomorrow);
    currentContext = { mode: 'tomorrow', dateStr: dateStr };
    displayFullDay(dateStr, "Tomorrow's Menu");
});

// Weekly
document.getElementById('wm').addEventListener('click', () => {
    currentContext = { mode: 'weekly', dateStr: null };
    displayWeekly();
});

// Date Picker
dateInput.addEventListener('change', () => {
    const [y, m, d] = dateInput.value.split('-');
    const formattedDate = `${d}-${m}-${y}`;
    currentContext = { mode: 'picker', dateStr: formattedDate };
    displayFullDay(formattedDate, `Menu for ${formattedDate}`);
});

// Meal Buttons
function handleMeal(mealType) {
    if (currentContext.mode === 'weekly') {
        displayWeekly(mealType);
    } else if (currentContext.dateStr) {
        const data = menuData.find(item => item.Dates === currentContext.dateStr);
        if (data) {
            output.innerHTML = `<h3>${mealType} (${data.Dates})</h3><hr><p>${data[mealType]}</p>`;
        }
    }
}

document.getElementById('bf').addEventListener('click', () => handleMeal('Breakfast'));
document.getElementById('an').addEventListener('click', () => handleMeal('Lunch'));
document.getElementById('eve').addEventListener('click', () => handleMeal('Snacks'));
document.getElementById('ngt').addEventListener('click', () => handleMeal('Dinner'));

function displayFullDay(dateStr, title) {
    const day = menuData.find(item => item.Dates === dateStr);
    if (day) {
        output.innerHTML = `<h3>${title} - ${day.Dates}</h3><hr>
            <p><strong>Breakfast:</strong> ${day.Breakfast}</p>
            <p><strong>Lunch:</strong> ${day.Lunch}</p>
            <p><strong>Snacks:</strong> ${day.Snacks}</p>
            <p><strong>Dinner:</strong> ${day.Dinner}</p>`;
    } else {
        output.innerHTML = `<p>No data found for ${dateStr}.</p>`;
    }
}

function displayWeekly(meal = null) {
    let html = `<h3>${meal ? meal : 'Full'} Weekly Menu</h3><hr>`;
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const dateStr = getFormattedDate(d);
        const day = menuData.find(item => item.Dates === dateStr);
        if (day) {
            html += `<div style="margin-bottom:15px;"><strong>${day.Dates}</strong>: ${meal ? day[meal] : '<br>B: '+day.Breakfast+'<br>L: '+day.Lunch}</div>`;
        }
    }
    output.innerHTML = html;
}