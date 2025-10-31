import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export function useToken() {
    const token = Cookies.get('token');
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (err) {
        return null;
    };

};