type TrasverseReturnTypes = "index" | "value";

export class Queue<T> {
  last: Vertex<T> | undefined;
  first: Vertex<T> | undefined;
  #size: number = 0;

  constructor(...values: Vertex<T>[]) {
    this.last = values[0];
    for (let [i, value] of values.entries()) {
      if (values[i++]) value.next = values[i++];
      if (values[i--]) value.root = values[i--];
      this.#size++;
    }
    this.first = values[values.length - 1];
  }

  #search(compareTo: TrasverseReturnTypes,
          isEqual: (predicate: number | string) => boolean,
          returnType?: TrasverseReturnTypes,
          current: Vertex<T> | undefined = this.last, 
          i: number = 0, 
  ): Vertex<T> | string | number | undefined {
    if (!current) return;
    if (compareTo === "index" && isEqual(i)) {
      switch (returnType) {
        case "index":
          return i;
        default: 
          return current;
      }
    }
    const increment = i + 1;
    const next = current.next ?? undefined;
    return this.#search(compareTo, isEqual, returnType, next, increment);
  }

  get Size() {return this.#size;}

  enqueue(value: T): void {
    const newHead: Vertex<T> = {
      data: value,
      next: this.last ? this.last : undefined
    };

    if (this.last) this.last.root = newHead;

    if (!this.first) this.first = newHead;
    this.last = newHead;
    this.#size++;
  };

  dequeue(): void {
    if (this.#size === 0) return;
    if (this.#size === 1) {
      this.last = undefined;
      this.first = undefined;
      this.#size--;
      return;
    };
    const secondLast = this.first!.root!;
    secondLast.next = undefined;
    this.first = secondLast;
    this.#size--;
  };

  toString(): string {
    let result = "last -> ";
    let current: Vertex<T> | undefined = this.last;

    while(current) {
      result += `[${current.data}] -> `
      current = current?.next;
    }

    result += "null"

    return result;
  };
}

interface Vertex<T> {
  root?: Vertex<T>,
  data: T,
  next?: Vertex<T>,
}