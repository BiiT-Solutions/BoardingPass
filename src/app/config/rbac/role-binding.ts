import {Permission} from "./permission";
import {AppRole} from "@biit-solutions/authorization-services";

export class RoleBinding {

  private readonly BOARDING_PASS_ADMIN: Permission[] = [
    Permission.BOARDING_PASS.ROOT,
    Permission.BOARDING_PASS.ADMIN
  ];

  private readonly BOARDING_PASS_MANAGER: Permission[] = [
    Permission.BOARDING_PASS.ROOT,
    Permission.BOARDING_PASS.MANAGER
  ];

  private readonly BOARDING_PASS_USER: Permission[] = [
    Permission.BOARDING_PASS.ROOT,
    Permission.BOARDING_PASS.USER
  ];

  private roles : AppRole[];

  constructor(roles: AppRole[]){
    this.roles = roles;
  }

  public getPermissions(): Set<Permission>{
    const roles: Permission[] = this.roles.map(role => {
        switch(role.toUpperCase()){
          case AppRole.APPOINTMENTCENTER_ADMIN:
            return this.BOARDING_PASS_ADMIN;
          case AppRole.APPOINTMENTCENTER_MANAGER:
            return this.BOARDING_PASS_MANAGER;
          case AppRole.APPOINTMENTCENTER_USER:
            return this.BOARDING_PASS_USER;
          default:
            return [];
        }
      }).flat();
    return new Set<Permission>(roles);
  }
}
