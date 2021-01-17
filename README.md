# Console Companion App

This is a console based helper app written is typescript that runs on node
and uses levelup for storing data

Currently it has only a todo list but has more features planned

##### Install script

`npm i -g concom`

##### Usage

```
Usage: index [options] [command]

Helper for you dev console. With a todo list and more coming soon

Options:
  -v, --version      display program version
  -h, --help         display help for command

Commands:
  info               show program information
  add                add a task
  list|ls            list all tasks
  delete|rm <index>  delete task with given index
  help [command]     display help for command
```
