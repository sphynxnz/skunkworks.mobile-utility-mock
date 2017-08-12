FROM node:8
RUN useradd -m -s /bin/bash sphynxnz
USER sphynxnz
WORKDIR /home/sphynxnz
COPY package.json /home/sphynxnz
RUN npm install
COPY . /home/sphynxnz
CMD npm run start:mobile-utility:mock
EXPOSE 2525 8000