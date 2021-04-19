import { ArgumentParser } from 'argparse';
import { version, name } from '../package.json';
import { Projects, Tasks } from './models/enums';
import Generator from './dictionary';
import './loader';

const parser = new ArgumentParser({
  description: 'Argparse example',
  add_help: false,
});
parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-tf', '--targetFile');
parser.add_argument('-p', '--project');
parser.add_argument('-gt', '--generateTask');
const args = parser.parse_args();

const targetFilePath: string = args['targetFile'];
const projectName: Projects = args['project'];
const generateTask: Tasks = args['generateTask'];

const main = async () => {
  try {
    await Generator.runOrDie(projectName, generateTask, targetFilePath);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
main();
