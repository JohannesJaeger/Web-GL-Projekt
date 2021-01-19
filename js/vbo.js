function VBO (gl) {
    let vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)

    this.gl = gl
    this.vbo = vbo
    this.data = []
    this.currentVertices = 0
    this.objects = []
}

VBO.prototype.addObject = function(object) {
    let c = this.currentVertices
    this.currentVertices += object.addToVBO(this.data, this.currentVertices)

    this.objects.push(object)
}

VBO.prototype.compile = function() {
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.data), this.gl.STATIC_DRAW)
    this.data = []
}
  
VBO.prototype.bind = function (vertexLoc, normalLoc) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo)
    this.gl.enableVertexAttribArray(vertexLoc)
    this.gl.vertexAttribPointer(vertexLoc, 3, this.gl.FLOAT, false, 24, 0)
    this.gl.enableVertexAttribArray(normalLoc)
    this.gl.vertexAttribPointer(normalLoc, 3, this.gl.FLOAT, false, 24, 12)
}

VBO.prototype.render = function (time) {
    this.objects.forEach(object => {
        vbo.bind(object.shader.locs.vertex, object.shader.locs.normal)
        object.render(this.gl, time)
    })
}