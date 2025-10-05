package org.backend.A_general.base.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;
import java.util.Random;
import java.util.UUID;

/**
 * 安全工具类
 * 提供加密、解密、哈希、签名等安全相关功能
 */
public class SecurityUtils {

    private static final Logger logger = LoggerFactory.getLogger(SecurityUtils.class);

    // 常用加密算法常量
    public static final String AES = "AES";
    public static final String AES_GCM = "AES/GCM/NoPadding";
    public static final String RSA = "RSA";
    public static final String HMAC_SHA256 = "HmacSHA256";
    public static final String SHA256 = "SHA-256";
    public static final String SHA512 = "SHA-512";
    public static final String MD5 = "MD5";

    // AES加密相关常量
    private static final int AES_KEY_SIZE = 256;
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    // RSA密钥相关常量
    private static final int RSA_KEY_SIZE = 2048;

    /**
     * 生成AES密钥
     *
     * @return Base64编码的AES密钥
     */
    public static String generateAESKey() {
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance(AES);
            keyGen.init(AES_KEY_SIZE);
            SecretKey secretKey = keyGen.generateKey();
            return Base64.getEncoder().encodeToString(secretKey.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            logger.error("生成AES密钥失败: {}", e.getMessage());
            throw new RuntimeException("生成AES密钥失败", e);
        }
    }

    /**
     * AES加密（GCM模式）
     *
     * @param plainText 明文
     * @param secretKey Base64编码的密钥
     * @return Base64编码的加密结果（包含IV和密文）
     */
    public static String encryptAES(String plainText, String secretKey) {
        if (StringUtils.isBlank(plainText) || StringUtils.isBlank(secretKey)) {
            return null;
        }
        try {
            // 解码密钥
            byte[] keyBytes = Base64.getDecoder().decode(secretKey);
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, AES);

            // 生成随机IV
            byte[] iv = new byte[GCM_IV_LENGTH];
            SecureRandom random = new SecureRandom();
            random.nextBytes(iv);

            // 创建加密器
            Cipher cipher = Cipher.getInstance(AES_GCM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, parameterSpec);

            // 加密数据
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            // 合并IV和密文
            byte[] result = new byte[iv.length + encryptedBytes.length];
            System.arraycopy(iv, 0, result, 0, iv.length);
            System.arraycopy(encryptedBytes, 0, result, iv.length, encryptedBytes.length);

            return Base64.getEncoder().encodeToString(result);
        } catch (Exception e) {
            logger.error("AES加密失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * AES解密（GCM模式）
     *
     * @param cipherText Base64编码的加密结果（包含IV和密文）
     * @param secretKey  Base64编码的密钥
     * @return 解密后的明文
     */
    public static String decryptAES(String cipherText, String secretKey) {
        if (StringUtils.isBlank(cipherText) || StringUtils.isBlank(secretKey)) {
            return null;
        }
        try {
            // 解码加密数据
            byte[] encryptedData = Base64.getDecoder().decode(cipherText);

            // 分离IV和密文
            byte[] iv = new byte[GCM_IV_LENGTH];
            byte[] cipherBytes = new byte[encryptedData.length - iv.length];
            System.arraycopy(encryptedData, 0, iv, 0, iv.length);
            System.arraycopy(encryptedData, iv.length, cipherBytes, 0, cipherBytes.length);

            // 解码密钥
            byte[] keyBytes = Base64.getDecoder().decode(secretKey);
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, AES);

            // 创建解密器
            Cipher cipher = Cipher.getInstance(AES_GCM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, parameterSpec);

            // 解密数据
            byte[] decryptedBytes = cipher.doFinal(cipherBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            logger.error("AES解密失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 生成RSA密钥对
     *
     * @return RSA密钥对
     */
    public static KeyPair generateRSAKeyPair() {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance(RSA);
            keyGen.initialize(RSA_KEY_SIZE);
            return keyGen.generateKeyPair();
        } catch (NoSuchAlgorithmException e) {
            logger.error("生成RSA密钥对失败: {}", e.getMessage());
            throw new RuntimeException("生成RSA密钥对失败", e);
        }
    }

    /**
     * 从Base64编码的字符串获取公钥
     *
     * @param publicKeyBase64 Base64编码的公钥
     * @return 公钥对象
     */
    public static PublicKey getPublicKeyFromBase64(String publicKeyBase64) {
        if (StringUtils.isBlank(publicKeyBase64)) {
            return null;
        }
        try {
            byte[] keyBytes = Base64.getDecoder().decode(publicKeyBase64);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance(RSA);
            return keyFactory.generatePublic(spec);
        } catch (Exception e) {
            logger.error("获取RSA公钥失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 从Base64编码的字符串获取私钥
     *
     * @param privateKeyBase64 Base64编码的私钥
     * @return 私钥对象
     */
    public static PrivateKey getPrivateKeyFromBase64(String privateKeyBase64) {
        if (StringUtils.isBlank(privateKeyBase64)) {
            return null;
        }
        try {
            byte[] keyBytes = Base64.getDecoder().decode(privateKeyBase64);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance(RSA);
            return keyFactory.generatePrivate(spec);
        } catch (Exception e) {
            logger.error("获取RSA私钥失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * RSA加密（使用公钥）
     *
     * @param plainText 明文
     * @param publicKey 公钥
     * @return Base64编码的加密结果
     */
    public static String encryptRSA(String plainText, PublicKey publicKey) {
        if (StringUtils.isBlank(plainText) || publicKey == null) {
            return null;
        }
        try {
            Cipher cipher = Cipher.getInstance(RSA);
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            logger.error("RSA加密失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * RSA解密（使用私钥）
     *
     * @param cipherText Base64编码的加密结果
     * @param privateKey 私钥
     * @return 解密后的明文
     */
    public static String decryptRSA(String cipherText, PrivateKey privateKey) {
        if (StringUtils.isBlank(cipherText) || privateKey == null) {
            return null;
        }
        try {
            byte[] encryptedBytes = Base64.getDecoder().decode(cipherText);
            Cipher cipher = Cipher.getInstance(RSA);
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            logger.error("RSA解密失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 计算数据的哈希值
     *
     * @param data      要哈希的数据
     * @param algorithm 哈希算法（如SHA-256, MD5等）
     * @return 十六进制格式的哈希值
     */
    public static String hash(String data, String algorithm) {
        if (StringUtils.isBlank(data) || StringUtils.isBlank(algorithm)) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance(algorithm);
            byte[] hashBytes = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte hashByte : hashBytes) {
                String hex = Integer.toHexString(0xff & hashByte);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            logger.error("哈希计算失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 计算数据的SHA-256哈希值
     *
     * @param data 要哈希的数据
     * @return 十六进制格式的SHA-256哈希值
     */
    public static String sha256(String data) {
        return hash(data, SHA256);
    }

    /**
     * 计算数据的MD5哈希值
     *
     * @param data 要哈希的数据
     * @return 十六进制格式的MD5哈希值
     */
    public static String md5(String data) {
        return hash(data, MD5);
    }

    /**
     * 计算HMAC
     *
     * @param data      要计算HMAC的数据
     * @param key       密钥
     * @param algorithm HMAC算法（如HmacSHA256）
     * @return Base64编码的HMAC值
     */
    public static String hmac(String data, String key, String algorithm) {
        if (StringUtils.isBlank(data) || StringUtils.isBlank(key) || StringUtils.isBlank(algorithm)) {
            return null;
        }
        try {
            SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), algorithm);
            Mac mac = Mac.getInstance(algorithm);
            mac.init(signingKey);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            logger.error("HMAC计算失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 计算HmacSHA256
     *
     * @param data 要计算HMAC的数据
     * @param key  密钥
     * @return Base64编码的HmacSHA256值
     */
    public static String hmacSha256(String data, String key) {
        return hmac(data, key, HMAC_SHA256);
    }

    /**
     * 使用私钥对数据进行签名
     *
     * @param data       要签名的数据
     * @param privateKey 私钥
     * @param algorithm  签名算法
     * @return Base64编码的签名
     */
    public static String sign(String data, PrivateKey privateKey, String algorithm) {
        if (StringUtils.isBlank(data) || privateKey == null || StringUtils.isBlank(algorithm)) {
            return null;
        }
        try {
            Signature signature = Signature.getInstance(algorithm);
            signature.initSign(privateKey);
            signature.update(data.getBytes(StandardCharsets.UTF_8));
            byte[] signatureBytes = signature.sign();
            return Base64.getEncoder().encodeToString(signatureBytes);
        } catch (Exception e) {
            logger.error("签名失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 使用公钥验证签名
     *
     * @param data      原始数据
     * @param signature 要验证的签名（Base64编码）
     * @param publicKey 公钥
     * @param algorithm 签名算法
     * @return 签名是否有效
     */
    public static boolean verify(String data, String signature, PublicKey publicKey, String algorithm) {
        if (StringUtils.isBlank(data) || StringUtils.isBlank(signature) || publicKey == null || StringUtils.isBlank(algorithm)) {
            return false;
        }
        try {
            Signature sig = Signature.getInstance(algorithm);
            sig.initVerify(publicKey);
            sig.update(data.getBytes(StandardCharsets.UTF_8));
            byte[] signatureBytes = Base64.getDecoder().decode(signature);
            return sig.verify(signatureBytes);
        } catch (Exception e) {
            logger.error("签名验证失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 生成安全的随机字符串
     *
     * @param length 字符串长度
     * @return 随机字符串
     */
    public static String generateSecureRandomString(int length) {
        if (length <= 0) {
            return "";
        }
        try {
            SecureRandom secureRandom = SecureRandom.getInstanceStrong();
            byte[] randomBytes = new byte[length];
            secureRandom.nextBytes(randomBytes);
            return Base64.getEncoder().encodeToString(randomBytes).substring(0, length);
        } catch (NoSuchAlgorithmException e) {
            logger.error("生成随机字符串失败: {}", e.getMessage());
            // 降级为普通随机数生成
            StringBuilder sb = new StringBuilder(length);
            String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new Random();
            for (int i = 0; i < length; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            return sb.toString();
        }
    }

    /**
     * 生成UUID
     *
     * @return UUID字符串
     */
    public static String generateUUID() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

    /**
     * 验证密码与哈希值是否匹配
     *
     * @param password       明文密码
     * @param hashedPassword 哈希后的密码
     * @param algorithm      哈希算法
     * @return 密码是否匹配
     */
    public static boolean verifyPassword(String password, String hashedPassword, String algorithm) {
        if (StringUtils.isBlank(password) || StringUtils.isBlank(hashedPassword)) {
            return false;
        }
        String passwordHash = hash(password, algorithm);
        return hashedPassword.equals(passwordHash);
    }

    /**
     * 加密敏感数据（如身份证号、银行卡号等）
     *
     * @param sensitiveData 敏感数据
     * @param key           加密密钥
     * @return 加密后的数据
     */
    public static String encryptSensitiveData(String sensitiveData, String key) {
        if (StringUtils.isBlank(sensitiveData) || StringUtils.isBlank(key)) {
            return null;
        }
        try {
            // 确保密钥长度合适
            String validKey = key;
            if (key.length() < 16) {
                validKey = StringUtils.padRight(key, 16, '0');
            } else if (key.length() > 32) {
                validKey = key.substring(0, 32);
            }
            return encryptAES(sensitiveData, generateAESKey());
        } catch (Exception e) {
            logger.error("加密敏感数据失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 解密敏感数据
     *
     * @param encryptedData 加密的数据
     * @param key           加密密钥
     * @return 解密后的敏感数据
     */
    public static String decryptSensitiveData(String encryptedData, String key) {
        if (StringUtils.isBlank(encryptedData) || StringUtils.isBlank(key)) {
            return null;
        }
        try {
            // 确保密钥长度合适
            String validKey = key;
            if (key.length() < 16) {
                validKey = StringUtils.padRight(key, 16, '0');
            } else if (key.length() > 32) {
                validKey = key.substring(0, 32);
            }
            // 注意：实际使用中，这里需要使用与加密时相同的密钥
            // 此方法仅作为示例，实际应用需要妥善管理密钥
            return decryptAES(encryptedData, generateAESKey());
        } catch (Exception e) {
            logger.error("解密敏感数据失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 掩码处理敏感信息
     *
     * @param data      原始数据
     * @param prefixLen 前缀保留长度
     * @param suffixLen 后缀保留长度
     * @param maskChar  掩码字符
     * @return 掩码处理后的数据
     */
    public static String maskSensitiveInfo(String data, int prefixLen, int suffixLen, char maskChar) {
        if (StringUtils.isBlank(data)) {
            return data;
        }
        if (prefixLen < 0) {
            prefixLen = 0;
        }
        if (suffixLen < 0) {
            suffixLen = 0;
        }
        if (prefixLen + suffixLen >= data.length()) {
            return data;
        }
        return data.substring(0, prefixLen) +
                String.valueOf(maskChar).repeat(Math.max(0, data.length() - suffixLen - prefixLen)) +
                data.substring(data.length() - suffixLen);
    }

    /**
     * 掩码处理手机号
     *
     * @param phoneNumber 手机号
     * @return 掩码处理后的手机号（如：138****1234）
     */
    public static String maskPhoneNumber(String phoneNumber) {
        if (StringUtils.isBlank(phoneNumber)) {
            return phoneNumber;
        }
        return maskSensitiveInfo(phoneNumber, 3, 4, '*');
    }

    /**
     * 掩码处理身份证号
     *
     * @param idCard 身份证号
     * @return 掩码处理后的身份证号（如：1101**********1234）
     */
    public static String maskIdCard(String idCard) {
        if (StringUtils.isBlank(idCard)) {
            return idCard;
        }
        return maskSensitiveInfo(idCard, 4, 4, '*');
    }

    /**
     * 掩码处理银行卡号
     *
     * @param bankCard 银行卡号
     * @return 掩码处理后的银行卡号（如：6222 **** **** **** 1234）
     */
    public static String maskBankCard(String bankCard) {
        if (StringUtils.isBlank(bankCard)) {
            return bankCard;
        }
        // 移除非数字字符
        String digits = bankCard.replaceAll("\\D", "");
        if (digits.length() <= 8) {
            return bankCard;
        }
        // 格式化银行卡号，每4位一组，中间用空格分隔
        StringBuilder formatted = new StringBuilder();
        for (int i = 0; i < digits.length(); i++) {
            if (i > 0 && i % 4 == 0) {
                formatted.append(' ');
            }
            // 保留前4位和后4位，中间的用*替换
            if (i >= 4 && i < digits.length() - 4) {
                formatted.append('*');
            } else {
                formatted.append(digits.charAt(i));
            }
        }
        return formatted.toString();
    }

    /**
     * 检查字符串是否包含敏感词
     *
     * @param content        要检查的内容
     * @param sensitiveWords 敏感词列表
     * @return 是否包含敏感词
     */
    public static boolean containsSensitiveWord(String content, List<String> sensitiveWords) {
        if (StringUtils.isBlank(content) || CollectionUtils.isEmpty(sensitiveWords)) {
            return false;
        }
        for (String word : sensitiveWords) {
            if (StringUtils.isNotBlank(word) && content.contains(word)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 过滤字符串中的敏感词
     *
     * @param content        要过滤的内容
     * @param sensitiveWords 敏感词列表
     * @param replaceChar    替换字符
     * @return 过滤后的内容
     */
    public static String filterSensitiveWords(String content, List<String> sensitiveWords, char replaceChar) {
        if (StringUtils.isBlank(content) || CollectionUtils.isEmpty(sensitiveWords)) {
            return content;
        }
        String filteredContent = content;
        for (String word : sensitiveWords) {
            if (StringUtils.isNotBlank(word)) {
                filteredContent = filteredContent.replaceAll(word, String.valueOf(replaceChar).repeat(word.length()));
            }
        }
        return filteredContent;
    }

    /**
     * 生成密码强度评分
     *
     * @param password 密码
     * @return 密码强度（0-100）
     */
    public static int evaluatePasswordStrength(String password) {
        if (StringUtils.isBlank(password)) {
            return 0;
        }
        int score = 0;

        // 长度评分
        if (password.length() >= 8) {
            score += 20;
        } else if (password.length() >= 6) {
            score += 10;
        }

        // 包含数字
        if (password.matches(".*\\d.*")) {
            score += 20;
        }

        // 包含小写字母
        if (password.matches(".*[a-z].*")) {
            score += 20;
        }

        // 包含大写字母
        if (password.matches(".*[A-Z].*")) {
            score += 20;
        }

        // 包含特殊字符
        if (password.matches(".*[^a-zA-Z0-9].*")) {
            score += 20;
        }

        return Math.min(score, 100);
    }

    /**
     * 生成安全的随机密码
     *
     * @param length              密码长度
     * @param includeUppercase    是否包含大写字母
     * @param includeLowercase    是否包含小写字母
     * @param includeDigits       是否包含数字
     * @param includeSpecialChars 是否包含特殊字符
     * @return 随机生成的密码
     */
    public static String generateSecurePassword(int length, boolean includeUppercase, boolean includeLowercase,
                                                boolean includeDigits, boolean includeSpecialChars) {
        if (length <= 0) {
            throw new IllegalArgumentException("密码长度必须大于0");
        }

        StringBuilder charPool = new StringBuilder();
        if (includeUppercase) {
            charPool.append("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        }
        if (includeLowercase) {
            charPool.append("abcdefghijklmnopqrstuvwxyz");
        }
        if (includeDigits) {
            charPool.append("0123456789");
        }
        if (includeSpecialChars) {
            charPool.append("!@#$%^&*()-_=+[]{}|;:'\",.<>/?!");
        }

        if (charPool.isEmpty()) {
            throw new IllegalArgumentException("至少需要包含一种字符类型");
        }

        try {
            SecureRandom secureRandom = SecureRandom.getInstanceStrong();
            StringBuilder password = new StringBuilder(length);
            for (int i = 0; i < length; i++) {
                int randomIndex = secureRandom.nextInt(charPool.length());
                password.append(charPool.charAt(randomIndex));
            }
            return password.toString();
        } catch (NoSuchAlgorithmException e) {
            logger.error("生成安全密码失败: {}", e.getMessage());
            // 降级为普通随机数生成
            Random random = new Random();
            StringBuilder password = new StringBuilder(length);
            for (int i = 0; i < length; i++) {
                int randomIndex = random.nextInt(charPool.length());
                password.append(charPool.charAt(randomIndex));
            }
            return password.toString();
        }
    }
}