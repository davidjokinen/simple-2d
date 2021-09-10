const GroupMeshHandler = require("./group-mesh-handler");

console.log(GroupMeshHandler)
let id = 0;
class Sprite {

  constructor( texture, x, y, w, h ) {
    this._id = id++;
    const handle = GroupMeshHandler.getRootHandler();

    this._x = x || 0;
    this._y = y || 0;
    this._z = handle.defaultZPosition || 1;
    this._w = w || 1;
    this._h = h || 1;

    this._onPositionChange = [];

    this.needsUpdate = true;

    this.texture = null;
    this._link = null;
    this._removed = false;
    if (texture)
      this.setTexture(texture);

    texture.onUpdate(() => {
      this.needsUpdate = true;
      this._updateTexture();
    });
  }

  _updateTexture() {
    if (this._link) {
      this.needsUpdate = true;
      this._link.mesh.updateSpriteTexture(this);
    }
  }
  
  remove() {
    if (this._removed) return;
    this._link.remove();
    this._removed = true;
    this.needsUpdate = true;
  }

  applyVertices(buffer) {
    const pos = this._link.pos || 0;
    const index = pos*18;
    const _x = this._x;
    const _y = this._y;
    const _z = this._z;
    const _w = this._w;
    const _h = this._h;

    buffer[index+0] = _x +  0;
    buffer[index+1] = _y +  0;
    buffer[index+2] = _z;

    buffer[index+3] =  _x + _w;
    buffer[index+4] = _y +  0;
    buffer[index+5] = _z;

    buffer[index+6] = _x + _w;
    buffer[index+7] = _y + _h;
    buffer[index+8] = _z;
    //
    buffer[index+9] = _x + _w;
    buffer[index+10] = _y + _h;
    buffer[index+11] = _z;

    buffer[index+12] = _x +  0;
    buffer[index+13] = _y + _h;
    buffer[index+14] = _z;

    buffer[index+15] = _x +  0;
    buffer[index+16] = _y +  0;
    buffer[index+17] = _z;
  }

  applyUV(buffer) {
    this.texture.updateBuffer(buffer, this._link.pos);
  }

  setTexture(texture) {
    this.texture = texture;
    if (this._link) {
      // TODO: Check to see texture has a different base texture.
      this._updateTexture();
      return;
    }
    // Setting texture for the first time.
    const handle = GroupMeshHandler.getRootHandler();
    // Ugg animation something here

    // TODO: Clean this up
    if (texture.texture) {
      texture = texture.texture
    }
    const mesh = handle.getMesh(texture);
    mesh.addTexture(this.texture);
    mesh.addSprite(this);
  }

  addPosition(x,y,z) {
    this._x += x;
    this._y += y;
    this._z += z;
    this._link.mesh.updateSpritePos(this);
    this.needsUpdate = true;
    this._onPositionChange.forEach(event => event(x, y));
  }

  updatePosition(x,y,z) {
    this._x = x;
    this._y = y;
    // if (z) this._z = z;
    this._link.mesh.updateSpritePos(this);
    this.needsUpdate = true;
    this._onPositionChange.forEach(event => event(x, y));
  }

  updateSize(w, h) {
    this._w = w || 1;
    this._h = h || 1;
    this._link.mesh.updateSpritePos(this);
    this.needsUpdate = true;
  }

  addOnPositionChange(event) {
    this._onPositionChange.push(event);
  }

  removeOnPositionChange(event) {
    const index = this._onPositionChange.indexOf(event);
		if (index < -1) return;
		this._onPositionChange.splice(index, 1); 
  }
}

module.exports = Sprite;