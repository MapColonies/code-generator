import { Projects, Tasks } from './models/enums';
declare type FunctionDict = Record<string, ((target: string, value: string[]) => Promise<void>) | undefined>;
declare type ActionDict = Record<string, FunctionDict | undefined>;
class Generator {
  private static instance?: Generator;
  private dict: ActionDict = {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  public static getInstance(): Generator {
    if (this.instance === undefined) {
      this.instance = new Generator();
    }
    return this.instance;
  }
  public register(project: Projects, task: Tasks, func: (target: string, value: string[]) => Promise<void>): void {
    if (this.dict[project] === undefined) {
      this.dict[project] = {};
    }
    if (this.dict[project]?.[task] !== undefined) {
      throw new Error(`${project}-${task} is already registered`);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.dict[project]![task] = func;
  }
  public async runOrDie(project: Projects, task: Tasks, target: string, ORMDecorators: string[]): Promise<void> {
    if (this.dict[project] === undefined) {
      throw new Error(`${project} is not implemented or registered`);
    }
    if (this.dict[project]?.[task] === undefined) {
      throw new Error(`${project} - ${task} is not implemented or registered`);
    }
    await this.dict[project]?.[task]?.(target, ORMDecorators);
  }
}
export default Generator.getInstance();
