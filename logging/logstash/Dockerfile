# https://www.elastic.co/guide/en/logstash/current/_configuring_logstash_for_docker.html
FROM docker.elastic.co/logstash/logstash:6.0.0
RUN rm -f /usr/share/logstash/pipeline/logstash.conf
COPY --chown=logstash:logstash pipeline/logstash.conf /usr/share/logstash/pipeline/
COPY --chown=logstash:logstash config/logstash.yml /usr/share/logstash/config/