// -----------------------------------------------------------
// common.js
// 2012 Spring CS580 Final Project 4/18/2012
// Author: Yun-Yu Chen,Sophia Chang,Vince Liao,Chin-Kai Chang
// -----------------------------------------------------------

window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 1);
		
    };
})();
window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
} )();

//typedef unsigned int Pixel;no need type in js
//typedef vector3 Color;
//#############################################################################
var WHITE = new Color(255,255,255);
var BLACK = new Color(0,0,0);
var GREEN = new Color(0,255,0);
var BLUE  = new Color(0,0,255);
var RED   = new Color(255,0,0);
var GRAY  = new Color(128,128,128);
//#############################################################################
function Color(r,g,b)
{
	this.r = r;
	this.g = g;
	this.b = b;
  this.a = 0xff;
	this.toArray = new Array(r,g,b);
  this.toString = "r:"+r+" g:"+g+" b:"+b;

}

//testCommon();//All test passed
//#############################################################################
//code testing
function testCommon()
{
	console.log("Test Rand range of 0~20 :"+Rand(20)+"\n");
	var A = new vector3(1,1,1);
	var B = new vector3();//test default constructor
	B.Set(2,2,2);
	console.log("Test vector3:A "+A.toString());
	console.log("Test vector3:B "+B.toString());
	var C = DOT(A,B);
	console.log("Test vector3:C = A dot B = "+C.toString());
	var D = NORMALIZE(A);
	console.log("Test vector3:D = NORMALIZE(A) "+D.toString());
	console.log("Test SQRLENGTH(A) "+SQRLENGTH(A)+" == 3");
	console.log("Test vector3:A "+A.toString());
	console.log("Test vector3:B "+B.toString());
	console.log("Test SQRDISTANCE(A,B) "+SQRDISTANCE(A,B)+" == 3");

	console.log("Test vector3 class member function...");
	var AdotB = A.Dot(B);
	console.log("Test A.Dot(B) "+AdotB+" == 6");
	console.log("Test A.Length() "+A.Length()+" == sqrt(3)");
	console.log("Test A.SqrLength() "+A.SqrLength()+" == 3");
	console.log("Test A.Cross(B) "+A.Cross(B).toString()+" == 0");
	var AB =A.Add(B);
	console.log("Test A.Add(B) "+AB.toString()+" == (3,3,3)");
	AB =A.Sub(B);
	console.log("Test A.Sub(B) "+AB.toString()+" == (1,1,1)");
	A.Mul(4);
	console.log("Test A.Mul(4) "+A.toString()+" == (4,4,4)");
	A.Mul(new vector3(5,5,5));
	console.log("Test A.Mul((5,5,5)) "+A.toString()+" == (20,20,20)");
	console.log("Test A.Neg((5,5,5)) "+A.Neg().toString()+" == (-20,-20,-20)");
	

}
//#############################################################################
function Rand( a_Range ) { return Math.random() * a_Range; }


// @param {vector3} A 
// @param {vector3} B 
// @return {float}

function DOT(A,B){return A.x*B.x+A.y*B.y+A.z*B.z;}
function LENGTH(A){return Math.sqrt(A.x*A.x+A.y*A.y+A.z*A.z);}
function NORMALIZE(A)	{
	var l = 1.0/LENGTH(A);
	x = A.x*l;y = A.y*l; z = A.z*l;
	return new vector3(x,y,z);
}
function SQRLENGTH(A)	{return A.x*A.x+A.y*A.y+A.z*A.z;}
function SQRDISTANCE(A,B) {return (A.x-B.x)*(A.x-B.x)+(A.y-B.y)*(A.y-B.y)+(A.z-B.z)*(A.z-B.z);}

var EPSILON	=	0.0001;
var TRACEDEPTH	=	6;

var PI	= Math.PI;

//#############################################################################
// @param {float} x,y,z
// class vector3
function vector3(x,y,z)
{
	//default constructor
	if(typeof(x) == "undefined"){this.x = 0.0;this.y = 0.0; this.z = 0.0;}
	//constructor(vector3)
	else if(typeof(y) == "undefined"){this.x = x.x;this.y = x.y; this.z = x.z;}
	//constructor(x,y,z)
	else	{this.x = x;this.y = y;this.z = z;}

	// @param {float} a_X,a_Y,a_Z
	this.Set = function ( a_X,  a_Y,  a_Z ) { this.x = a_X; this.y = a_Y; this.z = a_Z; }

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
	this.Add = function( a_V ) {return new vector3(this.x + a_V.x, this.y + a_V.y, this.z + a_V.z); }
	// @param {vector3} a_V Subtract a_V from this vector
	this.Sub = function(a_V) {return new vector3(this.x - a_V.x, this.y - a_V.y, this.z - a_V.z);}
	//this.Sub = function( a_V ) { this.x -= a_V.x; this.y -= a_V.y; this.z -= a_V.z; }
	
	// @param {float/vector3} f Multiply f to this vector,f can be a number or vector3
	this.Mul = function( f ){
		if(typeof f == 'number'){
			return new vector3(this.x * f, this.y * f, this.z * f);
		}else{
			return new vector3(this.x * f.x, this.y * f.y, this.z * f.z);
		}
	}
	
	/*
	this.Mul = function ( f ) {
					if(typeof f == 'number'){
									this.x *= f; this.y *= f; this.z *= f; 
					}else{
									{ this.x *= f.x; this.y *= f.y; this.z *= f.z; }
					}
	}
	*/
	this.Neg = function()  { return new vector3( -this.x, -this.y, -this.z ); }

	// @return {String} (x,y,z) 
	this.toString = function() { return "("+this.x+","+this.y+","+this.z+")"; }

	this.r = 0.0;
	this.g = 0.0;
	this.b = 0.0;
	this.cell = new Array(3);
}

//#############################################################################
//class plane
// @param {vector3} a_Normal
// @param {float} a_D 
function plane(a_Normal,a_D)
{
	//default constructor
	if(typeof(a_Normal) == "undefined"){
								this.N = new vector3( 0, 0, 0 );
								this.D = 0;
	//constructor
	}else	{this.N = a_Normal;this.D = a_D;}
	this.cell = new Array(4);
}



