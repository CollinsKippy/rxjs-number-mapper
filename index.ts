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

const myNumberMapper = (transformationFn: (val: number) => number | Error) => {
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

const errorDiv = document.querySelector('.error-message') as HTMLElement;
errorDiv.style.color = 'white';
errorDiv.style.fontSize = 20 + 'px';

of(1, 2, 3, 4)
  .pipe(
    myNumberMapper((x: number) => {
      if (x === 3) {
        throwError(() => `Errored ${x} ${Date.now()}`);
      } else {
        return x + 2;
      }
    }),
    catchError((err) => {
      console.log(err);
      return throwError(() => err);
    })
  )
  .subscribe({
    next: (x: number) => {
      console.log(x);
      const div: HTMLElement = document.createElement('div');
      div.append(`${x}`);
      errorDiv.appendChild(div);
    },
    error: (myErr) => {
      console.error('Came through: ', myErr);
    },
    complete: console.log,
  });
