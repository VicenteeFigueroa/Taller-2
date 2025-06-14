import { User } from "@/interfaces/User";


export interface AuthState {
    user: User | null;
    status: 'authenticated' | 'non-authenticated' | 'checking';
}

export type AuthAction =
    | {type: 'auth', payload: {user: User}}
    | {type: 'logout'}
    | {type: 'non-authenticated'}
    | {type: 'updateUser', payload: {user: User}};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type){
        case 'auth':
            return {
                ...state,
                user: action.payload.user,
                status: 'authenticated'
            };
        case 'logout':
            return {
                ...state,
                user: null,
                status: 'non-authenticated'
            };

        case 'non-authenticated':
            return {
                ...state,
                user: null,
                status: 'non-authenticated'
            };
        case 'updateUser':
            return {
                ...state,
                status: 'authenticated',
                user: {
                    ...action.payload.user
                }
            };

        default:
            return state;
    }
}