package org.backend.A_general.base.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Bean工具类
 * 提供JavaBean对象的复制、转换和属性操作等功能
 */
public class BeanUtils {

    private static final Logger logger = LoggerFactory.getLogger(BeanUtils.class);

    /**
     * 复制对象的属性到目标对象
     *
     * @param source 源对象
     * @param target 目标对象
     */
    public static void copyProperties(Object source, Object target) {
        if (source == null || target == null) {
            return;
        }
        try {
            org.springframework.beans.BeanUtils.copyProperties(source, target);
        } catch (Exception e) {
            logger.error("复制对象属性失败: {}", e.getMessage());
        }
    }

    /**
     * 复制对象的属性到目标对象，忽略指定的属性
     *
     * @param source 源对象
     * @param target 目标对象
     * @param ignoreProperties 要忽略的属性名
     */
    public static void copyProperties(Object source, Object target, String... ignoreProperties) {
        if (source == null || target == null) {
            return;
        }
        try {
            org.springframework.beans.BeanUtils.copyProperties(source, target, ignoreProperties);
        } catch (Exception e) {
            logger.error("复制对象属性失败: {}", e.getMessage());
        }
    }

    /**
     * 将对象转换为指定类型的对象
     *
     * @param source 源对象
     * @param targetClass 目标类型
     * @param <T> 目标类型
     * @return 转换后的对象
     */
    public static <T> T convert(Object source, Class<T> targetClass) {
        if (source == null || targetClass == null) {
            return null;
        }
        try {
            T target = targetClass.getDeclaredConstructor().newInstance();
            copyProperties(source, target);
            return target;
        } catch (Exception e) {
            logger.error("对象转换失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将对象集合转换为指定类型的对象集合
     *
     * @param sourceList 源对象集合
     * @param targetClass 目标类型
     * @param <S> 源对象类型
     * @param <T> 目标对象类型
     * @return 转换后的对象集合
     */
    public static <S, T> List<T> convertList(Collection<S> sourceList, Class<T> targetClass) {
        if (CollectionUtils.isEmpty(sourceList) || targetClass == null) {
            return new ArrayList<>();
        }
        return sourceList.stream()
                .map(source -> convert(source, targetClass))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * 获取对象的所有属性名和属性值的映射
     *
     * @param bean 目标对象
     * @return 属性名和属性值的映射
     */
    public static Map<String, Object> getPropertyMap(Object bean) {
        if (bean == null) {
            return new HashMap<>();
        }
        Map<String, Object> propertyMap = new HashMap<>();
        try {
            BeanInfo beanInfo = Introspector.getBeanInfo(bean.getClass(), Object.class);
            PropertyDescriptor[] descriptors = beanInfo.getPropertyDescriptors();
            for (PropertyDescriptor descriptor : descriptors) {
                String propertyName = descriptor.getName();
                Method readMethod = descriptor.getReadMethod();
                if (readMethod != null) {
                    Object value = readMethod.invoke(bean);
                    propertyMap.put(propertyName, value);
                }
            }
        } catch (IntrospectionException | IllegalAccessException | InvocationTargetException e) {
            logger.error("获取对象属性映射失败: {}", e.getMessage());
        }
        return propertyMap;
    }

    /**
     * 设置对象的属性值
     *
     * @param bean 目标对象
     * @param propertyName 属性名
     * @param propertyValue 属性值
     * @return 是否设置成功
     */
    public static boolean setProperty(Object bean, String propertyName, Object propertyValue) {
        if (bean == null || StringUtils.isBlank(propertyName)) {
            return false;
        }
        try {
            PropertyDescriptor descriptor = new PropertyDescriptor(propertyName, bean.getClass());
            Method writeMethod = descriptor.getWriteMethod();
            if (writeMethod != null) {
                writeMethod.invoke(bean, propertyValue);
                return true;
            }
        } catch (IntrospectionException | IllegalAccessException | InvocationTargetException e) {
            logger.error("设置对象属性失败: {}", e.getMessage());
        }
        return false;
    }

    /**
     * 获取对象的属性值
     *
     * @param bean 目标对象
     * @param propertyName 属性名
     * @return 属性值
     */
    public static Object getProperty(Object bean, String propertyName) {
        if (bean == null || StringUtils.isBlank(propertyName)) {
            return null;
        }
        try {
            PropertyDescriptor descriptor = new PropertyDescriptor(propertyName, bean.getClass());
            Method readMethod = descriptor.getReadMethod();
            if (readMethod != null) {
                return readMethod.invoke(bean);
            }
        } catch (IntrospectionException | IllegalAccessException | InvocationTargetException e) {
            logger.error("获取对象属性值失败: {}", e.getMessage());
        }
        return null;
    }

    /**
     * 获取对象的属性值（支持嵌套属性，如user.address.city）
     *
     * @param bean 目标对象
     * @param propertyPath 属性路径
     * @return 属性值
     */
    public static Object getNestedProperty(Object bean, String propertyPath) {
        if (bean == null || StringUtils.isBlank(propertyPath)) {
            return null;
        }
        try {
            String[] propertyNames = propertyPath.split("\\.");
            Object current = bean;
            for (String propertyName : propertyNames) {
                if (current == null) {
                    return null;
                }
                current = getProperty(current, propertyName);
            }
            return current;
        } catch (Exception e) {
            logger.error("获取嵌套属性值失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 设置对象的嵌套属性值（支持嵌套属性，如user.address.city）
     *
     * @param bean 目标对象
     * @param propertyPath 属性路径
     * @param propertyValue 属性值
     * @return 是否设置成功
     */
    public static boolean setNestedProperty(Object bean, String propertyPath, Object propertyValue) {
        if (bean == null || StringUtils.isBlank(propertyPath)) {
            return false;
        }
        try {
            String[] propertyNames = propertyPath.split("\\.");
            Object current = bean;
            for (int i = 0; i < propertyNames.length - 1; i++) {
                String propertyName = propertyNames[i];
                Object next = getProperty(current, propertyName);
                if (next == null) {
                    // 如果中间属性为空，尝试创建新实例
                    PropertyDescriptor descriptor = new PropertyDescriptor(propertyName, current.getClass());
                    Class<?> propertyType = descriptor.getPropertyType();
                    next = propertyType.getDeclaredConstructor().newInstance();
                    setProperty(current, propertyName, next);
                }
                current = next;
            }
            String lastPropertyName = propertyNames[propertyNames.length - 1];
            return setProperty(current, lastPropertyName, propertyValue);
        } catch (Exception e) {
            logger.error("设置嵌套属性值失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 获取类的所有字段（包括父类的字段）
     *
     * @param clazz 目标类
     * @return 字段数组
     */
    public static List<Field> getAllFields(Class<?> clazz) {
        if (clazz == null) {
            return new ArrayList<>();
        }
        List<Field> fields = new ArrayList<>();
        while (clazz != null && clazz != Object.class) {
            fields.addAll(Arrays.asList(clazz.getDeclaredFields()));
            clazz = clazz.getSuperclass();
        }
        return fields;
    }

    /**
     * 获取对象的所有字段值（包括私有字段）
     *
     * @param bean 目标对象
     * @return 字段名和字段值的映射
     */
    public static Map<String, Object> getFieldMap(Object bean) {
        if (bean == null) {
            return new HashMap<>();
        }
        Map<String, Object> fieldMap = new HashMap<>();
        List<Field> fields = getAllFields(bean.getClass());
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object value = field.get(bean);
                fieldMap.put(field.getName(), value);
            } catch (IllegalAccessException e) {
                logger.error("获取字段值失败: {}", e.getMessage());
            }
        }
        return fieldMap;
    }

    /**
     * 设置对象的字段值（包括私有字段）
     *
     * @param bean 目标对象
     * @param fieldName 字段名
     * @param fieldValue 字段值
     * @return 是否设置成功
     */
    public static boolean setField(Object bean, String fieldName, Object fieldValue) {
        if (bean == null || StringUtils.isBlank(fieldName)) {
            return false;
        }
        try {
            Field field = findField(bean.getClass(), fieldName);
            if (field != null) {
                field.setAccessible(true);
                field.set(bean, fieldValue);
                return true;
            }
        } catch (IllegalAccessException e) {
            logger.error("设置字段值失败: {}", e.getMessage());
        }
        return false;
    }

    /**
     * 查找类中的字段（包括父类的字段）
     *
     * @param clazz 目标类
     * @param fieldName 字段名
     * @return 字段对象，如果不存在则返回null
     */
    public static Field findField(Class<?> clazz, String fieldName) {
        if (clazz == null || StringUtils.isBlank(fieldName)) {
            return null;
        }
        while (clazz != null && clazz != Object.class) {
            try {
                return clazz.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                // 继续查找父类
            }
            clazz = clazz.getSuperclass();
        }
        return null;
    }

    /**
     * 检查对象是否为空（所有属性都为null）
     *
     * @param bean 目标对象
     * @return 是否为空对象
     */
    public static boolean isEmptyBean(Object bean) {
        if (bean == null) {
            return true;
        }
        Map<String, Object> propertyMap = getPropertyMap(bean);
        for (Object value : propertyMap.values()) {
            if (value != null) {
                return false;
            }
        }
        return true;
    }

    /**
     * 深拷贝对象
     *
     * @param source 源对象
     * @param <T> 对象类型
     * @return 深拷贝后的对象
     */
    @SuppressWarnings("unchecked")
    public static <T> T deepCopy(T source) {
        if (source == null) {
            return null;
        }
        // 对于基本类型和字符串，直接返回
        if (source instanceof Number || source instanceof Boolean || source instanceof Character || source instanceof String) {
            return source;
        }
        // 对于集合类型，进行深拷贝
        switch (source) {
            case List<?> list -> {
                List<Object> copy = new ArrayList<>(list.size());
                for (Object item : list) {
                    copy.add(deepCopy(item));
                }
                return (T) copy;
            }
            case Set<?> set -> {
                Set<Object> copy = new HashSet<>(set.size());
                for (Object item : set) {
                    copy.add(deepCopy(item));
                }
                return (T) copy;
            }
            case Map<?, ?> map -> {
                Map<Object, Object> copy = new HashMap<>(map.size());
                for (Map.Entry<?, ?> entry : map.entrySet()) {
                    copy.put(deepCopy(entry.getKey()), deepCopy(entry.getValue()));
                }
                return (T) copy;
            }
            default -> {
            }
        }
        // 对于自定义对象，通过反射创建新实例并复制属性
        try {
            T target = (T) source.getClass().getDeclaredConstructor().newInstance();
            BeanInfo beanInfo = Introspector.getBeanInfo(source.getClass(), Object.class);
            PropertyDescriptor[] descriptors = beanInfo.getPropertyDescriptors();
            for (PropertyDescriptor descriptor : descriptors) {
                String propertyName = descriptor.getName();
                Method readMethod = descriptor.getReadMethod();
                Method writeMethod = descriptor.getWriteMethod();
                if (readMethod != null && writeMethod != null) {
                    Object value = readMethod.invoke(source);
                    Object copiedValue = deepCopy(value);
                    writeMethod.invoke(target, copiedValue);
                }
            }
            return target;
        } catch (Exception e) {
            logger.error("深拷贝对象失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 获取对象的属性类型
     *
     * @param bean 目标对象
     * @param propertyName 属性名
     * @return 属性类型，如果不存在则返回null
     */
    public static Class<?> getPropertyType(Object bean, String propertyName) {
        if (bean == null || StringUtils.isBlank(propertyName)) {
            return null;
        }
        try {
            PropertyDescriptor descriptor = new PropertyDescriptor(propertyName, bean.getClass());
            return descriptor.getPropertyType();
        } catch (IntrospectionException e) {
            logger.error("获取属性类型失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 检查对象是否有指定的属性
     *
     * @param bean 目标对象
     * @param propertyName 属性名
     * @return 是否有指定属性
     */
    public static boolean hasProperty(Object bean, String propertyName) {
        if (bean == null || StringUtils.isBlank(propertyName)) {
            return false;
        }
        try {
            new PropertyDescriptor(propertyName, bean.getClass());
            return true;
        } catch (IntrospectionException e) {
            return false;
        }
    }

    /**
     * 检查对象是否有指定的可读属性
     *
     * @param bean 目标对象
     * @param propertyName 属性名
     * @return 是否有指定的可读属性
     */
    public static boolean hasReadableProperty(Object bean, String propertyName) {
        if (bean == null || StringUtils.isBlank(propertyName)) {
            return false;
        }
        try {
            PropertyDescriptor descriptor = new PropertyDescriptor(propertyName, bean.getClass());
            return descriptor.getReadMethod() != null;
        } catch (IntrospectionException e) {
            return false;
        }
    }

    /**
     * 检查对象是否有指定的可写属性
     *
     * @param bean 目标对象
     * @param propertyName 属性名
     * @return 是否有指定的可写属性
     */
    public static boolean hasWritableProperty(Object bean, String propertyName) {
        if (bean == null || StringUtils.isBlank(propertyName)) {
            return false;
        }
        try {
            PropertyDescriptor descriptor = new PropertyDescriptor(propertyName, bean.getClass());
            return descriptor.getWriteMethod() != null;
        } catch (IntrospectionException e) {
            return false;
        }
    }

    /**
     * 将对象转换为Map（包括所有字段，支持嵌套属性）
     *
     * @param bean 目标对象
     * @param includeNull 是否包含null值
     * @return 对象的Map表示
     */
    public static Map<String, Object> toMap(Object bean, boolean includeNull) {
        if (bean == null) {
            return new HashMap<>();
        }
        Map<String, Object> map = new HashMap<>();
        List<Field> fields = getAllFields(bean.getClass());
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object value = field.get(bean);
                if (includeNull || value != null) {
                    map.put(field.getName(), value);
                }
            } catch (IllegalAccessException e) {
                logger.error("获取字段值失败: {}", e.getMessage());
            }
        }
        return map;
    }

    /**
     * 将Map转换为对象
     *
     * @param map 包含属性名和属性值的Map
     * @param targetClass 目标类
     * @param <T> 目标类型
     * @return 转换后的对象
     */
    public static <T> T fromMap(Map<String, Object> map, Class<T> targetClass) {
        if (map == null || map.isEmpty() || targetClass == null) {
            return null;
        }
        try {
            T target = targetClass.getDeclaredConstructor().newInstance();
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                String propertyName = entry.getKey();
                Object propertyValue = entry.getValue();
                if (hasWritableProperty(target, propertyName)) {
                    setProperty(target, propertyName, propertyValue);
                }
            }
            return target;
        } catch (Exception e) {
            logger.error("Map转对象失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 比较两个对象的属性是否相等
     *
     * @param source 源对象
     * @param target 目标对象
     * @param ignoreProperties 要忽略的属性名
     * @return 属性是否相等
     */
    public static boolean equals(Object source, Object target, String... ignoreProperties) {
        if (source == target) {
            return true;
        }
        if (source == null || target == null) {
            return false;
        }
        if (!source.getClass().equals(target.getClass())) {
            return false;
        }
        Set<String> ignoreSet = (ignoreProperties != null) ? new HashSet<>(Arrays.asList(ignoreProperties)) : new HashSet<>();
        try {
            BeanInfo beanInfo = Introspector.getBeanInfo(source.getClass(), Object.class);
            PropertyDescriptor[] descriptors = beanInfo.getPropertyDescriptors();
            for (PropertyDescriptor descriptor : descriptors) {
                String propertyName = descriptor.getName();
                if (ignoreSet.contains(propertyName)) {
                    continue;
                }
                Method readMethod = descriptor.getReadMethod();
                if (readMethod != null) {
                    Object sourceValue = readMethod.invoke(source);
                    Object targetValue = readMethod.invoke(target);
                    if (!Objects.equals(sourceValue, targetValue)) {
                        return false;
                    }
                }
            }
            return true;
        } catch (Exception e) {
            logger.error("比较对象属性失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 获取对象的属性差异
     *
     * @param source 源对象
     * @param target 目标对象
     * @return 差异属性名和源对象属性值的映射
     */
    public static Map<String, Object> getDiff(Object source, Object target) {
        Map<String, Object> diff = new HashMap<>();
        if (source == null || target == null) {
            return diff;
        }
        if (!source.getClass().equals(target.getClass())) {
            return diff;
        }
        try {
            BeanInfo beanInfo = Introspector.getBeanInfo(source.getClass(), Object.class);
            PropertyDescriptor[] descriptors = beanInfo.getPropertyDescriptors();
            for (PropertyDescriptor descriptor : descriptors) {
                String propertyName = descriptor.getName();
                Method readMethod = descriptor.getReadMethod();
                if (readMethod != null) {
                    Object sourceValue = readMethod.invoke(source);
                    Object targetValue = readMethod.invoke(target);
                    if (!Objects.equals(sourceValue, targetValue)) {
                        diff.put(propertyName, sourceValue);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("获取对象属性差异失败: {}", e.getMessage());
        }
        return diff;
    }
}