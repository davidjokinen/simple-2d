const GroupMesh = require("./group-mesh");

let _groupMeshHander = null;

class GroupMeshHandler {
  constructor() {
    this.scene = null;
    this.meshes = {}
    this.allMeshes = [];
    this.children = [];
    this.parent = null;

    this.focus = null;
    this.opacity = 1;

    this.defaultZPosition = null;
  }

  getScene() {
    if (this.scene)
      return this.scene;
    if (this.parent)
      return this.parent.getScene();
    return null;
  }

  static getRootHandler() {
    if (!_groupMeshHander) {
      _groupMeshHander = new GroupMeshHandler();
    }
    if (_groupMeshHander.focus) {
      return _groupMeshHander.focus;
    }
    return _groupMeshHander;
  }

  createChildHandler() {
    const handler = new GroupMeshHandler(); 
    handler.setOpacity(this.opacity);
    this.children.push(handler);
    handler.parent = this;
    return handler;
  }

  createSprite() {
    const handler = GroupMeshHandler.getRootHandler();
    const before = handler.focus;
    handler.focus = this;
    const sprite = new Sprite(...arguments);
    handler.focus = before;
    return sprite;
  }

  checkMeshes() {
    for(let i=0;i<this.allMeshes.length;i++) {
      this.allMeshes[i].update();
    }
    for(let i=0;i<this.children.length;i++) {
      this.children[i].checkMeshes();
    }
  }

  getMesh(texture) {
    const { file } = texture;
    if (!(file in this.meshes)) {
      const mesh = new GroupMesh(this, texture);
      this.allMeshes.push(mesh);
      this.meshes[file] = mesh;
    }
    return this.meshes[file];
  }

  setDefaultZ(z) {
    this.defaultZPosition = z;
  }

  setOpacity(opacity) {
    this.opacity = opacity;
  }
}

module.exports = GroupMeshHandler;