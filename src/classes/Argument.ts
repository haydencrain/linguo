export class Argument {
  name: string;
  params: string[];
  constructor(private args: string) {
    const argsArr = args.trim().split(/ +/g);
    this.name = argsArr.shift();
    this.params = argsArr;
  }
}
