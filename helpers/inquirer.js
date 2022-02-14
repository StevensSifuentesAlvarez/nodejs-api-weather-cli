const inquirer = require('inquirer'); // Paquete de terceros para implementar consola interactiva

const menu = async () => {
    const options = [{
        type: 'list',
        name: 'opciones',
        message: 'Seleccione una opción',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
        ]
    }]

    console.clear()
    console.log('============================='.brightCyan)
    console.log('   Seleccione una opción'.brightCyan)
    console.log('============================='.brightCyan)   
    const {opciones} = await inquirer.prompt(options)
    return opciones
}

const pause = async () => {
    const questions = [{
        type: 'input',
        name: 'enter',
        message: `Presione ${'ENTER'.cyan} para continuar...\n`
    }]
    console.log()
    await inquirer.prompt(questions)
}

const readInput = async (message='') => {
    const questions = [{
        type: 'input',
        name: 'desc',
        message,
        validate(value){
            if (value.length===0) {
                return 'Ingrese la ciudad, por favor.'
            }
            return true
        }
    }]

    const {desc} = await inquirer.prompt(questions)
    return desc
}

const showCities = async (cities=[]) => {
    const choices = cities.map(({id, place_name}, i) => ({
            value: id,
            name: `${(i+1+'.').green} ${place_name}`
        }))

    choices.unshift({
        value: 0,
        name: `${'0.'.green} Cancelar`
    })

    const options = [{
        type: 'list',
        name: 'id',
        message: 'Seleccione',
        choices
    }]

    const {id} = await inquirer.prompt(options)
    return id
}

module.exports = {
    menu,
    pause,
    readInput,
    showCities
}
