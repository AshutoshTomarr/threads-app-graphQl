import {redis} from './utils/redis';

async function init(){
    const result = await redis.get('msg:1');
    console.log(result);
    
}
init();