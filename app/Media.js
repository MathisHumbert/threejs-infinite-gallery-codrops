export default class Media {
  constructor({ element, geometry, gl, scene, screen, viewport }) {
    this.element = element;
    this.img = this.element.querySelector('img');

    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.createMesh();
    this.createBounds();
    this.onResize();
  }

  createMesh() {}

  createBounds() {}

  onResize() {}

  update() {}
}
