
class AuthService{
    constructor(){
        this.token = null;
        this.user = null;
        this.subscribers = [];

        this.loadToken();
        this.loadUser();
        console.log(this.token);
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
        this.token = null;
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
        this.token = token;
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
