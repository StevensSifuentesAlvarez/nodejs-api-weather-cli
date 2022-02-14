const axios = require('axios')
const { saveFile } = require('../helpers/saveFiles')

class Searches {

    _history = []

    constructor(){
        this._history = []
    }

    // Metodo para capitalizar la primera letra de una palabra
    get historyCapitalized () {
        return this._history.map(h => {
            let words = h.split(' ')
            words = words.map(w => w[0].toUpperCase()+w.slice(1))
            return words.join(' ')
        })
    }

    get paramsMapbox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            limit: 5,
            language: 'es'
        }
    }

    get paramsOpenweather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    // Carga los datos extraidos de la bd al arreglo 
    loadHistory = (data) => {
        this._history = data
    }

    // Metodo para consultar en la API de MapBox el lugar solicitado
    cities = async (place='') => {
        try {
            // Intance
            const instance = axios.create({
                baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
                params: this.paramsMapbox
            })
            // Petición HTTP 
            const {data:{features}} = await instance.get(`${place}.json`)
            return features
        } catch (error) {
            return []
        } 
    }

    // Método para consultar en la API de Openweather el clima 
    cityWeather = async (lat, lon) => {
        try {
            // Intance
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/', 
                params: {...this.paramsOpenweather, lat, lon}
            })
            // Petición HTTP y desestructuración de los datos de la respuesta
            const {data:{weather, main:{temp_min, temp_max, temp}}} = await instance.get('weather')
            return {
                desc: weather[0].description,
                min: temp_min,
                max: temp_max,
                temp: temp
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    saveHistory = (place='') => {
        if (this._history.includes(place.toLocaleLowerCase())) return
        this._history = this._history.splice(0, 5)
        this._history.unshift(place.toLocaleLowerCase())
        const payload = {
            history: this._history
        }
        saveFile(payload)
    }

    showHistory = () => {
        console.log()
        this.historyCapitalized.forEach((h, i) => {
            const id = `${i+1}.`.green
            console.log(`${id} ${h}`)
        })
    }
    
    showResults = ({place_name, center}, {desc, min, max, temp}) => {
        console.clear()
        console.log('\nInformación del lugar\n'.brightCyan)
        console.log('Ciudad:', place_name.cyan)
        console.log('Lat:', center[1])
        console.log('Lng:', center[0])
        console.log('Temperatura:', temp, '°C')
        console.log('Mín:', min,'°C')
        console.log('Máx:', max, '°C')
        console.log('Como está el clima:', desc.cyan)
    }
}

module.exports = Searches;