function RenderObject(shader, vertexInit, renderCallback) {
    this.data = []
    this.shader = shader
    this.renderCallback = renderCallback
    this.vertexCount = 0

    this.startVBO = -1;
    this.endVBO = -1;

    vertexInit(this)
}

RenderObject.prototype.addVertex = function (pos, normal) {
    this.data.push(pos[0])
    this.data.push(pos[1])
    this.data.push(pos[2])

    this.data.push(normal[0])
    this.data.push(normal[1])
    this.data.push(normal[2])

    this.vertexCount++
}

RenderObject.prototype.addToVBO = function (vboData, currentVertices) {
    this.startVBO = currentVertices
    this.endVBO = this.vertexCount

    vboData.extend(this.data)
    this.data = []

    return this.vertexCount
}

RenderObject.prototype.render = function (gl, time) {
    this.shader.use()

    this.renderCallback(this.shader, time)
    
    gl.drawArrays(gl.TRIANGLES, this.startVBO, this.endVBO)
}

// Utility for array
Array.prototype.extend = function (other_array) {
    other_array.forEach(function(v) {this.push(v)}, this);
}
