import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import normalizeWheel from 'normalize-wheel';

import Media from './Media';
import { lerp } from '../utils';
import vertex from './glsl/post-vertex.glsl';
import fragment from './glsl/post-fragment.glsl';

export default class App {
  constructor() {
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      ease: 0.05,
    };
    this.speed = 2;

    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createPost();

    this.load();
  }

  load() {
    const textureLoader = new THREE.TextureLoader();
    const images = [...document.querySelectorAll('.demo-2__gallery img')];

    Promise.all(
      images.map((img) => {
        return new Promise((res) => {
          textureLoader.load(img.src, (texture) => {
            res(texture);
          });
        });
      })
    ).then((data) => {
      this.textures = data;
      document.querySelector('html').classList.add('loaded');
      this.init();
    });
  }

  init() {
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
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  createPost() {
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    this.customShaderPass = {
      uniforms: {
        tDiffuse: { value: null },
        uStrength: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    };

    this.customPass = new ShaderPass(this.customShaderPass);
    this.customPass.renderToScreen = true;

    this.composer.addPass(this.customPass);
  }

  createGeometry() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  }

  createMedias() {
    this.mediasElements = [
      ...document.querySelectorAll('.demo-2__gallery__figure'),
    ];

    this.medias = this.mediasElements.map(
      (element, index) =>
        new Media({
          element,
          texture: this.textures[index],
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

  onTouchDown(event) {
    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.touchStart = event.touches ? event.touches[0].clientX : event.clientX;
  }

  onTouchMove(event) {
    if (!this.isDown) return;

    const y = event.touches ? event.touches[0].clientX : event.clientX;
    const distance = (this.touchStart - y) * 2;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;
  }

  update() {
    this.scroll.target += this.speed;

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    if (this.scroll.current > this.scroll.last) {
      this.direction = 'right';
      this.speed = 2;
    } else if (this.scroll.current < this.scroll.last) {
      this.direction = 'left';
      this.speed = -2;
    }

    if (this.medias) {
      this.medias.forEach((media) =>
        media.update({
          scroll: this.scroll,
          direction: this.direction,
        })
      );
    }

    this.customPass.uniforms.uStrength.value =
      ((this.scroll.current - this.scroll.last) / this.screen.width) * 0.5;

    this.scroll.last = this.scroll.current;

    this.composer.render();

    window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));

    window.addEventListener('mousewheel', this.onWheel.bind(this));
    window.addEventListener('wheel', this.onWheel.bind(this));

    window.addEventListener('mousedown', this.onTouchDown.bind(this));
    window.addEventListener('mousemove', this.onTouchMove.bind(this));
    window.addEventListener('mouseup', this.onTouchUp.bind(this));

    window.addEventListener('touchstart', this.onTouchDown.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('touchend', this.onTouchUp.bind(this));
  }
}
