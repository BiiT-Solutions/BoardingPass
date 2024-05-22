export class Permission {
  public static readonly BOARDING_PASS = class {
    public static readonly ROOT: string = 'ACCESS_BOARDING_PASS';
    public static readonly ADMIN: string = 'ACCESS_BOARDING_PASS_ADMIN';
    public static readonly MANAGER: string = 'ACCESS_BOARDING_PASS_MANAGER';
    public static readonly USER: string = 'ACCESS_BOARDING_PASS_USER';
  }
}
