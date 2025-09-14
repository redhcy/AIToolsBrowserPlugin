document.addEventListener('DOMContentLoaded', async () => {
    // 初始化数据
    await initializeData();

    // 渲染工具树形菜单
    renderToolTree();

    // 绑定事件
    bindEvents();
});

// 初始化数据
async function initializeData() {
    // 检查是否有初始数据
    const { tree } = await chrome.storage.local.get(['tree']);

    // 如果没有工具数据，初始化默认数据
    if (!tree) {
        const initialTree = {
            '通用类': {
                '国内可用': [
                    { name: 'DeepSeek', url: 'https://chat.deepseek.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: 'Kimi', url: 'https://kimi.moonshot.cn', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '百度文心一言', url: 'https://yiyan.baidu.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '讯飞星火', url: 'https://xinghuo.xfyun.cn', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '通义千问', url: 'https://tongyi.aliyun.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '腾讯元宝', url: 'https://yuanbao.tencent.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '字节豆包', url: 'https://www.doubao.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '智谱清言', url: 'https://chatglm.cn', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '天工 AI', url: 'https://www.tiangong.cn', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'ChatGPT', url: 'https://chat.openai.com', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Claude', url: 'https://claude.ai', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Gemini', url: 'https://gemini.google.com', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Grok', url: 'https://grok.x.ai', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Poe', url: 'https://poe.com', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Character.AI', url: 'https://character.ai', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '翻译': {
                '国内可用': [
                    { name: '百度翻译', url: 'https://fanyi.baidu.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '有道翻译', url: 'https://fanyi.youdao.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '腾讯翻译君', url: 'https://fanyi.qq.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '讯飞智能翻译', url: 'https://fanyi.xfyun.cn', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '火山翻译', url: 'https://translate.volcengine.com', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'DeepL', url: 'https://www.deepl.com/translator', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Google 翻译', url: 'https://translate.google.com', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '图像': {
                '国内可用': [
                    { name: '稿定设计', url: 'https://www.gaoding.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '稿定 AI', url: 'https://ai.gaoding.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '堆友 AI', url: 'https://www.duiyou360.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '悟空图像', url: 'https://www.wkimage.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '剪映 AI 抠图', url: 'https://www.capcut.cn/features/ai-cutout', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '腾讯智影', url: 'https://zenvideo.qq.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '阿里羚珑', url: 'https://linglong.aliyun.com', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'Midjourney', url: 'https://www.midjourney.com', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Stable Diffusion WebUI', url: 'https://stablediffusionweb.com', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Leonardo', url: 'https://leonardo.ai', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'DALL·E', url: 'https://labs.openai.com', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '视频': {
                '国内可用': [
                    { name: '剪映 AI', url: 'https://www.capcut.cn', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '腾讯智影', url: 'https://zenvideo.qq.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '百度度加', url: 'https://duga.baidu.com', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'Runway', url: 'https://runwayml.com', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Pika Labs', url: 'https://pika.art', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Synthesia', url: 'https://www.synthesia.io', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '音频': {
                '国内可用': [
                    { name: '网易天音', url: 'https://tianyin.music.163.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '腾讯 TME Studio', url: 'https://studio.tencentmusic.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: 'TTSMaker', url: 'https://ttsmaker.com', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'Suno', url: 'https://suno.ai', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'ElevenLabs', url: 'https://elevenlabs.io', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'AIVA', url: 'https://www.aiva.ai', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '写作': {
                '国内可用': [
                    { name: '讯飞绘文', url: 'https://huiwen.xfyun.cn', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '有道写作', url: 'https://write.youdao.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '百度度加写作', url: 'https://duga.baidu.com/writing', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'Notion AI', url: 'https://www.notion.so/ai', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Craft AI', url: 'https://www.craft.do/ai', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '设计': {
                '国内可用': [
                    { name: '稿定设计', url: 'https://www.gaoding.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '稿定 AI', url: 'https://ai.gaoding.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: 'Figma AI（国内版）', url: 'https://www.figma.com/cn/ai', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'Figma AI', url: 'https://www.figma.com/ai', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Adobe Firefly', url: 'https://firefly.adobe.com', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '搜索': {
                '国内可用': [
                    { name: '秘塔 AI 搜索', url: 'https://metaso.cn', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: 'Bing AI', url: 'https://www.bing.com/chat', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'Perplexity', url: 'https://www.perplexity.ai', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '内容检测': {
                '国内可用': [
                    { name: '网易易盾', url: 'https://dun.163.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: 'ZeroGPT', url: 'https://zerogpt.com', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'CopyLeaks', url: 'https://copyleaks.com', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '开发平台': {
                '国内可用': [
                    { name: 'HuggingFace 中国', url: 'https://huggingface.co/zh-CN', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '飞书多维表格 AI', url: 'https://www.feishu.cn', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'GitHub Copilot Chat', url: 'https://github.com/features/copilot', status: 'ok', lastCheck: Date.now(), color: 'red' },
                    { name: 'Replit AI', url: 'https://replit.com/ai', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '办公效率': {
                '国内可用': [
                    { name: 'WPS AI', url: 'https://ai.wps.cn', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '飞书妙记', url: 'https://www.feishu.cn/memo', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '腾讯会议 AI 助手', url: 'https://meeting.tencent.com/ai', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'Notion AI', url: 'https://www.notion.so/ai', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            'AI 炒股': {
                '国内可用': [
                    { name: '同花顺 AI 智投', url: 'https://ai.10jqka.com.cn', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '东方财富 AI 研报', url: 'https://emsec.eastmoney.com', status: 'ok', lastCheck: Date.now(), color: 'green' },
                    { name: '雪球 AI 选股', url: 'https://xueqiu.com/ai', status: 'ok', lastCheck: Date.now(), color: 'green' }
                ],
                '国际工具': [
                    { name: 'TradingView AI', url: 'https://www.tradingview.com/ai', status: 'ok', lastCheck: Date.now(), color: 'red' }
                ]
            },
            '自定义': {}
        };
        await chrome.storage.local.set({ tree: initialTree });
    }
}

// 渲染工具树形菜单
async function renderToolTree() {
    const toolTreeContainer = document.getElementById('tool-tree');
    const { tree, showBlockedSites } = await chrome.storage.local.get(['tree', 'showBlockedSites']);

    toolTreeContainer.innerHTML = '';

    // 提取所有分类并确保通用类在最前面
    const categories = Object.keys(tree);
    const commonClassIndex = categories.indexOf('通用类');
    if (commonClassIndex > 0) {
        categories.splice(commonClassIndex, 1);
        categories.unshift('通用类');
    }

    for (const category of categories) {
        const subcategories = tree[category];
        const categoryNode = document.createElement('div');
        categoryNode.className = 'category';
        categoryNode.innerHTML = `
            <div class="category-header">
                <h3>${category}</h3>
                <button class="category-delete-btn hidden" data-category="${category}" title="删除分类">×</button>
            </div>
        `;

        const subcategoryContainer = document.createElement('div');
        subcategoryContainer.className = 'subcategories';

        // 确保国内可用在国际工具前面
        const subcategoryKeys = Object.keys(subcategories);
        const orderedSubcategories = ['国内可用', '国际工具'];
        const finalSubcategories = orderedSubcategories.filter(sub => subcategoryKeys.includes(sub))
            .concat(subcategoryKeys.filter(sub => !orderedSubcategories.includes(sub)));

        for (const subcategory of finalSubcategories) {
            // 隐藏国际工具（如果用户设置了隐藏）
            if (subcategory === '国际工具' && showBlockedSites === false) continue;

            const subcategoryNode = document.createElement('div');
            subcategoryNode.className = 'subcategory';
            subcategoryNode.dataset.category = category;
            subcategoryNode.dataset.subcategory = subcategory;
            subcategoryNode.innerHTML = `
                <div class="subcategory-header">
                    <h4>${subcategory}</h4>
                    <button class="subcategory-delete-btn hidden" data-category="${category}" data-subcategory="${subcategory}" title="删除子分类">×</button>
                </div>
            `;

            const toolList = document.createElement('ul');
            toolList.className = 'tool-list';
            toolList.dataset.category = category;
            toolList.dataset.subcategory = subcategory;
            
            // 添加拖拽放置事件
            addDropZoneEvents(toolList);

            const tools = subcategories[subcategory];
        tools.forEach((tool, index) => {
            const toolItem = document.createElement('li');
            toolItem.className = 'tool-item';
            toolItem.draggable = true;
            toolItem.dataset.toolName = tool.name;
            toolItem.dataset.category = category;
            toolItem.dataset.subcategory = subcategory;
            toolItem.dataset.index = index;
            
            // 根据状态确定健康指示器样式和文本
            let healthIndicator = '';
            if (tool.status === 'error') {
                healthIndicator = `<span class="health-indicator error" title="连接失败，服务可能不可用">❌</span>`;
            } else if (tool.status === 'warning') {
                healthIndicator = `<span class="health-indicator warning" title="连接不稳定，但服务可能仍然可用">⚠️</span>`;
            } else if (tool.status && tool.status !== 'ok') {
                healthIndicator = `<span class="health-indicator warning" title="状态未知">⚠️</span>`;
            }
            
            toolItem.innerHTML = `
                <div class="drag-handle hidden">☰</div>
                <div class="tool-info">
                    <a href="${tool.url}" target="_blank">${tool.name}${healthIndicator}</a>
                    <span class="status-indicator" style="background-color: ${tool.color}"></span>
                </div>
                <div class="tool-actions">
                    <button class="tool-delete-btn hidden" data-category="${category}" data-subcategory="${subcategory}" data-tool-name="${tool.name}">×</button>
                </div>
            `;

            // 添加点击事件处理
            const toolLink = toolItem.querySelector('a');
            toolLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 检查URL有效性
                if (!tool.url || tool.url === '#' || tool.url === 'javascript:void(0)') {
                    console.warn('无效的URL:', tool.url);
                    return;
                }
                
                chrome.tabs.create({ url: tool.url, active: true });
            });
            
            // 添加删除按钮事件
            toolItem.querySelector('.tool-delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTool(category, subcategory, tool.name);
            });
            
            // 添加拖拽事件
            addDragAndDropEvents(toolItem);

            toolList.appendChild(toolItem);
        });

            subcategoryNode.appendChild(toolList);
            subcategoryContainer.appendChild(subcategoryNode);
        }

        categoryNode.appendChild(subcategoryContainer);
        toolTreeContainer.appendChild(categoryNode);

        // 添加分类删除事件
        const categoryDeleteBtn = categoryNode.querySelector('.category-delete-btn');
        if (categoryDeleteBtn) {
            categoryDeleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteCategory(category);
            });
        }

        // 添加子分类删除事件
        const subcategoryDeleteBtns = categoryNode.querySelectorAll('.subcategory-delete-btn');
        subcategoryDeleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const category = btn.dataset.category;
                const subcategory = btn.dataset.subcategory;
                deleteSubcategory(category, subcategory);
            });
        });

        // 添加折叠/展开功能
        const categoryHeader = categoryNode.querySelector('h3');
        categoryHeader.addEventListener('click', () => {
            subcategoryContainer.classList.toggle('hidden');
        });
    }
}

// 绑定事件
function bindEvents() {
    // 管理菜单按钮
    document.getElementById('manage-menu-btn').addEventListener('click', toggleManageMenu);
    
    // 添加工具按钮
    document.getElementById('add-tool-btn').addEventListener('click', () => {
        hideManageMenu();
        showAddToolModal();
    });
    
    // 管理分类按钮
    document.getElementById('manage-category-btn').addEventListener('click', () => {
        hideManageMenu();
        showCategoryModal();
    });
    
    // 编辑模式切换
    document.getElementById('toggle-edit-mode-btn').addEventListener('click', () => {
        hideManageMenu();
        toggleToolsManageMode();
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.tool-controls')) {
            hideManageMenu();
        }
    });
    
    // 模态框事件
    bindModalEvents();
}

    // 切换管理菜单显示
    function toggleManageMenu() {
        const dropdown = document.getElementById('manage-dropdown');
        dropdown.classList.toggle('hidden');
    }
    
    // 隐藏管理菜单
    function hideManageMenu() {
        const dropdown = document.getElementById('manage-dropdown');
        dropdown.classList.add('hidden');
    }
    
    // 更新编辑模式按钮文本
    function updateEditModeButton(isEditMode) {
        const btn = document.getElementById('toggle-edit-mode-btn');
        const icon = btn.querySelector('.icon');
        const text = btn.querySelector('span:last-child');
        
        if (isEditMode) {
            icon.textContent = '✓';
            text.textContent = '退出编辑';
            btn.classList.add('active');
        } else {
            icon.textContent = '✏️';
            text.textContent = '编辑模式';
            btn.classList.remove('active');
        }
    }

    // 切换AI工具管理模式
    function toggleToolsManageMode() {
        const toolDeleteBtns = document.querySelectorAll('.tool-delete-btn');
        const dragHandles = document.querySelectorAll('.drag-handle');
        const categoryDeleteBtns = document.querySelectorAll('.category-delete-btn');
        const subcategoryDeleteBtns = document.querySelectorAll('.subcategory-delete-btn');
        const toolItems = document.querySelectorAll('.tool-item');
        const isManageMode = !toolDeleteBtns[0]?.classList.contains('hidden');
        
        // 切换所有管理按钮和拖拽手柄的显示状态
        [...toolDeleteBtns, ...dragHandles, ...categoryDeleteBtns, ...subcategoryDeleteBtns].forEach(btn => {
            if (isManageMode) {
                btn.classList.add('hidden');
            } else {
                btn.classList.remove('hidden');
            }
        });
        
        // 切换拖拽功能
        toolItems.forEach(item => {
            if (isManageMode) {
                item.draggable = false;
                item.classList.remove('draggable-mode');
            } else {
                item.draggable = true;
                item.classList.add('draggable-mode');
            }
        });
        
        // 更新编辑模式按钮状态
        updateEditModeButton(!isManageMode);
    }

    // 添加拖拽事件
    function addDragAndDropEvents(toolItem) {
        toolItem.addEventListener('dragstart', handleDragStart);
        toolItem.addEventListener('dragend', handleDragEnd);
    }
    
    // 添加放置区域事件
    function addDropZoneEvents(toolList) {
        toolList.addEventListener('dragover', handleDragOver);
        toolList.addEventListener('dragenter', handleDragEnter);
        toolList.addEventListener('dragleave', handleDragLeave);
        toolList.addEventListener('drop', handleDrop);
    }
    
    let draggedItem = null;
    let draggedData = null;
    
    function handleDragStart(e) {
        draggedItem = this;
        draggedData = {
            toolName: this.dataset.toolName,
            category: this.dataset.category,
            subcategory: this.dataset.subcategory,
            index: parseInt(this.dataset.index)
        };
        
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
    }
    
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        
        // 清理所有拖拽相关的样式
        document.querySelectorAll('.tool-list').forEach(list => {
            list.classList.remove('drag-over');
        });
        document.querySelectorAll('.drop-indicator').forEach(indicator => {
            indicator.remove();
        });
        
        draggedItem = null;
        draggedData = null;
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const toolList = e.currentTarget;
        const afterElement = getDragAfterElement(toolList, e.clientY);
        
        // 移除旧的指示器
        document.querySelectorAll('.drop-indicator').forEach(indicator => {
            indicator.remove();
        });
        
        // 添加新的指示器
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        
        if (afterElement == null) {
            toolList.appendChild(indicator);
        } else {
            toolList.insertBefore(indicator, afterElement);
        }
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        // 只有当离开整个列表时才移除样式
        if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.classList.remove('drag-over');
        }
    }
    
    function handleDrop(e) {
        e.preventDefault();
        
        const toolList = e.currentTarget;
        const targetCategory = toolList.dataset.category;
        const targetSubcategory = toolList.dataset.subcategory;
        const afterElement = getDragAfterElement(toolList, e.clientY);
        
        // 移除指示器
        document.querySelectorAll('.drop-indicator').forEach(indicator => {
            indicator.remove();
        });
        
        toolList.classList.remove('drag-over');
        
        if (draggedData) {
            // 计算目标位置
            let targetIndex = 0;
            if (afterElement) {
                const siblings = Array.from(toolList.children).filter(child => 
                    child.classList.contains('tool-item')
                );
                targetIndex = siblings.indexOf(afterElement);
            } else {
                // 拖到列表末尾
                const siblings = Array.from(toolList.children).filter(child => 
                    child.classList.contains('tool-item')
                );
                targetIndex = siblings.length;
            }
            
            // 执行移动
            moveToolToPosition(
                draggedData.toolName,
                draggedData.category,
                draggedData.subcategory,
                targetCategory,
                targetSubcategory,
                targetIndex
            );
        }
    }
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.tool-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // 移动工具到指定位置
    async function moveToolToPosition(toolName, fromCategory, fromSubcategory, toCategory, toSubcategory, targetIndex) {
        const { tree } = await chrome.storage.local.get('tree');
        
        // 查找要移动的工具
        const fromTools = tree[fromCategory][fromSubcategory];
        const toolIndex = fromTools.findIndex(tool => tool.name === toolName);
        
        if (toolIndex === -1) return;
        
        const tool = fromTools[toolIndex];
        
        // 从原位置删除
        fromTools.splice(toolIndex, 1);
        
        // 添加到新位置
        const toTools = tree[toCategory][toSubcategory];
        
        // 如果是在同一个列表内移动，需要调整索引
        if (fromCategory === toCategory && fromSubcategory === toSubcategory && toolIndex < targetIndex) {
            targetIndex--;
        }
        
        toTools.splice(targetIndex, 0, tool);
        
        // 保存更改
        await chrome.storage.local.set({ tree });
        
        // 重新渲染
        renderToolTree();
    }

    // 显示添加工具模态框
    function showAddToolModal() {
        const modal = document.getElementById('add-tool-modal');
        const categorySelect = document.getElementById('tool-category');
        
        // 填充分类选项
        populateCategorySelect(categorySelect);
        
        modal.classList.remove('hidden');
    }
    
    // 显示分类管理模态框
    function showCategoryModal() {
        const modal = document.getElementById('category-modal');
        const parentSelect = document.getElementById('parent-category');
        
        // 填充父分类选项
        populateCategorySelect(parentSelect);
        
        // 渲染现有分类
        renderCategoryList();
        
        modal.classList.remove('hidden');
    }
    
    // 填充分类选项
    async function populateCategorySelect(selectElement) {
        const { tree } = await chrome.storage.local.get('tree');
        selectElement.innerHTML = '<option value="">请选择分类</option>';
        
        Object.keys(tree).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            selectElement.appendChild(option);
        });
    }
    
    // 填充子分类选项
    async function populateSubcategorySelect(category, selectElement) {
        const { tree } = await chrome.storage.local.get('tree');
        selectElement.innerHTML = '<option value="">请选择子分类</option>';
        
        if (tree[category]) {
            Object.keys(tree[category]).forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory;
                option.textContent = subcategory;
                selectElement.appendChild(option);
            });
        }
    }
    
    // 渲染分类列表
    async function renderCategoryList() {
        const { tree } = await chrome.storage.local.get('tree');
        const categoryList = document.getElementById('category-list');
        
        categoryList.innerHTML = '';
        
        Object.keys(tree).forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <div class="category-name">${category}</div>
                <button class="btn delete-category-btn" data-category="${category}">删除</button>
            `;
            
            const subcategoryList = document.createElement('div');
            subcategoryList.className = 'subcategory-list';
            
            Object.keys(tree[category]).forEach(subcategory => {
                const subcategoryItem = document.createElement('div');
                subcategoryItem.className = 'subcategory-item';
                subcategoryItem.innerHTML = `
                    <span>• ${subcategory}</span>
                    <button class="btn delete-subcategory-btn" data-category="${category}" data-subcategory="${subcategory}">删除</button>
                `;
                subcategoryList.appendChild(subcategoryItem);
            });
            
            categoryItem.appendChild(subcategoryList);
            categoryList.appendChild(categoryItem);
        });
    }
    
    // 绑定模态框事件
    function bindModalEvents() {
        // 关闭按钮事件
        document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.add('hidden');
                });
            });
        });
        
        // 分类选择变化事件
        document.getElementById('tool-category').addEventListener('change', (e) => {
            const subcategorySelect = document.getElementById('tool-subcategory');
            if (e.target.value) {
                populateSubcategorySelect(e.target.value, subcategorySelect);
            } else {
                subcategorySelect.innerHTML = '<option value="">请选择子分类</option>';
            }
        });
        
        // 保存工具
        document.getElementById('save-tool-btn').addEventListener('click', saveTool);
        
        // 添加分类
        document.getElementById('add-category-btn').addEventListener('click', addCategory);
        
        // 添加子分类
        document.getElementById('add-subcategory-btn').addEventListener('click', addSubcategory);
    }
    
    // 保存工具
    async function saveTool() {
        const name = document.getElementById('tool-name').value.trim();
        const url = document.getElementById('tool-url').value.trim();
        const category = document.getElementById('tool-category').value;
        const subcategory = document.getElementById('tool-subcategory').value;
        
        if (!name || !url || !category || !subcategory) {
            alert('请填写完整的工具信息');
            return;
        }
        
        const { tree } = await chrome.storage.local.get('tree');
        
        if (!tree[category]) {
            tree[category] = {};
        }
        if (!tree[category][subcategory]) {
            tree[category][subcategory] = [];
        }
        
        const newTool = {
            name,
            url,
            status: 'ok',
            lastCheck: Date.now(),
            color: 'green'
        };
        
        tree[category][subcategory].push(newTool);
        await chrome.storage.local.set({ tree });
        
        // 清空表单并关闭模态框
        document.getElementById('tool-name').value = '';
        document.getElementById('tool-url').value = '';
        document.getElementById('tool-category').value = '';
        document.getElementById('tool-subcategory').value = '';
        document.getElementById('add-tool-modal').classList.add('hidden');
        
        // 重新渲染
        renderToolTree();
    }
    
    // 添加分类
    async function addCategory() {
        const categoryName = document.getElementById('new-category').value.trim();
        
        if (!categoryName) {
            alert('请输入分类名称');
            return;
        }
        
        const { tree } = await chrome.storage.local.get('tree');
        
        if (tree[categoryName]) {
            alert('分类已存在');
            return;
        }
        
        tree[categoryName] = {};
        await chrome.storage.local.set({ tree });
        
        document.getElementById('new-category').value = '';
        renderCategoryList();
        renderToolTree();
    }
    
    // 添加子分类
    async function addSubcategory() {
        const parentCategory = document.getElementById('parent-category').value;
        const subcategoryName = document.getElementById('new-subcategory').value.trim();
        
        if (!parentCategory || !subcategoryName) {
            alert('请选择父分类并输入子分类名称');
            return;
        }
        
        const { tree } = await chrome.storage.local.get('tree');
        
        if (tree[parentCategory][subcategoryName]) {
            alert('子分类已存在');
            return;
        }
        
        tree[parentCategory][subcategoryName] = [];
        await chrome.storage.local.set({ tree });
        
        document.getElementById('new-subcategory').value = '';
        renderCategoryList();
        renderToolTree();
    }
    
    // 删除分类
    async function deleteCategory(categoryName) {
        if (!confirm(`确定要删除分类“${categoryName}”及其下所有工具吗？`)) return;
        
        const { tree } = await chrome.storage.local.get('tree');
        delete tree[categoryName];
        await chrome.storage.local.set({ tree });
        
        renderToolTree();
    }
    
    // 删除子分类
    async function deleteSubcategory(categoryName, subcategoryName) {
        if (!confirm(`确定要删除子分类“${subcategoryName}”及其下所有工具吗？`)) return;
        
        const { tree } = await chrome.storage.local.get('tree');
        delete tree[categoryName][subcategoryName];
        await chrome.storage.local.set({ tree });
        
        renderToolTree();
    }
    


    // 删除AI工具
    function deleteTool(category, subcategory, toolName) {
        if (!confirm(`确定要删除工具“${toolName}”吗？`)) return;

        chrome.storage.local.get('tree').then(async (result) => {
            const tree = result.tree || {};
            if (tree[category] && tree[category][subcategory]) {
                tree[category][subcategory] = tree[category][subcategory].filter(tool => tool.name !== toolName);
                await chrome.storage.local.set({ tree });
                renderToolTree();
            }
        });
    }

