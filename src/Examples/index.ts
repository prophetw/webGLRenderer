import Scene, { type FrameState } from '../packages/Scene'

const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
uniform float uTime;

void main() {
  float angle = uTime * 0.6;
  mat2 rotation = mat2(
    cos(angle), -sin(angle),
    sin(angle), cos(angle)
  );
  vec2 rotated = rotation * aPosition;
  gl_Position = vec4(rotated, 0.0, 1.0);
  vColor = aColor;
}
`

const FRAGMENT_SHADER = `
precision mediump float;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`

class RotatingTriangle {
  private program: WebGLProgram | null = null
  private vertexBuffer: WebGLBuffer | null = null
  private positionLocation = -1
  private colorLocation = -1
  private timeLocation: WebGLUniformLocation | null = null

  private initialize(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    if (this.program) {
      return
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    this.program = createProgram(gl, vertexShader, fragmentShader)

    this.vertexBuffer = gl.createBuffer()
    const vertices = new Float32Array([
      // x,    y,    r,   g,   b
      0, 0.6, 1, 0.34, 0.33,
      -0.6, -0.5, 0.2, 0.85, 0.98,
      0.6, -0.5, 0.29, 0.72, 1,
    ])
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    this.positionLocation = gl.getAttribLocation(this.program, 'aPosition')
    this.colorLocation = gl.getAttribLocation(this.program, 'aColor')
    this.timeLocation = gl.getUniformLocation(this.program, 'uTime')
  }

  render(state: FrameState): void {
    const { gl, time } = state
    this.initialize(gl)
    if (!this.program || !this.vertexBuffer || this.positionLocation === -1 || this.colorLocation === -1 || !this.timeLocation) {
      return
    }

    gl.useProgram(this.program)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)

    const stride = Float32Array.BYTES_PER_ELEMENT * 5
    gl.enableVertexAttribArray(this.positionLocation)
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, stride, 0)

    gl.enableVertexAttribArray(this.colorLocation)
    gl.vertexAttribPointer(this.colorLocation, 3, gl.FLOAT, false, stride, Float32Array.BYTES_PER_ELEMENT * 2)

    gl.uniform1f(this.timeLocation, time)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
}

function compileShader(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('Unable to create shader.')
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader compile error: ${info ?? 'unknown'}`)
  }
  return shader
}

function createProgram(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram {
  const program = gl.createProgram()
  if (!program) {
    throw new Error('Unable to create shader program.')
  }
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(`Program link error: ${info ?? 'unknown'}`)
  }
  return program
}

export default function bootstrapScene(): Scene {
  const scene = new Scene({
    clearColor: [0.01, 0.02, 0.04, 1],
  })
  const triangle = new RotatingTriangle()
  scene.addLayer((state) => triangle.render(state))
  scene.start()
  return scene
}
