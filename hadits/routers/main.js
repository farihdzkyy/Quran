const SurahHandler = require('../Handlers/Hadith');

module.exports = {
  getAllSurah: SurahHandler.getAllSurah,
  getSurah: SurahHandler.getSurah,
  getAyahFromSurah: SurahHandler.getAyahFromSurah,
  getJuz: JuzHandler.getJuz
};