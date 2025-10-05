package org.backend.A_general.base.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 集合工具类
 * 提供集合的判断、转换、操作等功能
 */
public class CollectionUtils {

    private static final Logger logger = LoggerFactory.getLogger(CollectionUtils.class);

    /**
     * 判断集合是否为null或空集合
     *
     * @param collection 要判断的集合
     * @return 是否为null或空集合
     */
    public static boolean isEmpty(Collection<?> collection) {
        return collection == null || collection.isEmpty();
    }

    /**
     * 判断集合是否不为null且不为空集合
     *
     * @param collection 要判断的集合
     * @return 是否不为null且不为空集合
     */
    public static boolean isNotEmpty(Collection<?> collection) {
        return !isEmpty(collection);
    }

    /**
     * 判断Map是否为null或空Map
     *
     * @param map 要判断的Map
     * @return 是否为null或空Map
     */
    public static boolean isEmpty(Map<?, ?> map) {
        return map == null || map.isEmpty();
    }

    /**
     * 判断Map是否不为null且不为空Map
     *
     * @param map 要判断的Map
     * @return 是否不为null且不为空Map
     */
    public static boolean isNotEmpty(Map<?, ?> map) {
        return !isEmpty(map);
    }

    /**
     * 获取集合的大小
     *
     * @param collection 集合
     * @return 集合大小，如果为null则返回0
     */
    public static int size(Collection<?> collection) {
        return collection == null ? 0 : collection.size();
    }

    /**
     * 获取Map的大小
     *
     * @param map Map
     * @return Map大小，如果为null则返回0
     */
    public static int size(Map<?, ?> map) {
        return map == null ? 0 : map.size();
    }

    /**
     * 创建一个新的ArrayList
     *
     * @param <T> 元素类型
     * @return 新的ArrayList
     */
    public static <T> List<T> newArrayList() {
        return new ArrayList<>();
    }

    /**
     * 创建一个包含指定元素的ArrayList
     *
     * @param elements 元素数组
     * @param <T> 元素类型
     * @return 包含指定元素的ArrayList
     */
    @SafeVarargs
    public static <T> List<T> newArrayList(T... elements) {
        if (elements == null) {
            return new ArrayList<>();
        }
        ArrayList<T> list = new ArrayList<>(elements.length);
        Collections.addAll(list, elements);
        return list;
    }

    /**
     * 创建一个新的HashSet
     *
     * @param <T> 元素类型
     * @return 新的HashSet
     */
    public static <T> Set<T> newHashSet() {
        return new HashSet<>();
    }

    /**
     * 创建一个包含指定元素的HashSet
     *
     * @param elements 元素数组
     * @param <T> 元素类型
     * @return 包含指定元素的HashSet
     */
    @SafeVarargs
    public static <T> Set<T> newHashSet(T... elements) {
        if (elements == null) {
            return new HashSet<>();
        }
        HashSet<T> set = new HashSet<>(elements.length);
        Collections.addAll(set, elements);
        return set;
    }

    /**
     * 创建一个新的HashMap
     *
     * @param <K> 键类型
     * @param <V> 值类型
     * @return 新的HashMap
     */
    public static <K, V> Map<K, V> newHashMap() {
        return new HashMap<>();
    }

    /**
     * 将集合转换为数组
     *
     * @param collection 集合
     * @param <T> 元素类型
     * @return 数组，如果集合为null则返回空数组
     */
    @SuppressWarnings("unchecked")
    public static <T> T[] toArray(Collection<T> collection) {
        if (isEmpty(collection)) {
            return (T[]) new Object[0];
        }
        return collection.toArray((T[]) new Object[collection.size()]);
    }

    /**
     * 将集合转换为数组
     *
     * @param collection 集合
     * @param array 目标数组
     * @param <T> 元素类型
     * @return 数组，如果集合为null则返回空数组
     */
    public static <T> T[] toArray(Collection<T> collection, T[] array) {
        if (isEmpty(collection)) {
            return array;
        }
        return collection.toArray(array);
    }

    /**
     * 合并多个集合
     *
     * @param collections 要合并的集合
     * @param <T> 元素类型
     * @return 合并后的集合
     */
    @SuppressWarnings("unchecked")
    public static <T> List<T> merge(Collection<T>... collections) {
        if (collections == null || collections.length == 0) {
            return new ArrayList<>();
        }
        int totalSize = 0;
        for (Collection<T> collection : collections) {
            totalSize += size(collection);
        }
        List<T> result = new ArrayList<>(totalSize);
        for (Collection<T> collection : collections) {
            if (collection != null) {
                result.addAll(collection);
            }
        }
        return result;
    }

    /**
     * 从集合中随机获取一个元素
     *
     * @param collection 集合
     * @param <T> 元素类型
     * @return 随机元素，如果集合为空则返回null
     */
    public static <T> T randomElement(Collection<T> collection) {
        if (isEmpty(collection)) {
            return null;
        }
        int size = collection.size();
        if (size == 1) {
            return collection.iterator().next();
        }
        int randomIndex = new Random().nextInt(size);
        int currentIndex = 0;
        for (T element : collection) {
            if (currentIndex == randomIndex) {
                return element;
            }
            currentIndex++;
        }
        return null;
    }

    /**
     * 检查集合是否包含指定元素
     *
     * @param collection 集合
     * @param element 要检查的元素
     * @param <T> 元素类型
     * @return 是否包含
     */
    public static <T> boolean contains(Collection<T> collection, T element) {
        if (isEmpty(collection)) {
            return false;
        }
        return collection.contains(element);
    }

    /**
     * 检查集合是否包含另一个集合的所有元素
     *
     * @param collection 集合
     * @param elements 要检查的元素集合
     * @param <T> 元素类型
     * @return 是否包含所有元素
     */
    public static <T> boolean containsAll(Collection<T> collection, Collection<T> elements) {
        if (isEmpty(collection) || isEmpty(elements)) {
            return false;
        }
        return collection.containsAll(elements);
    }

    /**
     * 获取两个集合的交集
     *
     * @param collection1 第一个集合
     * @param collection2 第二个集合
     * @param <T> 元素类型
     * @return 交集
     */
    public static <T> Set<T> intersection(Collection<T> collection1, Collection<T> collection2) {
        if (isEmpty(collection1) || isEmpty(collection2)) {
            return new HashSet<>();
        }
        Set<T> set1 = new HashSet<>(collection1);
        Set<T> set2 = new HashSet<>(collection2);
        set1.retainAll(set2);
        return set1;
    }

    /**
     * 获取两个集合的并集
     *
     * @param collection1 第一个集合
     * @param collection2 第二个集合
     * @param <T> 元素类型
     * @return 并集
     */
    public static <T> Set<T> union(Collection<T> collection1, Collection<T> collection2) {
        Set<T> result = new HashSet<>();
        if (collection1 != null) {
            result.addAll(collection1);
        }
        if (collection2 != null) {
            result.addAll(collection2);
        }
        return result;
    }

    /**
     * 获取两个集合的差集（在第一个集合中但不在第二个集合中）
     *
     * @param collection1 第一个集合
     * @param collection2 第二个集合
     * @param <T> 元素类型
     * @return 差集
     */
    public static <T> Set<T> difference(Collection<T> collection1, Collection<T> collection2) {
        if (isEmpty(collection1)) {
            return new HashSet<>();
        }
        if (isEmpty(collection2)) {
            return new HashSet<>(collection1);
        }
        Set<T> set1 = new HashSet<>(collection1);
        Set<T> set2 = new HashSet<>(collection2);
        set1.removeAll(set2);
        return set1;
    }

    /**
     * 将集合转换为Map，使用指定的函数提取键
     *
     * @param collection 集合
     * @param keyExtractor 键提取函数
     * @param <T> 元素类型
     * @param <K> 键类型
     * @return Map
     */
    public static <T, K> Map<K, T> toMap(Collection<T> collection, Function<? super T, ? extends K> keyExtractor) {
        if (isEmpty(collection)) {
            return new HashMap<>();
        }
        try {
            return collection.stream()
                    .collect(Collectors.toMap(keyExtractor, Function.identity()));
        } catch (Exception e) {
            logger.error("集合转Map失败: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    /**
     * 将集合转换为Map，使用指定的函数提取键和值
     *
     * @param collection 集合
     * @param keyExtractor 键提取函数
     * @param valueExtractor 值提取函数
     * @param <T> 元素类型
     * @param <K> 键类型
     * @param <V> 值类型
     * @return Map
     */
    public static <T, K, V> Map<K, V> toMap(
            Collection<T> collection,
            Function<? super T, ? extends K> keyExtractor,
            Function<? super T, ? extends V> valueExtractor) {
        if (isEmpty(collection)) {
            return new HashMap<>();
        }
        try {
            return collection.stream()
                    .collect(Collectors.toMap(keyExtractor, valueExtractor));
        } catch (Exception e) {
            logger.error("集合转Map失败: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    /**
     * 将集合按指定条件分组
     *
     * @param collection 集合
     * @param classifier 分组函数
     * @param <T> 元素类型
     * @param <K> 分组键类型
     * @return 分组后的Map
     */
    public static <T, K> Map<K, List<T>> groupBy(Collection<T> collection, Function<? super T, ? extends K> classifier) {
        if (isEmpty(collection)) {
            return new HashMap<>();
        }
        try {
            return collection.stream()
                    .collect(Collectors.groupingBy(classifier));
        } catch (Exception e) {
            logger.error("集合分组失败: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    /**
     * 过滤集合中的元素
     *
     * @param collection 集合
     * @param predicate 过滤条件
     * @param <T> 元素类型
     * @return 过滤后的集合
     */
    public static <T> List<T> filter(Collection<T> collection, java.util.function.Predicate<? super T> predicate) {
        if (isEmpty(collection)) {
            return new ArrayList<>();
        }
        try {
            return collection.stream()
                    .filter(predicate)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("集合过滤失败: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 对集合中的元素进行转换
     *
     * @param collection 集合
     * @param function 转换函数
     * @param <T> 原始元素类型
     * @param <R> 转换后元素类型
     * @return 转换后的集合
     */
    public static <T, R> List<R> transform(Collection<T> collection, Function<? super T, ? extends R> function) {
        if (isEmpty(collection)) {
            return new ArrayList<>();
        }
        try {
            return collection.stream()
                    .map(function)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("集合转换失败: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 对集合中的元素进行排序
     *
     * @param collection 集合
     * @param comparator 比较器
     * @param <T> 元素类型
     * @return 排序后的集合
     */
    public static <T> List<T> sort(Collection<T> collection, Comparator<? super T> comparator) {
        if (isEmpty(collection)) {
            return new ArrayList<>();
        }
        List<T> list = new ArrayList<>(collection);
        list.sort(comparator);
        return list;
    }

    /**
     * 截取集合的子集合
     *
     * @param collection 集合
     * @param start 开始索引（包含）
     * @param end 结束索引（不包含）
     * @param <T> 元素类型
     * @return 子集合
     */
    public static <T> List<T> subList(Collection<T> collection, int start, int end) {
        if (isEmpty(collection)) {
            return new ArrayList<>();
        }
        List<T> list = new ArrayList<>(collection);
        int size = list.size();
        if (start < 0) {
            start = 0;
        }
        if (end > size) {
            end = size;
        }
        if (start > end) {
            return new ArrayList<>();
        }
        return list.subList(start, end);
    }

    /**
     * 去重集合中的元素
     *
     * @param collection 集合
     * @param <T> 元素类型
     * @return 去重后的集合
     */
    public static <T> List<T> distinct(Collection<T> collection) {
        if (isEmpty(collection)) {
            return new ArrayList<>();
        }
        return collection.stream()
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * 反转集合中的元素顺序
     *
     * @param collection 集合
     * @param <T> 元素类型
     * @return 反转后的集合
     */
    public static <T> List<T> reverse(Collection<T> collection) {
        if (isEmpty(collection)) {
            return new ArrayList<>();
        }
        List<T> list = new ArrayList<>(collection);
        Collections.reverse(list);
        return list;
    }

    /**
     * 打乱集合中的元素顺序
     *
     * @param collection 集合
     * @param <T> 元素类型
     * @return 打乱后的集合
     */
    public static <T> List<T> shuffle(Collection<T> collection) {
        if (isEmpty(collection)) {
            return new ArrayList<>();
        }
        List<T> list = new ArrayList<>(collection);
        Collections.shuffle(list);
        return list;
    }

    /**
     * 填充集合
     *
     * @param collection 集合
     * @param element 要填充的元素
     * @param <T> 元素类型
     */
    public static <T> void fill(Collection<T> collection, T element) {
        if (isEmpty(collection)) {
            return;
        }
        if (collection instanceof List) {
            Collections.fill((List<T>) collection, element);
        } else {
            collection.clear();
            collection.add(element);
        }
    }

    /**
     * 将Map的键转换为List
     *
     * @param map Map
     * @param <K> 键类型
     * @param <V> 值类型
     * @return 键的List
     */
    public static <K, V> List<K> keysToList(Map<K, V> map) {
        if (isEmpty(map)) {
            return new ArrayList<>();
        }
        return new ArrayList<>(map.keySet());
    }

    /**
     * 将Map的值转换为List
     *
     * @param map Map
     * @param <K> 键类型
     * @param <V> 值类型
     * @return 值的List
     */
    public static <K, V> List<V> valuesToList(Map<K, V> map) {
        if (isEmpty(map)) {
            return new ArrayList<>();
        }
        return new ArrayList<>(map.values());
    }

    /**
     * 安全地获取Map中的值
     *
     * @param map Map
     * @param key 键
     * @param defaultValue 默认值
     * @param <K> 键类型
     * @param <V> 值类型
     * @return Map中的值，如果不存在则返回默认值
     */
    public static <K, V> V getOrDefault(Map<K, V> map, K key, V defaultValue) {
        if (isEmpty(map)) {
            return defaultValue;
        }
        return map.getOrDefault(key, defaultValue);
    }

    /**
     * 将两个集合组合成Map
     *
     * @param keys 键集合
     * @param values 值集合
     * @param <K> 键类型
     * @param <V> 值类型
     * @return 组合后的Map
     */
    public static <K, V> Map<K, V> zip(Collection<K> keys, Collection<V> values) {
        if (isEmpty(keys) || isEmpty(values)) {
            return new HashMap<>();
        }
        Map<K, V> map = new HashMap<>();
        Iterator<K> keyIterator = keys.iterator();
        Iterator<V> valueIterator = values.iterator();
        while (keyIterator.hasNext() && valueIterator.hasNext()) {
            map.put(keyIterator.next(), valueIterator.next());
        }
        return map;
    }

    /**
     * 检查两个集合是否相等
     *
     * @param collection1 第一个集合
     * @param collection2 第二个集合
     * @param <T> 元素类型
     * @return 是否相等
     */
    public static <T> boolean equals(Collection<T> collection1, Collection<T> collection2) {
        if (collection1 == collection2) {
            return true;
        }
        if (collection1 == null || collection2 == null) {
            return false;
        }
        if (collection1.size() != collection2.size()) {
            return false;
        }
        return collection1.containsAll(collection2) && collection2.containsAll(collection1);
    }

    /**
     * 计算集合的哈希码
     *
     * @param collection 集合
     * @return 哈希码
     */
    public static int hashCode(Collection<?> collection) {
        if (isEmpty(collection)) {
            return 0;
        }
        return collection.hashCode();
    }

    /**
     * 将集合转换为字符串表示
     *
     * @param collection 集合
     * @param separator 元素分隔符
     * @param <T> 元素类型
     * @return 字符串表示
     */
    public static <T> String toString(Collection<T> collection, String separator) {
        if (isEmpty(collection)) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        Iterator<T> iterator = collection.iterator();
        while (iterator.hasNext()) {
            sb.append(iterator.next());
            if (iterator.hasNext()) {
                sb.append(separator);
            }
        }
        return sb.toString();
    }

    /**
     * 将Map转换为字符串表示
     *
     * @param map Map
     * @param entrySeparator 条目分隔符
     * @param keyValueSeparator 键值分隔符
     * @param <K> 键类型
     * @param <V> 值类型
     * @return 字符串表示
     */
    public static <K, V> String toString(Map<K, V> map, String entrySeparator, String keyValueSeparator) {
        if (isEmpty(map)) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        Iterator<Map.Entry<K, V>> iterator = map.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<K, V> entry = iterator.next();
            sb.append(entry.getKey()).append(keyValueSeparator).append(entry.getValue());
            if (iterator.hasNext()) {
                sb.append(entrySeparator);
            }
        }
        return sb.toString();
    }

    /**
     * 并发安全地创建一个不可变的List
     *
     * @param elements 元素数组
     * @param <T> 元素类型
     * @return 不可变的List
     */
    @SafeVarargs
    public static <T> List<T> immutableList(T... elements) {
        if (elements == null || elements.length == 0) {
            return Collections.emptyList();
        }
        return Collections.unmodifiableList(Arrays.asList(elements.clone()));
    }

    /**
     * 并发安全地创建一个不可变的Set
     *
     * @param elements 元素数组
     * @param <T> 元素类型
     * @return 不可变的Set
     */
    @SafeVarargs
    public static <T> Set<T> immutableSet(T... elements) {
        if (elements == null || elements.length == 0) {
            return Collections.emptySet();
        }
        return Collections.unmodifiableSet(new HashSet<>(Arrays.asList(elements.clone())));
    }

    /**
     * 并发安全地创建一个不可变的Map
     *
     * @param k1 键1
     * @param v1 值1
     * @param k2 键2
     * @param v2 值2
     * @param kvPairs 其他键值对
     * @param <K> 键类型
     * @param <V> 值类型
     * @return 不可变的Map
     */
    public static <K, V> Map<K, V> immutableMap(K k1, V v1, K k2, V v2, Object... kvPairs) {
        Map<K, V> map = new HashMap<>();
        map.put(k1, v1);
        map.put(k2, v2);
        if (kvPairs != null && kvPairs.length > 0) {
            if (kvPairs.length % 2 != 0) {
                throw new IllegalArgumentException("键值对数量必须为偶数");
            }
            for (int i = 0; i < kvPairs.length; i += 2) {
                @SuppressWarnings("unchecked")
                K key = (K) kvPairs[i];
                @SuppressWarnings("unchecked")
                V value = (V) kvPairs[i + 1];
                map.put(key, value);
            }
        }
        return Collections.unmodifiableMap(map);
    }
}