FROM quay.io/souravkl11/raganork:multidevice

RUN git clone https://github.com/souravkl11/raganork-md /skl/Raganork
WORKDIR /skl/Raganork
ENV TZ=Asia/Kolkata
RUN npm install supervisor -g
RUN yarn install --ignore-engines
CMD ["node", "index.js"]
