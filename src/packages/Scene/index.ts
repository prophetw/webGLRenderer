class Scene {
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
  gl: WebGL2RenderingContext;

  constructor() {
    const div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    const canvas = document.createElement('canvas');
    div.appendChild(canvas);
    document.body.appendChild(div);
    this.canvas = canvas;
    this.container = div;
    // this.gl = canvas.getContext('webgl');
    this.gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
  }
}

export default Scene