function OpenGLRenderer (canvas) {
    var gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"))
    gl.enable(gl.DEPTH_TEST)
    this.gl = gl
    this.projection = null
    this.parameters = new Parameters()
    this.camera = null
    this.shader = null
}

OpenGLRenderer.prototype.getContext = function () {
    return this.gl
}

function Parameters() {
    this.globalRotation = null
    this.lightPos = null
    this.color = null
}