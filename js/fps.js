const fpsElement = document.querySelector("#fps")
let then = 0

function updateFps(now) {
    now *= 0.001
    const deltaTime = now - then
    then = now
    const fps = 1 / deltaTime
    fpsElement.textContent = fps.toFixed(0)
}