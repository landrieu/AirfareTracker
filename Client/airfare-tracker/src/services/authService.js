
class AuthService{
    constructor(){
        this.token = null;
        this.user = null;
        this.subscribers = [];
    }

    storeUserData({token, user}){
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.token = token;
        this.user = user;
        
        for(let subscriber of this.subscribers){
            subscriber(true);
        }
    }

    logout() {
        this.authToken = null;
        this.user = null;
        localStorage.clear();

        for(let subscriber of this.subscribers){
            subscriber(false);
        }
      }

    loggedIn() {
        return !!this.token;
        //return tokenNotExpired('id_token');
    }
    
    loadToken(){
        const token = localStorage.getItem('id_token');
        this.authToken = token;
        return token;
    }
    
    loadUser(){
        const user = localStorage.getItem('user');
        this.user = user;
        return user;
    }

    subscribe(subscriber){
        this.subscribers.push(subscriber);
    }
}

export const authService = new AuthService();
