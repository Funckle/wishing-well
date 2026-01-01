'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ConfettiProps {
  isActive: boolean
  duration?: number
}

const CONFETTI_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#95E1D3', // Mint
  '#F38181', // Salmon
  '#AA96DA', // Lavender
  '#FCBAD3', // Pink
  '#A8D8EA', // Sky blue
]

const CONFETTI_SHAPES = ['square', 'circle', 'triangle'] as const

interface ConfettiPiece {
  id: number
  x: number
  color: string
  shape: typeof CONFETTI_SHAPES[number]
  delay: number
  rotation: number
  size: number
}

export function Confetti({ isActive, duration = 3000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 8,
      }))
      setPieces(newPieces)
      setShow(true)

      const timer = setTimeout(() => {
        setShow(false)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isActive, duration])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: -20,
          }}
          initial={{ y: 0, opacity: 1, rotate: piece.rotation }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [1, 1, 0],
            rotate: piece.rotation + 720,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: piece.delay,
            ease: 'easeOut',
          }}
        >
          {piece.shape === 'square' && (
            <div
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: 2,
              }}
            />
          )}
          {piece.shape === 'circle' && (
            <div
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: '50%',
              }}
            />
          )}
          {piece.shape === 'triangle' && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${piece.size / 2}px solid transparent`,
                borderRight: `${piece.size / 2}px solid transparent`,
                borderBottom: `${piece.size}px solid ${piece.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
