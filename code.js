(function(){

    function convertPeriod(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    };

    function renderGarage () {
        const garage = getGarage();
        $("#garage").html("");
        garage.forEach(c => addCarToGarage(c))
    };

    function addCarToGarage (car) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${car.brand} ${car.name}</td>
            <td>${car.licence}</td>
            <td data-time="${car.time}">
                ${new Date(car.time)
                        .toLocaleString('pt-BR', { 
                            hour: 'numeric', minute: 'numeric' 
                })}
            </td>
            <td>
                <button class="delete">x</button>
            </td>
        `;

        $("#garage").append(row);
    };

    function checkOut(info) {
        console.log(info)
        let period = new Date() - new Date(info[2].dataset.time);
        period = convertPeriod(period);

        const licence = info[1].textContent;
        const msg = `O veículo ${info[0].textContent} de placa ${licence} permaneceu ${period} estacionado. \n\n Deseja encerrar?`;

        if(!confirm(msg)) return;
        
        const garage = getGarage().filter(c => c.licence !== licence);
        localStorage.garage = JSON.stringify(garage);
        
        renderGarage();
    };

    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    renderGarage();
    $("button#send").click("click", e => {
        e.preventDefault()
        const name = $("input#name").val()
        const brand = $("input#brand").val()
        const licence = $("input#licence").val().toUpperCase();

        if(!name || !licence){
            alert("Os campos são obrigatórios.");
            return;
        }   

        const card = { brand,name, licence, time: new Date() };

        const garage = getGarage();
        garage.push(card);

        localStorage.garage = JSON.stringify(garage);

        addCarToGarage(card);
        $("#name").val("")
        $("#brand").val("");
        $("#licence").val("");
    });

    $("tbody#garage").click(function (e) { 
        e.preventDefault();
        console.log(e.target.className)
        console.log(e.target.parentElement.parentElement.cells)
        if(e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
})()