const Toast = {
    init() {
        this.hideTimeout = null;
        this.el = document.createElement('div');
        this.el.className = 'newRequestsAlert';
        this.el.onclick = window.location.reload.bind(window.location);
        document.body.appendChild(this.el);
    },

    show(message, state){
        clearTimeout(this.hideTimeout);
        this.el.textContent = message;
        this.el.className = "newRequestsAlert toast--visible"
    }
}

document.addEventListener('DOMContentLoaded', () => Toast.init());