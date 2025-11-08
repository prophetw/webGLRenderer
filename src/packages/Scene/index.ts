import Renderer from '../Core/Renderer'
import type { FrameState, RendererOptions, Color } from '../Core/Renderer'

export type SceneLayer = (state: FrameState) => void

export interface SceneOptions extends Omit<RendererOptions, 'canvas'> {
  clearColor?: Color
}

class Scene {
  readonly renderer: Renderer

  private readonly layers = new Set<SceneLayer>()
  private started = false

  constructor(options: SceneOptions = {}) {
    this.renderer = new Renderer({
      container: options.container,
      clearColor: options.clearColor,
      devicePixelRatio: options.devicePixelRatio,
      contextAttributes: options.contextAttributes,
    })
  }

  addLayer(layer: SceneLayer): () => void {
    this.layers.add(layer)
    return () => this.layers.delete(layer)
  }

  start(): void {
    if (this.started) {
      return
    }
    this.started = true
    this.renderer.start((state) => {
      this.layers.forEach((layer) => layer(state))
    })
  }

  stop(): void {
    if (!this.started) {
      return
    }
    this.started = false
    this.renderer.stop()
  }

  dispose(): void {
    this.stop()
    this.layers.clear()
    this.renderer.dispose()
  }

  setClearColor(color: Color): void {
    this.renderer.setClearColor(color)
  }
}

export type { FrameState }
export default Scene
