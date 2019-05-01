"use strict";

class Rectangle extends GameObject{ 

    /**
    * Construct a polygon representing a unit circle with the specified number of sides and colour
    */
    
    constructor(colour) {
        check(isArray(colour));
        super();

        this.colour = colour;
    }

    renderSelf(gl, colourUniform) {
        check(isContext(gl), isUniformLocation(colourUniform));

        // TODO: Write code to render the shape at the origin, in the desired colour
        // Hint: use a TRIANGLE_FAN
        gl.uniform4f(colourUniform, this.colour[0], this.colour[1], this.colour[2], this.colour[3]);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,1,0,0,1,1,1,0,1,1,0]), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

    }

}