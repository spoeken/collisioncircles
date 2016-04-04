var THREE = require('three');

var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
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
	camera.position.y = 200;
	// camera.position.x = 1000;
	scene = new THREE.Scene();
	particles = new Array();
	var PI2 = Math.PI * 2;
	var material = new THREE.SpriteMaterial( {
		color: '#02C9C8',
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

			particle.position.x = x;
			particle.position.y = y;
			particle.position.z = z;
			particle.scale.x = particle.scale.y = 2;
			console.log(particle);
			scene.add( particle );
		}
	}

	renderer = new THREE.WebGLRenderer({ alpha: true });
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
var rotation = 0;
function render() {
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	// rotation += 0.01;
	// camera.position.x = 200;
	// camera.position.y = Math.sin(rotation) * 200;
	// camera.position.z = Math.cos(rotation) * 200;
	camera.lookAt( scene.position ); // the origin
	var i = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			particle = particles[ i++ ];
			var x = particle.position.x;
			var y = particle.position.y;
			var z = particle.position.z;

			var d = ( Math.cos( ( ix ) ) -  Math.cos( ( iy ))) * 0.1;
			var e = ( Math.cos( ( ix ) ) -  Math.sin( ( iy ))) * 0.1;
			var f = ( Math.sin( ( ix ) ) -  Math.cos( ( iy ))) * 0.1;
			particle.position.x = (particle.position.x) + d;
			particle.position.y = (particle.position.y) + e;
			particle.position.z = (particle.position.z) + f;
			// var d = 1 / Math.sqrt(Math.pow(particle.position.x, 2) + Math.pow(particle.position.y, 2) + Math.pow(particle.position.z, 2));
			// particle.position.x += d;
			// particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 8 +
				// ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 8;
		}
	}
	renderer.render( scene, camera );
	count += 0.1;
}