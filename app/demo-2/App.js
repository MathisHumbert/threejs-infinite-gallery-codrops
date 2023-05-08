import * as THREE from 'three';
import normalizeWheel from 'normalize-wheel';

import Media from './Media';
import { lerp } from '../utils';

export default class App {
  constructor() {
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      ease: 0.05,
    };

    this.createScene();
    this.createCamera();
    this.createRenderer();

    this.createGallery();

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
    this.mediasElements = [
      ...document.querySelectorAll('.demo-2__gallery__figure'),
    ];

    this.medias = this.mediasElements.map(
      (element) =>
        new Media({
          element,
          scene: this.scene,
          geometry: this.planeGeometry,
          screen: this.screen,
          viewport: this.viewport,
          galleryWidth: this.galleryWidth,
        })
    );
  }

  createGallery() {
    this.gallery = document.querySelector('.demo-2__gallery');
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

    this.galleryWidth =
      (this.viewport.width * this.gallery.offsetWidth) / this.screen.width;

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({
          screen: this.screen,
          viewport: this.viewport,
          galleryWidth: this.galleryWidth,
        })
      );
    }
  }

  onWheel(event) {
    const normalized = normalizeWheel(event);
    const speed = normalized.pixelY;

    this.scroll.target += speed * 0.5;
  }

  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    if (this.scroll.current > this.scroll.last) {
      this.direction = 'right';
    } else if (this.scroll.current < this.scroll.last) {
      this.direction = 'left';
    }

    if (this.medias) {
      this.medias.forEach((media) =>
        media.update({
          scroll: this.scroll,
          direction: this.direction,
        })
      );
    }

    this.scroll.last = this.scroll.current;

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));

    window.addEventListener('mousewheel', this.onWheel.bind(this));
    window.addEventListener('wheel', this.onWheel.bind(this));
  }
}
