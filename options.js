document.addEventListener('DOMContentLoaded', async () => {
    // 初始化数据
    await initializeData();

    // 渲染主题设置
    renderThemeSettings();

    // 渲染需翻墙工具开关
    renderBlockedSitesToggle();

    // 渲染自定义工具树
    renderCustomToolTree();

    // 绑定事件
    bindEvents();

    // 应用主题
    applyTheme();
});

// 初始化数据
async function initializeData() {
    // 检查是否有初始数据
    const { tree, prompts, showBlockedSites, theme } = await chrome.storage.local.get([
        'tree', 'prompts', 'showBlockedSites', 'theme'
    ]);

    // 如果没有显示需翻墙工具的设置，默认为true
    if (showBlockedSites === undefined) {
        await chrome.storage.local.set({ showBlockedSites: true });
    }
}

// 渲染主题设置
async function renderThemeSettings() {
    const { theme } = await chrome.storage.local.get('theme');

    // 选中对应的主题单选按钮
    document.querySelector(`input[name="theme"][value="${theme}"]`).checked = true;

    // 添加事件监听器
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', async (e) => {
            const newTheme = e.target.value;
            await chrome.storage.local.set({ theme: newTheme });
            applyTheme();
        });
    });
}

// 渲染需翻墙工具开关
async function renderBlockedSitesToggle() {
    const { showBlockedSites } = await chrome.storage.local.get('showBlockedSites');

    // 设置开关状态
    document.getElementById('show-blocked-sites').checked = showBlockedSites;

    // 添加事件监听器
    document.getElementById('show-blocked-sites').addEventListener('change', async (e) => {
        const newState = e.target.checked;
        await chrome.storage.local.set({ showBlockedSites: newState });

        // 通知popup页面更新
        chrome.runtime.sendMessage({ action: 'updateToolTree' });
    });
}

// 渲染自定义工具树
async function renderCustomToolTree() {
    const customTreeContainer = document.getElementById('custom-tree');
    const { tree } = await chrome.storage.local.get('tree');

    customTreeContainer.innerHTML = '';

    // 创建可拖拽的树结构
    const treeElement = document.createElement('div');
    treeElement.className = 'custom-tree';

    for (const [category, subcategories] of Object.entries(tree)) {
        const categoryNode = document.createElement('div');
        categoryNode.className = 'category';
        categoryNode.setAttribute('data-category', category);
        categoryNode.innerHTML = `<h3>${category}</h3>`;

        const subcategoryContainer = document.createElement('div');
        subcategoryContainer.className = 'subcategories';

        for (const [subcategory, tools] of Object.entries(subcategories)) {
            const subcategoryNode = document.createElement('div');
            subcategoryNode.className = 'subcategory';
            subcategoryNode.setAttribute('data-subcategory', subcategory);
            subcategoryNode.innerHTML = `<h4>${subcategory}</h4>`;

            const toolList = document.createElement('ul');
            toolList.className = 'tool-list';
            toolList.setAttribute('data-subcategory', subcategory);
            toolList.setAttribute('data-category', category);

            tools.forEach(tool => {
                const toolItem = document.createElement('li');
                toolItem.className = 'tool-item';
                toolItem.setAttribute('draggable', 'true');
                toolItem.setAttribute('data-tool-id', tool.name);
                toolItem.innerHTML = `
                    <span>${tool.name}</span>
                    <span class="tool-url">${tool.url}</span>
                    <div class="tool-actions">
                        <button class="edit-tool-btn">编辑</button>
                        <button class="delete-tool-btn">删除</button>
                    </div>
                `;

                // 添加拖拽事件
                toolItem.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                        name: tool.name,
                        url: tool.url,
                        category: category,
                        subcategory: subcategory
                    }));
                    toolItem.classList.add('dragging');
                });

                toolItem.addEventListener('dragend', () => {
                    toolItem.classList.remove('dragging');
                });

                // 添加编辑和删除事件
                toolItem.querySelector('.edit-tool-btn').addEventListener('click', () => {
                    editTool(category, subcategory, tool);
                });

                toolItem.querySelector('.delete-tool-btn').addEventListener('click', () => {
                    deleteTool(category, subcategory, tool.name);
                });

                toolList.appendChild(toolItem);
            });

            // 添加拖放区域
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.setAttribute('data-category', category);
            dropZone.setAttribute('data-subcategory', subcategory);
            dropZone.innerHTML = '<span>拖放工具到这里</span>';

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('drag-over');
            });

            dropZone.addEventListener('drop', async (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');

                const toolData = JSON.parse(e.dataTransfer.getData('text/plain'));
                const targetCategory = dropZone.getAttribute('data-category');
                const targetSubcategory = dropZone.getAttribute('data-subcategory');

                // 移动工具
                await moveTool(
                    toolData.category,
                    toolData.subcategory,
                    toolData.name,
                    targetCategory,
                    targetSubcategory
                );

                // 重新渲染树
                renderCustomToolTree();
            });

            subcategoryNode.appendChild(toolList);
            subcategoryNode.appendChild(dropZone);
            subcategoryContainer.appendChild(subcategoryNode);
        }

        // 添加子分类拖放区域
        const subcategoryDropZone = document.createElement('div');
        subcategoryDropZone.className = 'drop-zone subcategory-drop-zone';
        subcategoryDropZone.setAttribute('data-category', category);
        subcategoryDropZone.innerHTML = '<span>拖放或添加子分类</span>';

        subcategoryDropZone.addEventListener('click', () => {
            addSubcategory(category);
        });

        categoryNode.appendChild(subcategoryContainer);
        categoryNode.appendChild(subcategoryDropZone);
        treeElement.appendChild(categoryNode);
    }

    // 添加分类拖放区域
    const categoryDropZone = document.createElement('div');
    categoryDropZone.className = 'drop-zone category-drop-zone';
    categoryDropZone.innerHTML = '<span>拖放或添加分类</span>';

    categoryDropZone.addEventListener('click', () => {
        addCategory();
    });

    treeElement.appendChild(categoryDropZone);
    customTreeContainer.appendChild(treeElement);
}

// 绑定事件
function bindEvents() {
    // 添加分类按钮
    document.getElementById('add-category-btn').addEventListener('click', addCategory);

    // 添加工具按钮
    document.getElementById('add-tool-btn').addEventListener('click', addTool);

    // 导出数据按钮
    document.getElementById('export-data-btn').addEventListener('click', exportData);

    // 导入数据按钮
    document.getElementById('import-data-btn').addEventListener('click', importData);
}

// 添加分类
function addCategory() {
    const categoryName = prompt('请输入分类名称:');
    if (!categoryName || categoryName.trim() === '') return;

    chrome.storage.local.get('tree').then(async (result) => {
        const tree = result.tree || {};

        // 检查分类是否已存在
        if (tree[categoryName]) {
            alert('分类已存在!');
            return;
        }

        // 添加新分类
        tree[categoryName] = {};
        await chrome.storage.local.set({ tree });

        // 重新渲染树
        renderCustomToolTree();
    });
}

// 添加子分类
function addSubcategory(category) {
    const subcategoryName = prompt('请输入子分类名称:');
    if (!subcategoryName || subcategoryName.trim() === '') return;

    chrome.storage.local.get('tree').then(async (result) => {
        const tree = result.tree || {};

        // 检查分类是否存在
        if (!tree[category]) {
            alert('分类不存在!');
            return;
        }

        // 检查子分类是否已存在
        if (tree[category][subcategoryName]) {
            alert('子分类已存在!');
            return;
        }

        // 添加新子分类
        tree[category][subcategoryName] = [];
        await chrome.storage.local.set({ tree });

        // 重新渲染树
        renderCustomToolTree();
    });
}

// 添加工具
function addTool() {
    const toolName = prompt('请输入工具名称:');
    if (!toolName || toolName.trim() === '') return;

    const toolUrl = prompt('请输入工具URL:');
    if (!toolUrl || toolUrl.trim() === '') return;

    // 获取所有分类和子分类
    chrome.storage.local.get('tree').then(async (result) => {
        const tree = result.tree || {};
        let categories = Object.keys(tree);

        // 创建分类选择菜单
        let categorySelectHtml = '<select id="category-select">';
        categories.forEach(category => {
            categorySelectHtml += `<option value="${category}">${category}</option>`;

            // 添加子分类
            const subcategories = Object.keys(tree[category]);
            subcategories.forEach(subcategory => {
                categorySelectHtml += `<option value="${category}|${subcategory}">${category} > ${subcategory}</option>`;
            });
        });
        categorySelectHtml += '</select>';

        // 显示选择对话框
        const result = confirm(`请选择工具分类:\n${categorySelectHtml}\n\n(注: 此对话框显示可能不正常，请记住您要选择的分类和子分类，在确认后输入。)`);

        if (result) {
            const categoryInput = prompt('请输入分类名称:');
            if (!categoryInput || categoryInput.trim() === '') return;

            const subcategoryInput = prompt('请输入子分类名称:');
            if (!subcategoryInput || subcategoryInput.trim() === '') return;

            // 检查分类和子分类是否存在
            if (!tree[categoryInput]) {
                // 创建新分类
                tree[categoryInput] = {};
            }

            if (!tree[categoryInput][subcategoryInput]) {
                // 创建新子分类
                tree[categoryInput][subcategoryInput] = [];
            }

            // 检查工具是否已存在
            const toolExists = tree[categoryInput][subcategoryInput].some(tool => tool.name === toolName);
            if (toolExists) {
                alert('工具已存在!');
                return;
            }

            // 添加新工具
            // 根据子分类名称设置颜色
            const color = subcategoryInput === '国内可用' ? 'green' : (subcategoryInput === '国际工具' ? 'red' : '#6b7280');
            tree[categoryInput][subcategoryInput].push({
                name: toolName,
                url: toolUrl,
                status: 'ok',
                lastCheck: Date.now(),
                color: color
            });

            await chrome.storage.local.set({ tree });

            // 重新渲染树
            renderCustomToolTree();
        }
    });
}

// 编辑工具
function editTool(category, subcategory, tool) {
    const newName = prompt('编辑工具名称:', tool.name);
    if (newName === null) return; // 用户取消

    const newUrl = prompt('编辑工具URL:', tool.url);
    if (newUrl === null) return; // 用户取消

    chrome.storage.local.get('tree').then(async (result) => {
        const tree = result.tree || {};

        // 检查分类和子分类是否存在
        if (!tree[category] || !tree[category][subcategory]) {
            alert('分类或子分类不存在!');
            return;
        }

        // 查找并更新工具
        const toolIndex = tree[category][subcategory].findIndex(t => t.name === tool.name);
        if (toolIndex === -1) {
            alert('未找到工具!');
            return;
        }

        tree[category][subcategory][toolIndex].name = newName;
        tree[category][subcategory][toolIndex].url = newUrl;

        await chrome.storage.local.set({ tree });

        // 重新渲染树
        renderCustomToolTree();
    });
}

// 删除工具
function deleteTool(category, subcategory, toolName) {
    if (!confirm(`确定要删除工具 "${toolName}" 吗？`)) return;

    chrome.storage.local.get('tree').then(async (result) => {
        const tree = result.tree || {};

        // 检查分类和子分类是否存在
        if (!tree[category] || !tree[category][subcategory]) {
            alert('分类或子分类不存在!');
            return;
        }

        // 过滤掉要删除的工具
        tree[category][subcategory] = tree[category][subcategory].filter(tool => tool.name !== toolName);
        
        // 如果子分类为空，可以选择删除它
        if (tree[category][subcategory].length === 0) {
            if (confirm(`子分类 "${subcategory}" 已为空，是否删除？`)) {
                delete tree[category][subcategory];
            }
        }

        await chrome.storage.local.set({ tree });

        // 重新渲染树
        renderCustomToolTree();
    });
}