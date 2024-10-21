export function authCheck(){
    return localStorage.getItem('isLoggedIn') === 'true';

}
