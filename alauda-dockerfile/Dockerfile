FROM 10.200.5.18:5000/base/base-nodejs

# Create app directory
RUN mkdir -p /home/cashier
WORKDIR /home/cashier

# Bundle app source
COPY . /home/cashier
RUN npm install --registry=https://registry.npm.taobao.org

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY  alauda-dockerfile/entrypoint.sh   /entrypoint.sh
RUN  chmod +777   /entrypoint.sh
ENTRYPOINT  ["/entrypoint.sh"]

# Run
CMD [ "node", "./dist/app.js" ]

ENV EUREKA_CENTER_HOSTS=eureka01.allscore.lab:8090,eureka02.allscore.lab:8090,eureka03.allscore.lab:8090

EXPOSE 3003
CMD [ "npm", "start" ]
