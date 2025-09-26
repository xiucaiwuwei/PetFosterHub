/**
 * 日期工具类 - 提供常用的日期处理函数
 */
export class DateUtils {
  /**
   * 格式化日期为指定格式
   * @param date 日期对象或时间戳
   * @param format 格式化模板，如 'YYYY-MM-DD HH:mm:ss'
   * @returns 格式化后的日期字符串
   */
  static format(date: Date | string | number, format: string): string {
    const d = typeof date === 'object' ? date : new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();

    return format
      .replace('YYYY', String(year))
      .replace('MM', String(month).padStart(2, '0'))
      .replace('DD', String(day).padStart(2, '0'))
      .replace('HH', String(hours).padStart(2, '0'))
      .replace('mm', String(minutes).padStart(2, '0'))
      .replace('ss', String(seconds).padStart(2, '0'));
  }

  /**
   * 解析日期字符串为Date对象
   * @param dateString 日期字符串
   * @returns Date对象
   */
  static parse(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * 获取当前日期时间
   * @returns 当前日期时间的Date对象
   */
  static now(): Date {
    return new Date();
  }

  /**
   * 计算两个日期之间的天数差
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 天数差
   */
  static diffInDays(startDate: Date | string | number, endDate: Date | string | number): number {
    const start = typeof startDate === 'object' ? startDate : new Date(startDate);
    const end = typeof endDate === 'object' ? endDate : new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * 计算两个日期之间的小时差
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 小时差
   */
  static diffInHours(startDate: Date | string | number, endDate: Date | string | number): number {
    const start = typeof startDate === 'object' ? startDate : new Date(startDate);
    const end = typeof endDate === 'object' ? endDate : new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours;
  }

  /**
   * 获取相对时间（如：刚刚、3分钟前、2小时前、3天前等）
   * @param date 日期对象或时间戳
   * @returns 相对时间字符串
   */
  static getRelativeTime(date: Date | string | number): string {
    const now = new Date();
    const target = typeof date === 'object' ? date : new Date(date);
    const diffTime = now.getTime() - target.getTime();
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffSeconds < 60) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 30) {
      return `${diffDays}天前`;
    } else if (diffMonths < 12) {
      return `${diffMonths}个月前`;
    } else {
      return `${diffYears}年前`;
    }
  }

  /**
   * 向日期添加指定的时间
   * @param date 基础日期
   * @param amount 数量
   * @param unit 单位：'days', 'hours', 'minutes', 'seconds'
   * @returns 新的日期对象
   */
  static add(date: Date | string | number, amount: number, unit: 'days' | 'hours' | 'minutes' | 'seconds'): Date {
    const d = typeof date === 'object' ? new Date(date) : new Date(date);

    switch (unit) {
      case 'days':
        d.setDate(d.getDate() + amount);
        break;
      case 'hours':
        d.setHours(d.getHours() + amount);
        break;
      case 'minutes':
        d.setMinutes(d.getMinutes() + amount);
        break;
      case 'seconds':
        d.setSeconds(d.getSeconds() + amount);
        break;
    }

    return d;
  }

  /**
   * 检查是否为有效日期
   * @param date 要检查的日期
   * @returns 是否为有效日期
   */
  static isValid(date: Date | string | number): boolean {
    const d = typeof date === 'object' ? date : new Date(date);
    return !isNaN(d.getTime());
  }

  /**
   * 比较两个日期
   * @param date1 第一个日期
   * @param date2 第二个日期
   * @returns 如果date1 > date2返回1，如果date1 < date2返回-1，否则返回0
   */
  static compare(date1: Date | string | number, date2: Date | string | number): number {
    const d1 = typeof date1 === 'object' ? date1.getTime() : new Date(date1).getTime();
    const d2 = typeof date2 === 'object' ? date2.getTime() : new Date(date2).getTime();
    
    if (d1 > d2) return 1;
    if (d1 < d2) return -1;
    return 0;
  }

  /**
   * 获取指定日期所在月份的第一天
   * @param date 日期
   * @returns 该月第一天的Date对象
   */
  static getFirstDayOfMonth(date: Date | string | number): Date {
    const d = typeof date === 'object' ? new Date(date) : new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * 获取指定日期所在月份的最后一天
   * @param date 日期
   * @returns 该月最后一天的Date对象
   */
  static getLastDayOfMonth(date: Date | string | number): Date {
    const d = typeof date === 'object' ? new Date(date) : new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * 获取日期的年、月、日、时、分、秒等信息
   * @param date 日期
   * @returns 日期信息对象
   */
  static getDateInfo(date: Date | string | number): {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    weekday: number;
    timestamp: number;
  } {
    const d = typeof date === 'object' ? date : new Date(date);
    
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hours: d.getHours(),
      minutes: d.getMinutes(),
      seconds: d.getSeconds(),
      weekday: d.getDay(),
      timestamp: d.getTime()
    };
  }

  /**
   * 获取日期的本地字符串表示
   * @param date 日期
   * @param options 格式化选项
   * @returns 本地化的日期字符串
   */
  static toLocaleString(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'object' ? date : new Date(date);
    return d.toLocaleString('zh-CN', options);
  }
}

export default DateUtils;