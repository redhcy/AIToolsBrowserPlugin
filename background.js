// 健康检测 - 每24小时检查一次URL状态
chrome.alarms.create('healthCheck', { delayInMinutes: 0, periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'healthCheck') {
        await checkUrlsHealth();
    }
});

// 检查URL健康状态
async function checkUrlsHealth() {
    console.log('开始URL健康检测...');
    const { tree } = await chrome.storage.local.get('tree');

    if (!tree) return;

    // 重试配置
    const maxRetries = 2;
    const retryDelay = 1000; // 1秒

    for (const [category, subcategories] of Object.entries(tree)) {
        for (const [subcategory, tools] of Object.entries(subcategories)) {
            for (const tool of tools) {
                let isHealthy = false;
                let retryCount = 0;
                
                // 特殊处理某些可能需要GET请求的URL或有CORS限制的URL
                const corsRestrictedSites = ['tradingview.com', 'leonardo.ai', 'xueqiu.com', 'xfyun.cn', 'baidu.com'];
                const useGetMethod = corsRestrictedSites.some(site => tool.url.includes(site));
                
                // 重试机制
                while (!isHealthy && retryCount < maxRetries) {
                    try {
                        // 对于特殊URL使用GET请求，其他使用HEAD请求
                        const response = await fetch(tool.url, {
                            method: useGetMethod ? 'GET' : 'HEAD',
                            mode: 'no-cors',
                            timeout: 12000, // 增加超时时间到12秒
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                                'Accept': '*/*',
                                'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
                                'Cache-Control': 'no-cache'
                            }
                        });

                        // 由于使用no-cors模式，我们无法获取真实的状态码
                        // 但如果请求成功完成，我们假设状态是ok
                        tool.status = 'ok';
                        isHealthy = true;
                        console.log(`URL检测成功: ${tool.url}`);
                    } catch (error) {
                        retryCount++;
                        
                        // 对常见的CORS限制网站做特殊处理
                        const isCorsRestrictedSite = corsRestrictedSites.some(site => tool.url.includes(site));
                        if (isCorsRestrictedSite && error.message.includes('Failed to fetch')) {
                            console.warn(`${tool.name} 检测失败（第${retryCount}次）：可能是 CORS 限制或网络问题`); 
                            // 对这些网站，在最后一次重试时不标记为错误，而是保持警告状态
                            if (retryCount === maxRetries) {
                                // 如果之前没有状态或状态是 ok，设置为警告
                                if (!tool.status || tool.status === 'ok') {
                                    tool.status = 'warning'; // 警告状态而不是错误
                                }
                            }
                        } else {
                            console.warn(`检测URL失败 (第${retryCount}次): ${tool.url}`, error.message);
                            
                            // 如果是最后一次重试，则标记为错误
                            if (retryCount === maxRetries) {
                                // 对于 "Failed to fetch" 错误，可能是CORS限制，使用警告状态
                                if (error.message.includes('Failed to fetch')) {
                                    tool.status = 'warning';
                                    console.warn(`URL检测警告: ${tool.url} - 可能是CORS限制，但服务可能仍然可用`);
                                } else {
                                    tool.status = 'error';
                                    console.error(`URL检测最终失败: ${tool.url}`, error);
                                }
                            }
                        }
                        
                        // 如果不是最后一次重试，等待一段时间后重试
                        if (retryCount < maxRetries) {
                            await new Promise(resolve => setTimeout(resolve, retryDelay));
                        }
                    }
                }
                
                tool.lastCheck = Date.now();
            }

            // 过滤掉连续3天失败的工具（但保留警告状态的工具）
            tree[category][subcategory] = tools.filter(tool => {
                // 如果状态正常或为警告，保留
                if (tool.status === 'ok' || tool.status === 'warning') return true;

                // 如果状态异常，检查最后一次成功检查的时间
                // 如果最后一次成功检查时间在3天内，保留
                const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
                return tool.lastCheck > threeDaysAgo;
            });
        }
    }

    // 保存更新后的树结构
    await chrome.storage.local.set({ tree });
    console.log('URL健康检测完成');
}

// 初始化
async function initialize() {
    // 首次运行时检查URL健康
    await checkUrlsHealth();
}

// 启动初始化
initialize();

// 监听来自content脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 处理消息
    if (request.action === 'ping') {
        sendResponse({ status: 'pong' });
    }
    
    // 立即检查URL健康状态
    else if (request.action === 'checkUrlsNow') {
        checkUrlsHealth().then(() => {
            sendResponse({ status: 'completed' });
        }).catch(error => {
            console.error('检查URL健康状态时出错:', error);
            sendResponse({ status: 'error', message: error.message });
        });
        
        // 保持消息通道开放，以便异步响应
        return true;
    }

    // 保持消息通道开放，以便异步响应
    return true;
});

// 监听标签页创建事件
chrome.tabs.onCreated.addListener((tab) => {
    // 可以在这里添加逻辑
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 可以在这里添加逻辑
});