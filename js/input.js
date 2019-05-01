"use strict";

const InputClass = function() {
    const input = this;

    input.leftPressed = false;
    input.rightPressed = false;
    input.upPressed = false;
    input.downPressed = false;
    input.picking = false;
    input.land = false;
    input.takeoff = false;

    input.onKeyDown = function(event) {
        switch (event.key) {
            case "ArrowLeft": 
                input.leftPressed = true;
                break;

            case "ArrowRight": 
                input.rightPressed = true;
                break;

            case "ArrowDown":
                input.downPressed = true;
                break;

            case "ArrowUp":
                input.upPressed = true;
                break;
            case "p":
                input.picking = true;
                break;

            case "l":
                input.land = true;
                break;

            case "t":
                input.takeoff = true;
            break;
        }
    }

    input.onKeyUp = function(event) {
        switch (event.key) {
            case "ArrowLeft": 
                input.leftPressed = false;
                break;

            case "ArrowRight": 
                input.rightPressed = false;
                break;

            case "ArrowDown":
                input.downPressed = false;
                break;

            case "ArrowUp":
                input.upPressed = false;
                break;

            case "p":
                input.picking = false;
                break;

            case "l":
                input.land = false;
                break;

            case "t":
                input.takeoff = false;
            break;
            }
    }

    document.addEventListener("keydown", input.onKeyDown);
    document.addEventListener("keyup", input.onKeyUp);

}

// global inputManager variable
const Input = new InputClass();