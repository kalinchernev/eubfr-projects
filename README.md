# EUBFR Projects

Work with projects locally.

## Elasticsearch and Kibana

### Overview

There is a `docker-compose.yml` file containing all you need to work with Elasticsearch and Kibana locally.

Kibana is being served behind Nginx Proxy so you can secure access of kibana for your purpose.

## Requirements

- [Docker](https://www.docker.com/) (18.02.0+)
- [Docker Compose](https://docs.docker.com/compose/) (1.23.2+)

### "Up" the stack

In deamon mode:

```
$ docker-compose up -d
```

In normal mode, better for being able to see logs:

```
$ docker-compose up
```

### Check status of docker-compose cluster

```
$ docker-compose ps -a
```

### Cluster Node Info

```
$ curl http://localhost:9200/_nodes?pretty=true
```

### Access Kibana

```
http://localhost:5601
```

### Accessing Kibana through Nginx

```
http://localhost:8080
```

### Access Elasticsearch

```
http://localhost:9200
```

## Node apps

### Overview

There are a few scripts which help you migrate data from a remote Amazon Elasticsearch domain to a local instance in order to facilitate the local development workflows.

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
