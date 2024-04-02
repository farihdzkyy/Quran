const SurahHandler = require('./handlers/surah');
const JuzHandler = require('./handlers/juz');

module.exports = {
  getAllSurah: SurahHandler.getAllSurah,
  getSurah: SurahHandler.getSurah,
  getAyahFromSurah: SurahHandler.getAyahFromSurah,
  getJuz: JuzHandler.getJuz
};