import './style.css';

import {
  of,
  map,
  Observable,
  from,
  tap,
  take,
  Subject,
  BehaviorSubject,
  catchError,
  EMPTY,
  throwError,
} from 'rxjs';

console.log('----------------//-----------------------');

console.log('from -> with tap, map, take');
from([1, 5, 10, 15])
  .pipe(
    tap((v) => console.log('before transformation: ', v)),
    map((v) => v * 2),
    take(3)
  )
  .subscribe({
    next: (v) => console.log('after transformation: ', v),
    error: console.log,
    complete: console.log,
  });

console.log('----------------//-----------------------');

console.log('of -> with tap, map, take');
of(10, 50, 100, 150)
  .pipe(
    tap((v) => console.log('before transformation: ', v)),
    map((v) => v + 35),
    take(3)
  )
  .subscribe({
    next: (v) => console.log('after transformation: ', v),
    error: console.log,
    complete: console.log,
  });

console.log('-------------------custom number mapper--------------');

const myNumberMapper = (transformationFn: (val: number) => number) => {
  return (input: Observable<number>) => {
    return new Observable((observer) => {
      return input.subscribe({
        next: (val) => observer.next(transformationFn(val)),
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  };
};

of(1, 2, 3, 4)
  .pipe(
    myNumberMapper((x: number) => {
      if (x === 3) {
        throwError(() => new Error(`Errored ${x} ${Date.now}`));
      } else {
        return x + 2;
      }
    })
    // catchError((err) => {
    //   console.warn(`CatchError: ${err}`);
    //   return EMPTY;
    // })
  )
  .subscribe({
    next: (x) => console.log(x),
    error: (myErr) => console.error('Came through: ', myErr),
    complete: console.log,
  });
