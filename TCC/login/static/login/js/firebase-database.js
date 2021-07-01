firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        var arrayRequisicoes = []
        var requisicoesUsuarios = []
        var usuario;
        var dbRef = firebase.database().ref();
        dbRef.child("dados/requisicoes").get().then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(element => {
                    element.forEach(element =>{
                        let requisicao = element.val()
                        if(requisicao.statusRequisicao == 0){
                            arrayRequisicoes.push(requisicao)
                        }
                    })
                })
                arrayRequisicoes.forEach(req => {
                    dbRef.child("dados/usuarios/" + req.usuarioID).get().then(snapshot => {
                        usuario = snapshot.val()
                        console.log(usuario.nome)
                        var reqUsuario = new RequisicaoUsuario(req, usuario)
                        requisicoesUsuarios.push(reqUsuario)
                        ReactDOM.render(<Table requisicoes={requisicoesUsuarios}/>,
                            document.querySelector('main'))
                    })
                })

                
            } else {
                console.log('Sem dados disponívies')
            }
        }).catch((error) => {
            console.error(error)
        })
    } else {
        firebase.auth().signInAnonymously().catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorCode + " " + errorMessage)
        });
    }
});

