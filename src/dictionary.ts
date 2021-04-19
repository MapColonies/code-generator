import { Projects, Tasks } from './models/enums';

class Generator {
  private dict: Record<string, Record<string, Function>> = {};

  private static instance: Generator;

  private constructor() {}

  public register(project: Projects, task: Tasks, func: Function) {
    if (this.dict[project] === undefined) this.dict[project] = {};
    if (this.dict[project][task] !== undefined) {
      throw new Error(`logic for ${project}-${task} already exists`);
    }
    this.dict[project][task] = func;
  }

  public async runOrDie(project: Projects, task: Tasks, target: string) {
    if (this.dict[project] === undefined) {
      throw new Error(`${project} is not implemented or registered`);
    }
    if (this.dict[project][task] === undefined) {
      throw new Error(`${project} - ${task} is not implemented or registered`);
    }
    await this.dict[project][task](target);
  }

  public static getInstance() {
    if (this.instance === undefined) {
      this.instance = new Generator();
    }
    return this.instance;
  }
}

export default Generator.getInstance();
