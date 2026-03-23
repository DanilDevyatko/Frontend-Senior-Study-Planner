type AsyncGeneratorLike<T> = Generator<unknown, T, unknown>

export function __awaiter<T>(
  thisArg: unknown,
  args: unknown,
  PromiseConstructor: PromiseConstructor | undefined,
  generator: (...generatorArgs: unknown[]) => AsyncGeneratorLike<T>,
): Promise<T> {
  const PromiseImpl = PromiseConstructor ?? Promise

  function adopt(value: unknown) {
    return value instanceof PromiseImpl ? value : new PromiseImpl((resolve) => resolve(value))
  }

  return new PromiseImpl((resolve, reject) => {
    const iterator = generator.apply(thisArg, args ? Array.from(args as ArrayLike<unknown>) : [])

    function fulfilled(value: unknown) {
      try {
        step(iterator.next(value))
      } catch (error) {
        reject(error)
      }
    }

    function rejected(value: unknown) {
      try {
        step(iterator.throw?.(value) ?? { done: true, value })
      } catch (error) {
        reject(error)
      }
    }

    function step(result: IteratorResult<unknown, T>) {
      if (result.done) {
        resolve(result.value)
        return
      }

      adopt(result.value).then(fulfilled, rejected)
    }

    step(iterator.next())
  })
}

export function __rest<T extends object, K extends keyof T>(source: T, excluded: K[]): Omit<T, K> {
  const target = {} as Omit<T, K>

  for (const key of Object.keys(source) as Array<keyof T>) {
    if (!excluded.includes(key as K) && Object.prototype.hasOwnProperty.call(source, key)) {
      target[key as Exclude<keyof T, K>] = source[key as Exclude<keyof T, K>]
    }
  }

  if (typeof Object.getOwnPropertySymbols === 'function') {
    for (const symbol of Object.getOwnPropertySymbols(source)) {
      if (
        !excluded.includes(symbol as K) &&
        Object.prototype.propertyIsEnumerable.call(source, symbol)
      ) {
        ;(target as Record<PropertyKey, unknown>)[symbol] = source[symbol as keyof T]
      }
    }
  }

  return target
}
