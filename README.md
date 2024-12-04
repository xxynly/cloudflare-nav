# Navigation Site / 导航站点

A modern, responsive navigation site built with Cloudflare Workers and D1 database, featuring an elegant design and a powerful admin dashboard for efficient management.  
一个基于 Cloudflare Workers 和 D1 数据库构建的现代化响应式导航站点，具有优雅的设计和强大的后台管理功能，旨在提供高效的管理体验。

# 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>
![首页](https://github.com/user-attachments/assets/c0e93ec4-8498-470e-a23e-9cdd16a2724c)

![折叠](https://github.com/user-attachments/assets/cced7557-aa44-441e-84b4-657676260471)

![后台1](https://github.com/user-attachments/assets/5ae99ec7-b9cb-41c2-b1e5-71942f312108)

![后台2](https://github.com/user-attachments/assets/acadef89-8c04-4f63-ad19-969104a98db9)

![后台3](https://github.com/user-attachments/assets/64446924-8539-4585-9e8f-e15d97dd9c1b)





</details>



[English](#english) | [中文](#中文)

## English

### Features

🚀 Core Features
- Dynamic link management with categories
- Most visited links showcase (top 4)
- Visit count tracking for each link
- Real-time search functionality
- Responsive design for all devices
- Modern and clean UI
- Keyboard shortcuts support

⚡ Technical Highlights
- Backend: Cloudflare Workers
- Database: SQLite (D1)
- Frontend: Vue.js 3 + Tailwind CSS
- Authentication: JWT
- Zero cold starts
- Global CDN deployment

🎯 User Experience
- Fast and responsive interface
- Intuitive category management
- Quick search with keyboard shortcuts (/ to focus, ESC to clear)
- Smooth animations
- Visit statistics display
- Domain tags for better visibility

### Deployment

#### Prerequisites
- Node.js 16+
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

#### Local Development
1. Clone the repository
```bash
git clone [repository-url]
cd nav
```

2. Install dependencies
```bash
npm install
```

3. Create local D1 database
```bash
wrangler d1 create nav-db
wrangler d1 execute nav-db --local --file=./schema.sql
```

4. Start development server
```bash
npm run dev
```

#### Production Deployment

1. Create D1 database in Cloudflare
```bash
wrangler d1 create nav-db
```

2. Update wrangler.toml with your database ID
```toml
[[d1_databases]]
binding = "DB"
database_name = "nav-db"
database_id = "your-database-id"
```

3. Deploy schema and initial data
```bash
wrangler d1 execute nav-db --file=./schema.sql
wrangler d1 execute nav-db --file=./migrations/0001_seed_data.sql
```

4. Deploy to Cloudflare Workers
```bash
wrangler deploy
```

### 快速部署指南

如果你只想部署到生产环境，而不需要本地开发，可以按照以下步骤操作：

1. 安装必要工具
```bash
npm install -g wrangler
```

2. 登录到 Cloudflare
```bash
wrangler login
```

3. 克隆项目
```bash
git clone [仓库地址]
cd nav
```

4. 创建数据库
```bash
# 创建 D1 数据库
wrangler d1 create nav-db

# 你会看到类似下面的输出：
# ✓ Successfully created DB 'nav-db' in region APAC
# Created database 'nav-db' at id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

5. 配置 wrangler.toml
```toml
# 将上一步得到的数据库ID复制到 wrangler.toml 中
[[d1_databases]]
binding = "DB"
database_name = "nav-db"
database_id = "你的数据库ID"  # ← 替换这里
```

6. 部署数据库架构和初始数据
```bash
# 部署数据库架构
wrangler d1 execute nav-db --file=./schema.sql

# 部署初始数据（包含示例链接和默认管理员账号）
wrangler d1 execute nav-db --file=./migrations/0001_seed_data.sql
```

7. 部署应用
```bash
wrangler deploy
```

8. 访问你的网站
- 网站地址将是：`https://nav.[你的workers子域名].workers.dev`
- 管理后台：`https://nav.[你的workers子域名].workers.dev/admin`
  - 默认用户名：`admin`
  - 默认密码：`admin123`

⚠️ 重要提示：
- 首次登录后请立即修改默认密码
- 如果你想使用自己的域名，可以在 Cloudflare 的 Workers & Pages 中配置自定义域名
- 确保你的 Cloudflare 账号已经验证了邮箱地址

### 自定义配置

#### 修改示例数据
如果你想修改初始的导航链接，可以编辑 `migrations/0001_seed_data.sql` 文件，然后重新执行：
```bash
wrangler d1 execute nav-db --file=./migrations/0001_seed_data.sql
```

#### 更换网站标题
1. 访问管理后台 `/admin`
2. 登录后在顶部可以修改网站标题

#### 自定义域名
1. 在 Cloudflare 的 DNS 设置中添加你的域名
2. 在 Workers & Pages 中为你的 Worker 绑定自定义域名
3. 等待 DNS 生效（通常很快）

### 常见问题

1. 数据库操作失败
```bash
# 如果需要重置数据库，可以执行：
wrangler d1 execute nav-db --command "DROP TABLE IF EXISTS links, categories, admins, configs;"
# 然后重新执行 schema.sql 和 seed_data.sql
```

2. 部署失败
- 确认 wrangler 已登录：`wrangler whoami`
- 确认 wrangler.toml 配置正确
- 检查是否有语法错误：`wrangler deploy --dry-run`

3. 无法访问管理后台
- 确认网址是否正确（末尾要加 /admin）
- 清除浏览器缓存和 Cookie
- 确认用户名和密码正确

### 技术支持

如果遇到问题：
1. 查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
2. 在 [GitHub Issues](https://github.com/your-repo/nav/issues) 提问
3. 访问 [Cloudflare 社区](https://community.cloudflare.com)

### Configuration

#### Admin Setup
1. Access `/admin` route
2. Default credentials:
   - Username: admin
   - Password: admin123
3. Change password immediately after first login

#### Site Settings
- Site title can be configured in admin panel
- Categories can be managed through admin interface
- Links can be added, edited, or removed in admin panel

---

## 中文

### 功能特点

🚀 核心功能
- 动态链接管理与分类
- 最常访问链接展示（前4个）
- 链接访问次数统计
- 实时搜索功能
- 全设备响应式设计
- 现代简洁的界面
- 键盘快捷键支持

⚡ 技术亮点
- 后端：Cloudflare Workers
- 数据库：SQLite (D1)
- 前端：Vue.js 3 + Tailwind CSS
- 认证：JWT
- 零冷启动
- 全球CDN部署

🎯 用户体验
- 快速响应的界面
- 直观的分类管理
- 快捷键搜索（/ 聚焦，ESC 清空）
- 平滑动画效果
- 访问统计显示
- 域名标签展示

### 部署说明

#### 前置要求
- Node.js 16+
- Cloudflare 账号
- Wrangler CLI（`npm install -g wrangler`）

#### 本地开发
1. 克隆仓库
```bash
git clone [仓库地址]
cd nav
```

2. 安装依赖
```bash
npm install
```

3. 创建本地D1数据库
```bash
wrangler d1 create nav-db
wrangler d1 execute nav-db --local --file=./schema.sql
```

4. 启动开发服务器
```bash
npm run dev
```

#### 生产环境部署

1. 在Cloudflare创建D1数据库
```bash
wrangler d1 create nav-db
```

2. 更新wrangler.toml中的数据库ID
```toml
[[d1_databases]]
binding = "DB"
database_name = "nav-db"
database_id = "你的数据库ID"
```

3. 部署数据库架构和初始数据
```bash
wrangler d1 execute nav-db --file=./schema.sql
wrangler d1 execute nav-db --file=./migrations/0001_seed_data.sql
```

4. 部署到Cloudflare Workers
```bash
wrangler deploy
```

### 配置说明

#### 管理员设置
1. 访问 `/admin` 路由
2. 默认凭据：
   - 用户名：admin
   - 密码：admin123
3. 首次登录后请立即修改密码

#### 站点设置
- 可在管理面板配置站点标题
- 可通过管理界面管理分类
- 可在管理面板添加、编辑或删除链接

### 开发说明

#### 目录结构
```
nav/
├── src/
│   ├── index.js      # 主应用入口
├── migrations/        # 数据库迁移
├── schema.sql        # 数据库架构
└── wrangler.toml     # Cloudflare配置
```

#### 技术栈
- **后端**：Cloudflare Workers
- **数据库**：D1 (SQLite)
- **前端**：
  - Vue.js 3
  - Tailwind CSS
  - 原生JavaScript
- **部署**：Cloudflare Workers
