// -----------------------------------------------------------
// common.js
// 2012 Spring CS580 Final Project 4/18/2012
// Author: Yun-Yu Chen,Sophia Chang,Vince Liao,Chin-Kai Chang
// -----------------------------------------------------------

//typedef unsigned int Pixel;no need type in js
//typedef vector3 Color;

function Rand( a_Range ) { return Math.random() * a_Range; }


// @param {vector3} A 
// @param {vector3} B 
// @return {float}
function DOT(A,B){return A.x*B.x+A.y*B.y+A.z*B.z;}
function NORMALIZE(A)	{
	var l=1.0/Math.sqrt(A.x*A.x+A.y*A.y+A.z*A.z);
	A.x*=l;A.y*=l;A.z*=l;
	return A;
}
function LENGTH(A){return Math.sqrt(A.x*A.x+A.y*A.y+A.z*A.z);}
function SQRLENGTH(A)	{return A.x*A.x+A.y*A.y+A.z*A.z;}
function SQRDISTANCE(A,B) {return (A.x-B.x)*(A.x-B.x)+(A.y-B.y)*(A.y-B.y)+(A.z-B.z)*(A.z-B.z);}

var EPSILON	=	0.0001;
var TRACEDEPTH	=	6;

var PI	= Math.PI;

// @param {float} x,y,z
// class vector3
function vector3(x,y,z)
{
	//default constructior
	if(typeof(x) == "undefined"){this.x = 0.0;this.y = 0.0; this.z = 0.0;}
	//constructior
	else	{this.x = x;this.y = y;this.z = z;}

	// @param {float} a_X,a_Y,a_Z
	this.Set = function ( a_X,  a_Y,  a_Z ) { this.x = a_X; this.y = this.a_Y; this.z = a_Z; }

	// inplace normalize
	this.Normalize = function() { var l = 1.0 / this.Length(); this.x *= l; this.y *= l; this.z *= l; }

	// @return {float} length of this vector
	this.Length = function() { return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z ); }

	// @return {float} square length of this vector
	this.SqrLength = function() { return this.x * this.x + this.y * this.y + this.z * this.z; }

	// @param {vector3} a_V
  // @return {float}
	this.Dot = function( a_V ) { return this.x * a_V.x + this.y * a_V.y + this.z * a_V.z; }

	// @param {vector3} b
	// @return {vector3} this vector a x b
	this.Cross = function( b ) { return new vector3( this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x ); }

	// @param {vector3} a_V Add a_V to this vector
	this.add = function( a_V ) { this.x += a_V.x; this.y += a_V.y; this.z += a_V.z; }
	// @param {vector3} a_V Subtract a_V from this vector
	this.sub = function( a_V ) { this.x -= a_V.x; this.y -= a_V.y; this.z -= a_V.z; }
	// @param {float/vector3} f Multiply f to this vector,f can be a number or vector3
	this.mul = function ( f ) {
					if(typeof f == 'number'){
									this.x *= f; this.y *= f; this.z *= f; 
					}else{
									{ this.x *= f.x; this.y *= f.y; this.z *= f.z; }
					}
	}
	this.neg = function()  { return new vector3( -this.x, -this.y, -this.z ); }

	this.r = 0.0;
	this.g = 0.0;
	this.b = 0.0;
	this.cell = new Array(3);
}

//class plane
// @param {vector3} a_Normal
// @param {float} a_D 
function plane(a_Normal,a_D)
{
	//default constructior
	if(typeof(a_Normal) == "undefined"){
								this.N = new vector3( 0, 0, 0 );
								this.D = 0;
	//constructior
	}else	{this.N = a_Normal;this.D = a_D;}
	this.cell = new Array(4);
}



