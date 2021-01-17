import chalk from 'chalk';
import levelup from 'levelup';
import leveldown from 'leveldown';
import inquirer from 'inquirer';

const db = levelup(leveldown('./task-db'));

const listTasks = (): void => {
  let curr_index = '';
  db.createReadStream()
    .on('data', (data) => {
      curr_index = String(data.key).substring(0, 3);
      if (data.key == `${curr_index}-1status`)
        process.stdout.write(chalk`{cyan #${curr_index}} `);
      else if (data.key == `${curr_index}-2category`)
        process.stdout.write(
          chalk`{green ${String(data.value).padEnd(12, ' ')}} - `,
        );
      else if (data.key == `${curr_index}-3name`) console.log(`${data.value}`);
      else if (data.key == `${curr_index}-4time`) {
        const currdate = new Date();
        const olddate = new Date(data.value);
        let time_or_date_toprint;
        if (
          `${currdate.getFullYear()}-${currdate.getMonth()}-${currdate.getDate()}` !=
          `${olddate.getFullYear()}-${olddate.getMonth()}-${olddate.getDate()}`
        ) {
          time_or_date_toprint = `${olddate.getFullYear()}-${String(
            Number(olddate.getMonth()) + 1,
          ).padStart(2, '0')}-${String(olddate.getDate()).padStart(2, '0')}`;
        } else {
          time_or_date_toprint = `${olddate.getHours()}:${olddate.getMinutes()}:${olddate.getSeconds()}`;
        }
        process.stdout.write(
          chalk`{grey   ${time_or_date_toprint.padEnd(11, ' ')}}`,
        );
      } else if (data.key == `${curr_index}-5description`)
        console.log(chalk`{magenta DESC} - ${data.value}`);
    })
    .on('error', (error) => console.log(chalk`{red ERROR!} ${error}`));
};

const createTask = (): void => {
  const index = Math.floor(Math.random() * 1000).toString();
  const str_index = index.padStart(3, '0');
  const key_status = `${index.padStart(3, '0')}-1status`;
  const key_category = `${index.padStart(3, '0')}-2category`;
  const key_name = `${index.padStart(3, '0')}-3name`;
  const key_time = `${index.padStart(3, '0')}-4time`;
  const key_description = `${index.padStart(3, '0')}-5description`;
  try {
    inquirer
      .prompt({
        name: 'name',
        message: 'Task name: ',
        default: `Task #${str_index}`,
      })
      .then((data) => {
        db.put(key_name, data.name).catch((err: unknown) =>
          console.log(chalk`{red ERROR!} ${err}`),
        );
      })
      .then(() => {
        inquirer
          .prompt({
            name: 'description',
            message: 'Task description: ',
          })
          .then((data) => {
            db.put(key_description, data.description).catch((err: unknown) =>
              console.log(chalk`{red ERROR!} ${err}`),
            );
          })
          .then(() => {
            inquirer
              .prompt({
                name: 'category',
                message: 'Task category: ',
                default: 'General',
              })
              .then((data) => {
                db.put(key_category, data.category).catch((err: unknown) =>
                  console.log(chalk`{red ERROR!} ${err}`),
                );
              });
          });
      });

    db.put(key_time, new Date().toISOString()).catch((err) =>
      console.log(chalk`{red ERROR!} ${err}`),
    );

    db.put(key_status, 'default').catch((err) =>
      console.log(chalk`{red ERROR!} ${err}`),
    );
  } catch (err) {
    console.log(chalk`{red ERROR!} ${err}`);
  }
};

const deleteTask = (index: string): void => {
  const keystr = `${index.padStart(3, '0')}`;
  delKey(`${keystr}-1status`);
  delKey(`${keystr}-2category`);
  delKey(`${keystr}-3name`);
  delKey(`${keystr}-4time`);
  delKey(`${keystr}-5description`);
};

function delKey(key: string): void {
  db.get(key).catch(() => {
    console.log(chalk`{red ERROR!} Task does not exist`);
    process.exit(1);
  });
  db.del(key).catch((err) => {
    if (err) console.log(chalk`{red ERROR!} ${err}`);
    process.exit(1);
  });
}

export { createTask, listTasks, deleteTask };
