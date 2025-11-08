export type Color = [number, number, number, number]

export interface FrameState {
  gl: WebGL2RenderingContext | WebGLRenderingContext
  canvas: HTMLCanvasElement
  time: number
  deltaTime: number
  frame: number
}

export interface RendererOptions {
  container?: HTMLElement
  canvas?: HTMLCanvasElement
  clearColor?: Color
  devicePixelRatio?: number
  contextAttributes?: WebGLContextAttributes
}

export type RenderCallback = (state: FrameState) => void

const DEFAULT_CLEAR: Color = [0.05, 0.05, 0.08, 1]
const DEFAULT_ATTRS: WebGLContextAttributes = {
  alpha: false,
  antialias: true,
  depth: true,
  stencil: false,
  preserveDrawingBuffer: false,
  powerPreference: 'high-performance',
}

class Renderer {
  readonly canvas: HTMLCanvasElement
  readonly gl: WebGL2RenderingContext | WebGLRenderingContext

  private readonly container: HTMLElement
  private readonly devicePixelRatio: number
  private clearColor: Color
  private resizeObserver?: ResizeObserver
  private rafId = 0
  private frame = 0
  private running = false
  private lastTime = 0
  private onFrame?: RenderCallback
  private detachResize?: () => void

  constructor(options: RendererOptions = {}) {
    this.container = options.container ?? Renderer.createContainer()
    this.canvas = options.canvas ?? Renderer.createCanvas()

    if (!options.canvas) {
      this.container.appendChild(this.canvas)
    }

    const contextAttributes = {
      ...DEFAULT_ATTRS,
      ...options.contextAttributes,
    }

    this.gl = Renderer.createContext(this.canvas, contextAttributes)
    this.devicePixelRatio = options.devicePixelRatio ?? window.devicePixelRatio ?? 1
    this.clearColor = options.clearColor ?? DEFAULT_CLEAR

    this.resize = this.resize.bind(this)
    this.startLoop = this.startLoop.bind(this)

    this.attachResizeObserver()
    this.resize()
  }

  setClearColor(color: Color): void {
    this.clearColor = color
    const gl = this.gl
    gl.clearColor(color[0], color[1], color[2], color[3])
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  start(callback: RenderCallback): void {
    this.onFrame = callback
    this.running = true
    this.lastTime = performance.now()
    this.frame = 0
    this.rafId = requestAnimationFrame(this.startLoop)
  }

  stop(): void {
    this.running = false
    cancelAnimationFrame(this.rafId)
  }

  dispose(): void {
    this.stop()
    this.resizeObserver?.disconnect()
    this.detachResize?.()
    this.onFrame = undefined
  }

  private startLoop(time: number): void {
    if (!this.running || !this.onFrame) {
      return
    }

    const delta = time - this.lastTime
    this.lastTime = time
    this.frame += 1

    this.clear()
    this.onFrame({
      gl: this.gl,
      canvas: this.canvas,
      time: time * 0.001,
      deltaTime: delta * 0.001,
      frame: this.frame,
    })
    this.rafId = requestAnimationFrame(this.startLoop)
  }

  private clear(): void {
    const gl = this.gl
    gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3])
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  private resize(): void {
    const targetWidth = Math.max(1, Math.floor(this.container.clientWidth * this.devicePixelRatio))
    const targetHeight = Math.max(1, Math.floor(this.container.clientHeight * this.devicePixelRatio))

    if (this.canvas.width !== targetWidth || this.canvas.height !== targetHeight) {
      this.canvas.width = targetWidth
      this.canvas.height = targetHeight
    }

    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.gl.viewport(0, 0, targetWidth, targetHeight)
  }

  private attachResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.resize())
      this.resizeObserver.observe(this.container)
      this.detachResize = undefined
      return
    }

    const handler = this.resize
    window.addEventListener('resize', handler)
    this.detachResize = () => window.removeEventListener('resize', handler)
  }

  private static createContainer(): HTMLElement {
    const container = document.createElement('div')
    container.style.width = '100%'
    container.style.height = '100%'
    document.body.appendChild(container)
    return container
  }

  private static createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    return canvas
  }

  private static createContext(
    canvas: HTMLCanvasElement,
    attributes: WebGLContextAttributes,
  ): WebGL2RenderingContext | WebGLRenderingContext {
    const webgl2 = canvas.getContext('webgl2', attributes)
    if (webgl2) {
      return webgl2
    }

    const webgl = canvas.getContext('webgl', attributes) ?? canvas.getContext('experimental-webgl', attributes)
    if (!webgl) {
      throw new Error('WebGL is not supported in this environment.')
    }
    return webgl
  }
}

export default Renderer
