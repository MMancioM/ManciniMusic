//------------------------------------------------
//COSTRUTTORE DELL'OGGETTO USER
//------------------------------------------------
class User{
    constructor(){
        this.id = Date.now();
        this.email = null;
        this.fullname = null;
        this.password = null;
        this.process = {};
        this.genres = [];
        this.playlist = [];
    }
}

//------------------------------------------------
//COSTRUTTORE DELL'OGGETTO PLAYLIST
//------------------------------------------------
class Playlist{
    constructor(){
        this.id = null;
        this.userID = null;
        this.name = null;
        this.description = null;
        this.pubblic = false;
        this.likes = [];
        this.songs = [];
        this.tags = [];
    }
}

//------------------------------------------------
//COSTRUTTORE DELLO STORAGE
//------------------------------------------------
class Store{
    constructor(){
        this.collection = {}; //INIZIALIZZO COME OGGETTO VUOTO
    }

    init(){
        this.collection = JSON.parse(localStorage.getItem('collection')) || {};
    }

    get(article=null, object=null){

        let result = null;

        if(article && article in this.collection){

            result = this.collection[article];

            if(object){
                result = this.collection[article].find(element=>element.id)
            }

        }

        return result

    }

    getBy(attribute=null, article=null, object=null){

        let result = null;

        if(attribute && article && object){

            if(article in this.collection){
                result = this.collection[article].filter(item=>item[attribute]==object[attribute]);
            }

        }

        return result

    }

    set(article=null, object=null){

        console.log(this.collection)

        if(article && object){

            if(article in this.collection){

                const exist = this.collection[article].find(item=>item.id==object.id);

                if(exist){
                    this.collection[article] = this.collection[article].map(item=>{
                        if(item.id==object.id){
                            item=object
                        }
                        return item
                    });
                }else{
                    this.collection[article].push(object);
                }

            }else{

                this.collection = {
                    ...this.collection,
                };

                this.collection[article] = [];
                this.collection[article].push(object);
            }

            this.update();

        }

    }

    delete(article=null, object=null){

        if(article && object){

            if(article in this.collection){

                const exist = this.collection[article].find(item=>item.id==object.id);

                if(exist){
                    this.collection[article] = this.collection[article].reduce((acc,item)=>{

                        if(item.id!==object.id){
                            acc.push(item);
                        }

                        return acc

                    },[]);
                }

            }

            this.update();

        }

        this.update();

    }

    drop(article=null){

        if(article){

            if(article in this.collection){
               delete this.collection[article]
            }

            this.update();

        }

        this.update();

    }

    update(){
        localStorage.setItem('collection',JSON.stringify(this.collection));
    }

}
//------------------------------------------------
//INIZIALIZZO LO STORAGE
//------------------------------------------------
let $store = new Store;
    $store.init();


//------------------------------------------------
//NOTIFICHE
//------------------------------------------------
const notification = (type=null, message=null, action=null) =>{ //ARROW FUNCTION

    let check = document.getElementById('notification-container');


        if(!check){
            let container = document.createElement('div');
                container.setAttribute('id','notification-container');
                document.body.appendChild(container);
        }

        let container = document.getElementById('notification-container');

        let notification = document.createElement('div');
            notification.classList.add('notification');
            notification.classList.add('col-12');
            notification.classList.add('col-md-3');
            notification.classList.add('col-lg-2');

            //OPERATORE TERNARIO
            type == null ? notification.classList.add('bg-success') : null;
            type == 'primary' ? notification.classList.add('bg-primary') : null;
            type == 'success' ? notification.classList.add('bg-success') : null;
            type == 'danger' ? notification.classList.add('bg-danger') : null;
            type == 'warning' ? notification.classList.add('bg-warning') : null;

            notification.innerHTML = `<h5 class='text-white'>${message}</h5>`;

            container.appendChild(notification);

            setTimeout(()=>{
                let noty = container.querySelector('.notification');
                    container.removeChild(noty);
                    if(action){
                        action();
                    }
            },2000);
       

}

//------------------------------------------------
//AL CARICAMENTO DI OGNI PAGINA VERIFICO CHE UN USER SIA IN SESSIONE
//------------------------------------------------
let currentUser = $store.get('session')? $store.get('session')[0] : null;

console.log('CURRENT USER');
console.log(currentUser);

//------------------------------------------------
//GESTISCO GLI ACCESSI
//------------------------------------------------

const privatePages = ['admin.html','playlist.html','songs.html','details.html'];
const currentPath = window.location.pathname;

//SE L'USER NON E' LOGGATO E SONO IN UNA PAGINA PRIVATA ALLORA LO MANDO ALLA PAGINA DI LOGIN
if(!currentUser && ((/admin.html/.test(window.location.href)) || (/playlist.html/.test(window.location.href)) || (/songs.html/.test(window.location.href)) || (/details.html/.test(window.location.href)))){ 
    window.location.href = "login.html";
};

//------------------------------------------------
//CREO UNA FUNZIONE PER LA GESTIONE DELLE PLAYLIST
//------------------------------------------------
const playlistAction = (playlist = null) =>{

    let check = document.getElementById('addPlaylist-modal');
    
    return new Promise(resolve=>{

        let title = playlist ? 'Modifica la Playlist' : 'Crea una Playlist';

        if(!playlist){
            //CREO UNA PLAYLIST
            playlist = new Playlist;
        }

        if(!check){

            let modal = document.createElement('div');
                modal.setAttribute('id','addPlaylist-modal');
                modal.classList.add('modal');
                modal.classList.add('bg-modal');
                modal.classList.add('show');
                modal.innerHTML = `<div class="playlist-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title mt-2" id="exampleModalLabel">${title}</h5>
                                                <button type="button" class="discard-confirm-modal btn btn-danger" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <form class="form-action contact-from">
                                                            <input class="playlistName" type="text" placeholder="Nome Playlist">
                                                            <textarea class="playlistDescription" placeholder="Descrizione della Playlist"></textarea>
                                                            <div class="form-check h-40-px">
                                                                <input class="playlistPubblic form-check-input checkbox-pubblic" name="playlistPubblic" type="checkbox" id="playlistPubblic">
                                                                <label class="form-check-label text-capitalize" for="playlistPubblic">Rendi pubblica</label>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="discard-confirm-modal btn btn-danger" data-dismiss="modal">Annulla</button>
                                                <button type="button" class="accept-confirm-modal btn btn-success">Conferma</button>
                                            </div>
                                        </div>
                                    </div>`;

                document.body.appendChild(modal);
    
        }

        //RECUPERO I DATI E POPOLO L'OGGETTO PLAYLIST
        const populate = ()=>{

            let modal = document.getElementById('addPlaylist-modal');

            let currentUser = $store.get('session')? $store.get('session')[0] : null;
            let playlistName = modal.querySelector('.playlistName');
            let playlistDescription = modal.querySelector('.playlistDescription');
            let playlistPubblic = modal.querySelector('.playlistPubblic');
    
            playlist.name = playlistName.value;
            playlist.description = playlistDescription.value;
            playlist.pubblic = playlistPubblic.checked;
            playlist.id = (playlistName.value +  currentUser.id.toString()).replace(/\s/g,'');
            playlist.userID = currentUser.id;

        }   

        //SE I DATI SONO PRESENTI NELLA PLAYLIST PASSATA ALLORA GRAFICO ALL'INTERNO DELLA MODAL
        const update = ()=>{

            let modal = document.getElementById('addPlaylist-modal');
            let playlistName = modal.querySelector('.playlistName');
            let playlistDescription = modal.querySelector('.playlistDescription');
            let playlistPubblic = modal.querySelector('.playlistPubblic');

            playlist.name ? playlistName.value = playlist.name : null;
            playlist.description ? playlistDescription.value = playlist.description : null;
            playlist.pubblic ? playlistPubblic.checked =  true : false;

        }

        update();

        const discardsModal = document.querySelectorAll('.discard-confirm-modal');
        const acceptdModal = document.querySelector('.accept-confirm-modal');
    
        if(discardsModal && acceptdModal){
            discardsModal.forEach(button=>{
                button.addEventListener('click',()=>{
                    let modal = document.getElementById('addPlaylist-modal');
                        document.body.removeChild(modal);
                        resolve(false)
                });
            });

            acceptdModal.addEventListener('click',()=>{

                    populate();

                    let modal = document.getElementById('addPlaylist-modal');

                    //CONTROLLO CHE NELLO STORE NON CI SIA GIA' QUESTA PLAYLIST
                    let playlistExist = $store.getBy('id','playlist',playlist) ? $store.getBy('id','playlist',playlist)[0] : null;

                    if(!playlistExist){
                        //LA PLAYLIST NON ESISTE QUINDI LA CREO
                        $store.set('playlist',playlist);
                        notification('success','Playlist creata!');
                    }else{
                        //LA PLAYLIST ESISTE GIA' QUINDI AGGIORNO
                        $store.set('playlist',playlist);
                        notification('warning','Playlist aggiornata!');
                    }

                    document.body.removeChild(modal);
                    keepUpdated();
                    resolve(true)
            });

        }

    });

};

const renderDetailPage = ()=>{

    if((/details.html/.test(window.location.href))){

        //RECUPER L'ID DELLA PLAYLIST DALL'URL DELLA PAGINA
        const playlistID = window.location.search.replace('?','') || null;

        if(playlistID){
            //RECUPERO LA PLAYLIST DALLO STORE
            const playlist = $store.getBy('id','playlist',{id:playlistID}) ? $store.getBy('id','playlist',{id:playlistID})[0] : null;

            if(playlist){
                //POPOLA LA PAGINA
                const playlistName = document.querySelector('.playlistName');
                const playlistAuthor = document.querySelector('.playlistAuthor');
                const musicBackground = document.querySelector('.musicBackground');
                const songsDetails = document.querySelector('.songs-details');

                songsDetails.innerHTML = `<h4 class="text-danger px-4">Ancora nessuna canzone in questa playlist</h4>`;

                const author = $store.getBy('id','users',{id:playlist.userID}) ? $store.getBy('id','users',{id:playlist.userID})[0] : null;

                let img =  Math.floor((Math.random() * (15 - 2)));
                    img == 0 ? img = 1 : null;

                if(playlistName && playlistAuthor && musicBackground && author && songsDetails){
                    playlistName.innerHTML = playlist.name;
                    musicBackground.src=`img/playlist/${img}.jpg`;
                    playlistAuthor.innerHTML = author.fullname;

                    if(playlist.songs.length){

                        songsDetails.innerHTML = "";

                        playlist.songs.forEach((item, index)=>{

                            songsDetails.innerHTML += `<div class="row">
                                                                <div class="col-lg-6">
                                                                    <div class="song-details-box">
                                                                        <h3>Track n. ${index + 1}</h3>
                                                                        <div class="artist-details">
                                                                            <img src="${item.album.images[1].url || item.album.images[0].url}" alt="">
                                                                            <div class="ad-text">
                                                                                <h4>${item.name}</h4>
                                                                                <h6 class="mt-1">${item.album.artists[0].name}</h6>
                                                                                <p>${item.album.name}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg-4">
                                                                    <div class="song-details-box">
                                                                        <h3>Informazioni</h3>
                                                                        <ul>
                                                                            <li><strong>Nome:</strong><span>${item.name}</span></li>
                                                                            <li><strong>Durata:</strong><span>${item.duration_ms}</span></li>
                                                                            <li><strong>Pubblicata:</strong><span>${item.album.release_date}</span></li>
                                                                            <li><strong>Traccia album:</strong><span>${item.track_number}</span></li>
                                                                            <li><strong>Popolarità:</strong><span>${item.popularity}</span></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg-2">
                                                                    <div class="songs-info">
                                                                        <a href="${item.external_urls.spotify}" target='_black'><img class="listen-icon"src="img/icons/ascolta.png" alt=""></a>
                                                                    </div>
                                                                    <div class="songs-info">
                                                                        <img class="add-icon"src="img/icons/add.png" data="${JSON.stringify(item).replace(/\"/g,"'")}" alt="">
                                                                    </div>
                                                                </div>
                                                            
                                                        </div> <hr class="my-5"/>`;

                            const addIcons = document.querySelectorAll('.add-icon');

                            if(addIcons){
        
                                addIcons.forEach(icon=>{
        
                                    icon.addEventListener('click',function(){
                                        let data = this.getAttribute('data').replace(/\'/g,'"');
                                        addToPlayslist(JSON.parse(data));
                                    });
        
                                });
                                
                            }
                        });

                    }else{
                        songsDetails.innerHTML = `<h4 class="text-danger px-4">Ancora nessuna canzone in questa playlist</h4>`;
                    }


                }



            }

        
        }
    }
}

//------------------------------------------------
//CREO UNA FUNZIONE CHE TIENE AGGIORNATI I DATI DELLA PAGINA CON LA SESSIONE CORRENTE
//------------------------------------------------
const keepUpdated = () => {

    currentUser = $store.get('session') ? $store.get('session')[0] : null;

    let elements = document.querySelectorAll('.keep-updated');

    if(elements && currentUser){

        for(let element of elements){

            const data = element.getAttribute('data');
            const push = element.getAttribute('push');

            //PRENDE L'ATTRIBUTO PUSH
            if(push){

                if(data && data in currentUser){
                    if(push=='value'){
                        element.value = currentUser[data];
                    }
                    if(push=='placeholder'){
                        element.placeholder = currentUser[data];
                    }
                }
            }else{
                if(data && data in currentUser){
                    element.innerHTML = "";
                    element.innerHTML = currentUser[data];
                }
            }

           
        }
    }

    //TENGO AGGIORNATI I GENERI MUSICALI
    const genresCheckbox = document.querySelectorAll('.genres-checkbox');

    if(genresCheckbox){

        genresCheckbox.forEach(item=>{

            //RECUPERO IL VALORE DEL GENERE 
            let value = item.getAttribute('name');

            if(currentUser.genres.includes(value)){
                item.checked = true;
            }else{
                item.checked = false;
            }

        })

    }

    //TENGO AGGIORNATE LE PLAYLIST
    const playlistContainer = document.querySelector('.playlist-container');

    if(playlistContainer){

        playlistContainer.innerHTML = "";

        let playlist = $store.getBy('userID','playlist',{'userID': currentUser.id}) || [];

        if(playlist){
            playlist.forEach(item=>{

                let element = document.createElement('button');
                    element.classList.add('playlist-badge');
                    element.classList.add('w-100');
                    element.classList.add('btn');
                    item.pubblic == true ? element.classList.add('btn-info') : element.classList.add('btn-secondary');
                    element.classList.add('mt-2');
                    element.classList.add('text-left');

                    element.setAttribute('data',item.id);

                    element.innerHTML = `${item.name} <span class="badge badge-light float-right">${item.songs.length}</span>`;

                playlistContainer.appendChild(element);
            });
        }

        const badges = document.querySelectorAll('.playlist-badge');

        if(badges){
            badges.forEach(badge=>{
                badge.addEventListener('click',function(){
                    let data = this.getAttribute('data');
                    if(data){
                        let currentPlaylist = $store.getBy('id','playlist',{'id':data});
                        console.log(currentPlaylist[0])
                        playlistAction(currentPlaylist[0]);
                    }
                }); 
            })
        }

    }

    //CARICO LE PLAYLIST PUBBLICHE SULLA PAGINA PLAYLIST
    const playlistArea = document.querySelector('.playlist-area');

    if(playlistArea){

        const pubblicList = $store.getBy('pubblic','playlist',{pubblic:true}) || [];
        playlistArea.innerHTML = "";

        pubblicList.length ? playlistArea.innerHTML = "" :  playlistArea.innerHTML = `<h4 class="text-danger px-4 ">Nessuna playlist pubblica</h4>`;


        pubblicList.forEach(item=>{

            let img =  Math.floor((Math.random() * (15 - 2)));
                img == 0 ? img = 1 : null;
            const author = $store.getBy('id','users',{id:item.userID}) ?  $store.getBy('id','users',{id:item.userID})[0] : null;

            playlistArea.innerHTML += `<div class="mix col-lg-3 col-md-4 col-sm-6 genres">
                                            <a href="details.html?${item.id}">
                                                <div class="playlist-item">
                                                    <img src="img/playlist/${img}.jpg" alt="">
                                                    <h5>${item.name}</h5>
                                                    <h6 class='mt-2'>${author.fullname}</h6>
                                                </div>
                                            </a>
                                        </div>`;
            
        });

    }

    //CARICO LE PLAYLIST PRIVATE SULLA PAGINA PLAYLIST
    const playlistPrivate = document.querySelector('.playlist-private');

    if(playlistPrivate){

        let currentUser = $store.get('session')? $store.get('session')[0] : null;

        let privateList = $store.getBy('pubblic','playlist',{pubblic:false}) || [];
            privateList = privateList.filter(item=>item.userID == currentUser.id);

        privateList.length ? playlistPrivate.innerHTML = "" :  playlistPrivate.innerHTML = `<h4 class="text-danger px-4 ">Nessuna playlist privata</h4>`;

        privateList.forEach(item=>{

            let img =  Math.floor((Math.random() * (15 - 2)));
                img == 0 ? img = 1 : null;
            const author = $store.getBy('id','users',{id:item.userID}) ?  $store.getBy('id','users',{id:item.userID})[0] : null;

            playlistPrivate.innerHTML += `<div class="mix col-lg-3 col-md-4 col-sm-6 genres">
                                                <a href="details.html?${item.id}">
                                                    <div class="playlist-item">
                                                        <img src="img/playlist/${img}.jpg" alt="">
                                                        <h5>${item.name}</h5>
                                                        <h6 class='mt-2'>${author.fullname}</h6>
                                                    </div>
                                                </a>
                                            </div>`;
            
        });


        
    }

    //RENDERIZZO I DATI SE MI TROVO NELLA PAGINA DI DETTAGLIO
    renderDetailPage();

}


//------------------------------------------------
//CREO UNA MODAL DI CONFERMA OPERAZIONI
//------------------------------------------------
const confirm = (message) => {

    let check = document.getElementById('confirm-modal');

    return new Promise(resolve=>{

        if(!check){

            let modal = document.createElement('div');
                modal.setAttribute('id','confirm-modal');
                modal.classList.add('modal');
                modal.classList.add('bg-modal');
                modal.classList.add('show');
                modal.innerHTML = `<div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title mt-2" id="exampleModalLabel">Azione necessaria</h5>
                                            <button type="button" class="discard-confirm-modal btn btn-danger" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            ${message}
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="discard-confirm-modal btn btn-danger" data-dismiss="modal">Annulla</button>
                                            <button type="button" class="accept-confirm-modal btn btn-success">Conferma</button>
                                        </div>
                                        </div>
                                    </div>`;
                document.body.appendChild(modal);
    
        }
        
        const discardsModal = document.querySelectorAll('.discard-confirm-modal');
        const acceptdModal = document.querySelector('.accept-confirm-modal');
    
        if(discardsModal && acceptdModal){
    
            discardsModal.forEach(button=>{
                button.addEventListener('click',()=>{
                    let modal = document.getElementById('confirm-modal');
                        document.body.removeChild(modal);
                        resolve(false)
                });
            });

            acceptdModal.addEventListener('click',()=>{
                let modal = document.getElementById('confirm-modal');
                    document.body.removeChild(modal);
                    resolve(true)
            });

        }

    });

}

//------------------------------------------------
//CREO UNA MODAL PER L'INSERIMENTO DELLA TRACCIA IN UNA PLAYLIST
//------------------------------------------------
const addToPlayslist = (song) => {

    return new Promise(resolve=>{
        
        let check = document.getElementById('confirm-modal');

        let currentPlaylist = null;

        let currentUser = $store.get('session') ? $store.get('session')[0] : null;
        let playlist = $store.getBy('userID','playlist',{'userID': currentUser.id}) || [];

        let options = "";
            playlist.forEach(item=>{
                options += `<option value="${item.id}">${item.name}</option>`;
            });

        if(!check){

            let modal = document.createElement('div');
                modal.setAttribute('id','confirm-modal');
                modal.classList.add('modal');
                modal.classList.add('bg-modal');
                modal.classList.add('show');
                modal.innerHTML = `<div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title mt-2" id="exampleModalLabel">Aggiungi alla playlist</h5>
                                            <button type="button" class="discard-confirm-modal btn btn-danger" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="song-info-box p-3">
                                                        <img src="${song.album.images[1].url || song.album.images[0].url}" alt="">
                                                        <div class="song-info">
                                                            <h4>${song.name}</h4>
                                                            <p class='text-bold'>${song.album.artists[0].name}</p>
                                                            <p>${song.album.name}</p>
                                                        </div>
                                                    </div>
                                                </div>                        
                                            </div>
                                            <div class="row">
                                                    <div class="col-md-12">
                                                        <form class="form-action contact-from">
                                                            <select class="playlistName select-playlist" name="playlistName">
                                                                <option>scegli una playlist</option>
                                                                ${options}
                                                            </select>
                                                        </form>
                                                    </div>
                                                </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="discard-confirm-modal btn btn-danger" data-dismiss="modal">Annulla</button>
                                            <button type="button" class="accept-confirm-modal btn btn-success">Aggiungi o Elimina</button>
                                        </div>
                                        </div>
                                    </div>`;
                document.body.appendChild(modal);
    
        }
        
        const discardsModal = document.querySelectorAll('.discard-confirm-modal');
        const acceptdModal = document.querySelector('.accept-confirm-modal');

        let playlistName = document.querySelectorAll('.playlistName');

        if(playlistName){

            playlistName = playlistName[playlistName.length-1];

            playlistName.addEventListener('change',function(){
                currentPlaylist = $store.getBy('id','playlist',{id:this.value}) ? $store.getBy('id','playlist',{id:this.value})[0] : null;
            });
        }
    
        if(discardsModal && acceptdModal){
    
            discardsModal.forEach(button=>{
                button.addEventListener('click',()=>{
                    let modal = document.getElementById('confirm-modal');
                        document.body.removeChild(modal);
                        resolve(false)
                });
            });

            acceptdModal.addEventListener('click',()=>{
                let modal = document.getElementById('confirm-modal');

                    let songExist = currentPlaylist ? currentPlaylist.songs.find(item=>item.id==song.id) : null;

                    if(currentPlaylist){

                        if(songExist){
                            currentPlaylist.songs = currentPlaylist.songs.filter(item=>item.id!==song.id);
                            $store.set('playlist',currentPlaylist);
                            notification('warning','Traccia eliminata dalla tua playlist');
                        }else{
                            currentPlaylist.songs.push(song);
                            $store.set('playlist',currentPlaylist)
                            notification('success','Traccia aggiunta alla tua playlist');
                        }
    
                        keepUpdated();
    
                    }else{
                        console.log($store.getBy('id','playlist',{id:this.value}))
                    }

                    document.body.removeChild(modal);
                    resolve(true)

            });

        }

    });

}


//------------------------------------------------
//SE ESISTE UNA SESSIONE TENGO I DATI PAGINA AGGIORNATI CON LO STORE
//------------------------------------------------ 
keepUpdated();

//MOSTRO UNA NOTIFICA
notification('primary',"Dati caricati!");

//------------------------------------------------
//VALIDAZIONE MAIL
//------------------------------------------------ 
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

//------------------------------------------------
//RACCOLGO TUTTE LE INTERAZIONI
//------------------------------------------------
const registerAction = document.querySelector('.register-action');
const loginAction = document.querySelector('.login-action');
const updateAction = document.querySelector('.update-action');
const deleteAction = document.querySelector('.delete-action');
const deletePlaylistAction = document.querySelector('.delete-playlist-action');
const searchAction = document.querySelector('.search-action');
const searchPlaylistAction = document.querySelector('.search-playlist-action');
const addPlaylistAction = document.querySelector('.addPlaylist-action');

//------------------------------------------------
//CREO UN PUNTO D'ASCOLTO PER OGNI INTERAZIONE
//------------------------------------------------


//REGISTRAZIONE UTENTE
if(registerAction){
    //INVIO DI UNA NUOVA REGISTRAZIONE UTENTE
    registerAction.addEventListener('click', (evt)=>{
    
        //EVITO CHE IL FORM VENGA SPEDITO IN MODO DA PROCESSARE I DATI ATTRAVERSO LO SCRIPT
        evt.preventDefault(); //PREVENTDEFAULT ANNULLA L'EVENTO PREDEFINITO DI UN ELEMENTO

        //CANCELLO LA SESSIONE CORRENTE
        $store.drop('session');
    
        //CREO UN NUOVO USER
        let newUser = new User;
    
        //SETTO I VALORI DA PROCESSARE
        newUser.process.password1 = null;
        newUser.process.password2 = null;

        //INIZIALIZZO UNA VARIABILE PER LA VERIFICA DEI DATI
        let verified = true;
    
        //RECUPERO I DATI INVIATI
        const formAction = document.querySelector('.form-action');
    
        if(formAction){
    
            //RECUPERO TUTTI GLI INPUT 
            let inputs = formAction.getElementsByTagName('input');

             //RECUPERO IL TITOLO PER INSERIRE EVENTUALI ERRORI
            let errorForm = document.querySelector('.error-form');
                errorForm.innerHTML = "";
    
                for(let input of inputs){
                    input.name == 'email' ? newUser.email = input.value : null;
                    input.name == 'password1' ? newUser.process.password1 = input.value : null;
                    input.name == 'password2' ? newUser.process.password2 = input.value : null;
                }
    
                //VERIFICO CHE LE PASSWORD SIANO IDENTICHE


                if(newUser.process.password1 !== '' && newUser.process.password2 !== '' && newUser.process.password1 === newUser.process.password2 && validateEmail(newUser.email)){
                    newUser.password = newUser.process.password1;
                    newUser.process = {};
    
                    //CONTROLLO CHE NELLO STORE CI SIA GIA' UN USER CON LA EMAIL INSERITA
                    let user = $store.getBy('email','users', newUser);

                    //SE L'USER NON ESISTE LO INSERISCO NELLO STORAGE
                    if(!user || user.length==0){
                        $store.set('users',newUser);
                        $store.set('session',newUser);
                        notification('success',"Utente creato con successo!");
                    }else{
                        errorForm.innerHTML = "email o password errata!";
                        verified = false;
                        notification('danger',"Utente già presente");
                    }
        
                }else{
                    errorForm.innerHTML = "email o password errata!";
                    verified = false;
                }


                //SEGNALO I CAMPI FORM IN CASO DI ERRORE
                if(!verified){
                   
                    //PULISCO I DATI DEL FORM
                    for(let input of inputs){
                        input.classList.add('error');
                        input.value = '';
                    }

                }else{
                    //CONSTROLLO LA SESSIONE ATTIVA E EFFETTUO IL LOGIN CON IL NUOVO USER
                    if($store.getBy('id', 'session',newUser).length){
                        //DIROTTO L'USER SULLA PAGINA ADMIN
                        window.location.href = "admin.html";
                    }
                }

        }
    
    });
}

//LOGIN UTENTE
if(loginAction){
    //INVIO DI UN NUOVO LOGIN UTENTE
    loginAction.addEventListener('click',(evt)=>{
    
        //EVITO CHE IL FORM VENGA SPEDITO IN MODO DA PROCESSARE I DATI ATTRAVERSO LO SCRIPT
        evt.preventDefault();

        //CANCELLO LA SESSIONE CORRENTE
        $store.drop('session');

        //INIZIALIZZO UN USER
        let user = new User;

        //RECUPERO I DATI INVIATI
        const formAction = document.querySelector('.form-action');
    
        if(formAction){

            //RECUPERO IL TITOLO PER INSERIRE EVENTUALI ERRORI
            let errorForm = document.querySelector('.error-form');
                errorForm.innerHTML = "";
         
            //RECUPERO TUTTI GLI INPUT
            let inputs = formAction.getElementsByTagName('input');
    
                for(let input of inputs){
                    input.name == 'email' ? user.email = input.value : null;
                    input.name == 'password' ? user.password = input.value : null;
                }

                //CERCO L'UTENTE PER EMAIL NELLO STORAGE
                let foundUser = $store.getBy('email','users',user) ? $store.getBy('email','users',user)[0] : null;

                //SE TROVO LA MAIL VERIFICO CHE LE PASSWORD COINCIDANO
                if(foundUser && foundUser.password == user.password){
                    //ATTIVO UNA SESSIONE CON L'USER
                    $store.set('session',foundUser);
                    //DIROTTO L'USER SULLA PAGINA ADMIN
                    window.location.href = "admin.html";
                }else{
                    //PULISCO I DATI DEL FORM
                    for(let input of inputs){
                        input.classList.add('error');
                        errorForm.innerHTML = "email o password errata!";
                        input.value = '';
                    }

                    notification('danger',"Utente sconosciuto!");
     
                }
                    
        }
    
    })
}

//AGGIORNAMENTO NOME UTENTE
if(updateAction){
    //INVIO DI UNA NUOVA REGISTRAZIONE UTENTE
    updateAction.addEventListener('click', (evt)=>{
    
        //EVITO CHE IL FORM VENGA SPEDITO IN MODO DA PROCESSARE I DATI ATTRAVERSO LO SCRIPT
        evt.preventDefault();

        //RECUPERO I DATI INVIATI
        const formAction = document.querySelector('.form-action');

        //RECUPERO L'USER CORRENTE
        let currentUser = $store.get('session')? $store.get('session')[0] : null;

        if(formAction){
    
            //RECUPERO TUTTI GLI INPUT 
            let inputs = formAction.getElementsByTagName('input');

                for(let input of inputs){
                    input.name == 'fullname' ? currentUser.fullname = input.value : null;
                }

                console.log("user ",currentUser)

                //CANCELLO LA SESSIONE CORRENTE
                $store.drop('session');

                //AGGIORNO LO STORE E LA SESSIONE CORRENTE CON L'USER AGGIORNATO
                $store.set('users',currentUser);
                $store.set('session',currentUser);

                //AGGIORNO I DATI PAGINA CON LE MODIFICHE APPORTATE
                keepUpdated();

                //MOSTRO UNA NOTIFICA DI QUANTO ACCADUTO
                notification('success',"Utente aggiornato!");
        }
    });
}

//CANCELLAZIONE PROFILO UTENTE
if(deleteAction){

    //RECUPERO L'USER CORRENTE
    let user = $store.get('session')? $store.get('session')[0] : null;

    if(user){
        //INVIO DI UNA NUOVA REGISTRAZIONE UTENTE
        deleteAction.addEventListener('click', async (evt)=>{

            //EVITO CHE IL FORM VENGA SPEDITO IN MODO DA PROCESSARE I DATI ATTRAVERSO LO SCRIPT
            evt.preventDefault();

            //CREO UN MESSAGGIO PER LA MODAL DI CONFERMA RIGUARDO L'ELIMINAZIONE DELL'ACCOUNT
            let message = user.fullname ? "Ciao "+ user.fullname + " sei sicuro di voler eliminare il tuo account?" : "Il tuo account sta per essere eliminato!";

            //ATTENDO CONFERMA DA PARTE DELL'UTENTE
            let response = await confirm(message);

            //SE LA RISPOSTA E' AFFERMATIVA CANCELLO L'ACCOUNT
            if(response==true){

                //CANCELLO LA SESSIONE CORRENTE
                $store.drop('session');

                //CANCELLO L'USER DALLO STORE
                $store.delete('users',user);

                //DIROTTO L'USER SULLA PAGINA LOGIN
                window.location.href = "index.html";

            }
        
        });
    }

}

//CANCELLAZIONE PLAYLIST
if(deletePlaylistAction){

    //RECUPERO L'USER CORRENTE
    const playlistID = window.location.search.replace('?','') || null;
    let playlist = $store.getBy('userID','playlist',{'userID': currentUser.id}) || [];


    if(playlist){
        //INVIO DI UNA NUOVA REGISTRAZIONE UTENTE
        deletePlaylistAction.addEventListener('click', async (evt)=>{

            //EVITO CHE IL FORM VENGA SPEDITO IN MODO DA PROCESSARE I DATI ATTRAVERSO LO SCRIPT
            evt.preventDefault();

            //CREO UN MESSAGGIO PER LA MODAL DI CONFERMA RIGUARDO L'ELIMINAZIONE DELL'ACCOUNT
            let message ="Sei sicuro di voler eliminare la tua playlist?";

            //ATTENDO CONFERMA DA PARTE DELL'UTENTE
            let response = await confirm(message);

            //SE LA RISPOSTA E' AFFERMATIVA CANCELLO L'ACCOUNT
            if(response==true){
                //CANCELLO L'USER DALLO STORE
                $store.delete('playlist', {id:playlistID});

                //DIROTTO L'USER SULLA PAGINA LOGIN
                window.location.href = "playlist.html";
            }
        });
    }
}

//RICERCA MUSICA
if(searchAction){

    
    searchAction.addEventListener('click', async (evt)=>{
    
        //EVITO CHE IL FORM VENGA SPEDITO IN MODO DA PROCESSARE I DATI ATTRAVERSO LO SCRIPT
        evt.preventDefault();

        
        //RECUPERO L'USER CORRENTE
        let user = $store.get('session')? $store.get('session')[0] : null;
        
        //RECUPERO I DATI INVIATI
        const formAction = document.querySelector('.form-action');
    
        if(formAction){

            //RECUPERO L'INPUT DI RICERCA
            let input = formAction.querySelector('.search-input');
            let message = document.querySelector('.music-message');
    
            let data = await search(input.value);

            if(data.length){

                message.innerHTML = user.fullname + ", ecco il risultato della tua ricerca:";

                let container = document.querySelector('.songs-container');

                if(container){
                    container.innerHTML = "";
                    data.forEach(item=>{
                        item.duration_ms = parseInt((item.duration_ms/(1000*60))%60) + ":" + parseInt((item.duration_ms/1000)%60)
                        container.innerHTML +=`
                        <div class="song-item">
                            <div class="row">
                                <div class="col-lg-4">
                                    <div class="song-info-box">
                                        <img src="${item.album.images[1].url || item.album.images[0].url}" alt="">
                                        <div class="song-info">
                                            <h4>${item.name}</h4>
                                            <p class='text-bold'>${item.album.artists[0].name}</p>
                                            <p>${item.album.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="songs-info">
                                        <p class='text-bold mt-2'>Durata</p>
                                        <p class='mt-1'>${item.duration_ms}</p>
                                    </div>
                                </div>
                                <div class="col-lg-2">
                                    <div class="songs-info">
                                        <a href="${item.external_urls.spotify}" target='_black'><img class="listen-icon"src="img/icons/ascolta.png" alt=""></a>
                                    </div>
                                </div>
                                <div class="col-lg-2">
                                <div class="songs-info">
                                    <img class="add-icon"src="img/icons/add.png" data="${JSON.stringify(item).replace(/\"/g,"'")}" alt="">
                                </div>
                                </div>
                            </div>
                        </div>
                        `;
                    });

                    const addIcons = document.querySelectorAll('.add-icon');

                    if(addIcons){

                        addIcons.forEach(icon=>{

                            icon.addEventListener('click',function(){
                                let data = this.getAttribute('data').replace(/\'/g,'"');
                                addToPlayslist(JSON.parse(data));
                            });

                        });
                        
                    }

                }

            }
                
        }
    
    });
}

//RICERCA PLAYLIST PUBBLICA
if(searchPlaylistAction){

    //INVIO DI UN NUOVO LOGIN UTENTE
    searchPlaylistAction.addEventListener('click', async (evt)=>{
    
        //EVITO CHE IL FORM VENGA SPEDITO IN MODO DA PROCESSARE I DATI ATTRAVERSO LO SCRIPT
        evt.preventDefault();

        //RECUPERO I DATI INVIATI
        const formAction = document.querySelector('.form-action');
    
        if(formAction){

            //RECUPERO L'INPUT DI RICERCA
            let input = formAction.querySelector('.search-playlist-input');
            let pubblicList = $store.getBy('pubblic','playlist',{pubblic:true}) || [];

            //RITORNA L'ITEM CON TUTTE LE SUE PROPRIETÀ E SEARCH CHE CONTIENE I DATI INTERESSANTI DI ITEM TUTTO IN MINUSCOLO
            pubblicList = pubblicList.map(item=>{ 

                const author = $store.getBy('id','users',{id:item.userID}) ?  $store.getBy('id','users',{id:item.userID})[0] : null;

                return {
                    ...item,
                    search: (item.name+' '+item.description+' '+author.fullname).toLowerCase()
                }

            });
    
            if(input.value.length>0 && pubblicList){

                pubblicList = pubblicList.filter(item=>item.search.includes(input.value.toLowerCase()));

            }

            //CARICO LE PLAYLIST PUBBLICHE SULLA PAGINA PLAYLIST
            const playlistArea = document.querySelector('.playlist-area');

            if(playlistArea){

                playlistArea.innerHTML = "";

                pubblicList.forEach(item=>{

                    let img =  Math.floor((Math.random() * (15 - 2)));
                        img == 0 ? img = 1 : null;

                    const author = $store.getBy('id','users',{id:item.userID}) ?  $store.getBy('id','users',{id:item.userID})[0] : null;

                    playlistArea.innerHTML += `<div class="mix col-lg-3 col-md-4 col-sm-6 genres">
                                                <div class="playlist-item">
                                                    <img src="img/playlist/${img}.jpg" alt="">
                                                    <h5>${item.name}</h5>
                                                    <h6 class='mt-2'>${author.fullname}</h6>
                                                </div>
                                            </div>`;
                    
                });
                
            }
   
        }
    
    });
}

//CREA PLAYLIST
if(addPlaylistAction){

    //INVIO DI UN NUOVO LOGIN UTENTE
    addPlaylistAction.addEventListener('click', async (evt)=>{
    
        //EVITO CHE IL FORM VENGA SPEDITO IN MODO DA PROCESSARE I DATI ATTRAVERSO LO SCRIPT
        evt.preventDefault();

        
        //RECUPERO L'USER CORRENTE
        let currentUser = $store.get('session')? $store.get('session')[0] : null;

        let action = await playlistAction();

        if(action){
            keepUpdated();
        }

    });

}

//------------------------------------------------
//SPOTIFY
//------------------------------------------------
const getToken = async() =>{

    const url = 'https://accounts.spotify.com/api/token?grant_type=client_credentials&json=true';

    const options = {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ZDJiYjkyNWIxM2QzNDhlYjk5Y2NiNDc1YzNjYjA2MDM6MDVjZmQwM2FiNTUwNGRhNTg4MmNjNTY0MmJiNDA2NTI='
        }
    }

    let token = await fetch(url,options)
        .then(res => res.json())
        .then(res => {
            if('access_token' in res){
                return res.access_token
            }else{
                return res
            }
        })
        .catch(err => console.log(err))

    return token
 
}

const getGenre = async(token) =>{

    const url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';

    const options = {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + token
        }
    }

    let genre = await fetch(url,options)
        .then(res => res.json())
        .then(res => {
           return res
        })
        .catch(err => console.log(err))

    return genre
    

}

const getFound = async(token, input) =>{

    const url = 'https://api.spotify.com/v1/search?q='+input+'&type=track&limit=50';

    const options = {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + token
        }
    }

    let data = await fetch(url,options)
        .then(res => res.json())
        .then(res => {
           return res
        })
        .catch(err => console.log(err))

    return data
    

}

const search = async (input) =>{

    let token = await getToken();

    let response = await getFound(token, input);

    if('tracks' in response){
        return response.tracks.items
    }else{
        return response
    }
}

//------------------------------------------------
//CONTENITORE GENERI
//------------------------------------------------

const genreContainer = document.querySelector('.genre-container');

if(genreContainer){

    const populate = async () => {

        let token = await getToken();

        let response = await getGenre(token);

        if('genres' in response && response.genres.length){

            let genres = response.genres;

            genreContainer.innerHTML = "";

            genres.map(genre=>{
                genreContainer.innerHTML += `<div class="col-12 col-md-4 form-check h-40-px">
                                                <input class="genres-checkbox form-check-input checkbox" name="${genre}" type="checkbox" id="${genre}">
                                                <label class="form-check-label text-capitalize" for="${genre}">${genre}</label>
                                            </div>`;
            });

            //AGGIORNO LA PAGINA
            keepUpdated();

            //RECUPERO TUTTI I GENERI DISPONIBILI 
            const genresCheckbox = document.querySelectorAll('.genres-checkbox');

            if(genresCheckbox){

                genresCheckbox.forEach(item=>{
                    item.addEventListener('change',(event)=>{

                        //RECUPERO IL VALORE DEL GENERE 
                        let value = event.currentTarget.getAttribute('name');
                        let checked = event.currentTarget.checked;

                        //RECUPERO L'USER CORRENTE
                        let user = $store.get('session')? $store.get('session')[0] : null;

                        if(user){
                            //VERIFICO SE IL GENERE MUSICALE E' PRESENTE TRA LE SCELTE
                            if(user.genres.includes(value)){
                                //SE IL VALORE E' GIA PRESENTE ALLORA LO ELIMINO
                                user.genres = user.genres.filter(item=>item!==value);
                            }else{
                                //SE IL VALORE NON E' PRESENTE ALLORA LO AGGIUNGO
                                user.genres.push(value);
                            }

                            //CANCELLO LA SESSIONE CORRENTE
                            $store.drop('session');

                            //AGGIORNO LO STORE E LA SESSIONE CORRENTE CON L'USER AGGIORNATO
                            $store.set('users',user);
                            $store.set('session',user);

                            //AGGIORNO I DATI PAGINA CON LE MODIFICHE APPORTATE
                            keepUpdated();

                            //MOSTRO UNA NOTIFICA DI QUANTO ACCADUTO
                            notification('success',"Generi aggiornati!");

                        }

                    })
                })

            }

        }
    }


    populate();

}


//------------------------------------------------
//SE LA PAGINA MUSICA E' APERTA CARICO LA MUSICA SUGGERITA IN BASE ALLE PREFERNZE
//------------------------------------------------

const songContainer = document.querySelector('.songs-container');

if(songContainer){

    //RECUPERO L'USER CORRENTE
    let currentUser = $store.get('session')? $store.get('session')[0] : null;
    let genres = currentUser.genres;

    if(genres){

        const suggestions = async ()=>{

            let promises = [];

            genres.forEach(genre=>{
                let promise = new Promise(async(resolve)=>{
                    let result = await search(genre);
                    resolve(result.slice(0,5))
                });
                promises.push(promise);
            });

            return Promise.all(promises).then(result=>{

                result = result.reduce((acc,items)=>{

                    items.forEach(item=>{
                        item.duration_ms = parseInt((item.duration_ms/(1000*60))%60) + ":" + parseInt((item.duration_ms/1000)%60)
                        acc.push(item)
                    });

                    return acc

                },[]);

                return result
            })
            .then(result=>{
                for (let i = result.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [result[i], result[j]] = [result[j], result[i]];
                }
                console.log(result)
                return result
            })
            .then(result=>{
                songContainer.innerHTML = "";
                    result.forEach(item=>{
                        songContainer.innerHTML +=`
                        <div class="song-item">
                            <div class="row">
                                <div class="col-lg-4">
                                    <div class="song-info-box">
                                        <img src="${item.album.images[1].url || item.album.images[0].url}" alt="">
                                        <div class="song-info">
                                            <h4>${item.name}</h4>
                                            <p class='text-bold'>${item.album.artists[0].name}</p>
                                            <p>${item.album.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="songs-info">
                                        <p class='text-bold mt-2'>Durata</p>
                                        <p class='mt-1'>${item.duration_ms}</p>
                                    </div>
                                </div>
                                <div class="col-lg-2">
                                    <div class="songs-info">
                                        <a href="${item.external_urls.spotify}" target='_black'><img class="listen-icon"src="img/icons/ascolta.png" alt=""></a>
                                    </div>
                                </div>
                                <div class="col-lg-2">
                                    <div class="songs-info">
                                        <img class="add-icon"src="img/icons/add.png" data="${JSON.stringify(item).replace(/\"/g,"'")}" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    });

                    const addIcons = document.querySelectorAll('.add-icon');

                    if(addIcons){

                        addIcons.forEach(icon=>{

                            icon.addEventListener('click',function(){
                                let data = this.getAttribute('data').replace(/\'/g,'"');
                                addToPlayslist(JSON.parse(data));
                            });

                        });
                        
                    }
            });

        }


        suggestions();

    }

}

//------------------------------------------------
//SE LA PAGINA E' QUELLA DI DETTAGLIO ALLORA LA COMPLETO
//------------------------------------------------
renderDetailPage();
   
