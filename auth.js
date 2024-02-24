const fetch = require('cross-fetch');


const getToken = async() =>{

    const client_id = 'd2bb925b13d348eb99ccb475c3cb0603';
    const client_secret = '05cfd03ab5504da5882cc5642bb40652';
    const url = 'https://accounts.spotify.com/api/token?grant_type=client_credentials&json=true';

    const options = {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        }
    }


    console.log(options.headers.Authorization)

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

const start = async ()=>{

    let token = await getToken();

    console.log(token)

}



start();