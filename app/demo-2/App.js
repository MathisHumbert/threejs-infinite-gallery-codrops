import * as THREE from 'three';
import Media from './Media';

export default class App {
  constructor() {
    this.createScene();
    this.createCamera();
    this.createRenderer();

    this.onResize();

    this.createGeometry();
    this.createMedias();

    this.update();
    this.addEventListeners();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.z = 5;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    document.body.appendChild(this.renderer.domElement);
  }

  createGeometry() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  }

  createMedias() {
    // TODO
    this.mediasElements = [
      ...document.querySelectorAll('.demo-2__gallery__figure'),
    ];

    this.medias = this.mediasElements.map(
      (element) =>
        new Media({
          element,
          scene: this.scene,
          geometry: this.planeGeometry,
          screen: this.scene,
          viewport: this.viewport,
        })
    );
  }

  onResize() {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.renderer.setSize(this.screen.width, this.screen.height);

    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix();

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = { width, height };

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }

  update() {
    this.renderer.render(this.scene, this.camera);

    if (this.medias) {
      this.medias.forEach((media) => media.update());
    }

    window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
  }
}
