'use client'

import { useEffect, useRef } from 'react'
import styles from './AmbientBackground.module.css'

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 粒子配置
    const particles: {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      color: string
    }[] = []

    const colors = [
      'rgba(200, 148, 58, 0.6)',   // 琥珀金
      'rgba(232, 185, 106, 0.5)',  // 浅琥珀
      'rgba(74, 144, 217, 0.4)',   // 锤蓝色
    ]

    // 初始化粒子
    const initParticles = () => {
      const particleCount = Math.min(50, Math.floor(window.innerWidth / 30))
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }
    initParticles()

    // 动画循环
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        // 更新位置
        p.x += p.vx
        p.y += p.vy

        // 边界检测
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // 绘制粒子
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1

        // 绘制光晕
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.globalAlpha = p.alpha * 0.3
        ctx.fill()
        ctx.globalAlpha = 1
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <div className={styles.gradientOverlay} />
    </>
  )
}
