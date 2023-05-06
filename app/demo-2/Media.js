import * as THREE from 'three';

export default class Media {
  constructor({ element, scene, geometry, screen, viewport }) {
    this.element = element;
    this.img = element.querySelector('img');

    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;

    this.createMesh();
    this.createBounds();
  }

  createMesh() {
    this.material = new THREE.RawShaderMaterial({
      vertexShader: ``,
      fragmentShader: ``,
      uniforms: {},
      transparent: true,
      wireframe: true,
    });

    this.plane = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.plane);
  }

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  updateScale() {}

  updateX() {}

  updateY() {}

  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;
  }

  update() {}
}
