# EUBFR Projects

Work with projects locally.

## Get dependencies

```sh
$ yarn
```

Or:

```sh
$ npm install
```

# Environment settings

Copy `.env.example` to `.env` and set the necessary values.

## Scripts

Pull all projects from a given index:

```sh
$ yarn pull
```

Create the index:

```sh
$ yarn createIndex
```

Push the results from the `pull` operation to another (local) index:

```sh
$ yarn push
```
