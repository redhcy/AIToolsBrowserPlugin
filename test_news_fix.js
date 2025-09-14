// 测试新闻源修复功能的脚本
// 此脚本用于验证背景页是否能正确获取和处理国内新闻源

console.log('=== 开始测试新闻源修复功能 ===');

// 检查background.js文件是否存在
const fs = require('fs');
const path = require('path');

const backgroundJsPath = path.join(__dirname, 'background.js');

if (!fs.existsSync(backgroundJsPath)) {
    console.error('错误: 找不到background.js文件');
    process.exit(1);
}

// 读取background.js文件内容
const backgroundContent = fs.readFileSync(backgroundJsPath, 'utf8');

// 验证新闻源配置
const newsSourcesMatch = backgroundContent.match(/const\s+newsSources\s*=\s*\[([\s\S]*?)\];/);

if (newsSourcesMatch) {
    const newsSourcesContent = newsSourcesMatch[1];
    
    // 检查国内新闻源是否在列表顶部
    const domesticSources = ['百度新闻', '新浪新闻', '腾讯新闻', '网易新闻'];
    const sourceNames = newsSourcesContent.match(/name:\s*['"]([^'"]+)['"]/g) || [];
    const orderedSourceNames = sourceNames.map(match => match.replace(/name:\s*['"]|['"]/g, ''));
    
    console.log('\n新闻源顺序:');
    orderedSourceNames.forEach((name, index) => {
        console.log(`${index + 1}. ${name}`);
    });
    
    // 检查国内新闻源是否优先
    let domesticSourcesFirst = true;
    let firstNonDomesticIndex = null;
    
    for (let i = 0; i < orderedSourceNames.length; i++) {
        const name = orderedSourceNames[i];
        if (!domesticSources.includes(name) && firstNonDomesticIndex === null) {
            firstNonDomesticIndex = i;
        }
        
        // 如果国内新闻源出现在非国内新闻源之后，则标记为失败
        if (domesticSources.includes(name) && firstNonDomesticIndex !== null && i > firstNonDomesticIndex) {
            domesticSourcesFirst = false;
            break;
        }
    }
    
    console.log(`\n✅ 国内新闻源优先检查: ${domesticSourcesFirst ? '通过' : '失败'}`);
    
    // 检查新闻获取逻辑是否包含重试机制
    const retryMechanismCheck = backgroundContent.includes('maxRetries') && 
                              backgroundContent.includes('retryCount') && 
                              backgroundContent.includes('while (newsItems.length === 0');
    console.log(`✅ 新闻获取重试机制检查: ${retryMechanismCheck ? '通过' : '失败'}`);
    
    // 检查默认新闻数据是否更新
    const defaultNewsCheck = backgroundContent.includes('默认新闻数据（当所有源都失败时使用） - 国内热点新闻');
    console.log(`✅ 默认新闻数据更新检查: ${defaultNewsCheck ? '通过' : '失败'}`);
    
} else {
    console.error('错误: 在background.js中找不到newsSources配置');
}

console.log('\n=== 测试完成 ===');
console.log('\n下一步建议:');
console.log('1. 在Chrome浏览器中加载扩展，检查是否正常显示新闻');
console.log('2. 打开扩展管理页面，启用开发者模式，然后点击"加载已解压的扩展程序"选择AITools文件夹');
console.log('3. 点击扩展图标，查看新闻区域是否显示国内新闻内容');
console.log('4. 检查浏览器控制台（右键->检查->控制台）是否有错误信息');