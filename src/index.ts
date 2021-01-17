import { program } from 'commander';
import chalk from 'chalk';

import { createTask, listTasks, deleteTask } from './actions';

program
  .version('0.1.0', '-v, --version', 'display program version')
  .description(
    'Helper for you dev console. With a todo list and more coming soon',
  );

program
  .command('info')
  .description('show program information')
  .action(() => {
    console.log(chalk`This is a console based helper app`);
    console.log(chalk`Developed by Mohit Raj {magenta @AgrMohit}`);
  });

program
  .command('add')
  .description('add a task')
  .action(() => {
    try {
      createTask();
    } catch (err) {
      console.log(chalk`{red ERROR!} ${err}`);
    }
  });

program
  .command('list')
  .alias('ls')
  .description('list all tasks')
  .action(() => {
    try {
      listTasks();
    } catch (err) {
      console.log(chalk`{red ERROR!} ${err}`);
    }
  });

program
  .command('delete <index>')
  .aliases(['rm', 'del', 'remove'])
  .description('delete task with given index')
  .action((index) => {
    try {
      deleteTask(index);
    } catch (err) {
      console.log(chalk`{red ERROR!} ${err}`);
    }
  });

program.parse(process.argv);

process.exit(0);
