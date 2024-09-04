function showTimeWork(startDate, elementId) {
    const currentDate = new Date();
    let year = currentDate.getFullYear() - startDate.getFullYear();
    let month = currentDate.getMonth() - startDate.getMonth();
    if (month < 0) { year--; month += 12; }

    const tiempo = 
        (year ? `${year} año${year > 1 ? 's' : ''}` : '') + 
        (year && month ? ' y ' : '') + 
        (month ? `${month} mes${month > 1 ? 'es' : ''}` : '') || 
        'Menos de un mes';

    document.getElementById(elementId).innerHTML += ` <br> ${tiempo}`;
}
