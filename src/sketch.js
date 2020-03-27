import * as p5 from "p5"

let heightCanvas = 200
let widthCanvas = 400
let s = sk => {
    // field options

    // people options
    let people = []
    let ammountPeople = 80
    let ammountPeopleSick = 1
    let ammountDistancePeople = 0
    let personScale = 7

    // debug options
    let tries = 0
    let city

    // global settings
    // let currentDays = sk.round( sk.millis() / 1000 )

    // DOM options
    let restartButton
    let ammountPeopleSlider
    let ammountPeopleSickSlider
    let ammountDistancePeopleSlider

    // assets
    let manIcon
    let sickmanIcon
    let recoveredmanIcon
    let deadmanIcon

    function startSim () {
        sk.loop()
        sk.loop()
        ammountPeople = ammountPeopleSlider.value()
        ammountPeopleSick = ammountPeopleSickSlider.value()
        ammountDistancePeople = ammountDistancePeopleSlider.value()

        tries = 0
        city = new City(people, ammountPeople, ammountPeopleSick, ammountDistancePeople, personScale)
        city.cleanCity()
        city.generatePeople()
    }

    function endSim () {
        sk.noLoop()
    }

    function generateDOM () {
        restartButton = sk.createButton("REINICIAR SIMULACION")
        ammountPeopleSlider = sk.createSlider(0, 200, ammountPeople)
        ammountPeopleSickSlider = sk.createSlider(0, ammountPeople, ammountPeopleSick)
        ammountDistancePeopleSlider = sk.createSlider(0, ammountPeople, ammountDistancePeople)

        restartButton.mousePressed( startSim )
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
        startSim()
    }

    sk.draw = () => {
        city.generateField(heightCanvas, widthCanvas)
        city.updatePeople()
        city.checkCollide(city.people)
        city.drawPeople()
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
                this.people[i] = new Person(false, sk.random(personScale, widthCanvas - personScale), sk.random(0, heightCanvas - personScale), personScale)
                
                if ( i < ammountPeopleSick ) {
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

        drawPeople () {
            sk.noStroke()
            this.people.forEach(person => {
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
                // person.isSick?
                //     sk.fill("red"):
                //     sk.fill("skyblue")
                sk.noStroke()
                sk.image(faceIcon, person.posX, person.posY, person.personScale, person.personScale)
                // sk.ellipse(person.posX, person.posY, person.personScale, person.personScale)
                // drawDistance(person, 200, 200)
            })
        }

        updatePeople () {
            this.people.forEach(person => {
                person.move()
                person.isRecovered()
            })
        }

        generateField (heightCanvas, widthCanvas) {
            const midHeight = heightCanvas / 2
            const midWidth = widthCanvas / 2
            
            sk.background("grey")
            sk.strokeWeight(1)
            sk.stroke(50)
            sk.line(midWidth, 0, midWidth, heightCanvas)
            sk.stroke(50)
            sk.line(0, midHeight, widthCanvas, midHeight)
        }

        checkCollide (arrayPeople) {
            arrayPeople.forEach((person, index) => {
                while (index < arrayPeople.length-1) {
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

        isAnySick () {
            const n = this.people.filter(person => person.isSick).length
            return n ?
                true:
                false
            // return this.people.filter(person => person.isSick).length
        }

        cleanCity () {
            this.people.length = ammountPeopleSlider.value()
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
            this.changeOfSurvive = sk.round(sk.random(0, 100))
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

}


const P5 = new p5(s)

export default P5