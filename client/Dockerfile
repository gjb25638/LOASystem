FROM node:carbon

COPY ./docker/entrypoint.sh /entrypoint/

RUN ["chmod", "+x", "entrypoint/entrypoint.sh"]

RUN echo "client/Dockerfile"

# Copy or mount node app here
WORKDIR /data/

EXPOSE 8080

ENTRYPOINT ["/entrypoint/entrypoint.sh"]

CMD ["npm", "run", "deploy:prod"]



