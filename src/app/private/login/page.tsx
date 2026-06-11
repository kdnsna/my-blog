'use client'

import { Suspense, useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.css'

function LoginFallback() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>🔒 私人空间</h1>
        <p className={styles.subtitle}>
          这部分内容仅对大爷开放。输入密码进入。
        </p>
      </div>
    </main>
  )
}

function PrivateLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/private'

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push(redirect)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || '登录失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>🔒 私人空间</h1>
        <p className={styles.subtitle}>
          这部分内容仅对大爷开放。输入密码进入。
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入访问密码"
            className={styles.input}
            autoFocus
            disabled={loading}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button
            type="submit"
            className={styles.button}
            disabled={loading || !password.trim()}
          >
            {loading ? '验证中…' : '进入'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function PrivateLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <PrivateLoginForm />
    </Suspense>
  )
}
