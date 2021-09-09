const GroupMesh = require("./src/group-mesh");
const GroupMeshHandler = require("./src/group-mesh-handler");
const ResizeImage = require("./src/resize-image");
const Sprite = require("./src/sprite");
const SubTexture = require("./src/sub-texture");
const TextureMap = require("./src/texture-map");
const AnimationTexture = require("./src/texture/animation-texture");
const BaseTexture = require("./src/texture/base-texture");
const CanvasTexture = require("./src/texture/canvas-texture");
const ImageTexture = require("./src/texture/image-texture");

const textures = {
  AnimationTexture,
  BaseTexture,
  CanvasTexture,
  ImageTexture,
}

const simple2d = {
  textures,
  GroupMeshHandler,
  GroupMesh,
  ResizeImage,
  Sprite,
  SubTexture,
  TextureMap,
};

module.exports = simple2d;