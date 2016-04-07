var THREE = require('three');
var datGui = require('dat-gui');
console.log(datGui);
var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
var container, stats;
var camera, scene, renderer;
var line, particles, particle, count = 0;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var startTime = Date.now();





var gui = new datGui.GUI({
    height : 5 * 32 - 1
});

var params = {
	lineFreq: 1000,
	particleSize: 1,
	particlePulse: false,
	particleScalePulseSpeed: 0.1,
	particleScalePulseSize: 1,
	cameraMove: true
};

gui.add(params, 'lineFreq').min(0).max(3000).step(10);
gui.add(params, 'particleSize').min(0.1).max(3).step(0.01);
gui.add(params, 'particlePulse');
gui.add(params, 'particleScalePulseSpeed').min(0).max(4).step(0.01);
gui.add(params, 'particleScalePulseSize').min(0).max(2).step(0.01);
gui.add(params, 'cameraMove');













init();
animate();


// gui.add(params, 'width').min(128).max(256).step(16)


function init() {


	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.z = 50;
	camera.position.y = 100;
	camera.position.x = -200;
	scene = new THREE.Scene();
	particles = new Array();
	var PI2 = Math.PI * 2;
	var texture = new THREE.Texture( generateCircleTexture() );
  	texture.needsUpdate = true; // important!

	var material = new THREE.SpriteMaterial( {map: texture} ); //opacity can be set here
	var i = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			particle = particles[ i ++ ] = new THREE.Sprite( material );
			// particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
			// particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
			var x = -1 + Math.random() * 2;
			var y = -1 + Math.random() * 2;
			var z = -1 + Math.random() * 2;
			var d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			x *= d;
			y *= d;
			z *= d;

			particle.position.x = x;
			particle.position.y = y;
			particle.position.z = z;
			particle.scale.x = particle.scale.y = 1;
			// console.log(particle);
			scene.add( particle );
		}
	}

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize( window.innerWidth, window.innerHeight );



	//Line

	var material = new THREE.LineBasicMaterial({
		color: 0xffffff,
		opacity: 0.4
	});

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 0, 0, 0 )
	);

	line = new THREE.Line( geometry, material );
	console.log(line);
	scene.add( line );


	document.body.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}
function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}
function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function animate() {
	requestAnimationFrame( animate );
	render();
	// stats.update();
}
var rotation = 0;
var gravity = 100000;

var lastLineChange = startTime;
var lastRandomParticle = 0;
function render() {
	var now = Date.now();
	var elapsed = now - startTime;
	var slowDown = 2 - (elapsed / 1000);

	// console.log(camera.position.x);
	if(params.cameraMove){
		camera.position.x += ( mouseX - camera.position.x ) * .003;
		camera.position.y += ( mouseY - camera.position.y ) * .003;
		camera.position.z += ( mouseY - camera.position.y ) * .003;
	}
	// rotation += 0.01;
	// camera.position.x = 200;
	// camera.position.y = Math.sin(rotation) * 200;
	// camera.position.z = Math.cos(rotation) * 200;
	camera.lookAt( scene.position ); // the origin

	var i = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			particle = particles[ i++ ];
			if(slowDown > 0){
				var x = particle.position.x;
				var y = particle.position.y;
				var z = particle.position.z;

				var d = ( Math.cos( ( ix ) ) -  Math.cos( ( iy ))) * slowDown;
				var e = ( Math.cos( ( ix ) ) -  Math.sin( ( iy ))) * slowDown;
				var f = ( Math.sin( ( ix ) ) -  Math.cos( ( iy ))) * slowDown;

				particle.position.x = (particle.position.x) + d;
				particle.position.y = (particle.position.y) + e;
				particle.position.z = (particle.position.z) + f;

			}
			// var d = 1 / Math.sqrt(Math.pow(particle.position.x, 2) + Math.pow(particle.position.y, 2) + Math.pow(particle.position.z, 2));
			// particle.position.x += d;
			if(params.particlePulse){
				particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * params.particleScalePulseSpeed) + 1 ) * params.particleScalePulseSize + ( Math.sin( ( iy + count ) * params.particleScalePulseSpeed ) + 1 ) * params.particleScalePulseSize;
			} else {
				particle.scale.x = particle.scale.y = params.particleSize;
			}

		}
	}
	if(now - lastLineChange > params.lineFreq){
		lastLineChange = now;

		var randomParticle = Math.floor(Math.random()*particles.length) + 0;
		line.geometry.vertices[0] = new THREE.Vector3( particles[lastRandomParticle].position.x, particles[lastRandomParticle].position.y, particles[lastRandomParticle].position.z );
		line.geometry.vertices[1] = new THREE.Vector3( particles[randomParticle].position.x, particles[randomParticle].position.y, particles[randomParticle].position.z ),
		line.geometry.verticesNeedUpdate = true;
		lastRandomParticle = randomParticle;
	}




	//Call render
	renderer.render( scene, camera );
	count += 0.1;
}

function generateCircleTexture() {
    var PI2 = Math.PI * 2;
    var canvas = document.createElement( 'canvas' );
    var size = 20;
    canvas.width = size;
    canvas.height = size;

    var context = canvas.getContext( '2d' );
    context.fillStyle = '#02C9C8';
    context.beginPath();
    context.arc( size/2, size/2, size/2, 0, PI2, true );
    context.fill();

    return canvas;

}

