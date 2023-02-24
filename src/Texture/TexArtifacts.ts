import * as twgl from 'twgl.js'
import { createImgFromUrl } from '../Utils/Resource';

async function main() {
	console.log('iii ', twgl);
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

	// Define texture coordinates
	const texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	const texCoords = [
		0.0, 0.0,
		0.0, 1.0,
		1.0, 0.0,
		1.0, 1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

	// Define vertex coordinates
	const vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	const vertices = [
		-1.0, -1.0,
		1.0, -1.0,
		-1.0, 1.0,
		1.0, 1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	const image = await createImgFromUrl('https://th.bing.com/th/id/R.818d6bb7d8b7e00f999f62a0730095f3?rik=egUt9h0T7wgNXg&riu=http%3a%2f%2fs1.iconbird.com%2fico%2f1012%2fHalloween2012%2fw512h5121350587016blackcat512.png&ehk=LYohAN4nC3ybwBcaEKJLfI7hM51f86qdoI5K9dE6gF8%3d&risl=&pid=ImgRaw&r=0')

	// Define texture
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	// Define shader
	const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;
	const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_texture;
  varying vec2 v_texCoord;
  void main() {
    gl_FragColor = texture2D(u_texture, v_texCoord);
  }
`;
	const programInfo = twgl.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource]);
	console.log(programInfo);
	const {program} = programInfo
	gl.useProgram(program);

	// Set attribute and uniform locations
	const positionLocation = gl.getAttribLocation(program, 'a_position');
	const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
	const textureLocation = gl.getUniformLocation(program, 'u_texture');
	gl.enableVertexAttribArray(positionLocation);
	gl.enableVertexAttribArray(texCoordLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	gl.uniform1i(textureLocation, 0);

	// Render
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

}
export default main