# promievent
A better version of PromiEvent (inspired by [web3's](https://github.com/ethereum/web3.js) PromiEvent) that acts seamlessly as native Promise but with events (not like a deferred object).  

## Usage
```javascript

new PromiEvent((resolve, reject, event) => {
    setTimeout(() => resolve('Done'));
    event.emit('action', { a: 1 });
    event.emit('action', { a: 2 });
    event.emit('action', { a: 3 });
    event.emit('only', { o: 1 });
    event.emit('only', { o: 2 });
    event.emit('only', { o: 3 });
})
    .then(console.log)
    .on('action', console.log)
    .once('only', console.log)
    .catch(console.error)
    .finally(() => console.log('Finally!!!'));

// Output:
//> { a: 1 }
//> { a: 1 }
//> { a: 1 }
//> { o: 1 }
//> Done
//> Finally!!!

```
