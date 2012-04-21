// -----------------------------------------------------------
// raytracer.js
// 2012 Spring CS580 Final Project 4/18/2012
// Author: Yun-Yu Chen,Sophia Chang,Vince Liao,Chin-Kai Chang
// -----------------------------------------------------------
//testRaytraceScene();
//
//#############################################################################
//code testing
function testRaytraceScene(imageData) {
    console.log("Test raytracer.js");
    //var A = new vector3(1,1,1);
    var m_Origin = new vector3();
    var m_Direction = new vector3();
    var a_Origin = new vector3(3, 3, 3);
    var a_Dir = new vector3(4, 4, 4);
    console.log("Test Ray a_Origin: " + a_Origin.toString());
    console.log("Test Ray a_Dir: " + a_Dir.toString());
    var A = new Ray(a_Origin, a_Dir);
    console.log("Test Ray A: " + A.m_Origin.toString());
    console.log("Test Ray A: " + A.m_Direction.toString());
    var B = new Ray(); //test default constructor
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
    C.SetTarget(20, 400, 300);
    console.log("Test Engine C.SetTarget: " + C.m_Dest);
    console.log("Test Engine C.SetTarget: " + C.m_Width);
    console.log("Test Engine C.SetTarget: " + C.m_Height);

    var o = new vector3(0, 0, -5);
    var dir = new vector3(10, 20, 0);
    var acc = new vector3(0, 0, 0);
    var a_Ray = (o, dir);
    var ret = C.Raytrace(a_Ray, 10, 1.0);
    console.log("Test Engine C.Raytrace: ");
    var D = C.GetScene();
    console.log("Test Engine C.GetScene = D: ");
    C.InitRender();
    console.log("Test Engine C.InitRender: ");
    C.Render(imageData);
    console.log("Test Engine C.Render: "); //*/
}
//#############################################################################
// class Material
function Material() {
    // default constructor
    this.m_color = new vector3(0.2, 0.2, 0.2);
    this.m_Refl = 0;
    this.m_Refr = 0;
    this.m_Diff = 0.2;
    this.m_Spec = 0.8;
    this.m_RIndex = 1.5;

    // @param {Color} a_color
    this.SetColor = function (a_color) { this.m_color = a_color; }

    // @return {Color} color of this material
    this.GetColor = function () { return this.m_color; }

    // @param {float} a_Diff
    this.SetDiffuse = function (a_Diff) { this.m_Diff = a_Diff; }

    // @param {float} a_Spec
    this.SetSpecular = function (a_Spec) { this.m_Spec = a_Spec; }

    // @param {float} a_Refl
    this.SetReflection = function (a_Refl) { this.m_Refl = a_Refl; }

    // @param {float} a_Refr
    this.SetRefraction = function (a_Refr) { this.m_Refr = a_Refr; }

    // @return {float} specular of this material
    this.GetSpecular = function () { return 1.0 - this.m_Diff; }

    // @return {float} diffuse of this material
    this.GetDiffuse = function () { return this.m_Diff; }

    // @return {float} reflection of this material
    this.GetReflection = function () { return this.m_Refl; }

    // @return {float} refraction of this material
    this.GetRefraction = function () { return this.m_Refr; }

    // @param {float} a_RIndex
    this.SetRefrIndex = function (a_RIndex) { this.m_RIndex = a_RIndex; }

    // @return {float} RIndex of this material
    this.GetRefrIndex = function () { return this.m_RIndex; }

    // @return {String}
    this.toString = function () {
        return "[ Material Color: " + this.m_color.toString() + " Refl: " + this.m_Refl
		+ " Refr: " + this.m_Refr + " Diff: " + this.m_Diff
		+ " Spec: " + this.m_Spec + "RIndex: " + this.m_RIndex + " ]";
    }
}

//#############################################################################
/*
var SPHERE = 1;
var PLANE = 2;
*/
//class Primitive
function Primitive() {
    // default constructor
    this.m_Name = 0;
    this.m_Light = new Boolean(false);
    this.m_Material = new Material();

    // @return {Material} material of this primitive
    this.GetMaterial = function () { return this.m_Material; }

    // @param {Material} a_Mat
    this.SetMaterial = function (a_Mat) { this.m_Material = a_Mat; }

    // @return {int} type of this primitive
    this.GetType = function () { return 0; }

    // @param {Ray} a_Ray
    // @param {float} a_Dist
    // @return {int} intersection type
    this.Intersect = function (a_Ray) { return 0; }

    // @param {vector3} a_Pos
    // @return {vector3} normal of the primitive
    this.GetNormal = function (a_Pos) { return 0; }

    // @return {Color} color of this material
    this.GetColor = function () { return this.m_Material.GetColor(); }

    // @param {Boolean} a_Light
    this.Light = function (a_Light) { this.m_Light = a_Light; }

    // @return {Boolean} is this primitive a light
    this.IsLight = function () { return this.m_Light.valueOf(); }

    // @param {String} a_Name
    this.SetName = function (a_Name) { this.m_Name = a_Name; }

    // @return {String} name of this primitive
    this.GetName = function () { return this.m_Name; }

    // @return {String}
    this.toString = function () {
        return "[ Primitive Name: " + this.m_Name + " Material: " + this.m_Material.toString()
		+ " Type: " + this.GetType() + " Normal: " + this.GetNormal(new vector3(0, 0, 0)).toString()
		+ " Light: " + this.IsLight().toString() + " ]";
    }
    this.primToString = function () {
        return "[ Primitive Name: " + this.m_Name + " Material: " + this.m_Material.toString()
		+ " Type: " + this.GetType() + " Normal: " + this.GetNormal(new vector3(0, 0, 0)).toString()
		+ " Light: " + this.IsLight().toString() + " ]";
    }

}

//#############################################################################
// class Sphere
// @param {vector3} a_Centre
// @param {float} a_Radius

function Sphere(a_Centre, a_Radius) {
    // Intersection method return values
    var HIT = 1; 	// Ray hit primitive
    var MISS = 0; 	// Ray missed primitive
    var INPRIM = -1; // Ray started inside primitive

    var SPHERE = 1;
    // @return {int} type of this primitive
    this.GetType = function () { return SPHERE; }

    if (typeof (a_Centre) == "undefined") {
        // default constructor
        this.m_Centre = new vector3(0, 0, 0);
        this.m_SqRadius = 1.0 * 1.0;
        this.m_Radius = 1.0;
        this.m_RRadius = 1.0 / 1.0;
    } else {
        // constructor
        this.m_Centre = a_Centre;
        this.m_SqRadius = a_Radius * a_Radius;
        this.m_Radius = a_Radius;
        this.m_RRadius = 1.0 / a_Radius;
    }

    // @return {vertor3} centre of this sphere
    this.GetCentre = function () { return this.m_Centre; }

    // @return {float} radius of this sphere
    this.GetSqRadius = function () { return this.m_SqRadius; }

    // @param {Ray} a_Ray
    // @return {Array} [0] intersection type [1] distance
    this.Intersect = function (a_Ray) {
        var result = new Array(2);
        var a_Dist = Number.MAX_VALUE;
        var v = a_Ray.GetOrigin().Sub(this.m_Centre);
        var b = -DOT(v, a_Ray.GetDirection());
        var det = (b * b) - DOT(v, v) + this.m_SqRadius;
        var retval = MISS;
        if (det > 0) {
            det = Math.sqrt(det);
            var i1 = b - det;
            var i2 = b + det;
            if (i2 > 0) {
                if (i1 < 0) {
                    if (i2 < a_Dist) {
                        a_Dist = i2;
                        retval = INPRIM;
                    }
                }
                else {
                    if (i1 < a_Dist) {
                        a_Dist = i1;
                        retval = HIT;
                    }
                }
            }
        }
        result[0] = retval;
        result[1] = a_Dist;

        return result;
    }

    // @param {vector3} a_Pos
    // @return {vector3} normal
    this.GetNormal = function (a_Pos) { return (a_Pos.Sub(this.m_Centre)).Mul(this.m_RRadius); }

    this.toString = function () {
        return "[ Sphere Primitive: " + this.primToString() + " Centre: " + this.m_Centre.toString() + " SqRadius: " + this.m_SqRadius
		+ " Radius: " + this.m_Radius + " RRadius: " + this.m_RRadius + " ]";
    }
}

//#############################################################################
// class PlanePrim
// @param {vector3} a_Normal
// @param {float} a_D
function PlanePrim(a_Normal, a_D) {
    // Intersection method return values
    var HIT = 1; 	// Ray hit primitive
    var MISS = 0; 	// Ray missed primitive
    var INPRIM = -1; // Ray started inside primitive

    var PLANE = 2;
    // @return {int} type of this primitive
    this.GetType = function () { return PLANE; }

    if (typeof (a_Normal) == "undefined") {
        // default constructor
        this.m_Plane = new plane(new vector3(0, 1, 0), 1.0);
    } else {
        //constructor
        this.m_Plane = new plane(a_Normal, a_D);
    }
    // @return {vector3} normal of this planeprim
    this.GetNormal = function () { return this.m_Plane.N; }

    // @return {float} d of this planeprim
    this.GetD = function () { return this.m_Plane.D; }

    // @param {Ray} a_Ray
    // @return {Array} [0] intersection type [1] distance
    this.Intersect = function (a_Ray) {
        var result = new Array(2);
        var a_Dist = Number.MAX_VALUE;
        var retval = MISS;
        var d = DOT(this.m_Plane.N, a_Ray.GetDirection());
        if (d != 0) {
            var dist = -(DOT(this.m_Plane.N, a_Ray.GetOrigin()) + this.m_Plane.D) / d;
            if (dist > 0) {
                if (dist < a_Dist) {
                    a_Dist = dist;
                    retval = HIT;
                    //return HIT;
                }
            }
        }
        //return MISS;

        result[0] = retval;
        result[1] = a_Dist;
        return result;
    }

    // @param {vector3} a_Pos
    // @return {vector3} normal
    this.GetNormal = function (a_Pos) { return this.m_Plane.N; }

    this.toString = function () {
        return "[ PlanePrim Primitive: " + this.primToString() + " Normal: "
		+ this.GetNormal().toString() + " D: " + this.GetD() + " ]";
    }
}

//#############################################################################
//class Scene
function Scene() {
    // default constructor
    this.m_Primitives = 0;
    this.m_Primtive = 0;

    // init scene
    this.InitScene = function () {
        Sphere.prototype = new Primitive(); // set parent
        PlanePrim.prototype = new Primitive(); // set parent

        this.m_Primitive = new Array(500);
        // ground plane
        this.m_Primitive[0] = new PlanePrim(new vector3(0, 1, 0), 4.4);
        this.m_Primitive[0].prototype = new Primitive();
        this.m_Primitive[0].SetName("plane");
        this.m_Primitive[0].GetMaterial().SetReflection(0);
        this.m_Primitive[0].GetMaterial().SetRefraction(0);
        this.m_Primitive[0].GetMaterial().SetDiffuse(1);
        this.m_Primitive[0].GetMaterial().SetColor(new vector3(0.4, 0.3, 0.3));
        // big sphere
        this.m_Primitive[1] = new Sphere(new vector3(2, -0.8, 3), 2.5);
        this.m_Primitive[1].SetName("big sphere");
        this.m_Primitive[1].GetMaterial().SetReflection(0.2);
        this.m_Primitive[1].GetMaterial().SetRefraction(0.8);
        this.m_Primitive[1].GetMaterial().SetRefrIndex(1.3);
        this.m_Primitive[1].GetMaterial().SetColor(new vector3(0.7, 0.7, 1.0));
        // small sphere
        this.m_Primitive[2] = new Sphere(new vector3(-5.5, -0.5, 7), 2);
        this.m_Primitive[2].SetName("small sphere");
        this.m_Primitive[2].GetMaterial().SetReflection(0.5);
        this.m_Primitive[2].GetMaterial().SetRefraction(0);
        this.m_Primitive[2].GetMaterial().SetRefrIndex(1.3);
        this.m_Primitive[2].GetMaterial().SetDiffuse(0.1);
        this.m_Primitive[2].GetMaterial().SetColor(new vector3(0.7, 0.7, 1.0));
        // light source 1
        this.m_Primitive[3] = new Sphere(new vector3(0, 5, 5), 0.1);
        this.m_Primitive[3].Light(new Boolean(true));
        this.m_Primitive[3].GetMaterial().SetColor(new vector3(0.6, 0.6, 0.8));
        // light source 2
        this.m_Primitive[4] = new Sphere(new vector3(-3, 5, 1), 0.1);
        this.m_Primitive[4].Light(new Boolean(true));
        this.m_Primitive[4].GetMaterial().SetColor(new vector3(0.6, 0.6, 0.8));
        // extra sphere
        this.m_Primitive[5] = new Sphere(new vector3(-1.5, -3.8, 1), 1.5);
        this.m_Primitive[5].SetName("extra sphere");
        this.m_Primitive[5].GetMaterial().SetReflection(0);
        this.m_Primitive[5].GetMaterial().SetRefraction(0.8);
        this.m_Primitive[5].GetMaterial().SetColor(new vector3(1.0, 0.4, 0.4));
        // back plane
        this.m_Primitive[6] = new PlanePrim(new vector3(0.4, 0, -1), 12);
        this.m_Primitive[6].SetName("back plane");
        this.m_Primitive[6].GetMaterial().SetReflection(0);
        this.m_Primitive[6].GetMaterial().SetRefraction(0);
        this.m_Primitive[6].GetMaterial().SetSpecular(0);
        this.m_Primitive[6].GetMaterial().SetDiffuse(0.6);
        this.m_Primitive[6].GetMaterial().SetColor(new vector3(0.5, 0.3, 0.5));
        // ceiling plane
        this.m_Primitive[7] = new PlanePrim(new vector3(0, -1, 0), 7.4);
        this.m_Primitive[7].SetName("back plane");
        this.m_Primitive[7].GetMaterial().SetReflection(0);
        this.m_Primitive[7].GetMaterial().SetRefraction(0);
        this.m_Primitive[7].GetMaterial().SetSpecular(0);
        this.m_Primitive[7].GetMaterial().SetDiffuse(0.5);
        this.m_Primitive[7].GetMaterial().SetColor(new vector3(0.4, 0.7, 0.7));
        //grid
        var prim = 8;
        for (x = 0; x < 8; x = x + 1) {
            for (y = 0; y < 7; y = y + 1) {
                this.m_Primitive[prim] = new Sphere(new vector3(-4.5 + x * 1.5, -4.3 + y * 1.5, 10), 0.3);
                this.m_Primitive[prim].SetName("grid sphere");
                this.m_Primitive[prim].GetMaterial().SetReflection(0);
                this.m_Primitive[prim].GetMaterial().SetRefraction(0);
                this.m_Primitive[prim].GetMaterial().SetSpecular(0.6);
                this.m_Primitive[prim].GetMaterial().SetDiffuse(0.6);
                this.m_Primitive[prim].GetMaterial().SetColor(new vector3(0.3, 1.0, 0.4));
                prim = prim + 1;
            }
        }

        this.m_Primitives = prim;
    }

    // @return {float} number of primitives in this scene
    this.GetNrPrimitives = function () { return this.m_Primitives; }

    // @return {Array} array containing all the primitives in this scene
    this.GetPrimitive = function (a_Idx) { return this.m_Primitive[a_Idx]; }

    this.toString = function () {
        var result = "Number of primitives: " + this.GetNrPrimitives() + " Primitives: ";
        for (i = 0; i < this.GetNrPrimitives(); i = i + 1) {
            result += this.GetPrimitive(i).toString() + " ";
        }
        return result;
    }
}
//#############################################################################
// @param {vector3} m_Origin m_Direction
// class Ray
function Ray(m_Origin, m_Direction) {
    //default constructor
    if (typeof (m_Origin) == "undefined") {
        this.m_Origin = new vector3(0, 0, 0);
        this.m_Direction = new vector3(0, 0, 0);
    }
    //constructor
    else {
        this.m_Origin = m_Origin;
        this.m_Direction = m_Direction;
    }


    //@param {vector3} a_Origin
    this.SetOrigin = function (a_Origin) { this.m_Origin = a_Origin; }

    //@param {vector3} a_Origin
    this.SetDirection = function (a_Direction) { this.m_Direction = a_Direction; }

    this.GetOrigin = function () { return this.m_Origin; }

    this.GetDirection = function () { return this.m_Direction; }

    //@param {vector3}
    var m_Origin = new vector3();
    //@param {vector3}
    var m_Direction = new vector3();
}

// class Engine
function Engine() {
    //default constructor
    this.m_Scene = new Scene();
    this.m_Scene.InitScene();

    //@param {Pixel} a_Dest
    //@param {int} a_Width a_Height
    this.SetTarget = function (a_Dest, a_Width, a_Height) {
        this.m_Dest = a_Dest;
        this.m_Width = a_Width;
        this.m_Height = a_Height;
    }
    // @return {Scene} 
    this.GetScene = function () { return this.m_Scene; }

    //@param {Ray} a_Ray
    //@param {int} a_Depth
    //@param {float} a_RIndex 
    //@return[0] {int} normal return
    //@return[1] {Color} a_Acc 
    //@return[2] {float} a_Dist
    this.Raytrace = function (a_Ray, a_Depth, a_RIndex) {
        var ret = new Array(3);
        if (a_Depth > TRACEDEPTH) { ret[0] = 0; return ret; }

        a_Depth = 1000000.0;
        var a_Dist = 0;
        //@param  {vector3}
        var pi;
        //@param {Primitive}
        var prim = 0;
        //@param {int}
        var result;
        for (var s = 0; s < this.m_Scene.GetNrPrimitives(); s++) {
            //@param {Primitive}
            var pr = this.m_Scene.GetPrimitive(s);
            //console.log("pr is "+pr.toString());
            //console.log("ray is "+a_Ray.m_Origin.toString()+"  Dir:"+a_Ray.m_Direction.toString());
            //@param {int}
            var res;
            var prReturn = pr.Intersect(a_Ray);

            if (prReturn[0] != 0) {
                a_Dist = prReturn[1];
                ret[2] = a_Dist;
                //console.log("intersect with pr"+pr.toString());
                prim = pr;
                result = res;
            }
        }

        //console.log("prim is "+prim);
        if (!prim) { ret[0] = 0; return ret; };

        var a_Acc = new vector3();

        if (prim.IsLight()) {
            a_Acc = new vector3(1, 1, 1);
        }
        else {
            // determine color at point of intersection
            pi = a_Ray.GetDirection().Mul(a_Dist).Add(a_Ray.GetOrigin());
            // trace lights
            for (var l = 0; l < this.m_Scene.GetNrPrimitives(); l++) {
                //@param {Primitive}
                var p = this.m_Scene.GetPrimitive(l);
                if (p.IsLight()) {
                    //@param {Primitive}
                    var light = p;
                    // handle point light source
                    //@param {float}
                    var shade = 1.0;

                    if (light.GetType() == 1) {
                        //@param {vector3}
                        var L = light.GetCentre().Sub(pi);
                        //@param {float}
                        var tdist = LENGTH(L);
                        L = L.Mul(1.0 / tdist);
                        //@param {Ray}
                        var r = new Ray(pi.Add(L.Mul(EPSILON)), L);
                        for (var s = 0; s < this.m_Scene.GetNrPrimitives(); s++) {
                            //@param {Primitive}
                            pr = this.m_Scene.GetPrimitive(s);
                            if ((pr != light) && (pr.Intersect(r, tdist))) {
                                shade = 0;
                                break;
                            }
                        }
                        //console.log("shade = " + shade);
                    }
                    if (shade > 0) {
                        console.log("shade");
                        // calculate diffuse shading
                        //@param {vector3}
                        var L = light.GetCentre().Sub(pi);
                        L.Normalize();
                        //@param {vector3}
                        var N = prim.GetNormal(pi);
                        if (prim.GetMaterial().GetDiffuse() > 0) {
                            //@param {float}
                            var dot = DOT(N, L);
                            if (dot > 0) {
                                //@param {float}
                                var diff = dot * prim.GetMaterial().GetDiffuse();
                                // add diffuse component to ray color
                                a_Acc = a_Acc.Add((prim.GetMaterial().GetColor().Mul(light.GetMaterial().GetColor())).Mul(diff));
                            }
                        }
                        // determine specular component
                        if (prim.GetMaterial().GetSpecular() > 0) {
                            //@param {vector3}
                            var V = a_Ray.GetDirection();
                            var R = L.Sub((DOT(L, N).Mul(N)).Mul(2.0));
                            var H = L.Add(V);
                            NORMALIZE(H);
                            //float dot = DOT( V, R );
                            //@param {float}
                            var dot = DOT(N, H);
                            if (dot > 0) {
                                //@param {float}
                                var spec = powf(dot, 1) * prim.GetMaterial().GetSpecular() * shade;
                                // add specular component to ray color
                                a_Acc = a_Acc.Add(spec.Mul(light.GetMaterial().GetColor()));
                            }
                        }
                        console.log("R: " + a_Acc.x + "G: " + a_Acc.y + "B: " + a_Acc.z);
                    }
                }
            }
        }
        // calculate reflection
        //@param {float}
        var refl = prim.GetMaterial().GetReflection();
        if ((refl > 0.0) && (a_Depth < TRACEDEPTH))//
        {
            //@param {vector3}
            var N = prim.GetNormal(pi);
            var R = a_Ray.GetDirection().Sub((DOT(a_Ray.GetDirection(), N).Mul(N)).Mul(2.0));
            var rcol = new vector3(0, 0, 0);
            //@param {float}
            var dist;
            Raytrace(Ray(pi.Add(R.Mul(EPSILON)), R), a_Depth + 1, a_RIndex);
            a_Acc = a_Acc.Add(refl.Mul(rcol.Mul(prim.GetMaterial().GetColor())));
        }
        // calculate refraction
        //@param {float}
        var refr = prim.GetMaterial().GetRefraction();
        if ((refr > 0) && (a_Depth < TRACEDEPTH)) {
            //@param {float}
            var rindex = prim.GetMaterial().GetRefrIndex();
            var n = a_RIndex / rindex;
            //@param {vector3}
            var N = prim.GetNormal(pi).Mul(result);
            //@param {float}
            var cosI = -DOT(N, a_Ray.GetDirection());
            var cosT2 = 1.0 - n * n * (1.0 - cosI * cosI);
            if (cosT2 > 0.0) {
                //@param {vector3}
                var T = (a_Ray.GetDirection().Mul(n)).Add(N.Mul((n * cosI - sqrtf(cosT2))));
                var rcol = new vector3(0, 0, 0);
                Raytrace(Ray(pi.Add(T.Mul(EPSILON)), T), a_Depth + 1, rindex);
                // apply Beer's law
                //Color absorbance = prim->GetMaterial()->GetColor() * 0.15f * -dist;
                //Color transparency = Color( expf( absorbance.r ), expf( absorbance.g ), expf( absorbance.b ) );
                //a_Acc = a_Acc.Add(rcol.Mul(transparency));
                a_Acc = a_Acc.Add(refr.Mul(rcol.Mul(prim.GetMaterial().GetColor())));
            }
        }
        //console.log("Color in Raytrace "+a_Acc.toString());
        ret[0] = prim;
        ret[1] = a_Acc;
        ret[2] = a_Dist;
        return ret;
    }

    this.InitRender = function () {
        this.m_CurrLine = 20;
        this.m_PPos = this.m_CurrLine * this.m_Width;
        this.m_WX1 = -4, this.m_WX2 = 4, this.m_WY1 = this.m_SY = 3, this.m_WY2 = -3;
        this.m_DX = (this.m_WX2 - this.m_WX1) / this.m_Width;
        this.m_DY = (this.m_WY2 - this.m_WY1) / this.m_Height;
        this.m_SY += this.m_CurrLine * this.m_DY;
        this.m_LastRow = new Primitive * [this.m_Width];
        for (var i = 0; i < this.m_Width * 4; i++)
            this.m_LastRow[i] = 0;
    }

    this.Render = function (imageData) {
        //@param {vector3}
        var o = new vector3(0, 0, -5);
        //@param {int}
        var date = new Date();
        var msecs = date.getTime(); //new GetTickCount();
        //@param {Primitive}
        var lastprim = 0;
        // render remaining lines
        for (var y = this.m_CurrLine; y < (this.m_Height - 20); y++) {
            //console.log("currLine="+this.m_CurrLine+" y="+y+" Height="+this.m_Height);
            this.m_SX = this.m_WX1;
            // render pixels for current line
            for (var x = 0; x < this.m_Width; x++) {
                //@param {vector3}
                var acc = new vector3(0, 0, 0);
                //@param {vector3}
                var dir = new vector3(this.m_SX, this.m_SY, 0).Sub(o);
                var nDir = NORMALIZE(dir);
                //@param {Ray}
                var r = new Ray(o, nDir);
                //@param {float}
                var dist;
                //@param {Primitive}
                var ret = this.Raytrace(r, 1, 1.0);
                prim = ret[0];
                if (prim != 0) {
                    acc = ret[1];
                    //console.log("Ray acc"+ acc.toString());
                    dist = ret[2];
                }
                //@param {int}
                var red;
                var green;
                var blue;

                if (prim != lastprim) {
                    lastprim = prim;
                    //@param {vector3}
                    var acc = new vector3(0, 0, 0);
                    for (var tx = -1; tx < 2; tx++) for (var ty = -1; ty < 2; ty++) {
                        //@param {vector3}
                        var dir = new vector3(this.m_SX + this.m_DX * tx / 2.0, this.m_SY + this.m_DY * ty / 2.0, 0).Sub(o);
                        var n_Dir = NORMALIZE(dir);
                        //@param {Ray}
                        var r = new Ray(o, n_Dir);
                        //@param {float}
                        var dist;
                        //@param {Primitive}
                        var prim = this.Raytrace(r, 1, 1.0);
                    }
                    red = acc.x * (256 / 9);
                    green = acc.y * (256 / 9);
                    blue = acc.z * (256 / 9);
                }
                else {
                    red = acc.x * 256;
                    green = acc.y * 256;
                    blue = acc.z * 256;
                }

                if (red > 255) red = 255;
                if (green > 255) green = 255;
                if (blue > 255) blue = 255;

                var cc = new Color(red, green, blue);
                //console.log("X:"+x+" y:"+y+" col"+cc.toString);
                setPixel(imageData, x, y, cc);
                this.m_SX += this.m_DX;
            }
            this.m_SY += this.m_DY;
	    date = new Date();
	    if ((date.getTime() - msecs) > 100) 
	    {
		    // return control to windows so the screen gets updated
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

//#############################################################################
// @param {image} imageData
// @param {int} x,y
// @return {Color} col
function setPixel(imageData, x, y, col) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = col.r;
    imageData.data[index + 1] = col.g;
    imageData.data[index + 2] = col.b;
    imageData.data[index + 3] = col.a;
}

