export type AppRole="CUSTOMER"|"ADMIN"|"EDITOR"|"SUPPORT";
export function canManageProducts(role:AppRole){return role==="ADMIN"||role==="EDITOR"}
export function canManageOrders(role:AppRole){return role==="ADMIN"||role==="SUPPORT"}
export function canAccessAdmin(role:AppRole){return role!=="CUSTOMER"}
