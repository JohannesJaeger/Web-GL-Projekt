#version 100

precision highp float;

// Structures
// =============================================================================================================
struct Matrices
{
	mat4 mvp;
	mat4 mv;
	mat3 normal;
};

struct Light
{
    vec3 lightPos;
};

// =============================================================================================================

// Variables
// =============================================================================================================
attribute vec4 vertex;
attribute vec3 normal;

uniform Matrices matrices;

uniform Light light;

varying vec3 normalVert;
varying vec3 mvPos;
varying vec3 lightDir;
varying vec3 viewDir;
// =============================================================================================================

// Methods
// =============================================================================================================
void main()
{
    gl_Position = matrices.mvp * vertex;

    normalVert = matrices.normal * normal;

    vec4 h = matrices.mv * vertex;
    vec3 mvPos = h.xyz / h.w;

    lightDir = light.lightPos - mvPos;
    viewDir = -mvPos;
}
// =============================================================================================================
