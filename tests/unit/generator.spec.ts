import Generator from '../../src/generator';
import { Projects, Tasks } from '../../src/models/enums';

describe('objectToString', function () {
    let generator: { dict: Record<string,Record<string, ((target: string) => Promise<void>) | undefined>> };
    let dict: Record<string,Record<string, ((target: string) => Promise<void>) | undefined>>;
    beforeEach(() => {
      // spy functions
      // generateORMSpy = jest.spyOn(Generator, 'register')
      generator = Generator as unknown as { dict: Record<string,Record<string, ((target: string) => Promise<void>) | undefined>> };
      dict = generator.dict;
    });
  
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
      generator.dict = {}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      dict = {};
    });
  
    it('should successfuly register new task into generator dictionary', () => {
      // mock
      const project = Projects.RASTER;
      const task = Tasks.ORM;
      const resolve = async(): Promise<void> => {
        return Promise.resolve();
      };
      const generator = Generator as unknown as { dict: Record<string,Record<string,Record<string, ((target: string) => Promise<void>) | undefined>>> };
      const dict = generator.dict;

      // action
      Generator.register(project, task, resolve);
  
      // expect
      expect(dict[project]).not.toBeUndefined();
      expect(dict[project][task]).not.toBeUndefined();
      expect(dict[project][task]).toBe(resolve);
    });

    it('should throw an error - already registered task', () => {
      // mock
      const project = Projects.RASTER;
      const task = Tasks.ORM;
      const error = `${project}-${task} is already registered`;
      const resolve = async(): Promise<void> => {
        return Promise.resolve();
      };
      
      // action
      const action = () => {
      for (let index = 0; index < 2; index++) {
          Generator.register(project, task, resolve);
        }
      }
  
      // expect
      expect(action).toThrow(error);
    });

    it('should successfuly run an registered task', async () => {
      // mock
      const targetFilePath = 'tests/data/myClass.ts';
      const project: Projects = Projects.RASTER;
      const task: Tasks = Tasks.ORM;
      const resolve = async(): Promise<void> => {
        return Promise.resolve();
      };
     
      // action
      Generator.register(project, task, resolve);
      const action = async () => { 
        await Generator.runOrDie(project, task, targetFilePath);
      };

      // expect
      await expect(action()).resolves.not.toThrow();
    });

    it('should throw an error - run an unregistered PROJECT', async () => {
      // mock
      const targetFilePath = 'tests/data/myClass.ts';
      const resolve = async(): Promise<void> => {
        return Promise.resolve();
      };
      const project: Projects = Projects.RASTER;
      const unregisteredProject = Projects.THREED
      const task: Tasks = Tasks.ORM;
      const error = `${unregisteredProject} is not implemented or registered`;
      
      // action
      Generator.register(project, task, resolve);
      // trying to run unregistered PROJECT: '3d'
      const action = async () => { 
        await Generator.runOrDie(unregisteredProject, task, targetFilePath);
      };

      // expect
      await expect(action).rejects.toThrow(error);
    });

    it('should throw an error - run an unregistered TASK', async () => {
      // mock
      const targetFilePath = 'tests/data/myClass.ts';
      const resolve = async(): Promise<void> => {
        return Promise.resolve();
      };
      const project: Projects = Projects.RASTER;
      const unregisteredTask = Tasks.GRAPHQL;
      const task: Tasks = Tasks.ORM;
      const error = `${unregisteredTask} is not implemented or registered`;
      
      // action
      Generator.register(project, task, resolve);
      // trying to run unregistered TASK: 'graphql'
      const action = async () => { 
        await Generator.runOrDie(project, unregisteredTask, targetFilePath);
      };

      // expect
      await expect(action).rejects.toThrow(error);
    });
});
