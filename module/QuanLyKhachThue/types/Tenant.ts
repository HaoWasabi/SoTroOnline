interface Tenant {
    email: string,
    tenant_cccd: string,
    represent_code: string,
    name: string,
    phone: string,
    address: string,
    dateOfBirth: string,
    status: "isActive" | "isDeleted" | "isPending"
}