import { defineFunction } from "./polymorphism.ts";

//
//
//
//
//
//
//

type Area<T> = (shape: T) => number;

const area = defineFunction<Area>();

type Perimeter<T> = (shape: T) => number;

const perimeter = defineFunction<Perimeter>();

type Volume<T> = (shape: T) => number;

const volume = defineFunction<Volumn>();

//
//
//
//
//
//

type Rect = {
  width: number;
  height: number;
};

area.impl<Rect>((rect) => {
  return rect.width * rect.height;
});

perimeter.impl<Rect>((rect) => {
  return 2 * (rect.width + rect.height);
});

//
//
//
//
//
//
//

type Circle = {
  radius: number;
};

area.impl((circle: Circle) => {
  return circle.radius ** 2 * Math.PI;
});

//
//
//
//
//
//
//

type Triangle = {
  a: number;
  b: number;
  c: number;
};

area.impl((triangle: Triangle) => {
  const { a, b, c } = triangle;
  const s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
});

perimeter.impl((triangle: Triangle) => {
  return triangle.a + triangle.b + triangle.c;
});

//
//
//
//
//
//
//
//

const rect: Rect = { width: 10, height: 20 };

const circle: Circle = { radius: 10 };

const triangle: Triangle = { a: 10, b: 20, c: 30 };

area(rect);
perimeter(rect);
area(circle);
area(triangle);

// type error! missing implementation this type
perimeter(circle);

// type error! missing implementation this type
volume(rect);
