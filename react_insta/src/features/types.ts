// data type for react_insta

export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
}
/** authSlice.tsx */
export interface PROPS_AUTHEN {
    email: string;
    password: string;
}

export interface PROPS_PROFILE {
    id: number;
    nickName: string;
    // if not set, it will be null
    img: File | null;
}

// models.profile.nickname
export interface PROPS_NICKNAME {
    nickName: string;
}