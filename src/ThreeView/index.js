import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Detector from 'three/examples/js/Detector.js';

// These add-ons need a global THREE defined to load
// I guess that's useful for debugging anyway, lol
const THREE = window.THREE = require('three');
require('three/examples/js/controls/OrbitControls.js');
require('three/examples/js/loaders/MTLLoader.js');
require('three/examples/js/loaders/OBJLoader.js');

export default class ThreeView extends PureComponent {
  static propTypes = {
    objData: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired
  };

  static defaultProps = {
    onSuccess() {},
    onError() {}
  }

  componentDidMount() {
    const container = this._container;

    if (!Detector.webgl) {
      Detector.addGetWebGLMessage({ parent: this._container });
      return;
    }

    window.addEventListener('resize', this.handleResize);

    // Make us a scene
    this._scene = new THREE.Scene();
    this._ambient = new THREE.AmbientLight(0xffffff, 1.0);
    this._scene.add(this._ambient);

    // Make us a camera
    this._camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    this._camera.position.z = 10;

    // Set up our renderer
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize(container.clientWidth, container.clientHeight);
    this._renderer.setClearColor(0x333333);

    // Set up controls
    this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.25;
    this._controls.enableZoom = true;

    // Load our OBJ file
    this._objLoader = new THREE.OBJLoader();
    this.updateObject(this.props.objData);

    container.appendChild(this._renderer.domElement);

    requestAnimationFrame(this.renderWebGL);
  }

  updateObject(objData) {
    let parsedObject;

    try {
      parsedObject = this._objLoader.parse(objData);
    } catch (error) {
      console.error(error);
      this.props.onError(error);
      return;
    }

    if (this._displayedObject) {
      this._scene.remove(this._displayedObject);
    }

    this._displayedObject = this.createGroupFor(parsedObject);

    this._scene.add(this._displayedObject);

    this.props.onSuccess();
  }

  componentWillUpdate(nextProps) {
    this.updateObject(nextProps.objData);
  }

  createGroupFor(object) {
    const group = new THREE.Group();
    group.add(object);

    const box = new THREE.BoxHelper(object, 0xffff00);
    group.add(box);

    const axisHelper = new THREE.AxisHelper(500);
    group.add(axisHelper);

    return group;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this._controls.dispose();
  }

  handleResize = () => {
    console.debug('resized');
    const container = this._container;

    // TODO: Update camera for resized viewport
    // this._camera.aspect = container.clientWidth / container.clientHeight;
    this._renderer.setSize(container.clientWidth, container.clientHeight);
  };

  renderWebGL = () => {
    requestAnimationFrame(this.renderWebGL);
    this._controls.update();
    this._renderer.render(this._scene, this._camera);
  };

  render() {
    return <div ref={(div) => this._container = div} />;
  }
}
