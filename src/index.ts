#!/usr/bin/env node
import { ArgumentParser } from 'argparse';
import { version } from '../package.json';
import { Projects, Tasks } from './models/enums';
import Generator from './generator';
import './loader';

const parser: ArgumentParser = new ArgumentParser();

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-tf', '--targetFile');
parser.add_argument('-p', '--project');
parser.add_argument('-gt', '--generateTask');
parser.add_argument('-ormd', '--ORMDecorators');

const args = parser.parse_args() as Record<string, string>;
const targetFilePath: string = args['targetFile'];
const projectName: Projects = args['project'] as Projects;
const generateTask: Tasks = args['generateTask'] as Tasks;
const ORMDecorators: string = args['ORMDecorators'];
const decorators: string[] = ORMDecorators ? ORMDecorators.split(',').map((decorator) => decorator.trim()) : [];

const main = async (): Promise<void> => {
  try {
    await Generator.runOrDie(projectName, generateTask, targetFilePath, decorators);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

void main();
