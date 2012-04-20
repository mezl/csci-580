// -----------------------------------------------------------
// common.js
// 2012 Spring CS580 Final Project 4/18/2012
// Author: Yun-Yu Chen,Sophia Chang,Vince Liao,Chin-Kai Chang
// -----------------------------------------------------------

//typedef unsigned int Pixel;no need type in js
//typedef vector3 Color;

//raytracer();//All test passed
//#############################################################################
var TRACEDEPTH = 6;
// @param {vector3} m_Origin m_Direction
// class Ray
function Ray(m_Origin, m_Direction)
{
	//default constructor
	this.m_Origin = vector3( 0, 0, 0 );
	this.m_Direction = vector3( 0, 0, 0 );
	
	//constructor
	//@param {vector3} a_Origin a_Dir
	this.Ray = function( a_Origin, a_Dir) { this.m_Origin = a_Origin; this.m_Direction = a_Dir;}
	
	//@param {vector3} a_Origin
	this.SetOrigin = function( a_Origin) { this.m_Origin = a_Origin;}
	
	//@param {vector3} a_Origin
	this.SetDirection = function( a_Direction) { this.m_Direction = a_Direction;}
	
	this.GetOrigin = function() { return this.m_Origin;}
	
	this.GetDirection = function() { return this.m_Direction;}
	
	//@param {vector3}
	var m_Origin;
	//@param {vector3}
	var m_Direction;
}

function Scene;
function Primitive;
// class Engine
function Engine()
{
	//default constructor
	this.m_Scene = new Scene();

	this.~Engine = function(){ delete this.m_Scene;};
	
	//@param {Pixel} a_Dest
	//@param {int} a_Width a_Height
	this.SetTarget = function( a_Dest, a_Width, a_Height) { 
															this.m_Dest = a_Dest; 
															this.m_Width = a_Width; 
															this.m_Height = a_Height;
															}
	// @return {Scene} 
	this.GetScene = function() { return this.m_Scene;}
	
	//@param {Ray} a_Ray
	//@param {Color} a_Acc
	//@param {int} a_Depth
	//@param {float} a_RIndex a_Dist
	this.Raytrace = function( a_Ray, a_Acc, a_Depth, a_RIndex, a_Dist) {																		
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
																						var L = ((Sphere*)light.GetCentre() - pi;
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
	
	this.InitRender = function(){
									this.m_CurrLine = 20;
									this.m_PPos =  this.m_CurrLine * this.m_Width;
									this.m_WX1 = -4, this.m_WX2 = 4, this.m_WY1 = this.m_SY = 3, this.m_WY2 = -3;
									this.m_DX = (this.m_WX2 - this.m_WX1) / this.m_Width;
									this.m_DY = (this.m_WY2 - this.m_WY1) / this.m_Height;
									this.m_SY += this.m_CurrLine * this.m_DY;
									this.m_LastRow = new Primitive*[this.m_Width];
									memset( this.m_LastRow, 0, this.m_Width * 4 );
								};
	
	this.Render = function(){
								//@param {vector3}
								var o( 0, 0, -5 );
								//@param {int}
								var msecs = GetTickCount();	
								//@param {Primitive}
								var lastprim = 0;
								
								for ( var y = this.m_CurrLine; y < (this.m_Height - 20); y++ )
								{
									this.m_SX = this.m_WX1;
									// render pixels for current line
									for ( var x = 0; x < this.m_Width; x++ )
									{
										//@param {Color}
										var acc( 0, 0, 0 );
										//@param {vector3}
										var dir = vector3( this.m_SX, this.m_SY, 0 ) - o;
										NORMALIZE( dir );
										//@param {Ray}
										var r( o, dir );
										//@param {float}
										var dist;
										//@param {Primitive}
										var prim = Raytrace( r, acc, 1, 1.0, dist );
										//@param {int}
										var red = acc.r * 256;
										var green = acc.g * 256;
										var blue = acc.b * 256;
									
										if (red > 255) red = 255;
										if (green > 255) green = 255;
										if (blue > 255) blue = 255;
										//////////*****//////////////
										var cc = new Color(red, green, blue);
										setPixel( ,x, y, cc);
										//////////*****//////////////
										this.m_SX += this.m_DX;
									}
									this.m_SY += this.m_DY;
									if ((GetTickCount() - msecs) > 100) 
									{
										this.m_CurrLine = y + 1;
										return false;
									}
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

