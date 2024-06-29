FROM node:18

# ติดตั้ง dependencies ที่จำเป็น
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python3 \
    python3-pip

# ตั้งค่า working directory
WORKDIR /usr/src/app

# คัดลอกไฟล์ package.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกไฟล์ทั้งหมดไปยัง container ยกเว้นสิ่งที่ถูก ignore
COPY . .

# รันแอปพลิเคชัน
CMD ["npm", "run", "dev"]
