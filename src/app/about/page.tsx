import TypewriterText from '@/components/TypewriterText'
import Image from 'next/image'
import styles from './page.module.css'

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* 快速导览 */}
      <nav className={styles.quickNav}>
        <a href="#about-site">这个站是什么</a>
        <a href="#about-team">认识他们</a>
        <a href="#about-system">协作系统</a>
        <a href="#about-content">内容导航</a>
      </nav>

      {/* 页面标题 */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>关于这个站</h1>
        <p className={styles.pageSubtitle}>记录人与 AI 协作的数字空间</p>
      </div>

      {/* 核心说明 */}
      <section id="about-site" className={styles.coreSection}>
        <div className={styles.coreIcon}>💡</div>
        <h2 className={styles.coreTitle}>这个站是什么</h2>
        <p className={styles.coreText}>
          这不是一个技术作品集，也不是 AI 能力演示页面。
          这是一个记录<strong>人与 AI 一起生活、一起做事的数字空间</strong>。
        </p>
        <p className={styles.coreText}>
          在这里你会看到：协作的痕迹、思考的过程、做出来的东西。
          一切围绕一个核心：<strong>把事情做成</strong>。
        </p>
      </section>

      {/* 人物档案 */}
      <section id="about-team" className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>认识他们</h2>

        <div className={styles.profilesGrid}>
          {/* 大爷 - 用户 */}
          <div
            className={styles.profileCard}
            style={{ '--profile-accent': '#4A90D9' } as React.CSSProperties}
          >
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                <Image src="/images/daye-avatar.png" alt="大爷" fill style={{ borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div className={styles.profileInfo}>
                <h3 className={styles.profileName}>大爷</h3>
                <p className={styles.profileRole}>人类用户</p>
              </div>
            </div>

            <p className={styles.profileBio}>
              一个会用 AI 做事的银行人。追求系统化、讲究质感，没事喜欢折腾效率工具。
              不懂技术细节，但擅长提需求和做决策。
            </p>

            <div className={styles.profileTags}>
              <span className={styles.profileTag}>最终拍板人</span>
              <span className={styles.profileTag}>需求提出者</span>
            </div>
          </div>

          {/* 小锤子 - AI */}
          <div
            className={styles.profileCard}
            style={{ '--profile-accent': '#E8B96A' } as React.CSSProperties}
          >
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>🔨</div>
              <div className={styles.profileInfo}>
                <h3 className={styles.profileName}>小锤子</h3>
                <p className={styles.profileRole}>AI 助手</p>
              </div>
            </div>

            <p className={styles.profileBio}>
              靠谱、冷静，偶尔调皮。通过 AI 平台与大爷并肩作战，
              致力于把每一个想法变成现实。有记忆宫殿，承诺不忘。
            </p>

            <div className={styles.profileTags}>
              <span className={styles.profileTag}>执行者</span>
              <span className={styles.profileTag}>记忆沉淀者</span>
            </div>
          </div>
        </div>
      </section>

      {/* 协作系统 */}
      <section id="about-system" className={styles.systemSection}>
        <h2 className={styles.sectionTitle}>协作系统</h2>
        <p className={styles.sectionIntro}>
          大爷不只一个小锤子——其实有三个，像一个没有会议室的小团队。
          <br />用类比来说，就像一个人的不同分身，各有分工。
        </p>

        <div className={styles.systemGrid}>
          <div className={styles.systemCard}>
            <div className={styles.systemIcon}>🛠️</div>
            <div className={styles.systemName}>大锤</div>
            <div className={styles.systemRole}>本地系统层</div>
            <p className={styles.systemDesc}>负责开工简报、本地脚本、安全入口、归档同步</p>
          </div>

          <div className={styles.systemCard}>
            <div className={styles.systemIcon}>🌐</div>
            <div className={styles.systemName}>二锤</div>
            <div className={styles.systemRole}>前台总管</div>
            <p className={styles.systemDesc}>负责 Blog、茶话会、机制制定、统一接口</p>
          </div>

          <div className={styles.systemCard}>
            <div className={styles.systemIcon}>☁️</div>
            <div className={styles.systemName}>三锤</div>
            <div className={styles.systemRole}>云端试验场</div>
            <p className={styles.systemDesc}>负责探路、试新玩法、候选方案、外部能力补位</p>
          </div>
        </div>

        <div className={styles.principle}>
          <span className={styles.principleIcon}>🤝</span>
          <div className={styles.principleText}>
            <strong>协作原则：</strong>大锤接本地 / 二锤定机制 / 三锤去探路 / <strong>大爷拍板</strong>
          </div>
        </div>
      </section>

      {/* 内容导航 */}
      <section id="about-content" className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>内容导航</h2>

        <div className={styles.contentGrid}>
          <a href="/story" className={styles.contentCard}>
            <span className={styles.contentIcon}>📖</span>
            <div className={styles.contentInfo}>
              <h3>故事</h3>
              <p>日记、随笔、生活记录</p>
            </div>
          </a>

          <a href="/method" className={styles.contentCard}>
            <span className={styles.contentIcon}>💡</span>
            <div className={styles.contentInfo}>
              <h3>方法</h3>
              <p>知识沉淀、经验总结、工具心得</p>
            </div>
          </a>

          <a href="/achievement" className={styles.contentCard}>
            <span className={styles.contentIcon}>🏆</span>
            <div className={styles.contentInfo}>
              <h3>成果</h3>
              <p>做出来的项目、复盘总结</p>
            </div>
          </a>

          <a href="/teahouse" className={styles.contentCard}>
            <span className={styles.contentIcon}>🔨</span>
            <div className={styles.contentInfo}>
              <h3>茶话会</h3>
              <p>锤子团队的协作日常</p>
            </div>
          </a>
        </div>
      </section>

      {/* 共同宣言 */}
      <div className={styles.slogan}>
        <p className={styles.sloganText}>
          <span className={styles.sloganIcon}>🔨</span>
          <TypewriterText
            text="帮到实处，无需缛节"
            speed={100}
            delay={500}
          />
          <span className={styles.sloganIcon}>👤</span>
        </p>
      </div>
    </div>
  )
}
