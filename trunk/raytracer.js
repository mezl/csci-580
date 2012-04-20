// -----------------------------------------------------------
// raytracer.js
// 2012 Spring CS580 Final Project 4/18/2012
// Author: Yun-Yu Chen,Sophia Chang,Vince Liao,Chin-Kai Chang
// -----------------------------------------------------------
testCommon();
//
//#############################################################################
//code testing
function testCommon()
{
	console.log("Test raytracer.js");
	//var A = new vector3(1,1,1);
	var m_Origin = new vector3();
	var m_Direction = new vector3();
	var a_Origin = new vector3( 3, 3, 3);
	var a_Dir = new vector3( 4, 4, 4);
	console.log("Test Ray a_Origin: " + a_Origin.toString());
	console.log("Test Ray a_Dir: " + a_Dir.toString());
	var A = new Ray( a_Origin, a_Dir);
	console.log("Test Ray A: " + A.m_Origin.toString());
	console.log("Test Ray A: " + A.m_Direction.toString());
	var B = new Ray();//test default constructor
	console.log("Test Ray B: " + B.m_Origin.toString());
	console.log("Test Ray B: " + B.m_Direction.toString());
	B.SetOrigin(a_Origin);
	console.log("Test Ray B.SetOrigin: " + B.m_Origin.toString());
	B.SetDirection(a_Dir);
	console.log("Test Ray B.SetDirection: " + B.m_Direction.toString());
	B.GetOrigin();
	console.log("Test Ray B.GetOrigin: " + B.m_Origin.toString());
	B.GetDirection();
	console.log("Test Ray B.GetDirection: " + B.m_Direction.toString());
	/////////////////////////////////////////
	var C = new Engine();
	//console.log("Test Engine C: " + C.m_Scene.toString());	
	///////////////////////////////////////
	C.SetTarget( 20, 200, 500);
	console.log("Test Engine C.SetTarget: " + C.m_Dest);
	console.log("Test Engine C.SetTarget: " + C.m_Width);
	console.log("Test Engine C.SetTarget: " + C.m_Height);
	
	var o = new vector3(0, 0, -5);
	var dir = new vector3(10, 20, 0);
	var acc = new Color(0, 0, 0);
	var a_Ray = ( o, dir);
	C.Raytrace( a_Ray, acc, 10, 1.0, 2.0);
	console.log("Test Engine C.Raytrace: ");
	var D = C.GetScene();
	console.log("Test Engine C.GetScene = D: ");
	C.InitRender( );
	console.log("Test Engine C.InitRender: ");
	C.Render();
	console.log("Test Engine C.Render: ");//*/
}
//#############################################################################
// @param {vector3} m_Origin m_Direction
// class Ray
function Ray(m_Origin, m_Direction)
{
	//default constructor
	if(typeof(m_Origin) == "undefined") {	
											this.m_Origin = new vector3( 0, 0, 0 );
											this.m_Direction = new vector3( 0, 0, 0 );
										}										
	//constructor
	else	{ 
				this.m_Origin = m_Origin; 
				this.m_Direction = m_Direction;
			}

	
	//@param {vector3} a_Origin
	this.SetOrigin = function( a_Origin) { this.m_Origin = a_Origin;}

	//@param {vector3} a_Origin
	this.SetDirection = function( a_Direction) { this.m_Direction = a_Direction;}

	this.GetOrigin = function() { return this.m_Origin;}

	this.GetDirection = function() { return this.m_Direction;}

	//@param {vector3}
	var m_Origin = new vector3();
	//@param {vector3}
	var m_Direction = new vector3();
}
	
/*function addOne(m_CurrLine)
{
	m_CurrLine = m_CurrLine +1;
	return false;
}*/

function Scene(){}
function Primitive(){}
// class Engine
function Engine()
{
	//default constructor
	this.Engine = function()	{this.m_Scene = new Scene();}

	//@param {Pixel} a_Dest
	//@param {int} a_Width a_Height
	this.SetTarget = function( a_Dest, a_Width, a_Height) 	{	
																this.m_Dest = a_Dest; 
																this.m_Width = a_Width; 
																this.m_Height = a_Height;
															}
	// @return {Scene} 
	this.GetScene = function()  { return this.m_Scene;}

	//@param {Ray} a_Ray
	//@param {Color} a_Acc
	//@param {int} a_Depth
	//@param {float} a_RIndex a_Dist
	this.Raytrace = function( a_Ray, a_Acc, a_Depth, a_RIndex, a_Dist) 
	{																		
		if(a_Depth > TRACEDEPTH) return 0;

		a_Depth = 1000000.0;

		//@param  {vector3}
		var pi;
		//@param {Primitive}
		var prim = 0;
		//@param {int}
		var result;

		for( var s = 0; s < this.m_Scene.GetNrPrimitives(); s++ )
		{
			//@param {Primitive}
			var pr = this.m_Scene.GetPrimitive( s );
			//@param {int}
			var res;
			if(res = pr.Intersect( a_Ray, a_Dist ))
			{
				prim = pr;
				result = res; 
			}
		}

		if (!prim) return 0;

		if (prim.IsLight())
		{
			a_Acc = Color( 1, 1, 1 );
		}
		else
		{
			// determine color at point of intersection
			pi = a_Ray.GetOrigin() + a_Ray.GetDirection() * a_Dist;
			// trace lights
			for ( var l = 0; l < this.m_Scene.GetNrPrimitives(); l++ )
			{
				//@param {Primitive}
				var p = this.m_Scene.GetPrimitive( l );
				if (p.IsLight()) 
				{
					//@param {Primitive}
					var light = p;
					//@param {vector3}
					var L = light.GetCentre() - pi;
					NORMALIZE( L );
					//@param {vector3}
					var N = prim.GetNormal( pi );
					if (prim.GetMaterial().GetDiffuse() > 0)
					{
						//@param {float}
						var dot = DOT( N, L );
						if (dot > 0)
						{
							//@param {float}
							var diff = dot * prim.GetMaterial().GetDiffuse();
							// add diffuse component to ray color
							a_Acc += diff * prim.GetMaterial().GetColor() * light.GetMaterial().GetColor();
						}
					}
				}
			}
		}
		return prim;
	}
	
	this.InitRender = function()	
	{
		this.m_CurrLine = 20;
		this.m_PPos = this.m_CurrLine * this.m_Width;
		this.m_WX1 = -4, this.m_WX2 = 4, this.m_WY1 = this.m_SY = 3, this.m_WY2 = -3;
		this.m_DX = (this.m_WX2 - this.m_WX1) / this.m_Width;
		this.m_DY = (this.m_WY2 - this.m_WY1) / this.m_Height;
		this.m_SY += this.m_CurrLine * this.m_DY;
		this.m_LastRow = new Primitive*[this.m_Width];
		for( var i = 0; i < this.m_Width * 4; i++)
			this.m_LastRow[i] = 0;
	}
	
	this.Render = function(imageData)
	{
		//@param {vector3}
		var o = new vector3( 0, 0, -5 );
		//@param {int}
		var date = new Date();
		var msecs = date.getTime();//new GetTickCount();
		//@param {Primitive}
		var lastprim = 0;
		// render remaining lines
		for ( var y = this.m_CurrLine; y < (this.m_Height - 20); y++ )
		{
			m_SX = m_WX1;
			// render pixels for current line
			for ( var x = 0; x < this.m_Width; x++ )
			{
				//@param {Color}
				var acc = new vector3( 0, 0, 0 );
				//@param {vector3}
				var dir = vector3( m_SX, m_SY, 0 ) - o;
				NORMALIZE( dir );
				//@param {Ray}
				var r = new Ray( o, dir );
				//@param {float}
				var dist;
				//@param {Primitive}
				var prim = this.Raytrace( r, acc, 1, 1.0, dist );
				//@param {int}
				var red = acc.r * 256;
				var green = acc.g * 256;
				var blue = acc.b * 256;
			
				if (red > 255) red = 255;
				if (green > 255) green = 255;
				if (blue > 255) blue = 255;
				
				var cc = new Color( red, green, blue);
				setPixel(imageData, x, y, cc);
				this.m_SX += this.m_DX;
			}
			this.m_SY += this.m_DY;
			if ((/*GetTickCount()*/date.getTime() - msecs) > 100) 
			{
				// return control to windows so the screen gets updated
				this.m_CurrLine = y + 1;
				return false;
			}
			//var t = setTimeout("addOne( this.m_CurrLine)",100);
		}
		return true;
	}
	//@param {float}
	var m_WX1, m_WY1, m_WX2, m_WY2, m_DX, m_DY, m_SX, m_SY;
	//@param {Scene}
	var m_Scene;
	//@param {Pixel}
	var m_Dest;	
	//@param {int}
	var m_Width, m_Height, m_CurrLine, m_PPos;
	//@param {Primitive}
	var m_LastRow;
}

