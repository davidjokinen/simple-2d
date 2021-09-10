const THREE = require('three');
const ResizeImage = require('../resize-image');
const BaseTexture = require('./base-texture');
const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);

class ImageTexture extends BaseTexture {
  constructor(file) {
    super();
    this.file = file;
    this.load();
  }

  load() {
    const image = new ResizeImage(this.file, resizedImage => {
      this.size = resizedImage.size;
      this.orginalSize = resizedImage.orginalSize;
      const texture = loader.load(resizedImage.url(), () => {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestMipmapNearestFilter;
        texture.needsUpdate = true;

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          alphaTest: .15,
          transparent: true,
          opacity: 1,
          side : THREE.DoubleSide,
        });
        material.map.minFilter = THREE.NearestFilter;
        this._texture = texture;
        this._material = material;
        this._loaded = true;
        this._waiting.forEach(promise => promise());
        this._onLoad.forEach(promise => promise(this));
      });
      
    });
  }
}

module.exports = ImageTexture;