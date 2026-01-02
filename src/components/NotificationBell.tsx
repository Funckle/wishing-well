'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'
import type { Notification } from '@/types/database'
import { formatDistanceToNow } from 'date-fns'

export function NotificationBell() {
  const { user } = useAuth()
  const supabase = createClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  // Fetch notifications on mount
  useEffect(() => {
    if (!user) {
      setNotifications([])
      setIsLoading(false)
      return
    }

    async function fetchNotifications() {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data) {
        setNotifications(data)
      }
      setIsLoading(false)
    }

    fetchNotifications()

    // Subscribe to real-time notifications
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? payload.new as Notification : n))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    )
  }

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user) return

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'wish_received':
        return '🪙'
      case 'wish_rated':
        return '⭐'
      default:
        return '🔔'
    }
  }

  // Get link for notification
  const getNotificationLink = (notification: Notification) => {
    const data = notification.data as { well_id?: string; short_code?: string } | null
    if (data?.short_code) {
      return `/well/${data.short_code}`
    }
    if (notification.type === 'wish_rated') {
      return '/dashboard'
    }
    return null
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-stone-600 hover:text-stone-800 transition"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-semibold text-stone-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="py-8 text-center text-stone-400">
                  <div className="animate-spin w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full mx-auto" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="text-3xl mb-2">🔔</div>
                  <p className="text-stone-500 text-sm">No notifications yet</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => {
                    const link = getNotificationLink(notification)
                    const content = (
                      <div
                        className={`px-4 py-3 border-b border-stone-50 hover:bg-stone-50 transition cursor-pointer ${
                          !notification.is_read ? 'bg-rose-50/50' : ''
                        }`}
                        onClick={() => {
                          if (!notification.is_read) {
                            markAsRead(notification.id)
                          }
                          setIsOpen(false)
                        }}
                      >
                        <div className="flex gap-3">
                          <span className="text-xl flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.is_read ? 'font-medium text-stone-800' : 'text-stone-600'}`}>
                              {notification.title}
                            </p>
                            {notification.message && (
                              <p className="text-xs text-stone-500 mt-0.5 truncate">
                                {notification.message}
                              </p>
                            )}
                            <p className="text-xs text-stone-400 mt-1">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    )

                    if (link) {
                      return (
                        <Link key={notification.id} href={link}>
                          {content}
                        </Link>
                      )
                    }

                    return <div key={notification.id}>{content}</div>
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-stone-100 bg-stone-50">
                <Link
                  href="/dashboard"
                  className="text-xs text-stone-500 hover:text-stone-700 transition"
                  onClick={() => setIsOpen(false)}
                >
                  View all activity
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
