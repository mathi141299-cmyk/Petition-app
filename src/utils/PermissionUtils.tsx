export const hasPermission = (permissionList: any, sectionName: any) => {
  return permissionList.includes(sectionName) ? true : false;
};
