import * as THREE from 'three';

import vertex from './glsl/vertex.glsl';
import fragment from './glsl/fragment.glsl';

export default class Media {
  constructor({ element, scene, geometry, screen, viewport, galleryWidth }) {
    this.element = element;
    this.img = element.querySelector('img');

    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.galleryWidth = galleryWidth;

    this.extra = 0;

    this.createMesh();
    this.createBounds();
  }

  createMesh() {
    const loader = new THREE.TextureLoader();

    const texture = loader.load(this.img.src, (t) => {
      return t;
    });

    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTexture: { value: texture },
        uPlaneSizes: { value: new THREE.Vector2(0, 0) },
        uImageSizes: {
          value: new THREE.Vector2(
            this.img.naturalWidth,
            this.img.naturalHeight
          ),
        },
      },
      transparent: true,
      // wireframe: true,
    });

    this.plane = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.plane);
  }

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();

    this.material.uniforms.uPlaneSizes.value = new THREE.Vector2(
      this.plane.scale.x,
      this.plane.scale.y
    );
  }

  updateScale() {
    this.plane.scale.x =
      (this.viewport.width * this.bounds.width) / this.screen.width;
    this.plane.scale.y =
      (this.viewport.height * this.bounds.height) / this.screen.height;
  }

  updateX(x = 0) {
    this.plane.position.x =
      -(this.viewport.width / 2) +
      this.plane.scale.x / 2 +
      ((this.bounds.left - x) / this.screen.width) * this.viewport.width -
      this.extra;
  }

  updateY(y = 0) {
    this.plane.position.y =
      this.viewport.height / 2 -
      this.plane.scale.y / 2 -
      ((this.bounds.top - y) / this.screen.height) * this.viewport.height;
  }

  onResize(sizes) {
    this.extra = 0;

    const { screen, viewport, galleryWidth } = sizes;

    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;
    if (galleryWidth) this.galleryWidth = galleryWidth;

    this.createBounds();
  }

  update({ scroll, direction }) {
    this.updateX(scroll.current);

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;

    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.galleryWidth;

      this.isBefore = false;
      this.isAfter = false;
    } else if (direction === 'left' && this.isAfter) {
      this.extra += this.galleryWidth;

      this.isBefore = false;
      this.isAfter = false;
    }

    // const planeLeft =
    //   this.plane.position.x + this.viewport.width / 2 + this.plane.scale.x / 2;

    // if (direction === 'right' && planeLeft < 0) {
    //   this.extra -= galleryWidth;
    // } else if (direction === 'left' && planeLeft > galleryWidth) {
    //   this.extra += galleryWidth;
    // }
  }
}
