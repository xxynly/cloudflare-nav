-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- 删除现有表
DROP TABLE IF EXISTS links;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS configs;

-- 分类表
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_expanded BOOLEAN DEFAULT 1
);

-- 链接表
CREATE TABLE links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    visit_count INTEGER DEFAULT 0,
    last_visit DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 管理员表
CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 配置表
CREATE TABLE IF NOT EXISTS configs (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- 初始化网站标题
INSERT OR REPLACE INTO configs (key, value) VALUES ('site_title', '我的导航');

-- Migration number: 0001 	 2024-01-27T00:00:00.000Z
-- Description: Seed initial data

-- Insert categories
INSERT INTO categories (name) VALUES
('My Links'),
('AI Chat Tools'),
('Security Analysis Tools'),
('Tech Forums'),
('Remote Work');

-- Insert My Links
INSERT INTO links (category_id, name, url, description) VALUES
(1, 'Blog', 'https://blog.duizhang.fun', 'My personal blog with thoughts and insights'),
(1, 'Feed', 'https://f.duizhang.fun', 'Curated content feed for latest updates'),
(1, 'Note', 'https://note.duizhang.fun', 'A simple, efficient tool for jotting down and organizing your thoughts.'),
(1, 'AI', 'https://chat.duizhang.fun', 'AI-powered chat interface for assistance'),
(1, 'URL Shortener', 'https://s.duizhang.fun', 'A simple, efficient tool for shortening long URLs to create more shareable links.'),
(1, 'Todo App', 'https://todo.duizhang.fun', 'A simple and effective task management tool to keep track of your to-dos.');

-- Insert AI Chat Tools
INSERT INTO links (category_id, name, url, description) VALUES
(2, 'Poe', 'https://poe.com/', 'A platform offering access to various AI models for chat and content generation'),
(2, 'ChatGPT', 'https://chatgpt.com/', 'OpenAI''s flagship conversational AI model known for its versatility'),
(2, 'Google Gemini', 'https://gemini.google.com/app', 'Google''s advanced AI model offering multimodal capabilities'),
(2, 'Doubao', 'https://www.doubao.com/chat/?from_login=1', 'A Chinese AI chat platform for various applications');

-- Insert Security Analysis Tools
INSERT INTO links (category_id, name, url, description) VALUES
(3, 'urlscan.io', 'https://urlscan.io', 'Online tool for scanning and analyzing URLs and websites'),
(3, 'Triage', 'https://tria.ge/submit', 'Online platform for automated malware analysis'),
(3, 'ANY.RUN', 'https://any.run', 'Interactive online sandbox for malware analysis and security testing'),
(3, 'CheckPhish', 'https://checkphish.bolster.ai/', 'AI-powered phishing detection and URL analysis tool');

-- Insert Tech Forums
INSERT INTO links (category_id, name, url, description) VALUES
(4, 'Medium', 'https://medium.com', 'A platform for sharing ideas, knowledge, and stories through blog posts'),
(4, 'Hostloc', 'https://hostloc.com/', 'A community for discussing hosting, VPS, and cloud services'),
(4, 'V2EX', 'https://www.v2ex.com/', 'A community of technology enthusiasts for sharing and learning'),
(4, 'Linux DO', 'https://linux.do/', 'A forum dedicated to discussions on Linux and open-source software'),
(4, '52pojie', 'https://www.52pojie.cn/', 'A Chinese community focusing on software security and development');

-- Insert Remote Work
INSERT INTO links (category_id, name, url, description) VALUES
(5, 'Remote.co', 'https://remote.co', 'Remote jobs, companies & virtual teams resource'),
(5, 'We Work Remotely', 'https://weworkremotely.com', 'Remote jobs in design, programming, marketing and more'),
(5, 'Indeed', 'https://www.indeed.com', 'Comprehensive job search engine for various industries'),
(5, 'FlexJobs', 'https://www.flexjobs.com', 'Curated platform for remote, flexible, and freelance jobs'),
(5, 'Upwork', 'https://www.upwork.com', 'Global freelancing platform for diverse skill sets'),
(5, 'Freelancer', 'https://www.freelancer.com', 'Marketplace for freelancers and project-based work'),
(5, 'Virtual Vocations', 'https://www.virtualvocations.com', 'Hand-screened remote job opportunities'),
(5, 'Jobspresso', 'https://jobspresso.co', 'Curated remote jobs in tech and digital marketing'),
(5, 'Working Nomads', 'https://www.workingnomads.co', 'Remote job opportunities for digital nomads'),
(5, 'RemoteOK', 'https://remoteok.io', 'Remote jobs in programming, support, design and more'),
(5, 'Guru', 'https://www.guru.com', 'Freelance marketplace for various professional services'),
(5, 'SkipTheDrive', 'https://www.skipthedrive.com', 'Aggregator for work-from-home and remote job listings');

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admins (username, password_hash) VALUES
('admin', '$2a$10$zG1DQ3/bwuhB6PKC7LZPzOyR7a0F9TgATqvN4QG.fHGKodAhXtPYi');

