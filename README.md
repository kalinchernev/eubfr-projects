# EUBFR Projects

Work with Elasticsearch projects locally.

## Elasticsearch and Kibana

The `docker-compose.yml` file in this repository contains all you need to work with Elasticsearch and Kibana locally.

Kibana is being served via Nginx Proxy.

The repository contains a few utility scripts:

- Create an index and apply mapping to local Elasticsearch instance.
- Migrate data from a remote Amazon Elasticsearch domain to a local instance.

## Requirements

- [Docker](https://www.docker.com/) (18.02.0+)
- [Docker Compose](https://docs.docker.com/compose/) (1.23.2+)

## Update versions

Elasticsearch and Kibana are dynamic products and they receive frequent updates.

In order to ensure your scripting is compatible with the target version of a given product, make sure you use the correct version in `docker-compose.yml`:

```yml
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:6.5.4
```

and

```yml
kibana:
  image: docker.elastic.co/kibana/kibana:6.5.4
```

Available Docker images are listed [here](https://www.docker.elastic.co/#).

## Provision resources

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

A set of utilities to improve your local development workflows with Elasticsearch, Kibana and Node.js.

### Get dependencies

```sh
$ yarn install
```

### Environment settings

Copy `.env.example` to `.env` and set the necessary values.

### Scripts

Pull all projects from a remote Amazon Elasticsearch index:

```sh
$ yarn pull
```

Create an index in a local Elasticsearch instance:

```sh
$ yarn createIndex
```

Delete an index

```sh
$ yarn deleteIndex
```

Push back up results from `pull` operation to the newly created local index:

```sh
$ yarn push
```

### Testing premium features

Keep in mind that there are certain features available only at a given [subscription level](https://www.elastic.co/subscriptions).

When you want to evaluate premium features locally, you will need to [start a trial](https://www.elastic.co/guide/en/elasticsearch/reference/6.3/start-trial.html).
