"use strict";

// Shader code

const vertexShaderSource = `
attribute vec4 a_position;
uniform mat3 u_worldMatrix;
uniform mat3 u_viewMatrix;

void main() {
    // convert to homogeneous coordinates 
    vec3 pos = vec3(a_position.xy, 1);

    // multiply by world martix
    pos = u_worldMatrix * pos;

    // multiply by view martix
    pos = u_viewMatrix * pos;

    // output to gl_Position
    gl_Position = vec4(pos.xy,0,1);
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec4 u_colour;

void main() {
    // set the fragment colour

    gl_FragColor = u_colour; 
}
`;

function createShader(gl, type, source)
{
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success)
    {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader)
{
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success)
    {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

function resize(canvas)
{
    const resolution = window.devicePixelRatio || 1.0;

    const displayWidth = Math.floor(canvas.clientWidth * resolution);
    const displayHeight = Math.floor(canvas.clientHeight * resolution);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight)
    {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        return true;
    }
    else
    {
        return false;
    }
}

function main()
{

    // === Initialisation ===
    const resolution = 50;

    // get the canvas element & gl rendering 
    const canvas = document.getElementById("c");
    const gl = canvas.getContext("webgl");

    if (gl === null)
    {
        window.alert("WebGL not supported!");
        return;
    }

    // create GLSL shaders, upload the GLSL source, compile the shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Initialise the shader attributes & uniforms
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    const worldMatrixUniform = gl.getUniformLocation(program, "u_worldMatrix");
    const viewMatrixUniform = gl.getUniformLocation(program, "u_viewMatrix");
    const colourUniform = gl.getUniformLocation(program, "u_colour");

    // Initialise the array buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

    // create the colours
    const yellow = [1, 1, 0, 1];
    const blue = [0, 0, 1, 1];
    const grey = [0.5, 0.5, 0.5, 1];
    const lgrey = [0.8, 0.8, 0.6, 1];
    const green = [0.6, 0.9, 0, 1];
    const brown = [0.6, 0.3, 0, 1];
    const wood = [0.8, 0.4, 0, 1];
    const wood2 = [0.8, 0.6, 0, 1];
    const yuk_green = [0.6, 0.8, 0.5, 1];
    const red = [1, 0, 0, 1];
    const black = [0, 0, 0, 1];
    const white = [1, 1, 1, 1];
    const skin = [0.8, 0.6, 0.3, 1];
    const dgrey = [0.4, 0.4, 0.4, 1];

    // create the background
    const back_rect = new Rectangle(green);
    const back_water_rect = new Rectangle(yuk_green);
    const back_water_circle = new Circle(yuk_green, 8);
    let flood = Math.random();

    //buildings
    const back_housebase_rect = new Rectangle(brown);
    const back_strutbase_rect1 = new Rectangle(wood);
    const back_strutbase_rect2 = new Rectangle(wood);
    const back_strutbase_rect3 = new Rectangle(wood);
    const back_strutbase_rect4 = new Rectangle(wood);
    const back_strutbase_circle = new Circle(wood2, 8);
    back_strutbase_rect1.parent = back_housebase_rect;
    back_strutbase_rect2.parent = back_housebase_rect;
    back_strutbase_rect3.parent = back_housebase_rect;
    back_strutbase_rect4.parent = back_housebase_rect;
    back_strutbase_circle.parent = back_housebase_rect;

    back_strutbase_rect1.rotation = 135;
    back_strutbase_rect1.scalex = 0.02;
    back_strutbase_rect1.scaley = -0.6;

    back_strutbase_rect2.translation = [0, 1];
    back_strutbase_rect2.rotation = 45;
    back_strutbase_rect2.scalex = 0.02;
    back_strutbase_rect2.scaley = -0.6;

    back_strutbase_rect3.translation = [1, 0];
    back_strutbase_rect3.rotation = -135;
    back_strutbase_rect3.scalex = 0.02;
    back_strutbase_rect3.scaley = -0.6;

    back_strutbase_rect4.translation = [1, 1];
    back_strutbase_rect4.rotation = -45;
    back_strutbase_rect4.scalex = 0.02;
    back_strutbase_rect4.scaley = -0.6;

    back_strutbase_circle.translation = [0.5, 0.5];
    back_strutbase_circle.scalex = 0.2;
    back_strutbase_circle.scaley = 0.2;

    //HeliPad
    const back_helipadbase_circle = new Circle(grey, 8);
    const back_helipadbase2_circle = new Circle(lgrey, 8);
    const back_helipadlH_rect = new Rectangle(yellow);
    const back_helipadrH_rect = new Rectangle(yellow);
    const back_helipadmH_rect = new Rectangle(yellow);
    back_helipadbase2_circle.parent = back_helipadbase_circle;
    back_helipadlH_rect.parent = back_helipadbase_circle;
    back_helipadrH_rect.parent = back_helipadbase_circle;
    back_helipadmH_rect.parent = back_helipadbase_circle;

    back_helipadbase2_circle.scalex = 0.8;
    back_helipadbase2_circle.scaley = 0.8;

    back_helipadlH_rect.translation = [-0.5, -0.6];
    back_helipadlH_rect.scalex = 0.1;
    back_helipadlH_rect.scaley = 1.2;

    back_helipadrH_rect.translation = [0.4, -0.6];
    back_helipadrH_rect.scalex = 0.1;
    back_helipadrH_rect.scaley = 1.2;

    back_helipadmH_rect.translation = [-0.5, 0];
    back_helipadmH_rect.scalex = 0.9;
    back_helipadmH_rect.scaley = 0.1;

    //helicopter
    const hbase_base_circle = new Circle(black, 8);
    const hbase_struct_circle = new Circle(red, 8);
    const hbase_struct_circle2 = new Circle(red, 8);
    const hbase_struct_rectangle = new Rectangle(red);
    const hrrotor_rotor_rectangle = new Rectangle(black);
    const hrrotor_rotor_rectangle2 = new Rectangle(black);
    const hwindow_struct_triangle = new Triangle(white);
    const hwindow_struct_triangle2 = new Triangle(white);
    const hmrotor_rotor_circle = new Circle(black, 8);
    const hmrotor_rotor_circle2 = new Circle(black, 8);
    const hmrotor_rotor_rect = new Rectangle(black);
    const hmrotor_rotor_rect2 = new Rectangle(black);
    const hmrotor_rotor_rect3 = new Rectangle(black);
    const hmrotor_rotor_rect4 = new Rectangle(black);
    const hmrotor_rotor_rect11 = new Rectangle(black);
    const hmrotor_rotor_rect22 = new Rectangle(black);
    const hmrotor_rotor_rect33 = new Rectangle(black);
    const hmrotor_rotor_rect44 = new Rectangle(black);

    hbase_struct_circle.parent = hbase_base_circle;
    hbase_struct_circle2.parent = hbase_base_circle;
    hbase_struct_rectangle.parent = hbase_base_circle;
    hwindow_struct_triangle.parent = hbase_struct_circle;
    hwindow_struct_triangle2.parent = hbase_struct_circle;
    hmrotor_rotor_circle.parent = hbase_base_circle;
    hmrotor_rotor_circle2.parent = hbase_base_circle;
    hmrotor_rotor_rect.parent = hmrotor_rotor_circle;
    hmrotor_rotor_rect2.parent = hmrotor_rotor_circle;
    hmrotor_rotor_rect3.parent = hmrotor_rotor_circle;
    hmrotor_rotor_rect4.parent = hmrotor_rotor_circle;
    hmrotor_rotor_rect11.parent = hmrotor_rotor_circle2;
    hmrotor_rotor_rect22.parent = hmrotor_rotor_circle2;
    hmrotor_rotor_rect33.parent = hmrotor_rotor_circle2;
    hmrotor_rotor_rect44.parent = hmrotor_rotor_circle2;

    hbase_base_circle.scalex = 0.5;
    hbase_base_circle.scaley = 0.5;
    hbase_struct_circle.translation[1] = 12;
    hbase_struct_circle.scalex = 6;
    hbase_struct_circle.scaley = 12;

    hbase_struct_circle2.translation[1] = -13;
    hbase_struct_circle2.scalex = 6;
    hbase_struct_circle2.scaley = 12;

    hbase_struct_rectangle.translation = [-5, -8];
    hbase_struct_rectangle.scalex = 10;
    hbase_struct_rectangle.scaley = 15;

    hwindow_struct_triangle.translation = [0, 0.4];
    hwindow_struct_triangle.scalex = 0.7;
    hwindow_struct_triangle.scaley = 0.4;

    hwindow_struct_triangle2.translation = [0, 0.4];
    hwindow_struct_triangle2.scalex = -0.7;
    hwindow_struct_triangle2.scaley = 0.4;

    hmrotor_rotor_circle.translation = [0, 13];
    hmrotor_rotor_circle.scalex = 3;
    hmrotor_rotor_circle.scaley = 3;

    hmrotor_rotor_circle2.translation = [0, -15];
    hmrotor_rotor_circle2.scalex = 3;
    hmrotor_rotor_circle2.scaley = 3;

    hmrotor_rotor_rect.translation = [-0.38, 0];
    hmrotor_rotor_rect.scalex = 0.8;
    hmrotor_rotor_rect.scaley = 5;

    hmrotor_rotor_rect2.translation = [0, -0.38];
    hmrotor_rotor_rect2.rotation = 90;
    hmrotor_rotor_rect2.scalex = 0.8;
    hmrotor_rotor_rect2.scaley = 5;

    hmrotor_rotor_rect3.translation = [0, 0.4];
    hmrotor_rotor_rect3.rotation = -90;
    hmrotor_rotor_rect3.scalex = 0.8;
    hmrotor_rotor_rect3.scaley = 5;

    hmrotor_rotor_rect4.translation = [0.4, 0];
    hmrotor_rotor_rect4.rotation = 180;
    hmrotor_rotor_rect4.scalex = 0.8;
    hmrotor_rotor_rect4.scaley = 5;

    hmrotor_rotor_rect11.translation = [-0.38, 0];
    hmrotor_rotor_rect11.rotation = 45;
    hmrotor_rotor_rect11.scalex = 0.8;
    hmrotor_rotor_rect11.scaley = 5;

    hmrotor_rotor_rect22.translation = [0, -0.38];
    hmrotor_rotor_rect22.rotation = 135;
    hmrotor_rotor_rect22.scalex = 0.8;
    hmrotor_rotor_rect22.scaley = 5;

    hmrotor_rotor_rect33.translation = [0, 0.4];
    hmrotor_rotor_rect33.rotation = -45;
    hmrotor_rotor_rect33.scalex = 0.8;
    hmrotor_rotor_rect33.scaley = 5;

    hmrotor_rotor_rect44.translation = [0.4, 0];
    hmrotor_rotor_rect44.rotation = 225;
    hmrotor_rotor_rect44.scalex = 0.8;
    hmrotor_rotor_rect44.scaley = 5;

    //people

    const people_rect_main = new Rectangle(blue);
    const people_rect_left = new Rectangle(skin);
    const poeple_rect_right = new Rectangle(skin);
    const people_cricle_head = new Circle(skin, 8);

    people_rect_left.parent = people_rect_main;
    poeple_rect_right.parent = people_rect_main;
    people_cricle_head.parent = people_rect_main;

    people_rect_main.scalex = 0.4;
    people_rect_main.scaley = 0.4;

    people_cricle_head.translation = [0.5, 0.5];
    people_cricle_head.scalex = 0.4;
    people_cricle_head.scaley = 0.4;

    poeple_rect_right.translation = [1, 0.25];
    poeple_rect_right.scalex = 0.7;
    poeple_rect_right.scaley = 0.4;

    people_rect_left.translation = [-0.7, 0.25];
    people_rect_left.scalex = 0.7;
    people_rect_left.scaley = 0.4;

    //speedo
    const speed_base_circle = new Circle(dgrey, 32);
    const speed_needle_circle = new Circle(yellow, 12);
    const speed_needlearm_rect = new Rectangle(yellow);
    const speed_needlearm_tri = new Triangle(yellow)
    const speed_line_rect = new Rectangle(white);
    const speed_line_rect1 = new Rectangle(white);
    const speed_line_rect2 = new Rectangle(white);
    const speed_line_rect3 = new Rectangle(white);
    const speed_line_rect4 = new Rectangle(white);
    const speed_line_rect5 = new Rectangle(white);

    speed_needle_circle.parent = speed_base_circle;
    speed_needlearm_rect.parent = speed_needle_circle;
    speed_needlearm_tri.parent = speed_needle_circle;
    speed_line_rect.parent = speed_base_circle;
    speed_line_rect1.parent = speed_base_circle;
    speed_line_rect2.parent = speed_base_circle;
    speed_line_rect3.parent = speed_base_circle;
    speed_line_rect4.parent = speed_base_circle;
    speed_line_rect5.parent = speed_base_circle;

    speed_needle_circle.rotation = 180;
    speed_needle_circle.scalex = 0.2;
    speed_needle_circle.scaley = 0.2;

    speed_needlearm_rect.translation = [0, -0.05];
    speed_needlearm_rect.scalex = 4;
    speed_needlearm_rect.scaley = 0.4;

    speed_needlearm_tri.translation = [4, -0.05]
    speed_needlearm_tri.scalex = 0.5;
    speed_needlearm_tri.scaley = 0.4;

    speed_line_rect.translation = [-0.5, 0];
    speed_line_rect.rotation = 180;
    speed_line_rect.scaley = 0.01;
    speed_line_rect.scalex = 0.5;

    speed_line_rect1.translation = [0, 0.5];
    speed_line_rect1.rotation = 90;
    speed_line_rect1.scaley = 0.01;
    speed_line_rect1.scalex = 0.5;

    speed_line_rect2.translation = [-0.35, 0.35];
    speed_line_rect2.rotation = 135;
    speed_line_rect2.scaley = 0.01;
    speed_line_rect2.scalex = 0.5;

    speed_line_rect3.translation = [0.5, 0];
    speed_line_rect3.rotation = 0;
    speed_line_rect3.scaley = 0.01;
    speed_line_rect3.scalex = 0.5;

    speed_line_rect4.translation = [0.35, 0.35];
    speed_line_rect4.rotation = 45;
    speed_line_rect4.scaley = 0.01;
    speed_line_rect4.scalex = 0.5;

    speed_line_rect5.translation = [0.35, -0.35];
    speed_line_rect5.rotation = -45;
    speed_line_rect5.scaley = 0.01;
    speed_line_rect5.scalex = 0.5;

    //minimap border

    const dot = new Circle(yuk_green);
    const borderu = new Rectangle(black);
    const borderl = new Rectangle(black);
    const borderr = new Rectangle(black);
    const borderh = new Rectangle(black);

    borderu.parent = dot;
    borderl.parent = dot;
    borderr.parent = dot;
    borderh.parent = dot;

    borderu.translation = [-10, -8.5];
    borderu.scalex = 20;
    borderu.scaley = 1;

    borderh.translation = [-10, 7.5];
    borderh.scalex = 20;
    borderh.scaley = 1;

    borderl.translation = [-10.5, -8];
    borderl.scalex = 1;
    borderl.scaley = 20;

    borderr.translation = [9.5, -8];
    borderr.scalex = 1;
    borderr.scaley = 20;


    // === Per Frame operations ===
    //human stuff
    let landed = false;
    let alive = false;
    let time = 0;
    let randomx = ((Math.random() - 1) * 10);
    let randomy = ((Math.random() - 0.5) * 10);

    // update objects in the scene
    let update = function (deltaTime)
    {
        flood = Math.random()*1 + 0.2;
        hmrotor_rotor_circle.rotation += 12;
        hmrotor_rotor_circle2.rotation -= 12;

        console.log(randomx);
        console.log(randomy);
        console.log(hbase_base_circle.translation[0] / 10);
        console.log(hbase_base_circle.translation[1] / 10);
        //picking up people
        if (hbase_base_circle.translation[0] / 10 - randomx <= 1.2 &&
            hbase_base_circle.translation[0] / 10 - randomx >= -1.2 &&
            hbase_base_circle.translation[1] / 10 - randomy <= 1.2 &&
            hbase_base_circle.translation[1] / 10 - randomy >= -1.2 &&
            Input.picking == true)
        {
            alive = false;
            time = 0;
            randomx = ((Math.random() - 1) * 10);
            randomy = ((Math.random() - 0.5) * 10);
        }

        //landing
        if (hbase_base_circle.translation[0] / 10 - 7 <= 1.2 &&
            hbase_base_circle.translation[0] / 10 - 7 >= -1.2 &&
            hbase_base_circle.translation[1] / 10 - 3 <= 1.2 &&
            hbase_base_circle.translation[1] / 10 - 3 >= -1.2 &&
            Input.land === true)
        {
            hbase_base_circle.scalex = 0.4;
            hbase_base_circle.scaley = 0.4;
            landed = true;
        }
        //taking off
        if (landed === true && Input.takeoff === true)
        {
            hbase_base_circle.scalex = 0.5;
            hbase_base_circle.scaley = 0.5;
            landed = false;
        }
        //movement
        if (landed === false)
        {

            if (Input.leftPressed == true)
            {
                hbase_base_circle.rotation += 5;
            }
            if (Input.rightPressed == true)
            {
                hbase_base_circle.rotation -= 5;

            }
            if (Input.upPressed == true)
            {
                hbase_base_circle.translation[0] -= 1.5 * Math.sin(hbase_base_circle.rotation * Math.PI / 180);
                hbase_base_circle.translation[1] += 1.5 * Math.cos(hbase_base_circle.rotation * Math.PI / 180);
                if (speed_needle_circle.rotation > 45)
                {
                    speed_needle_circle.rotation -= 2;
                }
            }
            if (Input.upPressed == false)
            {
                if (speed_needle_circle.rotation < 180)
                {
                    speed_needle_circle.rotation += 2;
                }
            }

        }
    }

    // redraw the scene
    let render = function (deltaTime)
    {
        // clear the screen
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.clearColor(0.6, 0.9, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // scale the view matrix to the canvas size & resolution
        const sx = 2 * resolution / canvas.width;
        const sy = 2 * resolution / canvas.height;
        const viewMatrix = Matrix.scale(sx, sy);
        gl.uniformMatrix3fv(viewMatrixUniform, false, viewMatrix);

        // render everything

        //render background
        let matrix = Matrix.identity();

        //render water
        matrix = Matrix.multiply(Matrix.identity(), Matrix.trs(-4, -10, 0, 4, 20));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        back_water_rect.render(gl, worldMatrixUniform, colourUniform, matrix);

        for (var i = -10; i < 10; i = i + flood)
        {
            matrix = Matrix.identity();
            matrix = Matrix.multiply(matrix, Matrix.trs(-4, i, 0, 1, 1));
            gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
            back_water_circle.render(gl, worldMatrixUniform, colourUniform, matrix);

            matrix = Matrix.identity();
            matrix = Matrix.multiply(matrix, Matrix.trs(-0, i, 0, 1, 1));
            gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
            back_water_circle.render(gl, worldMatrixUniform, colourUniform, matrix);
        }

        //render helipad
        matrix = Matrix.multiply(Matrix.identity(), Matrix.trs(7, 3, 0, 1.2, 1.2));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        back_helipadbase_circle.render(gl, worldMatrixUniform, colourUniform, matrix);


        //render house's
        //house a
        let matrixa = Matrix.multiply(Matrix.identity(), Matrix.trs(-8, -6, 45, 2.5, 2));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        back_housebase_rect.render(gl, worldMatrixUniform, colourUniform, matrixa);
        //house b
        let matrixb = Matrix.multiply(Matrix.identity(), Matrix.trs(-6, 0, 28, 3, 1.8));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        back_housebase_rect.render(gl, worldMatrixUniform, colourUniform, matrixb);
        //house c
        let matrixc = Matrix.multiply(Matrix.identity(), Matrix.trs(-6.5, 5, 36, 2.5, 2));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        back_housebase_rect.render(gl, worldMatrixUniform, colourUniform, matrixc);
        //render human
        if (alive === true)
        {
            matrix = Matrix.multiply(Matrix.identity(), Matrix.trs(randomx, randomy, 0, 1, 1));
            gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
            people_rect_main.render(gl, worldMatrixUniform, colourUniform, matrix);

        }

        // render speed
        matrix = Matrix.multiply(Matrix.identity(), Matrix.trs(8, -6, 0, 1.5, 1.5));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        speed_base_circle.render(gl, worldMatrixUniform, colourUniform, matrix);

        // render helicopter
        matrix = Matrix.multiply(Matrix.identity(), Matrix.trs(0, 0, 0, 0.1, 0.1));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        hbase_base_circle.render(gl, worldMatrixUniform, colourUniform, matrix);


        time += deltaTime;
        if (time >= 2)
        {
            alive = true;
        }

        gl.viewport(600, 20, 200, 200);
        gl.useProgram(program);
        //render water
        matrix = Matrix.multiply(Matrix.identity(), Matrix.trs(-4, -10, 0, 4, 20));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        back_water_rect.render(gl, worldMatrixUniform, colourUniform, matrix);


        for (var i = -10; i < 10; i = i + flood)
        {
            matrix = Matrix.identity();
            matrix = Matrix.multiply(matrix, Matrix.trs(-4, i, 0, 1, 1));
            gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
            back_water_circle.render(gl, worldMatrixUniform, colourUniform, matrix);

            matrix = Matrix.identity();
            matrix = Matrix.multiply(matrix, Matrix.trs(-0, i, 0, 1, 1));
            gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
            back_water_circle.render(gl, worldMatrixUniform, colourUniform, matrix);
        }

        //render view border
        matrix = Matrix.multiply(Matrix.identity(), Matrix.trs(0, 0, 0, 1, 1));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        dot.render(gl, worldMatrixUniform, colourUniform, matrix);

        //render helipad
        matrix = Matrix.multiply(Matrix.identity(), Matrix.trs(7, 3, 0, 1.2, 1.2));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        back_helipadbase_circle.render(gl, worldMatrixUniform, colourUniform, matrix);

        //render house's
        //house a
        matrixa = Matrix.multiply(Matrix.identity(), Matrix.trs(-8, -6, 45, 2.5, 2));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        back_housebase_rect.render(gl, worldMatrixUniform, colourUniform, matrixa);
        //house b
        matrixb = Matrix.multiply(Matrix.identity(), Matrix.trs(-6, 0, 28, 3, 1.8));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        back_housebase_rect.render(gl, worldMatrixUniform, colourUniform, matrixb);
        //house c
        matrixc = Matrix.multiply(Matrix.identity(), Matrix.trs(-6.5, 5, 36, 2.5, 2));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        back_housebase_rect.render(gl, worldMatrixUniform, colourUniform, matrixc);
        //render human
        if (alive === true)
        {
            matrix = Matrix.multiply(Matrix.identity(), Matrix.trs(randomx, randomy, 0, 1, 1));
            gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
            people_rect_main.render(gl, worldMatrixUniform, colourUniform, matrix);

        }

        // render helicopter
        matrix = Matrix.multiply(Matrix.identity(), Matrix.trs(0, 0, 0, 0.1, 0.1));
        gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
        hbase_base_circle.render(gl, worldMatrixUniform, colourUniform, matrix);
    };

    // animation loop
    let oldTime = 0;
    let animate = function (time)
    {
        time = time / 1000;
        let deltaTime = time - oldTime;
        oldTime = time;

        resize(canvas);
        update(deltaTime);
        render(deltaTime);

        requestAnimationFrame(animate);
    }
    // start it going
    animate(0);
}