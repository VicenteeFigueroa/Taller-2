export interface User {
    userID?:             number;
    firstName?:          string;
    lastName?:           string;
    email?:              string;
    telephone?:          string;
    dateOfBirth?:        Date;
    accountStatus?:      boolean;
    registeredAt?:       Date;
    lastLogin?:          Date;
    deactivationReason?: null;
    shippingAddress?:    ShippingAddress;
}

export interface ShippingAddress {
    addressID?:  number;
    street?:     string;
    number?:     string;
    commune?:    string;
    region?:     string;
    postalCode?: string;
    userId?:     number;
}
