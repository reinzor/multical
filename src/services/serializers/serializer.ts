// eslint-disable-next-line max-classes-per-file
export class Command {
  name: string

  data: Uint8Array

  constructor(name: string, request: number[]) {
    this.name = name;
    this.data = new Uint8Array(request);
  }
}

export class Value {
  scalar: number

  unit: string

  constructor(scalar: number, unit: string) {
    this.scalar = scalar;
    this.unit = unit;
  }
}

export abstract class Serializer {
  commands: Command[]

  protected constructor(commands: Command[]) {
    this.commands = commands;
  }

  abstract deserialize (data: Uint8Array): Value
}
