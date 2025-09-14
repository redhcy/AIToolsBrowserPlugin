// 测试URL健康检查功能
console.log('开始测试URL健康检查...');

// 发送消息给background script，触发立即检查URL健康
chrome.runtime.sendMessage({ action: 'checkUrlsNow' }, (response) => {
    console.log('URL检查响应:', response);
    
    // 检查完成后，获取并显示工具数据
    setTimeout(() => {
        chrome.storage.local.get('tree', (result) => {
            console.log('工具树数据:', result.tree);
            
            // 查找TradingView AI工具
            const tradingViewTool = findToolByName(result.tree, 'TradingView AI');
            if (tradingViewTool) {
                console.log('TradingView AI 状态:', tradingViewTool.status);
            } else {
                console.log('未找到TradingView AI工具');
            }
        });
    }, 3000); // 等待3秒让检查完成
});

// 辅助函数：在工具树中查找指定名称的工具
function findToolByName(tree, toolName) {
    for (const category of Object.values(tree)) {
        for (const subcategory of Object.values(category)) {
            for (const tool of subcategory) {
                if (tool.name === toolName) {
                    return tool;
                }
            }
        }
    }
    return null;
}