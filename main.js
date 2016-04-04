var THREE = require('three');

var SEPARATION = 100, AMOUNTX = 20, AMOUNTY = 20;
var container, stats;
var camera, scene, renderer;
var particles, particle, count = 0;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();
function init() {


	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.z = 100;
	camera.position.y = 4000;
	// camera.position.x = 1000;
	scene = new THREE.Scene();
	particles = new Array();
	var PI2 = Math.PI * 2;
	var material = new THREE.SpriteMaterial( {
		color: 0xffffff,
		program: function ( context ) {
			context.beginPath();
			context.arc( 0, 0, 0.5, 0, PI2, true );
			context.fill();
		}
	} );
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

			particle.position.x = x * 1000;
			particle.position.y = y * 1000;
			particle.position.z = z * 1000;
			particle.scale.x = particle.scale.y = 30;
			scene.add( particle );
		}
	}

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );



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

function render() {
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	// camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( scene.position );
	var i = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			// particle = particles[ i++ ];
			// particle.position.x += ( Math.sin( ( iy + count ) * 0.1 ) * (count/10) );
			// particle.position.z += ( Math.cos( ( iy + count ) * 0.1 ) * (count/10) );
			// particle.position.y += ( Math.cos( ( ix + count ) * 0.1 ) * Math.sin( ( iy + count ) * 0.1 ) * (count/10));
			// particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 8 +
			// 	( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 8;
		}
	}
	renderer.render( scene, camera );
	count += 0.1;
}