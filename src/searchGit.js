
export class GitHubUser{
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`
        
        return fetch(endpoint)
        .then(data => data.json())
        .then(({login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers
        }))
    } 
    // Criamos uma função static endpoint da API do git que é alterado via username. Esse endpoint é chamado pelo fetch que faz uma promessa de retorn. Após retornar, then(então) fazemos o data virar um json e (segundo then) pegamos os dados do json que queremos 
}


//Classe que ira tratar os dados apresentados
export class Favorites{
    constructor(root){
        this.root = document.querySelector(root);
        this.load()
        
    }

    load() {

        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }
        
    async add(username){
        try{
            
            const userExists = this.entries.find(entry => entry.login === username)
            console.log(userExists)
            if(userExists){
                throw new Error('Usuário já cadastrado')
            }
            

            const user = await GitHubUser.search(username)
            console.log(user.login)
            if(user.login === undefined){
                throw new Error('Usuário não encontrado')
            }
            
            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } catch(error){
            alert(error.message)
        }
    }
    delete(user){
        //para cada valor (entry) na array entries ele verifica se o login é o meso que o login do user. Quando ele encontrar o login, ele retorna false e aquele elemento é retirado da array
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}


//Classe que ira apresentar no HTML os dados
export class FavoritesView extends Favorites{
    constructor(root){
        super(root);
        this.tbody = this.root.querySelector('table tbody') // Pegando o tbody
        
        this.update()
        this.onadd()

    }
    onadd(){
        const addButton = this.root.querySelector(".input-wrapper button")
        addButton.onclick = () => {
            const {value} = this.root.querySelector(".input-wrapper input")
            this.add(value) //Quando o botão buscar for clicado ele irá pegar o valor dentro do input e passará para a função assicrona add 
        }
    }
    
    update() {
        this.removeAllTr()
        
        this.entries.forEach(user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.Followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')

                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
        
        
        
    }
    createRow(){
        const tr = document.createElement('tr') // Criamos um elemento dentro da DOM no html da tag tr
        tr.innerHTML =
        `<th class="user">
            <img src="https://source.unsplash.com/random/">
            <a href="https://github.com/GustavoMolino59">
                <p>gustavoMolino</p>
                <span>Gustavo Molino</span>
            </a>
        </th>

        </th>
        <th class="repositories">
            123
        </th>
        <th class="Followers">
            1234
        </th>
        <th class="action">
            <button class="remove">Remover</button>
        </th>` // passamos para a constante inner o HTML, junto aos locais para mudança
        return tr;
    }
    removeAllTr(){
        this.tbody.querySelectorAll("tr").forEach((tr)=>{tr.remove()}) //pegando todos os Trs dentro do tbody. Depois para cada Tr(forEach) eu removo os trs do tbody

    }
}