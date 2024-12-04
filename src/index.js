import { Router } from 'itty-router';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin HTML 页面内容
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>导航管理后台</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div id="app" class="container mx-auto px-4 py-8">
        <!-- 登录表单 -->
        <div v-if="!token" class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">登录</h2>
            <form @submit.prevent="login" class="space-y-4">
                <div>
                    <label class="block text-gray-700">用户名</label>
                    <input v-model="loginForm.username" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                </div>
                <div>
                    <label class="block text-gray-700">密码</label>
                    <input v-model="loginForm.password" type="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                    登录
                </button>
            </form>
        </div>

        <!-- 管理界面 -->
        <div v-else>
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold">导航管理后台</h1>
                <div class="space-x-2">
                    <button @click="showChangePasswordModal = true" class="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700">
                        修改密码
                    </button>
                    <button @click="logout" class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
                        退出登录
                    </button>
                </div>
            </div>
            <!-- 网站设置 -->
<div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-bold mb-4">网站设置</h2>
    <div class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">网站标题</label>
            <div class="flex space-x-2">
                <input
                    type="text"
                    v-model="siteTitle"
                    class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="请输入网站标题"
                >
                <button
                    @click="updateSiteTitle"
                    class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    保存
                </button>
            </div>
        </div>
    </div>
</div>
            

            <!-- 修改密码模态框 -->
            <div v-if="showChangePasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 class="text-xl font-bold mb-4">修改密码</h3>
                    <form @submit.prevent="changePassword" class="space-y-4">
                        <div>
                            <label class="block text-gray-700">当前密码</label>
                            <input type="password" v-model="passwordForm.currentPassword" class="w-full mt-1 px-3 py-2 border rounded-md">
                        </div>
                        <div>
                            <label class="block text-gray-700">新密码</label>
                            <input type="password" v-model="passwordForm.newPassword" class="w-full mt-1 px-3 py-2 border rounded-md">
                        </div>
                        <div>
                            <label class="block text-gray-700">确认新密码</label>
                            <input type="password" v-model="passwordForm.confirmPassword" class="w-full mt-1 px-3 py-2 border rounded-md">
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" @click="showChangePasswordModal = false" class="px-4 py-2 border rounded-md">
                                取消
                            </button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                确认
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- 分类管理 -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-bold mb-4">分类管理</h2>
                <div class="flex gap-4 mb-4">
                    <input v-model="newCategory" type="text" placeholder="分类名称" class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <button @click="addCategory" class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                        添加分类
                    </button>
                </div>
                <div class="space-y-2">
                    <div v-for="category in categories" :key="category.id" class="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{{ category.name }}</span>
                        <div class="space-x-2">
                            <button @click="editCategory(category)" class="text-blue-600 hover:text-blue-800">编辑</button>
                            <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-800">删除</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 链接管理 -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-bold mb-4">链接管理</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select v-model="newLink.category_id" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <option value="">选择分类</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                    <input v-model="newLink.name" type="text" placeholder="链接名称" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <input v-model="newLink.url" type="url" placeholder="链接地址" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <input v-model="newLink.description" type="text" placeholder="链接描述（可选）" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <button @click="addLink" class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                        添加链接
                    </button>
                </div>
                <div class="space-y-2">
                    <div v-for="link in links" :key="link.id" class="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div class="flex-1">
                            <div class="font-medium">{{ link.name }}</div>
                            <div class="text-sm text-gray-500">
                                分类：{{ getCategoryName(link.category_id) }} | 
                                URL：{{ link.url }}
                                <span v-if="link.description"> | 描述：{{ link.description }}</span>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button @click="editLink(link)" class="text-blue-600 hover:text-blue-800">
                                编辑
                            </button>
                            <button @click="deleteLink(link.id)" class="text-red-600 hover:text-red-800">
                                删除
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 编辑链接模态框 -->
            <div v-if="showEditLinkModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 class="text-xl font-bold mb-4">编辑链接</h3>
                    <form @submit.prevent="updateLink" class="space-y-4">
                        <div>
                            <label class="block text-gray-700">分类</label>
                            <select v-model="editLinkForm.category_id" class="w-full mt-1 px-3 py-2 border rounded-md">
                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700">名称</label>
                            <input type="text" v-model="editLinkForm.name" class="w-full mt-1 px-3 py-2 border rounded-md">
                        </div>
                        <div>
                            <label class="block text-gray-700">URL</label>
                            <input type="url" v-model="editLinkForm.url" class="w-full mt-1 px-3 py-2 border rounded-md">
                        </div>
                        <div>
                            <label class="block text-gray-700">描述（可选）</label>
                            <input type="text" v-model="editLinkForm.description" class="w-full mt-1 px-3 py-2 border rounded-md">
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" @click="showEditLinkModal = false" class="px-4 py-2 border rounded-md">
                                取消
                            </button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                保存
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- 编辑链接模态框 -->
            <div v-if="showEditLinkModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 class="text-xl font-bold mb-4">编辑链接</h3>
                    <form @submit.prevent="updateLink" class="space-y-4">
                        <div>
                            <label class="block text-gray-700">分类</label>
                            <select v-model="editLinkForm.category_id" class="w-full mt-1 px-3 py-2 border rounded-md">
                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700">名称</label>
                            <input type="text" v-model="editLinkForm.name" class="w-full mt-1 px-3 py-2 border rounded-md">
                        </div>
                        <div>
                            <label class="block text-gray-700">URL</label>
                            <input type="url" v-model="editLinkForm.url" class="w-full mt-1 px-3 py-2 border rounded-md">
                        </div>
                        <div>
                            <label class="block text-gray-700">描述（可选）</label>
                            <input type="text" v-model="editLinkForm.description" class="w-full mt-1 px-3 py-2 border rounded-md">
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" @click="showEditLinkModal = false" class="px-4 py-2 border rounded-md">
                                取消
                            </button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                保存
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <footer class="mt-12 pb-8 text-center text-sm text-gray-500">
        <div class="space-x-1">
            <span>Powered by</span>
            <a href="https://workers.cloudflare.com" class="text-blue-500 hover:text-blue-600" target="_blank" rel="noopener noreferrer">Cloudflare</a>
            <span>•</span>
            <a href="https://codeium.com" class="text-blue-500 hover:text-blue-600" target="_blank" rel="noopener noreferrer">Codeium</a>
            <span>•</span>
            <span>Built by</span>
            <a href="https://duizhang.fun" class="text-blue-500 hover:text-blue-600" target="_blank" rel="noopener noreferrer">duizhang</a>
        </div>
        <div class="mt-2">
            <span>Copyright 2024</span>
        </div>
    </footer>

    <!-- Vue.js -->
    <script src="https://unpkg.com/vue@3"></script>
    <script>
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    token: localStorage.getItem('token'),
                    loginForm: {
                        username: '',
                        password: ''
                    },
                    siteTitle: '',
                    categories: [],
                    links: [],
                    newCategory: '',
                    newLink: {
                        category_id: '',
                        name: '',
                        url: '',
                        description: ''
                    },
                    editLinkForm: {
                        id: null,
                        category_id: '',
                        name: '',
                        url: '',
                        description: ''
                    },
                    showChangePasswordModal: false,
                    showEditLinkModal: false,
                    passwordForm: {
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    }
                };
            },
            methods: {
                async login() {
                    try {
                        const response = await fetch('/api/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.loginForm)
                        });

                        if (!response.ok) {
                            throw new Error('Login failed');
                        }

                        const data = await response.json();
                        this.token = data.token;
                        localStorage.setItem('token', data.token);
                        this.fetchData();
                    } catch (error) {
                        alert('登录失败：' + error.message);
                    }
                },
                logout() {
                    this.token = null;
                    localStorage.removeItem('token');
                },
                async fetchData() {
                    await Promise.all([
                        this.fetchCategories(),
                        this.fetchLinks(),
                        this.fetchConfigs()
                    ]);
                },
                async fetchCategories() {
                    try {
                        const response = await fetch('/api/categories', {
                            headers: {
                                'Authorization': 'Bearer ' + this.token
                            }
                        });
                        if (!response.ok) throw new Error('Failed to fetch categories');
                        this.categories = await response.json();
                    } catch (error) {
                        console.error('Error fetching categories:', error);
                        alert('获取分类失败：' + error.message);
                    }
                },
                async fetchLinks() {
                    try {
                        const response = await fetch('/api/links', {
                            headers: {
                                'Authorization': 'Bearer ' + this.token
                            }
                        });
                        if (!response.ok) throw new Error('Failed to fetch links');
                        this.links = await response.json();
                    } catch (error) {
                        console.error('Error fetching links:', error);
                        alert('获取链接失败：' + error.message);
                    }
                },
                async fetchConfigs() {
                    try {
                        const response = await fetch('/api/configs');
                        const configs = await response.json();
                        this.siteTitle = configs.site_title || '我的导航';
                    } catch (error) {
                        console.error('Error fetching configs:', error);
                    }
                },
                async updateSiteTitle() {
                    if (!this.siteTitle.trim()) {
                        alert('网站标题不能为空');
                        return;
                    }

                    try {
                        const response = await fetch('/api/configs/site_title', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.token
                            },
                            body: JSON.stringify({ value: this.siteTitle.trim() })
                        });

                        if (response.ok) {
                            alert('网站标题更新成功');
                        } else {
                            const data = await response.json();
                            throw new Error(data.error || '更新失败');
                        }
                    } catch (error) {
                        console.error('Error updating site title:', error);
                        alert(error.message || '更新网站标题失败');
                    }
                },
                async addCategory() {
                    if (!this.newCategory.trim()) {
                        alert('分类名称不能为空');
                        return;
                    }

                    try {
                        const response = await fetch('/api/categories', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.token
                            },
                            body: JSON.stringify({ name: this.newCategory.trim() })
                        });

                        const data = await response.json();
                        
                        if (!response.ok) {
                            throw new Error(data.error || '添加分类失败');
                        }

                        await this.fetchData();
                        this.newCategory = '';
                    } catch (error) {
                        console.error('Error adding category:', error);
                        alert('添加分类失败：' + error.message);
                    }
                },
                async deleteCategory(id) {
                    if (!confirm('确定要删除这个分类吗？')) return;

                    try {
                        const response = await fetch('/api/categories/' + id, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + this.token
                            }
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Failed to delete category');
                        }

                        await this.fetchData();
                    } catch (error) {
                        alert('删除分类失败：' + error.message);
                    }
                },
                async addLink() {
                    if (!this.newLink.category_id || !this.newLink.name || !this.newLink.url) return;

                    try {
                        const response = await fetch('/api/links', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.token
                            },
                            body: JSON.stringify(this.newLink)
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Failed to add link');
                        }

                        await this.fetchData();
                        this.newLink = {
                            category_id: '',
                            name: '',
                            url: '',
                            description: ''
                        };
                    } catch (error) {
                        alert('添加链接失败：' + error.message);
                    }
                },
                async deleteLink(id) {
                    if (!confirm('确定要删除这个链接吗？')) return;

                    try {
                        const response = await fetch('/api/links/' + id, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + this.token
                            }
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Failed to delete link');
                        }

                        await this.fetchData();
                    } catch (error) {
                        alert('删除链接失败：' + error.message);
                    }
                },
                editCategory(category) {
                    const newName = prompt('请输入新的分类名称：', category.name);
                    if (newName && newName !== category.name) {
                        this.updateCategory(category.id, newName);
                    }
                },
                async updateCategory(id, name) {
                    try {
                        const response = await fetch('/api/categories/' + id, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.token
                            },
                            body: JSON.stringify({ name })
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Failed to update category');
                        }

                        await this.fetchData();
                    } catch (error) {
                        alert('更新分类失败：' + error.message);
                    }
                },
                editLink(link) {
                    this.editLinkForm = {
                        id: link.id,
                        category_id: link.category_id,
                        name: link.name,
                        url: link.url,
                        description: link.description || ''
                    };
                    this.showEditLinkModal = true;
                },
                async updateLink() {
                    if (!this.editLinkForm.category_id || !this.editLinkForm.name || !this.editLinkForm.url) {
                        alert('分类、名称和URL都是必填项');
                        return;
                    }

                    try {
                        const response = await fetch('/api/links/' + this.editLinkForm.id, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.token
                            },
                            body: JSON.stringify(this.editLinkForm)
                        });

                        const data = await response.json();
                        
                        if (!response.ok) {
                            throw new Error(data.error || '更新链接失败');
                        }

                        await this.fetchData();
                        this.showEditLinkModal = false;
                        this.editLinkForm = {
                            id: null,
                            category_id: '',
                            name: '',
                            url: '',
                            description: ''
                        };
                    } catch (error) {
                        console.error('Error updating link:', error);
                        alert('更新链接失败：' + error.message);
                    }
                },
                getCategoryName(categoryId) {
                    const category = this.categories.find(c => c.id === categoryId);
                    return category ? category.name : '';
                },
                async changePassword() {
                    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
                        alert('新密码和确认密码不一致');
                        return;
                    }

                    try {
                        const response = await fetch('/api/change-password', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.token
                            },
                            body: JSON.stringify({
                                currentPassword: this.passwordForm.currentPassword,
                                newPassword: this.passwordForm.newPassword
                            })
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || 'Failed to change password');
                        }

                        alert('密码修改成功');
                        this.showChangePasswordModal = false;
                        this.passwordForm = {
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        };
                    } catch (error) {
                        alert('密码修改失败：' + error.message);
                    }
                },
            },
            mounted() {
                if (this.token) {
                    this.fetchData();
                }
            }
        }).mount('#app');
    </script>
</body>
</html>`;

const router = Router();
const JWT_SECRET = 'your-secret-key'; // 在生产环境中应该使用环境变量

// 中间件：验证 JWT token
async function authenticateToken(request, env) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return new Response('Invalid token', { status: 403 });
  }
}

// 生成密码哈希的辅助函数
async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash for admin123:', hash);
  return hash;
}

// 登录路由
router.post('/api/login', async (request, env) => {
  const { username, password } = await request.json();
  console.log('Login attempt:', { username });

  const { results } = await env.DB.prepare(
    'SELECT * FROM admins WHERE username = ?'
  ).bind(username).all();

  console.log('Database query results:', results);

  if (results.length === 0) {
    console.log('No user found');
    return new Response('Invalid credentials', { status: 401 });
  }

  const admin = results[0];
  console.log('Found admin:', { id: admin.id, username: admin.username });

  const validPassword = await bcrypt.compare(password, admin.password_hash);
  console.log('Password validation:', { valid: validPassword });

  if (!validPassword) {
    console.log('Invalid password');
    return new Response('Invalid credentials', { status: 401 });
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, {
    expiresIn: '24h',
  });

  return new Response(JSON.stringify({ token }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// 获取所有分类
router.get('/api/categories', async (request, env) => {
  try {
    const auth = await authenticateToken(request, env);
    if (auth.status === 401 || auth.status === 403) return auth;

    const { results } = await env.DB.prepare(
      'SELECT * FROM categories ORDER BY name'
    ).all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 获取所有链接
router.get('/api/links', async (request, env) => {
  try {
    const auth = await authenticateToken(request, env);
    if (auth.status === 401 || auth.status === 403) return auth;

    const { results } = await env.DB.prepare(`
      SELECT l.*, c.name as category_name 
      FROM links l 
      JOIN categories c ON l.category_id = c.id 
      ORDER BY c.name, l.name
    `).all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 添加分类
router.post('/api/categories', async (request, env) => {
  try {
    const auth = await authenticateToken(request, env);
    if (auth.status === 401 || auth.status === 403) return auth;

    const { name } = await request.json();
    await env.DB.prepare('INSERT INTO categories (name) VALUES (?)').bind(name).run();
    
    return new Response(JSON.stringify({ message: 'Category created' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 更新分类
router.put('/api/categories/:id', async (request, env) => {
  try {
    const auth = await authenticateToken(request, env);
    if (auth.status === 401 || auth.status === 403) return auth;

    const { id } = request.params;
    const { name } = await request.json();
    
    await env.DB.prepare('UPDATE categories SET name = ? WHERE id = ?')
      .bind(name, id)
      .run();
    
    return new Response(JSON.stringify({ message: 'Category updated' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 删除分类
router.delete('/api/categories/:id', async (request, env) => {
  try {
    const auth = await authenticateToken(request, env);
    if (auth.status === 401 || auth.status === 403) return auth;

    const { id } = request.params;
    await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
    
    return new Response(JSON.stringify({ message: 'Category deleted' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 添加链接
router.post('/api/links', async (request, env) => {
  try {
    const auth = await authenticateToken(request, env);
    if (auth.status === 401 || auth.status === 403) return auth;

    const { category_id, name, url, description } = await request.json();
    
    await env.DB.prepare(
      'INSERT INTO links (category_id, name, url, description) VALUES (?, ?, ?, ?)'
    ).bind(category_id, name, url, description).run();
    
    return new Response(JSON.stringify({ message: 'Link created' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 更新链接
router.put('/api/links/:id', async (request, env) => {
  try {
    const auth = await authenticateToken(request, env);
    if (auth.status === 401 || auth.status === 403) return auth;

    const { id } = request.params;
    const { category_id, name, url, description } = await request.json();
    
    await env.DB.prepare(
      'UPDATE links SET category_id = ?, name = ?, url = ?, description = ? WHERE id = ?'
    ).bind(category_id, name, url, description, id).run();
    
    return new Response(JSON.stringify({ message: 'Link updated' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 删除链接
router.delete('/api/links/:id', async (request, env) => {
  try {
    const auth = await authenticateToken(request, env);
    if (auth.status === 401 || auth.status === 403) return auth;

    const { id } = request.params;
    await env.DB.prepare('DELETE FROM links WHERE id = ?').bind(id).run();
    
    return new Response(JSON.stringify({ message: 'Link deleted' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 访问统计
router.get('/api/visit/:id', async (request, env) => {
  try {
    const { id } = request.params;
    
    // 获取链接信息
    const link = await env.DB.prepare('SELECT url FROM links WHERE id = ?').bind(id).first();
    if (!link) {
      return new Response('Link not found', { status: 404 });
    }

    // 更新访问次数
    await env.DB.prepare(`
      UPDATE links 
      SET visit_count = COALESCE(visit_count, 0) + 1,
          last_visit = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(id).run();

    // 重定向到目标URL
    return new Response(null, {
      status: 302,
      headers: { 'Location': link.url }
    });
  } catch (error) {
    console.error('Error recording visit:', error);
    return new Response('Server Error', { status: 500 });
  }
});

// 修改密码路由
router.post('/api/change-password', async (request, env) => {
  try {
    const auth = await authenticateToken(request, env);
    if (auth.status === 401 || auth.status === 403) return auth;

    const { currentPassword, newPassword } = await request.json();
    const decoded = jwt.verify(request.headers.get('Authorization').split(' ')[1], JWT_SECRET);

    // 获取当前用户信息
    const { results } = await env.DB.prepare(
      'SELECT * FROM admins WHERE username = ?'
    ).bind(decoded.username).all();

    if (results.length === 0) {
      return new Response('User not found', { status: 404 });
    }

    const admin = results[0];
    const validPassword = await bcrypt.compare(currentPassword, admin.password_hash);

    if (!validPassword) {
      return new Response('Current password is incorrect', { status: 401 });
    }

    // 生成新密码的哈希值
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await env.DB.prepare(
      'UPDATE admins SET password_hash = ? WHERE username = ?'
    ).bind(newPasswordHash, decoded.username).run();

    return new Response(JSON.stringify({ message: 'Password updated successfully' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 获取配置
router.get('/api/configs', async (request, env) => {
  try {
    const stmt = env.DB.prepare('SELECT key, value FROM configs');
    const configs = await stmt.all();
    const configObj = {};
    configs.results.forEach(config => {
      configObj[config.key] = config.value;
    });
    return new Response(JSON.stringify(configObj), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching configs:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch configs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// 更新配置
router.put('/api/configs/:key', async (request, env) => {
  try {
    const auth = await authenticateToken(request, env);
    if (auth.status === 401 || auth.status === 403) return auth;

    const { key } = request.params;
    const { value } = await request.json();

    if (!value || typeof value !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid value' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = env.DB.prepare('INSERT OR REPLACE INTO configs (key, value) VALUES (?, ?)');
    await stmt.bind(key, value).run();

    return new Response(JSON.stringify({ message: 'Config updated successfully' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating config:', error);
    return new Response(JSON.stringify({ error: 'Failed to update config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// 首页路由
router.get('/', async (request, env) => {
  try {
    // 获取网站标题
    const { results: configs } = await env.DB.prepare('SELECT value FROM configs WHERE key = ?').bind('site_title').all();
    const siteTitle = configs.length > 0 ? configs[0].value : '我的导航';

    // 获取常用链接（访问次数最多的前4个）
    const { results: topLinks } = await env.DB.prepare(`
      SELECT * FROM links 
      WHERE visit_count > 0 
      ORDER BY visit_count DESC 
      LIMIT 4
    `).all();

    // 获取所有链接并按分类组织
    const { results } = await env.DB.prepare(`
      SELECT l.*, c.name as category_name 
      FROM links l 
      JOIN categories c ON l.category_id = c.id 
      ORDER BY c.name, l.name
    `).all();

    const categorizedLinks = {};
    results.forEach(link => {
      if (!categorizedLinks[link.category_name]) {
        categorizedLinks[link.category_name] = [];
      }
      categorizedLinks[link.category_name].push(link);
    });

    return new Response(generateHTML(categorizedLinks, siteTitle, topLinks), {
      headers: { 'Content-Type': 'text/html;charset=utf-8' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Server Error', { status: 500 });
  }
});

// 404 处理
router.all('*', () => new Response('404, not found!', { status: 404 }));

// 处理请求
export default {
  async fetch(request, env) {
    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // 如果是管理后台请求
    if (request.url.endsWith('/admin')) {
      await generateHash();
      return new Response(ADMIN_HTML, {
        headers: { 'Content-Type': 'text/html;charset=utf-8' },
      });
    }

    // 如果是 API 请求，使用路由处理
    if (request.url.includes('/api/')) {
      return router.handle(request, env);
    }

    try {
      // 获取网站标题
      const { results: configs } = await env.DB.prepare('SELECT value FROM configs WHERE key = ?').bind('site_title').all();
      const siteTitle = configs.length > 0 ? configs[0].value : '我的导航';

      // 获取常用链接（访问次数最多的前4个）
      const { results: topLinks } = await env.DB.prepare(`
        SELECT * FROM links 
        WHERE visit_count > 0 
        ORDER BY visit_count DESC 
        LIMIT 4
      `).all();

      // 获取所有链接并按分类组织
      const { results } = await env.DB.prepare(`
        SELECT l.*, c.name as category_name 
        FROM links l 
        JOIN categories c ON l.category_id = c.id 
        ORDER BY c.name, l.name
      `).all();

      const categorizedLinks = {};
      results.forEach(link => {
        if (!categorizedLinks[link.category_name]) {
          categorizedLinks[link.category_name] = [];
        }
        categorizedLinks[link.category_name].push(link);
      });

      return new Response(generateHTML(categorizedLinks, siteTitle, topLinks), {
        headers: { 'Content-Type': 'text/html;charset=utf-8' },
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Server Error', { status: 500 });
    }
  },
};

// 修改 HTML 生成函数，将最常访问的链接移到顶部。
function generateHTML(categorizedLinks, siteTitle = '我的导航', topLinks = []) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteTitle}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
        }
        .link-card {
            transition: all 0.2s ease;
        }
        .link-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .search-box:focus {
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .category-content {
            transition: all 0.3s ease-out;
            overflow: hidden;
            max-height: 0;
            opacity: 1;
            padding: 0 1.5rem;
        }
        .category-content.expanded {
            max-height: none;
            padding: 1.5rem;
            opacity: 1;
        }
        .category-toggle {
            transition: transform 0.3s ease;
        }
        .category-toggle.collapsed {
            transform: rotate(-90deg);
        }
        .domain-tag {
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .link-card:hover .domain-tag {
            opacity: 1;
        }
        .visit-count {
            font-size: 0.75rem;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .link-card:hover .visit-count {
            opacity: 0.7;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 py-8">
        <header class="mb-8">
            <h1 class="text-4xl font-bold text-center text-gray-800 mb-6">${siteTitle}</h1>
            <div class="max-w-2xl mx-auto relative">
                <input type="text" 
                       id="searchInput" 
                       class="search-box w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none"
                       placeholder="搜索链接... (按 / 聚焦搜索框)"
                >
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                    按 ESC 清空
                </div>
            </div>
        </header>

        <main class="space-y-6">
            <!-- 最常访问的链接 -->
            ${topLinks.length > 0 ? `
                <section class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="category-header px-6 py-4 flex items-center justify-between border-b border-gray-100">
                        <div class="flex items-center space-x-3">
                            <h2 class="text-xl font-semibold text-gray-800">最常访问</h2>
                            <span class="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">${topLinks.length}</span>
                        </div>
                    </div>
                    <div class="category-content expanded">
                        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            ${topLinks.map(link => {
                                const domain = new URL(link.url).hostname;
                                return `
                                    <a href="/api/visit/${link.id}" 
                                       target="_blank" 
                                       rel="noopener noreferrer" 
                                       class="link-card block p-4 rounded-lg bg-gray-50 hover:bg-white relative"
                                       title="${link.description || ''}"
                                       data-name="${link.name.toLowerCase()}"
                                       data-description="${(link.description || '').toLowerCase()}"
                                    >
                                        <div class="absolute top-2 right-2 text-xs text-gray-400">
                                            ${link.visit_count || 0} 访问
                                        </div>
                                        <div class="pr-16">
                                            <div class="font-medium text-gray-900 truncate">${link.name}</div>
                                            <div class="domain-tag text-sm text-gray-500 truncate">${domain}</div>
                                        </div>
                                    </a>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </section>
            ` : ''}

            <div class="flex justify-end mb-4 space-x-4">
                <button onclick="expandAll()" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">展开全部</button>
                <button onclick="collapseAll()" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">折叠全部</button>
            </div>

            ${Object.entries(categorizedLinks).map(([category, links]) => `
                <section class="bg-white rounded-xl shadow-sm overflow-hidden" data-category="${category}">
                    <div class="category-header px-6 py-4 flex items-center justify-between cursor-pointer border-b border-gray-100"
                         onclick="toggleCategory(this.parentElement)">
                        <div class="flex items-center space-x-3">
                            <svg class="category-toggle w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            <h2 class="text-xl font-semibold text-gray-800">${category}</h2>
                            <span class="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">${links.length}</span>
                        </div>
                    </div>
                    <div class="category-content expanded">
                        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            ${links.map(link => {
                                const domain = new URL(link.url).hostname;
                                return `
                                    <a href="/api/visit/${link.id}" 
                                       target="_blank" 
                                       rel="noopener noreferrer" 
                                       class="link-card block p-4 rounded-lg bg-gray-50 hover:bg-white relative"
                                       title="${link.description || ''}"
                                       data-name="${link.name.toLowerCase()}"
                                       data-description="${(link.description || '').toLowerCase()}"
                                    >
                                        <div class="absolute top-2 right-2 text-xs text-gray-400">
                                            ${link.visit_count || 0} 访问
                                        </div>
                                        <div class="pr-16">
                                            <div class="font-medium text-gray-900 truncate">${link.name}</div>
                                            <div class="domain-tag text-sm text-gray-500 truncate">${domain}</div>
                                        </div>
                                    </a>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </section>
            `).join('')}

        </main>
    </div>

    <footer class="mt-12 pb-8 text-center text-sm text-gray-500">
        <div class="space-x-1">
            <span>Powered by</span>
            <a href="https://workers.cloudflare.com" class="text-blue-500 hover:text-blue-600" target="_blank" rel="noopener noreferrer">Cloudflare</a>
            <span>•</span>
            <a href="https://codeium.com" class="text-blue-500 hover:text-blue-600" target="_blank" rel="noopener noreferrer">Codeium</a>
            <span>•</span>
            <span>Built by</span>
            <a href="https://duizhang.fun" class="text-blue-500 hover:text-blue-600" target="_blank" rel="noopener noreferrer">duizhang</a>
        </div>
        <div class="mt-2">
            <span>Copyright 2024</span>
        </div>
    </footer>
    <script>
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;

        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase().trim();
                
                document.querySelectorAll('section[data-category]').forEach(section => {
                    const links = section.querySelectorAll('.link-card');
                    let hasVisibleLinks = false;
                    
                    links.forEach(link => {
                        const name = link.getAttribute('data-name');
                        const description = link.getAttribute('data-description');
                        const isMatch = name.includes(searchTerm) || description.includes(searchTerm);
                        
                        link.style.display = isMatch ? 'block' : 'none';
                        if (isMatch) hasVisibleLinks = true;
                    });
                    
                    section.style.display = hasVisibleLinks ? 'block' : 'none';
                });
            }, 200);
        });

        // 搜索框快捷键
        document.addEventListener('keydown', function(e) {
            if (e.key === '/' && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            } else if (e.key === 'Escape' && document.activeElement === searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
        });

        // 折叠/展开功能
        function toggleCategory(section) {
            const content = section.querySelector('.category-content');
            const toggle = section.querySelector('.category-toggle');
            
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                toggle.classList.add('collapsed');
            } else {
                content.classList.add('expanded');
                toggle.classList.remove('collapsed');
            }
        }

        // 展开所有分类
        function expandAll() {
            document.querySelectorAll('section[data-category] .category-content').forEach(content => {
                content.classList.add('expanded');
                content.parentElement.querySelector('.category-toggle').classList.remove('collapsed');
            });
        }

        // 折叠所有分类
        function collapseAll() {
            document.querySelectorAll('section[data-category] .category-content').forEach(content => {
                content.classList.remove('expanded');
                content.parentElement.querySelector('.category-toggle').classList.add('collapsed');
            });
        }

        // 初始化：展开所有分类
        document.querySelectorAll('section[data-category] .category-content').forEach(content => {
            content.classList.add('expanded');
        });

        // 在搜索时自动展开所有分类
        searchInput.addEventListener('input', function(e) {
            if (e.target.value.trim()) {
                document.querySelectorAll('section[data-category] .category-content').forEach(content => {
                    content.classList.add('expanded');
                    content.parentElement.querySelector('.category-toggle').classList.remove('collapsed');
                });
            }
        });
    </script>
</body>
</html>`;
}
