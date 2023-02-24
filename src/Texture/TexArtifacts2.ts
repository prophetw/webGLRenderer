// moire patterns
import * as twgl from 'twgl.js'

export default function main() {
	console.log(' cool ');

	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	canvas.height = 600
	canvas.width = 600
	if(canvas === null){
		console.error('canvas with id canvas not exist ');
		return 
	}

	const gl = canvas.getContext('webgl');

	if(gl === null){

		console.error(' gl error ');
		return 
	}


	// Create a texture object
	const texture = gl.createTexture();

	// Bind the texture object to the TEXTURE_2D target
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the texture image data
	const pixels = new Uint8Array([
		255, 0, 0, 255,
		0, 255, 0, 255,
		0, 0, 255, 255,
		255, 255, 255, 255
	]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

	// Set the texture filtering and wrapping parameters
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

	// Create a shader program
	const vsSource = `
      attribute vec4 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = a_position;
        v_texCoord = a_texCoord;
      }
    `;
	const fsSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      varying vec2 v_texCoord;
      void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
      }
    `;
	// const vs = gl.createShader(gl.VERTEX_SHADER);
	// const fs = gl.createShader(gl.FRAGMENT_SHADER);
	// gl.shaderSource(vs, vsSource);
	// gl.shaderSource(fs, fsSource);
	// gl.compileShader(vs);
	// gl.compileShader(fs);
	const pInfo = twgl.createProgramInfo(gl, [vsSource, fsSource])

	const { program } = pInfo
	// gl.attachShader(program, vs);
	// gl.attachShader(program, fs);
	// gl.linkProgram(program);
	gl.useProgram(program);

	// Set up the vertex buffer
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const positions = new Float32Array([
		-1, -1,
		-1, 1,
		1, -1,
		1, 1
	]);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	const positionLocation = gl.getAttribLocation(program, 'a_position');
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	// Set up the texture coordinate buffer
	const texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	const texCoords = new Float32Array([
		0, 0,
		0, 1,
		1, 0,
		1, 1
	]);
	gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
	const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')

	// Set up the texture coordinate buffer (continued)
	gl.enableVertexAttribArray(texCoordLocation);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

	// Set the texture uniform
	const textureLocation = gl.getUniformLocation(program, 'u_texture');
	gl.uniform1i(textureLocation, 0);

	// Draw the quad
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

}