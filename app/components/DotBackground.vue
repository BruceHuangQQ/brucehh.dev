<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const mouse = { x: -1000, y: -1000 }

let frameId: number | null = null
let dots: Array<{ x: number, y: number }> = []
let ctx: CanvasRenderingContext2D | null = null
let cssWidth = 0
let cssHeight = 0

const GRID_SIZE = 15
const DOT_SIZE = 1
const CURSOR_RADIUS = 100

function buildDots() {
  dots = []
  const rows = Math.ceil(cssHeight / GRID_SIZE)
  const cols = Math.ceil(cssWidth / GRID_SIZE)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dots.push({ x: j * GRID_SIZE, y: i * GRID_SIZE })
    }
  }
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas || !ctx)
    return

  const ratio = window.devicePixelRatio || 1
  cssWidth = window.innerWidth
  cssHeight = window.innerHeight

  canvas.width = Math.floor(cssWidth * ratio)
  canvas.height = Math.floor(cssHeight * ratio)
  canvas.style.width = `${cssWidth}px`
  canvas.style.height = `${cssHeight}px`

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  buildDots()
}

function animate() {
  if (!ctx)
    return

  ctx.clearRect(0, 0, cssWidth, cssHeight)

  for (const dot of dots) {
    const dx = dot.x - mouse.x
    const dy = dot.y - mouse.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    let opacity = 0.2
    if (distance < CURSOR_RADIUS)
      opacity = 0.2 + (1 - distance / CURSOR_RADIUS) * 0.9

    ctx.beginPath()
    ctx.arc(dot.x, dot.y, DOT_SIZE, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(120, 120, 120, ${opacity})`
    ctx.fill()
  }

  frameId = window.requestAnimationFrame(animate)
}

function handleMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas)
    return

  const rect = canvas.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

function handleMouseLeave() {
  mouse.x = -1000
  mouse.y = -1000
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas)
    return

  ctx = canvas.getContext('2d')
  if (!ctx)
    return

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
  animate()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
  if (frameId !== null)
    window.cancelAnimationFrame(frameId)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none fixed inset-0 -z-10"
  />
</template>
