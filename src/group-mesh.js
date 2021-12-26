const THREE = require('three');

class GroupMesh {
  constructor(handler, texture, maxsize) {
    this.texture = texture;
    this.opacity = 1;
    this.size = 0;
    this.handler = handler;
    this.maxsize = maxsize || 20;
    this.sprites = new Array(this.maxsize);
    this.geometry = new THREE.BufferGeometry();

    this.posBufferAtt = this._createPosBuffer();
    this.uvBufferAtt = this._createUVBuffer();
    this.colorBufferAtt = this._createColorBuffer();
    // this.angleBufferAtt = this._createColorBuffer();

    this.geometry.setAttribute( 'position', this.posBufferAtt);
    this.geometry.setAttribute( 'uv', this.uvBufferAtt);
    this.geometry.setAttribute( 'colors', this.colorBufferAtt);

    this.geometry.computeVertexNormals();
    this.geometry.renderOrder = handler.defaultZPosition*100;
    this.geometry.depthTest = false;

    this.texture.getMaterial().then(material => {
      this.material = material;
      material.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace('void main() {', `
          attribute vec4 colors;
          varying vec4 vColourTint;
          void main() {
            vColourTint = colors;
          `);
        shader.fragmentShader = shader.fragmentShader.replace('#include <clipping_planes_pars_fragment>', `
            #include <clipping_planes_pars_fragment>
            varying vec4 vColourTint;
          `);
        shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', `
          #include <output_fragment>
          gl_FragColor = gl_FragColor * vec4(vColourTint.r, vColourTint.g, vColourTint.b, vColourTint.a);
          `);
        shader.needsUpdate=true;
      };
      // remember about alphaTest
      this.material.opacity = handler.opacity;
      this.mesh = new THREE.Mesh( this.geometry, material );
      this.mesh.renderOrder = handler.defaultZPosition*100;
      material.depthTest = false;
      this.mesh.frustumCulled = false;
      if (this.handler) {
        const scene = this.handler.getScene();
        scene.add( this.mesh );
      }
    })
    
    this.updateNormals = false;
    this.updateUVs = false;
    this.updatePos = false;
    this.updateColor = true;

    this._textures = [];
    this._sprites = [];
  }

  update() {
    // TODO improve?
    for (let i=0;i<this._textures.length;i++) {
      const texture = this._textures[i];
      if (texture.animation) 
        if (texture.needsUpdate()) {
          this.updateUVs = true;
          break;
        }
    }
    const updateUVs = this.updateUVs;
    const updatePos = this.updatePos;
    const updateColor = this.updateColor;
    const resized = this.resized;
    const sprites = this.sprites;
    const uvBufferAtt = this.uvBufferAtt;
    const posBufferAttArray = this.posBufferAtt.array;
    const colorBufferAttArray = this.colorBufferAtt.array;
    if (updateUVs || updatePos || updateColor) {
      const length = this.size;
      this.geometry.setDrawRange(0,length*6);
      for (let i=0;i<length;i++) {
        const sprite = sprites[i];
        // if (sprite === undefined) continue;
        // if (sprite === null) continue;
        if (sprite._removed && !sprite) {
          console.log('error')
          continue;
        }

        if (!resized && !sprite.needsUpdate) continue;

        if (updateUVs)
          sprite.applyUV(uvBufferAtt);
        
        if (updatePos) {
          sprite.pos = i;
          sprite.applyVertices(posBufferAttArray);
        }
        if (updateColor) {
          sprite.applyColors(colorBufferAttArray);
        }
        sprite.needsUpdate = false;
      }
      if (updateUVs)
        this.uvBufferAtt.needsUpdate = true;
      if (updatePos)
        this.posBufferAtt.needsUpdate = true;
      if (updateColor)
        this.colorBufferAtt.needsUpdate = true;
      this.updatePos = false;
      this.updateUVs = false;
      this.resized = false;
    }

    if (this.updateNormals) {
      this.updateNormals = false;
    }
  }

  _createPosBuffer() {
    const vertices = new Float32Array( 18 * this.maxsize );
    const posBufferAtt = new THREE.BufferAttribute( vertices, 3 );
    posBufferAtt.setUsage(THREE.DynamicDrawUsage);
    return posBufferAtt;
  }

  _createUVBuffer() {
    const uvs = new Float32Array( 12 * this.maxsize );
    const uvBufferAtt = new THREE.BufferAttribute( uvs, 2 );
    uvBufferAtt.setUsage(THREE.DynamicDrawUsage);
    return uvBufferAtt;
  }

  _createColorBuffer() {
    const colors = new Float32Array( 24 * this.maxsize );
    const colorBufferAtt = new THREE.BufferAttribute( colors, 4 );
    colorBufferAtt.setUsage(THREE.DynamicDrawUsage);
    return colorBufferAtt;
  }

  _expandBuffers() {
    this.geometry.deleteAttribute( 'normal' );
    const uvs = new Float32Array( 12 * this.maxsize );
    const uvBufferAtt = new THREE.BufferAttribute( uvs, 2 );
    uvBufferAtt.setUsage(THREE.DynamicDrawUsage);
    uvBufferAtt.copyAt(0, this.uvBufferAtt, 0);
    delete this.uvBufferAtt;
    this.uvBufferAtt = uvBufferAtt;
    this.geometry.setAttribute( 'uv', this.uvBufferAtt);
    this.updatePos = true;

    const vertices = new Float32Array( 18 * this.maxsize );
    const posBufferAtt = new THREE.BufferAttribute( vertices, 3 );
    posBufferAtt.setUsage(THREE.DynamicDrawUsage);
    posBufferAtt.copyAt(0, this.posBufferAtt, 0);
    this.resized = true;

    // Colors
    const colors = new Float32Array( 24 * this.maxsize );
    const colorsBufferAtt = new THREE.BufferAttribute( colors, 4 );
    colorsBufferAtt.setUsage(THREE.DynamicDrawUsage);
    colorsBufferAtt.copyAt(0, this.colorBufferAtt, 0);
    
    this.posBufferAtt = posBufferAtt;
    this.geometry.setAttribute( 'position', this.posBufferAtt);
    this.updateUVs = true;
    const newNormals = new Float32Array( 18 * this.maxsize );
    // faster than calling computeVertexNormals
    for (let i=0;i<newNormals.length;i++) {
      if (i%3===2) 
        newNormals[i] = 1;
      else 
        newNormals[i] = 0;
    }
    this.geometry.setAttribute( 'normal', new THREE.BufferAttribute(newNormals, 3 ) );    
  }

  updateSpritePos(sprite) {
    this.updatePos = true;
  }

  updateSpriteTexture(sprite) {
    this.updateUVs = true;
  }

  updateSpriteColor(sprite) {
    this.updateColor = true;
  }

  addTexture(texture) {
    if (texture.animation)
      this._textures.push(texture);
  }

  remove(sprite) {
    const removePos = this.sprites.indexOf(sprite);
    const lastPos = this.size - 1;
    const removeItem = this.sprites[lastPos];
    this.sprites[lastPos].needsUpdate = true;
    this.sprites[removePos].needsUpdate = true;
    this.sprites[removePos] = this.sprites[lastPos];
    this.sprites[lastPos] = removeItem;
    this.size -= 1;
    this.updatePos = true;
    this.updateUVs = true;
  }

  addSprite(sprite) {
    const pos = this.size;
    if (this.maxsize <= pos) {
      this.maxsize = ~~(this.maxsize * 1.4) + 10;
      const newSprites = new Array(this.maxsize);
      this.sprites.forEach((e,i) => {
        newSprites[i] = e;
      });
      delete this.sprites;
      this.sprites = newSprites;
      this._expandBuffers();
    }
    this.sprites[pos] = sprite;
    this.size += 1;
    this.geometry.setDrawRange( 0, this.size*6 );
    sprite.mesh = this;
    sprite.pos = pos;
    this.updateSpriteTexture(sprite);
    this.updateSpritePos(sprite);
  }
}

module.exports = GroupMesh;