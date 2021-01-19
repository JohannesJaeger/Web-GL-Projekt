
var canvas = document.querySelector("#renderer");
var width = canvas.width;
var height = canvas.height;
var renderer = new OpenGLRenderer(canvas)
var gl = renderer.getContext();

var vbo = new VBO(gl)

var shaders = new Map()

function init() {
    setup()
    document.addEventListener("keydown", keyDown, false);
}

function keyDown(event) {
    let key = event.key
    if(key == "w") {
        renderer.camera.moveForward(0.02)
    } else if(key == "s") {
        renderer.camera.moveForward(-0.02)
    } else if(key == "a") {
        renderer.camera.moveRight(0.02)
    } else if(key == "d") {
        renderer.camera.moveRight(-0.02)
    }
}

function controls() {
    let globalRotationX = document.querySelector("#global-rotation-x")
    let globalRotationY = document.querySelector("#global-rotation-y")
    let globalRotationZ = document.querySelector("#global-rotation-z")

    globalRotationX.oninput = function() {
        quat.fromEuler(renderer.parameters.globalRotation, this.value, globalRotationY.value, globalRotationZ.value)
    }

    globalRotationY.oninput = function() {
        quat.fromEuler(renderer.parameters.globalRotation, globalRotationX.value, this.value, globalRotationZ.value)
    }

    globalRotationZ.oninput = function() {
        quat.fromEuler(renderer.parameters.globalRotation, globalRotationX.value, globalRotationY.value, this.value)
    }

    document.querySelector("#light-position-x").oninput = function() {
        let lightPos = renderer.parameters.lightPos
        renderer.parameters.lightPos = vec3.fromValues(this.value, lightPos[1], lightPos[2])
    }

    document.querySelector("#light-position-y").oninput = function() {
        let lightPos = renderer.parameters.lightPos
        renderer.parameters.lightPos = vec3.fromValues(lightPos[0], this.value, lightPos[2])
    }

    document.querySelector("#light-position-z").oninput = function() {
        let lightPos = renderer.parameters.lightPos
        renderer.parameters.lightPos = vec3.fromValues(lightPos[0], lightPos[1], this.value)
    }

    document.querySelector("#color-r").oninput = function() {
        let color = renderer.parameters.color
        renderer.parameters.color = vec4.fromValues(this.value, color[1], color[2], color[3])
    }

    document.querySelector("#color-g").oninput = function() {
        let color = renderer.parameters.color
        renderer.parameters.color = vec4.fromValues(color[0], this.value, color[2], color[3])
    }

    document.querySelector("#color-b").oninput = function() {
        let color = renderer.parameters.color
        renderer.parameters.color = vec4.fromValues(color[0], color[1], this.value, color[3])
    }

    document.querySelector("#color-a").oninput = function() {
        let color = renderer.parameters.color
        renderer.parameters.color = vec4.fromValues(color[0], color[1], color[2], this.value)
    }
}

async function setup() {   
    gl.clearColor(0.4, 0.4, 0.4, 1)

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    renderer.projection = mat4.perspective(mat4.create(), Math.PI / 5, width / height, 0.1, 200)

    renderer.parameters.globalRotation = quat.create()
    renderer.parameters.lightPos = vec4.fromValues(0, 0, 5, 0)
    renderer.parameters.color = vec4.create()

    renderer.camera = new Camera()
    renderer.camera.setTarget(vec3.fromValues(0, 0, 0))
    renderer.camera.moveTo(vec3.fromValues(0, 5, 100))

    await loadShaders()
    await addObjects()

    vbo.compile()
    
    controls()
    render(0)
}

async function loadShaders() {
    await ShaderProgram.load(gl, "./shader/verts_and_normals.vsh", "./shader/toon.fsh").then(function(shader) {
        shaders.set("toon", shader)
    })

    await ShaderProgram.load(gl, "./shader/verts_and_normals_sphere.vsh", "./shader/toon.fsh").then(function(shader) {
        shaders.set("toon-sphere", shader)
    })

    await ShaderProgram.load(gl, "./shader/phong.vsh", "./shader/phong_shading.fsh").then(function(shader) {
        shaders.set("phong", shader)
    })

    await ShaderProgram.load(gl, "./shader/phong-sphere.vsh", "./shader/phong_shading.fsh").then(function(shader) {
        shaders.set("phong-sphere", shader)
    })
}

function render(time) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    if(time == 0) {
        renderer.camera.moveTo(vec3.fromValues(0, 2, -10))
    }

    vbo.render(time)

    updateFps(time)

    requestAnimationFrame(render)
}

function defaultModelViewProjection(shader, transformModel) {
    let model = mat4.fromQuat(mat4.create(), renderer.parameters.globalRotation)

    if(transformModel != null) {
        transformModel(model)
    }

    let view = renderer.camera.getViewMatrix()
    let normal = mat4.multiply(mat4.create(), view, model)
    mat4.invert(normal, normal)
    mat4.transpose(normal, normal)

    let modelViewProjection = mat4.multiply(mat4.create(), renderer.projection, view)
    mat4.multiply(modelViewProjection, modelViewProjection, model)

    let modelView = mat4.multiply(mat4.create(), view, model)

    let lightPos = renderer.parameters.lightPos

    gl.uniformMatrix4fv(shader.locs.modelViewProjection, false, modelViewProjection)
    gl.uniformMatrix4fv(shader.locs.modelView, false, modelView)
    gl.uniformMatrix3fv(shader.locs.normalMatrix, false, mat3.fromMat4(mat3.create(), normal))

    gl.uniform3fv(shader.locs.lightPos, new Float32Array(vec3.fromValues(lightPos[0], lightPos[1], lightPos[2])))
    gl.uniform4fv(shader.locs.color, renderer.parameters.color)
}

function phongUniforms(shader, parameter) {
    let gl = shader.gl
    let locs = shader.locs

    gl.uniform4fv(locs.lightAmbient, parameter.lightAmbient)
    gl.uniform4fv(locs.lightDiffuse, parameter.lightDiffuse)
    gl.uniform4fv(locs.lightSpecular, parameter.lightSpecular)

    gl.uniform4fv(locs.matEmissive, parameter.matEmissive)
    gl.uniform4fv(locs.matAmbient, parameter.matAmbient)
    gl.uniform4fv(locs.matDiffuse, parameter.matDiffuse)
    gl.uniform4fv(locs.matSpecular, parameter.matSpecular)
    gl.uniform1fv(locs.matShininess, parameter.matShininess)
}