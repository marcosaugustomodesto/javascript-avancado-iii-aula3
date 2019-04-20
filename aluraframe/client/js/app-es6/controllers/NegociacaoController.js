class NegociacaoController {
    
    constructor() {
        /* teste */
        let $ = document.querySelector.bind(document);
        
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
         
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(), 
            new NegociacoesView($('#negociacoesView')), 
            'adiciona', 'esvazia' , 'ordena', 'inverteOrdem');
       
        this._mensagem = new Bind(
            new Mensagem(), new MensagemView($('#mensagemView')),
            'texto');    
            
        this._ordemAtual = '';
		this._init();

    }
    
	_init(){
		
		setInterval(() => {
			this.importaNegociacoes();
		}, 3000);
		
	}

    adiciona(event) {
        
        event.preventDefault();
		
		let negociacao = this._criaNegociacao();

		new NegociacaoService()
			.cadastrar(negociacao)
			.then(mensagem => {
				this._listaNegociacoes.adiciona(negociacao);
				this._mensagem.texto = mensagem;
				this._limpaFormulario();                         
			})
			.catch(erro => this._mensagem.texto = erro);
    }
    
    importaNegociacoes() {
        new NegociacaoService()
			.importa(this._listaNegociacoes.negociacoes)
			.then(negociacoes => negociacoes.forEach(negociacao => {
				this._listaNegociacoes.adiciona(negociacao);
				this._mensagem.texto = 'Negociações do período importadas';
			}))
			.catch(erro => this._mensagem.texto = erro);

    }
    
    apaga() {
        new NegociacaoService()
			.apaga()
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            })
            .catch(erro => this._mensagem.texto = erro);                              
    }
    
    _criaNegociacao() {
        
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value));    
    }
    
    _limpaFormulario() {
     
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();   
    }
    
    ordena(coluna) {
        
        if(this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem(); 
        } else {
            this._listaNegociacoes.ordena((p, s) => p[coluna] - s[coluna]);    
        }
        this._ordemAtual = coluna;    
    }
}