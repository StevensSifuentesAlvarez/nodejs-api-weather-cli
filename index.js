require('colors')
require('dotenv').config()
const { menu, pause, readInput, showCities } = require("./helpers/inquirer");
const { readFile } = require('./helpers/saveFiles');
const Searches = require('./models/searches');

const main = async () => {

    let op;
    const searches = new Searches();
    const info = readFile();
    info ? searches.loadHistory(info.history) : console.log('BD vacía');
    
    do {
        op = await menu()

        switch (op) {
            case 1:
                // Muestra el mensaje
                const place = await readInput('Escriba la ciudad:')  

                // Busca y retorna los lugares encontrados 
                const arrayCities = await searches.cities(place)

                // Seleccionar lugar
                const idx = await showCities(arrayCities)
                if (idx===0) continue // Opción de cancelar 

                // Encontramos la ciudad
                const city = arrayCities.find(c => c.id===idx)
                
                // Guardar el lugar consultado
                searches.saveHistory(city.place_name)
                
                // Obtener datos del clima
                const weatherResult = await searches.cityWeather(city.center[1], city.center[0])
                
                // Mostrar los resultado en consola
                searches.showResults(city, weatherResult)
            break;
            case 2:
                searches.showHistory()
            break;
        }

        (op!==0) ? await pause() : null
    } while (op!==0);
    console.log('Programa Finalizado...'.brightCyan)
}

main()