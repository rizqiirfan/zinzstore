const FAKE_PLAYER_NAMES = [
  'B O Y S★꧁ᵈᵃʳᵏ꧂',
  'ᴮᴬᴰ ʙᴏʏ࿐',
  '丂ㄩ几丂卄丨几乇',
  '★彡LEGEND彡★',
  '꧁☆ProPlayer☆꧂',
  'ꕥ᭄KINGꦿ᭄ꕥ',
  '✿ᴹᴿ᭄BOSS࿐',
  '亗 PREDATOR 亗',
];

// POST /api/player/check  { userId, zoneId }
// Simulasi cek akun game. Di aplikasi nyata, ganti dengan
// pemanggilan API resmi penyedia game (mis. Garena) di sini.
function checkPlayer(req, res) {
  const { userId, zoneId } = req.body;

  if (!userId || !zoneId) {
    return res.status(400).json({ success: false, message: 'User ID dan Zone ID wajib diisi.' });
  }

  const randomName = FAKE_PLAYER_NAMES[Math.floor(Math.random() * FAKE_PLAYER_NAMES.length)];

  res.json({ success: true, data: { userId, zoneId, playerName: randomName } });
}

module.exports = { checkPlayer };
