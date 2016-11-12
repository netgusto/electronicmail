FROM node:latest

RUN apt-get -y update
RUN apt-get -y install libgtk2.0.0 libxtst6 libxss1 libgconf-2-4 libnss3 libasound2

RUN apt-get install -y x11-apps

WORKDIR /source

#CMD ["xeyes"]
CMD ["npm", "start"]

