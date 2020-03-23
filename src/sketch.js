import * as p5 from "p5"
import { filter } from "async"

let people = []
let ammountPeople = 5000
let peopleSize = 5
let availableSpeed = [-1, 0, 1]

let canvasWith = 400
let canvasHeight = 400

let s = sk => {
    sk.setup = () => {
        // sk.stroke("black")
        sk.noStroke()
        sk.createCanvas( canvasWith, canvasHeight )

        for(let i = 0; i < ammountPeople; i++) {
            people[i] = new Person(false, Math.random() * 400, Math.random() * 400, getRandomDirection(0), getRandomDirection(0))
            people.push( people[i] )
        }
        // drawPeople()
    }

    sk.draw = () => {
        sk.background("black")
        drawPeople()
        for(let i = 0; i < ammountPeople; i++) {
            people[i].move()
        }
        // console.log( people[0].posX )
    }

    function drawPeople () {
        people.forEach( person => sk.ellipse(person.posX, person.posY, peopleSize, peopleSize) )
    }
}

class Person {
    constructor (isSick, posX, posY, speedX, speedY) {
        this.isSick = false
        this.posX = posX
        this.posY = posY
        this.speedX = speedX
        this.speedY = speedY
    }

    move () {
        this.posX += this.speedX
        this.posY += this.speedY;

        if ((this.posX <= 0 || this.posX >= canvasWith) || (this.posY <= 0 || this.posY >= canvasHeight)) {
            this.speedX = getRandomDirection(this.speedX)
            this.speedY = getRandomDirection(this.speedY)
        }
    }
}

function getRandomDirection (currentDirection) {
    const newDir = availableSpeed.filter( element => element != currentDirection )
    const index = Math.floor( Math.random() * Math.floor(2) )
    return newDir[index]
}

const P5 = new p5(s)

export default P5