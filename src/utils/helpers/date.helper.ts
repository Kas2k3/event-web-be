export class DateHelper {
  /**
   * Lấy thời gian hiện tại
   */
  static now(): Date {
    return new Date();
  }

  /**
   * Định dạng ngày theo kiểu YYYY-MM-DD
   */
  static formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  /**
   * Định dạng ngày theo kiểu DD/MM/YYYY (Việt Nam)
   */
  static formatDateVN(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  /**
   * Định dạng ngày giờ đầy đủ
   */
  static formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Thêm ngày vào một ngày
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Thêm giờ vào một ngày
   */
  static addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  /**
   * Thêm phút vào một ngày
   */
  static addMinutes(date: Date, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  /**
   * Chuyển đổi từ chuỗi sang Date
   */
  static parseDate(dateString: string): Date {
    // Hỗ trợ cả định dạng ISO và DD/MM/YYYY
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(dateString);
  }

  /**
   * So sánh hai ngày (chỉ ngày, không tính giờ)
   * Trả về: -1 nếu date1 < date2, 0 nếu bằng nhau, 1 nếu date1 > date2
   */
  static compareDate(date1: Date, date2: Date): number {
    const d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);

    const d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);

    if (d1.getTime() < d2.getTime()) return -1;
    if (d1.getTime() > d2.getTime()) return 1;
    return 0;
  }

  /**
   * Kiểm tra xem một ngày có phải là ngày hôm nay không
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return this.compareDate(date, today) === 0;
  }

  /**
   * Lấy ngày đầu tiên của tháng
   */
  static getFirstDayOfMonth(date: Date = new Date()): Date {
    const result = new Date(date);
    result.setDate(1);
    return result;
  }

  /**
   * Lấy ngày cuối cùng của tháng
   */
  static getLastDayOfMonth(date: Date = new Date()): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);
    return result;
  }

  /**
   * Chuyển đổi Date sang timestamp (milliseconds)
   */
  static toTimestamp(date: Date): number {
    return date.getTime();
  }

  /**
   * Tạo Date từ timestamp (milliseconds)
   */
  static fromTimestamp(timestamp: number): Date {
    return new Date(timestamp);
  }

  /**
   * Lấy khoảng thời gian giữa hai ngày (tính bằng ngày)
   */
  static getDaysDifference(date1: Date, date2: Date): number {
    const d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);

    const d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}
