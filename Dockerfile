FROM node:22.9.0

WORKDIR /SkillSavvy-An-EdTech-Online-Learning-Platform

COPY package* .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]






