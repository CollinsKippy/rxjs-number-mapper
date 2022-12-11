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
  EMPTY,
  throwError,
  catchError,
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

console.log('-------------------custom number map--------------');

/**
 * NB: Does not work like the normal rxjs map esp. on error handling
 */
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

const mainDiv = document.querySelector('.main-message') as HTMLElement;
const errorDiv = document.querySelector('.error-message') as HTMLElement;
mainDiv.style.color = 'white';
mainDiv.style.fontSize = 20 + 'px';

of(1, 2, 3, 4)
  .pipe(
    myNumberMapper((x: number) => {
      if (x === 3) {
        throw `Errored ${x} ${Date.now()}`;
      } else {
        return x + 2;
      }
    }),
    catchError((err) => {
      console.warn('Caught it! ', err);
      return throwError(() => err);
    })
  )
  .subscribe({
    next: (x: number | unknown) => {
      console.log(x);
      const div: HTMLElement = document.createElement('div');
      div.append(`${x}`);
      mainDiv.appendChild(div);
    },
    error: (myErr) => {
      console.error('Came through: ', myErr);
    },
    complete: () => {
      const anotherDiv = document.createElement('div');
      anotherDiv.style.marginBottom = 24 + 'px';
      anotherDiv.append(document.createTextNode('Done Custom Mapper'));
      mainDiv.appendChild(anotherDiv);
    },
  });

console.log('-------------------regular rxjs map--------------');

// Works well at error handling compared to the customer mapper above.

of(1, 2, 3, 4)
  .pipe(
    map((x: number) => {
      if (x === 3) {
        throw `Errored ${x} ${Date.now()}`;
      } else {
        return x + 2;
      }
    }),
    catchError((err) => {
      console.warn('Caught it! ', err);
      return throwError(() => err);
    })
  )
  .subscribe({
    next: (x: number | unknown) => {
      console.log(x);
      const div: HTMLElement = document.createElement('div');
      div.append(`${x}`);
      mainDiv.appendChild(div);
    },
    error: (myErr) => {
      errorDiv.style.color = 'yellow';
      errorDiv.append(document.createTextNode(myErr));
    },
    complete: () => {
      const anotherDiv = document.createElement('div');
      anotherDiv.style.marginBottom = 24 + 'px';
      anotherDiv.append(document.createTextNode('Done'));
      mainDiv.appendChild(anotherDiv);
    },
  });
