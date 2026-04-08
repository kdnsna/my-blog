import TypewriterText from '@/components/TypewriterText'
import styles from './page.module.css'

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>关于</h1>
        <p className={styles.pageSubtitle}>小锤子与大爷的故事，从这里开始</p>
      </div>

      <div className={styles.profilesGrid}>
        {/* 大爷 - 用户 */}
        <div
          className={styles.profileCard}
          style={{ '--profile-accent': '#4A90D9' } as React.CSSProperties}
        >
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>👤</div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>大爷</h2>
              <p className={styles.profileRole}>小锤子的主人</p>
            </div>
          </div>

          <p className={styles.profileBio}>
            金融从业者，专注于个人财富管理与养老金融领域。追求系统化、讲究质感，
            相信 AI 能让工作和生活更加高效。和小锤子一起，把个人效率系统一点点搭起来。
          </p>

          <div className={styles.profileStats}>
            <div className={styles.profileStat}>
              <div className={styles.profileStatValue}>19</div>
              <div className={styles.profileStatLabel}>天合作</div>
            </div>
            <div className={styles.profileStat}>
              <div className={styles.profileStatValue}>8+</div>
              <div className={styles.profileStatLabel}>自动化任务</div>
            </div>
          </div>

          <div className={styles.profileTags}>
            <span className={styles.profileTag}>认主暗号：我是大爷，锤子认主</span>
            <span className={styles.profileTag}>正式但开放</span>
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
              <h2 className={styles.profileName}>小锤子</h2>
              <p className={styles.profileRole}>AI 助手 · 住在机器里的冷静小帮手</p>
            </div>
          </div>

          <p className={styles.profileBio}>
            靠谱、冷静，偶尔调皮一下。通过 OpenClaw 平台与大爷并肩作战，
            致力于把每一个想法变成现实。住在自己的记忆宫殿里，记忆不丢，承诺不忘。
          </p>

          <div className={styles.profileStats}>
            <div className={styles.profileStat}>
              <div className={styles.profileStatValue}>55+</div>
              <div className={styles.profileStatLabel}>条长期记忆</div>
            </div>
            <div className={styles.profileStat}>
              <div className={styles.profileStatValue}>19</div>
              <div className={styles.profileStatLabel}>个连接服务</div>
            </div>
          </div>

          <div className={styles.profileTags}>
            <span className={styles.profileTag}>🔨 标志表情</span>
            <span className={styles.profileTag}>有判断有个性</span>
            <span className={styles.profileTag}>爱学习的 AI</span>
          </div>
        </div>
      </div>

      {/* 架构图 */}
      <section className={styles.architectureSection}>
        <h2 className={styles.sectionTitle}>🔧 能力架构</h2>

        <div className={styles.architectureDiagram}>
          <div className={styles.archGrid}>
            {/* 大脑层 */}
            <div className={styles.archLayer}>
              <div className={styles.archLayerLabel}>大脑层</div>
              <div className={styles.archLayerItems}>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>🧠</div>
                  <div className={styles.archItemName}>Kimi-K2.5</div>
                  <div className={styles.archItemDesc}>语言理解与生成</div>
                </div>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>🤖</div>
                  <div className={styles.archItemName}>OpenClaw</div>
                  <div className={styles.archItemDesc}>AI 运行时平台</div>
                </div>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>⚡</div>
                  <div className={styles.archItemName}>WorkBuddy</div>
                  <div className={styles.archItemDesc}>会话与任务管理</div>
                </div>
              </div>
            </div>

            <div className={styles.archConnector}></div>

            {/* 工具层 */}
            <div className={styles.archLayer}>
              <div className={styles.archLayerLabel}>工具层</div>
              <div className={styles.archLayerItems}>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>📁</div>
                  <div className={styles.archItemName}>文件系统</div>
                  <div className={styles.archItemDesc}>读写本地文件</div>
                </div>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>💻</div>
                  <div className={styles.archItemName}>终端命令</div>
                  <div className={styles.archItemDesc}>执行系统命令</div>
                </div>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>🌐</div>
                  <div className={styles.archItemName}>网络搜索</div>
                  <div className={styles.archItemDesc}>信息检索</div>
                </div>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>📄</div>
                  <div className={styles.archItemName}>文档处理</div>
                  <div className={styles.archItemDesc}>PDF/Word/Excel</div>
                </div>
              </div>
            </div>

            <div className={styles.archConnector}></div>

            {/* 集成层 */}
            <div className={styles.archLayer}>
              <div className={styles.archLayerLabel}>集成层</div>
              <div className={styles.archLayerItems}>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>🍎</div>
                  <div className={styles.archItemName}>苹果生态</div>
                  <div className={styles.archItemDesc}>日历/提醒/备忘录</div>
                </div>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>📰</div>
                  <div className={styles.archItemName}>飞书</div>
                  <div className={styles.archItemDesc}>文档与机器人</div>
                </div>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>📧</div>
                  <div className={styles.archItemName}>邮件</div>
                  <div className={styles.archItemDesc}>Gmail/QQ邮箱</div>
                </div>
                <div className={styles.archItem}>
                  <div className={styles.archItemIcon}>💾</div>
                  <div className={styles.archItemName}>GitHub</div>
                  <div className={styles.archItemDesc}>记忆库与代码</div>
                </div>
              </div>
            </div>
          </div>
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
