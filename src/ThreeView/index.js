import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Detector from 'three/examples/js/Detector.js';

// These add-ons need a global THREE defined to load
// I guess that's useful for debugging anyway, lol
const THREE = window.THREE = require('three');
require('three/examples/js/controls/OrbitControls.js');
require('three/examples/js/loaders/MTLLoader.js');
require('three/examples/js/loaders/OBJLoader.js');

const ThreeWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export default class ThreeView extends PureComponent {
  componentDidMount() {
    const container = this._container;

    if (!Detector.webgl) {
      Detector.addGetWebGLMessage({ parent: this._container });
      return;
    }

    window.addEventListener('resize', this.handleResize);

    this._camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    this._camera.position.z = 3;

    this._scene = new THREE.Scene();
    this._ambient = new THREE.AmbientLight(0xffffff, 1.0);
    this._scene.add(this._ambient);

    this._objLoader = new THREE.OBJLoader();
    this._objLoader.load(require('../examples/sysconf.obj'), (object) => {
      this._scene.add(object);
    });

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(container.clientWidth, container.clientHeight);
    this._renderer.setClearColor(0x333333);

    container.appendChild(this._renderer.domElement);

    this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.25;
    this._controls.enableZoom = true;

    requestAnimationFrame(this.renderWebGL);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this._controls.dispose();
  }

  handleResize = () => {
    console.debug('resized');
    const container = this._container;

    this._camera.aspect = container.clientWidth / container.clientHeight;
    this._renderer.setSize(container.clientWidth, container.clientHeight);
  };

  renderWebGL = () => {
    requestAnimationFrame(this.renderWebGL);
    this._controls.update();
    this._renderer.render(this._scene, this._camera);
  };

  render() {
    return (
      <ThreeWrapper innerRef={(div) => this._container = div} />
    );
  }
}
