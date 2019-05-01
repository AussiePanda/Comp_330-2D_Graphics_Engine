"use strict";

class Circle extends GameObject{ 

    /**
    * Construct a polygon representing a unit circle with the specified number of sides and colour
    */
    
    constructor(colour,sides) {
        check(isArray(colour));
        super();

        const nSides = sides;
        this.colour = colour;
        this.points = new Float32Array(nSides * 2);

        for (let i = 0; i < nSides; i++) {
            this.points[2*i] = Math.cos(i*2 * Math.PI/nSides);     // TODO: set the x coordinate;
            this.points[2*i+1] = Math.sin(i*2 * Math.PI/nSides);   // TODO: set the y coordiante
        }
    }

    renderSelf(gl, colourUniform) {
        check(isContext(gl), isUniformLocation(colourUniform));

        // TODO: Write code to render the shape at the origin, in the desired colour
        // Hint: use a TRIANGLE_FAN
        gl.uniform4f(colourUniform, this.colour[0], this.colour[1], this.colour[2], this.colour[3]);

        gl.bufferData(gl.ARRAY_BUFFER, this.points,gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length/2);

    }

}