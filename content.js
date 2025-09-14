// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'injectPrompt') {
        injectPrompt(request.prompt);
        sendResponse({ status: 'success' });
    }
});

// 注入Prompt到当前页面的输入框
function injectPrompt(prompt) {
    // 尝试查找常见的AI工具输入框
    const inputElements = [
        'textarea',
        'input[type="text"]',
        'div[contenteditable="true"]',
        '#prompt-input',
        '.prompt-textarea',
        '#user-input',
        '.user-input',
        '#chat-input',
        '.chat-textarea'
    ];

    let found = false;

    for (const selector of inputElements) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            // 优先选择可见的、用户可能正在使用的输入框
            const visibleElements = Array.from(elements).filter(el => {
                return el.offsetWidth > 0 && el.offsetHeight > 0;
            });

            if (visibleElements.length > 0) {
                const inputElement = visibleElements[0];
                fillInput(inputElement, prompt);
                found = true;
                break;
            } else if (elements.length > 0) {
                const inputElement = elements[0];
                fillInput(inputElement, prompt);
                found = true;
                break;
            }
        }
    }

    // 如果没有找到常见的输入框，尝试查找页面上的所有可编辑元素
    if (!found) {
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        if (editableElements.length > 0) {
            const inputElement = editableElements[0];
            fillInput(inputElement, prompt);
            found = true;
        }
    }

    // 如果还是没有找到，通知用户
    if (!found) {
        alert('未找到可注入的输入框，请手动复制Prompt: \n' + prompt);
    }
}

// 填充输入框
function fillInput(element, text) {
    // 不同类型的元素需要不同的处理方式
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        element.value = text;
        // 触发输入事件，确保AI工具能够检测到输入变化
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
    } else if (element.isContentEditable) {
        element.textContent = text;
        // 触发输入事件
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
    }

    // 聚焦到输入框
    element.focus();

    // 滚动到输入框
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 注册快捷键 Alt+P 触发最后使用的Prompt
let lastUsedPrompt = '';

document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'p' && lastUsedPrompt) {
        e.preventDefault();
        injectPrompt(lastUsedPrompt);
    }
});

// 监听存储变化，更新最后使用的Prompt
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.lastUsedPrompt) {
        lastUsedPrompt = changes.lastUsedPrompt.newValue;
    }
});

// 初始化时获取最后使用的Prompt
chrome.storage.local.get('lastUsedPrompt').then(result => {
    if (result.lastUsedPrompt) {
        lastUsedPrompt = result.lastUsedPrompt;
    }
});