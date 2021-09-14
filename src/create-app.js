const THREE = require('three');
const GroupMeshHandler = require("./group-mesh-handler");
// const { TextureMap, GroupMeshHandler, Sprite } = require('simple2d');

function createApp(config) {
  const getWidth = () => config.width || window.innerWidth;
  const getHeight = () => config.height || window.innerHeight;
  const getTarget = () => config.target ? document.getElementById(config.target) : document.body;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 30, getWidth() / getHeight(), 1, 1000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 60;

  const rootLayer = GroupMeshHandler.getRootHandler();
  rootLayer.scene = scene;
  rootLayer.setDefaultZ(0);

  const renderer = new THREE.WebGLRenderer({
    alpha : true,
  });
  renderer.getPixelRatio(window.devicePixelRatio);
  const exampleDom = getTarget();
  exampleDom.appendChild( renderer.domElement );

  const resizeCanvas = () => {
    camera.aspect = getWidth() / getHeight();
    camera.updateProjectionMatrix();
    renderer.setSize( getWidth(), getHeight(), false);
  }
  
  window.addEventListener('resize', () => {
    resizeCanvas();
  }, false);
  resizeCanvas();

  const gameLoop = (promise) => {
    const _gameLoop = function () {
      requestAnimationFrame( _gameLoop );
    
      promise();

      rootLayer.checkMeshes();
      renderer.render( scene, camera );
    };
    
    requestAnimationFrame( _gameLoop );
  }

  return {
    scene,
    camera,
    renderer,
    rootLayer,
    gameLoop
  };
}

module.exports = createApp