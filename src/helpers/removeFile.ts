import {unlink} from 'fs';

const remove = async (uri:string) => {

    unlink(uri, (err) => {
        if(err) throw err;
        console.log('unlinked');
    })
}

export default remove;