import fs from 'fs';

// อ่านข้อมูลจาก stats.json
const stats = JSON.parse(fs.readFileSync('stats.json', 'utf8'));

// สร้างเนื้อหาใหม่สำหรับ README.md
const readmeContent = `
# My League of Legends Stats

![Profile Icon](http://ddragon.leagueoflegends.com/cdn/11.6.1/img/profileicon/${stats.profileIconId}.png)

- **Summoner Name**: Desmenez
- **Summoner Level**: ${stats.summonerLevel}
- **Account ID**: ${stats.accountId}
- **PUUID**: ${stats.puuid}

## Additional Information
- **Profile Revision Date**: ${new Date(stats.revisionDate).toLocaleString()}
`;

// เขียนเนื้อหาใหม่ลงใน README.md
fs.writeFileSync('README.md', readmeContent);
