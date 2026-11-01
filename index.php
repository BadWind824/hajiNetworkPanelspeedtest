<?php
/**
 * NetworkPanel 网络面板 - 宝塔 PHP 部署入口
 *
 * 本站主体为静态资源（Vue 单页应用），由 Nginx/Apache 直接服务。
 * 此入口文件保证站点以 PHP 网站类型创建时首页也能正常访问，
 * 并为整站统一输出安全响应头。
 */
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("Referrer-Policy: no-referrer");
header("Content-Type: text/html; charset=utf-8");

$indexFile = __DIR__ . "/index.html";
if (is_readable($indexFile)) {
    readfile($indexFile);
} else {
    http_response_code(500);
    echo "index.html 缺失，请完整上传部署包内所有文件。";
}
