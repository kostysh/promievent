import { should } from 'chai';
import PromiEvent from '../../src';
should();

describe('PromiEvent', () => {

    describe('Constructor', () => {

        it('Creates new instance', async () => {
            (new PromiEvent(() => {})).should.be.instanceof(PromiEvent);
        });

        it('Instance has native Promise methods', async () => {
            const promi = new PromiEvent(() => {});
            (promi.then).should.be.a('function');
            (promi.catch).should.be.a('function');
            (promi.finally).should.be.a('function');
        });

        it('Instance has native EventEmitter methods', async () => {
            const promi = new PromiEvent(() => {});
            (promi.on).should.be.a('function');
            (promi.once).should.be.a('function');
            (promi.emit).should.be.a('function');
            (promi.removeListener).should.be.a('function');
            (promi.removeAllListeners).should.be.a('function');
            (promi.off).should.be.a('function');
            (promi.addListener).should.be.a('function');
            (promi.off).should.be.a('function');            
        });
    });
    
    describe('Behavior', () => {
        
        it('Should be resolved on resolve', async () => {
            new PromiEvent(resolve => resolve('done'));
        });

        it('Should be rejected on reject', async () => {
            try {
                await new PromiEvent((resolve, reject) => reject(err));
                return new Error('Not rejected');
            } catch(err) {
                return;
            }
        });

        it('Should emit events from inside', done => {
            let count = 0;
            new PromiEvent((resolve, reject, event) => {
                event.emit('test', 1);
                event.emit('test', 2);
                event.emit('test', 3);
                resolve();
            })
            .on('test', () => {
                if (count >= 2) {
                    return done();
                }

                count += 1;
            })
            .catch(done);
        });

        it('Can listen for the events using "once"', done => {
            let count = 0;
            new PromiEvent((resolve, reject, event) => {
                event.emit('test', 1);
                event.emit('test', 2);
                event.emit('test', 3);
                resolve();
            })
            .once('test', () => {
                count += 1;
            })
            .then(() => {
                if (count !== 1) {
                    return done(new Error('Wrong calls count'));
                }

                done();
            })
            .catch(done);
        });
    });
});