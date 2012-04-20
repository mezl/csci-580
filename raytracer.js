// -----------------------------------------------------------
// raytracer.js
// 2012 Spring CS580 Final Project 4/18/2012
// Author: Yun-Yu Chen,Sophia Chang,Vince Liao,Chin-Kai Chang
// -----------------------------------------------------------

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
	else 	{ this.m_Origin = a_Origin; this.m_Direction = a_Dir;}

	
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
	if(typeof() == "undefined") { this.m_Scene = new Scene();}

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

