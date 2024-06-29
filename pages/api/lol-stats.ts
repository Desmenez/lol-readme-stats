import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const PUUID = process.env.PUUID || '';
const RIOT_API_PLATFORM = process.env.RIOT_API_PLATFORM || 'th2';
const SUMMONER_NAME = process.env.SUMMONER_NAME

const getSummonerStats = async (puuid: string) => {
  const response = await axios.get(`https://${RIOT_API_PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
    headers: {
      'X-Riot-Token': RIOT_API_KEY,
    },
  });
  return response.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stats = await getSummonerStats(PUUID);
    const { profileIconId, summonerLevel } = stats;

    const width = 800;
    const height = 200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // เพิ่มพื้นหลัง
    const background = await loadImage('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg');
    ctx.drawImage(background, 0, 0, width, height);

    // การตกแต่งข้อความ
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.font = 'bold 30px CustomFont';
    ctx.strokeText(`Summoner: ${SUMMONER_NAME}`, 50, 50);
    ctx.fillText(`Summoner: ${SUMMONER_NAME}`, 50, 50);
    ctx.strokeText(`Level: ${summonerLevel}`, 50, 100);
    ctx.fillText(`Level: ${summonerLevel}`, 50, 100);

    // เพิ่มรูปโปรไฟล์
    const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/14.13.1/img/profileicon/${profileIconId}.png`;
    try {
      const icon = await loadImage(profileIconUrl);
      ctx.drawImage(icon, 650, 50, 100, 100);

      // เพิ่มขอบรูปโปรไฟล์
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.strokeRect(650, 50, 100, 100);
    } catch (loadImageError) {
      console.error('Error loading profile icon:', loadImageError);
    }

    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
