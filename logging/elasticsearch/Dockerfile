# https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html
FROM docker.elastic.co/elasticsearch/elasticsearch:6.0.0
COPY config/elasticsearch.yml /usr/share/elasticsearch/config/
USER root
RUN chown elasticsearch:elasticsearch /usr/share/elasticsearch/config/elasticsearch.yml
USER elasticsearch