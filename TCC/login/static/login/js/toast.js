const Toast = {
    init() {
        this.hideTimeout = null;
        this.el = document.createElement('div');
        this.el.className = 'd-flex flex-row align-items-center justify-content-center newRequestsAlert';

        //Cria conteúdo do toast (Deve ser o primeiro elemento)
        var content = document.createElement("div")
        content.className = "content-toast"
        content.onclick = window.location.reload.bind(window.location);
        this.el.appendChild(content)

        //Adiciona botão para fechar
        var close = document.createElement('span')
        close.className = "far fa-times-circle close-icon"
        close.onclick = () => {this.el.classList.toggle('toast--visible')}

        this.el.appendChild(close)
        document.body.appendChild(this.el);
        
    },

    show(message){
        clearTimeout(this.hideTimeout);
        this.el.className = "newRequestsAlert toast--visible"
        this.el.children[0].innerHTML = message
        
    }
}

document.addEventListener('DOMContentLoaded', () => Toast.init());