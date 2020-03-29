import * as p5 from "p5"


let heightCanvas = 300
let widthCanvas = 600
let tries = 0
let s = sk => {
    // field options

    // people options
    let people = []
    let ammountPeople = 120
    let ammountPeopleSick = 1
    let ammountDistancePeople = 0
    let personScale = 10

    // debug options
    let city

    // global settings
    // let currentDays = sk.round( sk.millis() / 1000 )

    // DOM options
    let restartButton
    let peopleSPAN1
    let infectedPeopleSPAN1
    let notInfectedSPAN1
    let deadPeopleSPAN1
    let recoveredPeopleSPAN1

//     id="peopleSPAN1"></span> PE
// id="infectedPeopleSPAN1"></
// id="notInfectedSPAN1"></spa
// id="deadPeopleSPAN1"></span
// id="recoveredPeopleSPAN1"><

    // assets
    let manIcon
    let sickmanIcon
    let recoveredmanIcon
    let deadmanIcon

    function startSim () {
        sk.loop()
        sk.loop()


        tries = 0
        city = new City(people, ammountPeople, ammountPeopleSick, ammountDistancePeople, personScale)
        city.cleanCity()
        city.generatePeople()
    }

    function endSim () {
        sk.noLoop()
    }

    function generateDOM () {
        // restartButton = sk.createButton("INICIAR")
        restartButton = document.getElementById("restartButton1")

        peopleSPAN1 = document.getElementById("peopleSPAN1")
        infectedPeopleSPAN1 = document.getElementById("infectedPeopleSPAN1")
        notInfectedSPAN1 = document.getElementById("notInfectedSPAN1")
        deadPeopleSPAN1 = document.getElementById("deadPeopleSPAN1")
        recoveredPeopleSPAN1 = document.getElementById("recoveredPeopleSPAN1")
        

        restartButton.addEventListener("click", startSim)
    }

    function updateDOM (city) {
        peopleSPAN1.innerHTML = city.people.length
        infectedPeopleSPAN1.innerHTML = city.people.filter(person => person.isSick).length
        notInfectedSPAN1.innerHTML = city.people.filter(person => !(person.isSick || person.isInmune || person.isDead)).length
        deadPeopleSPAN1.innerHTML = city.people.filter(person => person.isDead).length
        recoveredPeopleSPAN1.innerHTML = city.people.filter(person => person.isInmune).length
    }

    function cleanDOM () {
        peopleSPAN1.innerHTML = ""
        infectedPeopleSPAN1.innerHTML = ""
        notInfectedSPAN1.innerHTML = ""
        deadPeopleSPAN1.innerHTML = ""
        recoveredPeopleSPAN1.innerHTML = ""
    }


    sk.preload = () => {
        manIcon = sk.loadImage("./assets/manicon.png")
        sickmanIcon = sk.loadImage("./assets/sickman.png")
        recoveredmanIcon = sk.loadImage("./assets/recoveredicon.png")
        deadmanIcon = sk.loadImage("./assets/deadicon.png")
    }
    
    sk.setup = () => {
        sk.createCanvas(widthCanvas, heightCanvas)
        generateDOM()
        cleanDOM()
        startSim()
    }

    sk.draw = () => {
        generateField(heightCanvas, widthCanvas)
        city.updatePeople()
        checkCollide(city)
        drawPeople(city)
        updateDOM(city)
        showDebug()

        tries++

        city.isAnySick()?
            "":
            endSim()
    }
    
    function showDebug () {
        const DEBUG_MESSAGE = `MOVES MADE: ${tries}`
        sk.fill("white")
        sk.text(DEBUG_MESSAGE, 50, 50, 100, 50)
    }

    function drawPeople (city) {
        sk.noStroke()
        city.people.forEach(person => {
            let faceIcon = ""
            if (person.isSick) {
                faceIcon = sickmanIcon
            } else {
                if (person.isInmune) {
                    faceIcon = recoveredmanIcon
                } else {
                    if (person.isDead) {
                        faceIcon = deadmanIcon
                    } else {
                        faceIcon = manIcon
                    }
                }
            }
            sk.noStroke()
            sk.image(faceIcon, person.posX, person.posY, person.personScale, person.personScale)
        })
    }

    function generateField (heightCanvas, widthCanvas) {
        const midHeight = heightCanvas / 2
        const midWidth = widthCanvas / 2
        
        sk.background("black")
        sk.strokeWeight(1)
        sk.stroke(50)
        sk.line(midWidth, 0, midWidth, heightCanvas)
        sk.stroke(50)
        sk.line(0, midHeight, widthCanvas, midHeight)
    }

    function checkCollide (city) {
        city.people.forEach((person, index) => {
            while (index < city.people.length-1) {
                const person2 = people[index+1]
                const dist = sk.dist(person.posX, person.posY, person2.posX, person2.posY)
                if (dist <= (person.personScale + person2.personScale) / 2) {
                    person.changeDir()
                    person2.changeDir()

                    if ( person.isSick || person2.isSick ) {
                        person.gotSick()
                        person2.gotSick()
                    }
                }
                index++
            }
        })
    }
}

let s2 = sk => {
    // field options

    // people options
    let people = []
    let ammountPeople = 120
    let ammountPeopleSick = 1
    let ammountDistancePeople = Math.round(ammountPeople * 0.9)
    let personScale = 10

    // debug options
    let city

    // global settings
    // let currentDays = sk.round( sk.millis() / 1000 )

    // DOM options
    let restartButton
    let peopleSPAN2
    let infectedPeopleSPAN2
    let notInfectedSPAN2
    let deadPeopleSPAN2
    let recoveredPeopleSPAN2

    let slider = document.getElementById("slider-canvas2")


    // assets
    let manIcon
    let sickmanIcon
    let recoveredmanIcon
    let deadmanIcon

    function startSim () {
        sk.loop()
        sk.loop()
        // ammountPeople = ammountPeopleSlider.value()
        // ammountPeopleSick = ammountPeopleSickSlider.value()
        // ammountDistancePeople = ammountDistancePeopleSlider.value()
        ammountDistancePeople = slider.value

        tries = 0
        city = new City(people, ammountPeople, ammountPeopleSick, ammountDistancePeople, personScale)
        city.cleanCity()
        city.generatePeople()
    }

    function endSim () {
        sk.noLoop()
    }

    function generateDOM () {
        // restartButton = sk.createButton("INICIAR")
        restartButton = document.getElementById("restartButton2")

        peopleSPAN2 = document.getElementById("peopleSPAN2")
        infectedPeopleSPAN2 = document.getElementById("infectedPeopleSPAN2")
        notInfectedSPAN2 = document.getElementById("notInfectedSPAN2")
        deadPeopleSPAN2 = document.getElementById("deadPeopleSPAN2")
        recoveredPeopleSPAN2 = document.getElementById("recoveredPeopleSPAN2")
        

        // restartButton.mousePressed( startSim )
        restartButton.addEventListener("click", startSim )
    }

    function updateDOM (city) {
        peopleSPAN2.innerHTML = city.people.length
        infectedPeopleSPAN2.innerHTML = city.people.filter(person => person.isSick).length
        notInfectedSPAN2.innerHTML = city.people.filter(person => !(person.isSick || person.isInmune || person.isDead)).length
        deadPeopleSPAN2.innerHTML = city.people.filter(person => person.isDead).length
        recoveredPeopleSPAN2.innerHTML = city.people.filter(person => person.isInmune).length
    }

    function cleanDOM () {
        peopleSPAN2.innerHTML = ""
        infectedPeopleSPAN2.innerHTML = ""
        notInfectedSPAN2.innerHTML = ""
        deadPeopleSPAN2.innerHTML = ""
        recoveredPeopleSPAN2.innerHTML = ""
    }


    sk.preload = () => {
        manIcon = sk.loadImage("./assets/manicon.png")
        sickmanIcon = sk.loadImage("./assets/sickman.png")
        recoveredmanIcon = sk.loadImage("./assets/recoveredicon.png")
        deadmanIcon = sk.loadImage("./assets/deadicon.png")
    }
    
    sk.setup = () => {
        sk.createCanvas(widthCanvas, heightCanvas)
        generateDOM()
        cleanDOM()
        startSim()
    }

    sk.draw = () => {
        generateField(heightCanvas, widthCanvas)
        updateDOM(city)
        city.updatePeople()
        checkCollide(city)
        drawPeople(city)
        showDebug()

        tries++

        city.isAnySick()?
            "":
            endSim()

        if ( tries % 100 === 0 ) {
            
        }
    }
    
    function showDebug () {
        const DEBUG_MESSAGE = `MOVES MADE: ${tries}`
        sk.fill("white")
        sk.text(DEBUG_MESSAGE, 50, 50, 100, 50)
    }

    function drawDistance (person, originX, originY) {
        sk.stroke(210, 200, 0)
        sk.line(person.posX, person.posY, originX, originY)
    }

    function drawPeople (city) {
        sk.noStroke()
        city.people.forEach(person => {
            let faceIcon = ""
            if (person.isSick) {
                faceIcon = sickmanIcon
            } else {
                if (person.isInmune) {
                    faceIcon = recoveredmanIcon
                } else {
                    if (person.isDead) {
                        faceIcon = deadmanIcon
                    } else {
                        faceIcon = manIcon
                    }
                }
            }
            sk.noStroke()
            sk.image(faceIcon, person.posX, person.posY, person.personScale, person.personScale)
        })
    }

    function generateField (heightCanvas, widthCanvas) {
        const midHeight = heightCanvas / 2
        const midWidth = widthCanvas / 2
        
        sk.background("black")
        sk.strokeWeight(1)
        sk.stroke(50)
        sk.line(midWidth, 0, midWidth, heightCanvas)
        sk.stroke(50)
        sk.line(0, midHeight, widthCanvas, midHeight)
    }

    function checkCollide (city) {
        city.people.forEach((person, index) => {
            while (index < city.people.length-1) {
                const person2 = people[index+1]
                const dist = sk.dist(person.posX, person.posY, person2.posX, person2.posY)
                if (dist <= (person.personScale + person2.personScale) / 2) {
                    person.changeDir()
                    person2.changeDir()

                    if ( person.isSick || person2.isSick ) {
                        person.gotSick()
                        person2.gotSick()
                    }
                }
                index++
            }
        })
    }
}

class City {
    constructor (people, ammountPeople, ammountPeopleSick, ammountDistancePeople, personScale) {
        this.people = people
        this.ammountPeople = ammountPeople
        this.ammountPeopleSick = ammountPeopleSick
        this.ammountDistancePeople = ammountDistancePeople
        this.personScale = personScale
        this.ammountPeople = ammountPeople
    }

    generatePeople () {
        for (let i = 0; i < this.ammountPeople; i++) {
            this.people[i] = new Person(
                false,
                Math.round(Math.random() * (widthCanvas - this.personScale)),
                Math.round(Math.random() * (heightCanvas - this.personScale)),
                this.personScale)
            
            if ( i < this.ammountPeopleSick ) {
                this.people[i].gotSick()
            }
        }

        if ( this.ammountDistancePeople > 0 ) {
            for (let i = 1; i <= this.ammountDistancePeople; i++) {
                this.people[this.people.length-i].velX = 0
                this.people[this.people.length-i].velY = 0
            }
        }
    }

    updatePeople () {
        this.people.forEach(person => {
            person.move()
            person.isRecovered()
        })
    }

    isAnySick () {
        const n = this.people.filter(person => person.isSick).length
        return n ?
            true:
            false
        // return this.people.filter(person => person.isSick).length
    }

    cleanCity () {
        // this.people.length = ammountPeopleSlider.value()
    }
}
class Person {
    constructor (isSick, posX, posY, personScale) {
        this.isSick = isSick
        this.isInmune = false
        this.dayInfected = 0
        this.posX = posX
        this.posY = posY
        this.velX = (Math.round(Math.random()) * 2 - 1) * 0.5
        this.velY = (Math.round(Math.random()) * 2 - 1) * 0.5
        this.personScale = personScale
        this.isDead = false
        this.changeOfSurvive = Math.round( Math.random() * 100 )
    }

    move () {
        if ( this.posX <= 0 + this.personScale / 2 || this.posX >= widthCanvas - this.personScale / 2 ) {
            this.velX = -this.velX
        }

        if ( this.posY <= 0 + this.personScale / 2 || this.posY >= heightCanvas - this.personScale / 2 ) {
            this.velY = -this.velY
        }

        this.posX += this.velX
        this.posY += this.velY
    }

    updateVel () {
        this.velX = Math.random() * 3 - Math.random() * 3
        this.velY = Math.random() * 3 - Math.random() * 3
    }

    changeDir () {
        this.velX = -this.velX
        this.velY = -this.velY
    }

    gotSick () {
        if (!(this.isInmune || this.isSick || this.isDead)) {
            this.isSick = true
            this.dayInfected = tries
        }

    }

    isRecovered () {
        if ( this.isSick ) {
            if ( tries - this.dayInfected >= 480 ) {
                this.isSick = false
                if ( this.changeOfSurvive > 10 ) {
                    this.isInmune = true
                } else {
                    this.isInmune = false
                    this.isDead = true
                    this.velX = 0
                    this.velY = 0
                }
            }
        }
    }
}


const P5 = new p5(s, "canvas-container")
const P6 = new p5(s2, "canvas-container2")


export default {P5, P6}