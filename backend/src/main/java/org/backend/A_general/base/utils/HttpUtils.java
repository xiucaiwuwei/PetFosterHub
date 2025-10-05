package org.backend.A_general.base.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * HTTP工具类
 * 提供HTTP请求和响应处理的通用方法
 */
public class HttpUtils {

    private static final Logger logger = LoggerFactory.getLogger(HttpUtils.class);
    private static final int DEFAULT_CONNECT_TIMEOUT = 5000;
    private static final int DEFAULT_READ_TIMEOUT = 10000;

    /**
     * 获取客户端真实IP地址
     *
     * @param request HTTP请求对象
     * @return 客户端真实IP地址
     */
    public static String getClientIp(HttpServletRequest request) {
        if (request == null) {
            return "unknown";
        }
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 多级代理的情况，第一个IP为客户端真实IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        // 对于IPv6地址，去除可能的主机名部分
        if (ip != null && ip.contains("%")) {
            ip = ip.split("%")[0];
        }
        return ip;
    }

    /**
     * 获取HTTP请求的完整URL
     *
     * @param request HTTP请求对象
     * @return 完整的URL
     */
    public static String getFullUrl(HttpServletRequest request) {
        if (request == null) {
            return "";
        }
        StringBuilder url = new StringBuilder();
        url.append(request.getScheme()).append("://");
        url.append(request.getServerName()).append(":").append(request.getServerPort());
        url.append(request.getContextPath()).append(request.getServletPath());
        if (request.getQueryString() != null) {
            url.append("?").append(request.getQueryString());
        }
        return url.toString();
    }

    /**
     * 获取HTTP请求的请求体内容
     *
     * @param request HTTP请求对象
     * @return 请求体内容
     */
    public static String getRequestBody(HttpServletRequest request) {
        if (request == null) {
            return "";
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream(), StandardCharsets.UTF_8))) {
            return reader.lines().collect(Collectors.joining(System.lineSeparator()));
        } catch (IOException e) {
            logger.error("获取请求体失败: {}", e.getMessage());
            return "";
        }
    }

    /**
     * 发送GET请求
     *
     * @param url 请求URL
     * @return 响应结果
     */
    public static String doGet(String url) {
        return doGet(url, new HashMap<>(), new HashMap<>());
    }

    /**
     * 发送GET请求
     *
     * @param url 请求URL
     * @param params 请求参数
     * @return 响应结果
     */
    public static String doGet(String url, Map<String, String> params) {
        return doGet(url, params, new HashMap<>());
    }

    /**
     * 发送GET请求
     *
     * @param url 请求URL
     * @param params 请求参数
     * @param headers 请求头
     * @return 响应结果
     */
    public static String doGet(String url, Map<String, String> params, Map<String, String> headers) {
        try {
            URL requestUrl = buildUrlWithParams(url, params);
            HttpURLConnection connection = (HttpURLConnection) requestUrl.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(DEFAULT_CONNECT_TIMEOUT);
            connection.setReadTimeout(DEFAULT_READ_TIMEOUT);
            setHeaders(connection, headers);
            return getResponse(connection);
        } catch (Exception e) {
            logger.error("发送GET请求失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 发送POST请求
     *
     * @param url 请求URL
     * @param data 请求数据
     * @return 响应结果
     */
    public static String doPost(String url, String data) {
        return doPost(url, data, new HashMap<>());
    }

    /**
     * 发送POST请求
     *
     * @param url 请求URL
     * @param data 请求数据
     * @param headers 请求头
     * @return 响应结果
     */
    public static String doPost(String url, String data, Map<String, String> headers) {
        try {
            URL requestUrl = URI.create(url).toURL();
            HttpURLConnection connection = (HttpURLConnection) requestUrl.openConnection();
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(DEFAULT_CONNECT_TIMEOUT);
            connection.setReadTimeout(DEFAULT_READ_TIMEOUT);
            connection.setDoOutput(true);
            setHeaders(connection, headers);
            writeData(connection, data);
            return getResponse(connection);
        } catch (Exception e) {
            logger.error("发送POST请求失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 发送POST表单请求
     *
     * @param url 请求URL
     * @param params 表单参数
     * @return 响应结果
     */
    public static String doPostForm(String url, Map<String, String> params) {
        return doPostForm(url, params, new HashMap<>());
    }

    /**
     * 发送POST表单请求
     *
     * @param url 请求URL
     * @param params 表单参数
     * @param headers 请求头
     * @return 响应结果
     */
    public static String doPostForm(String url, Map<String, String> params, Map<String, String> headers) {
        try {
            Map<String, String> newHeaders = new HashMap<>(headers);
            newHeaders.putIfAbsent("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            String formData = buildFormData(params);
            return doPost(url, formData, newHeaders);
        } catch (Exception e) {
            logger.error("发送POST表单请求失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 发送JSON格式的POST请求
     *
     * @param url 请求URL
     * @param json JSON数据
     * @return 响应结果
     */
    public static String doPostJson(String url, String json) {
        return doPostJson(url, json, new HashMap<>());
    }

    /**
     * 发送JSON格式的POST请求
     *
     * @param url 请求URL
     * @param json JSON数据
     * @param headers 请求头
     * @return 响应结果
     */
    public static String doPostJson(String url, String json, Map<String, String> headers) {
        try {
            Map<String, String> newHeaders = new HashMap<>(headers);
            newHeaders.putIfAbsent("Content-Type", "application/json; charset=UTF-8");
            return doPost(url, json, newHeaders);
        } catch (Exception e) {
            logger.error("发送POST JSON请求失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 构建带参数的URL
     *
     * @param url 基础URL
     * @param params 参数映射
     * @return 构建后的URL对象
     * @throws MalformedURLException URL格式错误
     */
    public static URL buildUrlWithParams(String url, Map<String, String> params) throws MalformedURLException {
        if (params == null || params.isEmpty()) {
            return URI.create(url).toURL();
        }
        StringBuilder urlBuilder = new StringBuilder(url);
        boolean hasQuery = url.contains("?");
        for (Map.Entry<String, String> entry : params.entrySet()) {
            urlBuilder.append(hasQuery ? "&" : "?");
            urlBuilder.append(encode(entry.getKey())).append("=").append(encode(entry.getValue()));
            hasQuery = true;
        }
        return URI.create(urlBuilder.toString()).toURL();
    }

    /**
     * 构建表单数据字符串
     *
     * @param params 表单参数
     * @return 表单数据字符串
     */
    public static String buildFormData(Map<String, String> params) {
        if (params == null || params.isEmpty()) {
            return "";
        }
        StringBuilder formData = new StringBuilder();
        boolean first = true;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (!first) {
                formData.append("&");
            }
            formData.append(encode(entry.getKey())).append("=").append(encode(entry.getValue()));
            first = false;
        }
        return formData.toString();
    }

    /**
     * 设置HTTP请求头
     *
     * @param connection HTTP连接对象
     * @param headers 请求头映射
     */
    public static void setHeaders(HttpURLConnection connection, Map<String, String> headers) {
        if (headers != null && !headers.isEmpty()) {
            for (Map.Entry<String, String> entry : headers.entrySet()) {
                connection.setRequestProperty(entry.getKey(), entry.getValue());
            }
        }
    }

    /**
     * 向HTTP连接写入数据
     *
     * @param connection HTTP连接对象
     * @param data 要写入的数据
     * @throws IOException IO异常
     */
    public static void writeData(HttpURLConnection connection, String data) throws IOException {
        if (data != null && !data.isEmpty()) {
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = data.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }
        }
    }

    /**
     * 获取HTTP响应内容
     *
     * @param connection HTTP连接对象
     * @return 响应内容
     * @throws IOException IO异常
     */
    public static String getResponse(HttpURLConnection connection) throws IOException {
        int responseCode = connection.getResponseCode();
        try (BufferedReader in = new BufferedReader(
                new InputStreamReader(responseCode >= 400 ? connection.getErrorStream() : connection.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            return response.toString();
        }
    }

    /**
     * URL编码
     *
     * @param value 要编码的值
     * @return 编码后的字符串
     */
    public static String encode(String value) {
        if (value == null) {
            return "";
        }
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    /**
     * URL解码
     *
     * @param value 要解码的值
     * @return 解码后的字符串
     */
    public static String decode(String value) {
        if (value == null) {
            return "";
        }
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    /**
     * 下载文件
     *
     * @param url 文件URL
     * @param savePath 保存路径
     * @return 是否下载成功
     */
    public static boolean downloadFile(String url, String savePath) {
        try (InputStream in = URI.create(url).toURL().openStream();
             OutputStream out = new FileOutputStream(savePath)) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
            return true;
        } catch (Exception e) {
            logger.error("下载文件失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 向HTTP响应写入文件
     *
     * @param response HTTP响应对象
     * @param filePath 文件路径
     * @param fileName 文件名
     * @return 是否写入成功
     */
    public static boolean writeFileToResponse(HttpServletResponse response, String filePath, String fileName) {
        File file = new File(filePath);
        if (!file.exists() || !file.isFile()) {
            logger.error("文件不存在: {}", filePath);
            return false;
        }
        try {
            response.setContentType(getContentType(fileName));
            response.setHeader("Content-Disposition", "attachment; filename=\"" + encodeFileName(fileName) + "\"");
            response.setContentLengthLong(file.length());
            try (InputStream in = new FileInputStream(file);
                 OutputStream out = response.getOutputStream()) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
                out.flush();
            }
            return true;
        } catch (Exception e) {
            logger.error("向响应写入文件失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 获取文件的MIME类型
     *
     * @param fileName 文件名
     * @return MIME类型
     */
    public static String getContentType(String fileName) {
        if (fileName == null) {
            return "application/octet-stream";
        }
        String extension = getFileExtension(fileName).toLowerCase();
        Map<String, String> contentTypeMap = new HashMap<>();
        contentTypeMap.put("txt", "text/plain");
        contentTypeMap.put("pdf", "application/pdf");
        contentTypeMap.put("doc", "application/msword");
        contentTypeMap.put("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        contentTypeMap.put("xls", "application/vnd.ms-excel");
        contentTypeMap.put("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        contentTypeMap.put("ppt", "application/vnd.ms-powerpoint");
        contentTypeMap.put("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
        contentTypeMap.put("jpg", "image/jpeg");
        contentTypeMap.put("jpeg", "image/jpeg");
        contentTypeMap.put("png", "image/png");
        contentTypeMap.put("gif", "image/gif");
        contentTypeMap.put("bmp", "image/bmp");
        contentTypeMap.put("svg", "image/svg+xml");
        contentTypeMap.put("mp3", "audio/mpeg");
        contentTypeMap.put("wav", "audio/wav");
        contentTypeMap.put("mp4", "video/mp4");
        contentTypeMap.put("avi", "video/x-msvideo");
        contentTypeMap.put("zip", "application/zip");
        contentTypeMap.put("rar", "application/x-rar-compressed");
        contentTypeMap.put("7z", "application/x-7z-compressed");
        contentTypeMap.put("html", "text/html");
        contentTypeMap.put("htm", "text/html");
        contentTypeMap.put("css", "text/css");
        contentTypeMap.put("js", "application/javascript");
        contentTypeMap.put("json", "application/json");
        contentTypeMap.put("xml", "application/xml");
        return contentTypeMap.getOrDefault(extension, "application/octet-stream");
    }

    /**
     * 获取文件扩展名
     *
     * @param fileName 文件名
     * @return 文件扩展名（不含点号）
     */
    public static String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

    /**
     * 编码文件名（解决中文文件名下载问题）
     *
     * @param fileName 原始文件名
     * @return 编码后的文件名
     */
    public static String encodeFileName(String fileName) {
        if (fileName == null) {
            return "";
        }
        return URLEncoder.encode(fileName, StandardCharsets.UTF_8)
                .replace("+", "%")
                .replace("%3B", ";")
                .replace("%2C", ",")
                .replace("%2F", "/")
                .replace("%3F", "?")
                .replace("%3A", ":")
                .replace("%40", "@")
                .replace("%26", "&")
                .replace("%3D", "=")
                .replace("%2B", "+")
                .replace("%24", "$")
                .replace("%23", "#");
    }

    /**
     * 检查HTTP请求是否为AJAX请求
     *
     * @param request HTTP请求对象
     * @return 是否为AJAX请求
     */
    public static boolean isAjaxRequest(HttpServletRequest request) {
        if (request == null) {
            return false;
        }
        String xRequestedWith = request.getHeader("X-Requested-With");
        return "XMLHttpRequest".equals(xRequestedWith);
    }

    /**
     * 检查HTTP请求是否为GET请求
     *
     * @param request HTTP请求对象
     * @return 是否为GET请求
     */
    public static boolean isGetRequest(HttpServletRequest request) {
        if (request == null) {
            return false;
        }
        return "GET".equalsIgnoreCase(request.getMethod());
    }

    /**
     * 检查HTTP请求是否为POST请求
     *
     * @param request HTTP请求对象
     * @return 是否为POST请求
     */
    public static boolean isPostRequest(HttpServletRequest request) {
        if (request == null) {
            return false;
        }
        return "POST".equalsIgnoreCase(request.getMethod());
    }

    /**
     * 检查HTTP请求是否为HTTPS请求
     *
     * @param request HTTP请求对象
     * @return 是否为HTTPS请求
     */
    public static boolean isHttpsRequest(HttpServletRequest request) {
        if (request == null) {
            return false;
        }
        return "https".equalsIgnoreCase(request.getScheme());
    }

    /**
     * 获取请求头中的用户代理信息
     *
     * @param request HTTP请求对象
     * @return 用户代理信息
     */
    public static String getUserAgent(HttpServletRequest request) {
        if (request == null) {
            return "";
        }
        return request.getHeader("User-Agent");
    }

    /**
     * 判断是否为移动设备请求
     *
     * @param request HTTP请求对象
     * @return 是否为移动设备请求
     */
    public static boolean isMobileRequest(HttpServletRequest request) {
        String userAgent = getUserAgent(request);
        if (userAgent == null || userAgent.isEmpty()) {
            return false;
        }
        userAgent = userAgent.toLowerCase();
        // 常见移动设备关键词
        String[] mobileKeywords = {
                "android", "webos", "iphone", "ipad", "ipod", "blackberry", "windows phone",
                "mobile", "phone", "mobi", "tablet", "kindle"
        };
        for (String keyword : mobileKeywords) {
            if (userAgent.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 设置响应头，防止浏览器缓存
     *
     * @param response HTTP响应对象
     */
    public static void setNoCacheHeaders(HttpServletResponse response) {
        if (response == null) {
            return;
        }
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
    }
}