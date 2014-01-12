console.log('Start');

function* count(){
    var i = 0;
    while(true){
        yield i++;
    }
}
console.log(count.next().value);
