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
                
                // 特殊处理某些可能需要GET请求的URL
                const useGetMethod = tool.url.includes('tradingview.com');
                
                // 重试机制
                while (!isHealthy && retryCount < maxRetries) {
                    try {
                        // 对于特殊URL使用GET请求，其他使用HEAD请求
                        const response = await fetch(tool.url, {
                            method: useGetMethod ? 'GET' : 'HEAD',
                            mode: 'no-cors',
                            timeout: 8000, // 增加超时时间到8秒
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
                            }
                        });

                        // 由于使用no-cors模式，我们无法获取真实的状态码
                        // 但如果请求成功完成，我们假设状态是ok
                        tool.status = 'ok';
                        isHealthy = true;
                        console.log(`URL检测成功: ${tool.url}`);
                    } catch (error) {
                        retryCount++;
                        console.warn(`检测URL失败 (第${retryCount}次): ${tool.url}`, error.message);
                        
                        // 如果是最后一次重试，则标记为错误
                        if (retryCount === maxRetries) {
                            tool.status = 'error';
                            console.error(`URL检测最终失败: ${tool.url}`, error);
                        } else {
                            // 等待一段时间后重试
                            await new Promise(resolve => setTimeout(resolve, retryDelay));
                        }
                    }
                }
                
                tool.lastCheck = Date.now();
            }

            // 过滤掉连续3次失败的工具
            tree[category][subcategory] = tools.filter(tool => {
                // 如果状态正常，保留
                if (tool.status === 'ok') return true;

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

// 新闻轮播 - 每30分钟更新一次
chrome.alarms.create('newsUpdate', { delayInMinutes: 0, periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'newsUpdate') {
        await updateNews();
    }
});

// 更新新闻
async function updateNews() {
    console.log('开始更新新闻...');
    
    // 备选新闻源列表 - 优先使用国内新闻源
    const newsSources = [
        {
            url: 'https://news.baidu.com/rss',
            name: '百度新闻'
        },
        {
            url: 'https://rss.sina.com.cn/news/china/focus15.xml',
            name: '新浪新闻'
        },
        {
            url: 'https://rss.qq.com/news/nationalnews/rss_news_index.xml',
            name: '腾讯新闻'
        },
        {
            url: 'https://news.163.com/special/00012200/rss_newsattitude.xml',
            name: '网易新闻'
        },
        {
            url: 'https://news.google.com/rss?hl=zh-CN&gl=CN&ceid=CN:zh-Hans',
            name: 'Google News (中文站)'
        },
        {
            url: 'https://rss.cnn.com/rss/edition.rss',
            name: 'CNN (国际新闻)'
        }
    ];

    // 默认新闻数据（当所有源都失败时使用） - 国内热点新闻
    const defaultNews = [
        {
            title: '国内科技创新能力持续提升',
            link: '#',
            description: '近年来，我国在人工智能、航天技术、量子计算等领域取得突破性进展，科技创新能力显著提升。',
            pubDate: new Date().toISOString()
        },
        {
            title: '数字经济蓬勃发展',
            link: '#',
            description: '数字经济已成为我国经济增长的重要引擎，5G、大数据、云计算等新兴技术应用不断深化。',
            pubDate: new Date(Date.now() - 3600000).toISOString()
        },
        {
            title: '乡村振兴战略稳步推进',
            link: '#',
            description: '我国乡村振兴战略全面实施，农村基础设施不断完善，农民收入持续增长，乡村面貌焕然一新。',
            pubDate: new Date(Date.now() - 7200000).toISOString()
        },
        {
            title: '生态文明建设成效显著',
            link: '#',
            description: '我国生态文明建设取得重大进展，生态环境持续改善，绿色发展理念深入人心。',
            pubDate: new Date(Date.now() - 10800000).toISOString()
        },
        {
            title: '教育改革不断深化',
            link: '#',
            description: '我国教育改革持续推进，素质教育全面实施，高等教育质量不断提升，为国家发展培养了大批人才。',
            pubDate: new Date(Date.now() - 14400000).toISOString()
        }
    ];

    try {
        // 尝试从备选源中获取新闻
        let newsItems = [];
        
        // 尝试从备选源中获取新闻，设置重试次数
        const maxRetries = 2;
        let retryCount = 0;
        let currentSourceIndex = 0;
        
        while (newsItems.length === 0 && retryCount < maxRetries && currentSourceIndex < newsSources.length) {
            const source = newsSources[currentSourceIndex];
            
            try {
                console.log(`尝试从${source.name}获取新闻 (第${retryCount + 1}次尝试)...`);
                const response = await fetch(source.url, {
                    method: 'GET',
                    mode: 'cors',
                    timeout: 10000
                });

                if (response.ok) {
                    // 检查响应头，确保是XML格式
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('xml')) {
                        const text = await response.text();
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(text, 'text/xml');

                        // 检查解析是否成功
                        if (xmlDoc.documentElement.nodeName !== 'parsererror') {
                            const items = xmlDoc.querySelectorAll('item, entry');
                            if (items.length > 0) {
                                newsItems = Array.from(items).slice(0, 5).map(item => ({
                                    title: item.querySelector('title')?.textContent || '无标题',
                                    link: item.querySelector('link')?.textContent || item.querySelector('link')?.getAttribute('href') || '#',
                                    description: item.querySelector('description')?.textContent || item.querySelector('content')?.textContent || '',
                                    pubDate: item.querySelector('pubDate')?.textContent || item.querySelector('published')?.textContent || new Date().toISOString()
                                }));
                                
                                console.log(`从${source.name}获取新闻成功，共${newsItems.length}条`);
                                break; // 成功获取后退出循环
                            } else {
                                console.warn(`从${source.name}获取的XML中没有找到新闻条目`);
                            }
                        } else {
                            console.warn(`解析${source.name}的XML失败`);
                        }
                    } else {
                        console.warn(`${source.name}返回的不是XML格式数据`);
                    }
                } else {
                    console.warn(`${source.name}返回非成功状态码: ${response.status}`);
                }
            } catch (error) {
                console.warn(`从${source.name}获取新闻失败:`, error.message);
                // 继续尝试
            }

            // 准备下一次尝试
            currentSourceIndex++;
            if (currentSourceIndex >= newsSources.length) {
                retryCount++;
                currentSourceIndex = 0;
                if (retryCount < maxRetries) {
                    console.log(`所有源尝试失败，等待1秒后重试第${retryCount + 1}次...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // 如果所有源都失败，使用默认新闻数据
        if (newsItems.length === 0) {
            console.warn('所有新闻源都获取失败，使用默认新闻数据');
            newsItems = defaultNews;
        }

        await chrome.storage.local.set({ news: newsItems });
        console.log('新闻更新完成');
    } catch (error) {
        console.error('更新新闻时发生错误:', error);
        // 出现异常时，也使用默认新闻数据
        await chrome.storage.local.set({ news: defaultNews });
        console.log('使用默认新闻数据');
    }
}

// 初始化
async function initialize() {
    // 首次运行时检查URL健康
    await checkUrlsHealth();

    // 首次运行时更新新闻
    await updateNews();
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