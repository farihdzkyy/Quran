const Hadith = require('../models/hadith');

const HadithLibrary = {
  index: () => Hadith.available(),
  getByName: (name) => Hadith.getByName(name),
  getByNumber: (name, number) => {
    const parsedNumber = parseInt(number, 10);
    const hadithName = Hadith.beautyName(name);

    if (Number.isNaN(parsedNumber)) throw new Error('Hadith number must be number.');

    const hadith = Hadith.getByName(name);
    if (!hadith) throw new Error(`${hadithName} not available.`);

    const contents = Hadith.getByNumber(hadith, parsedNumber);
    if (!contents) throw new Error(`HR. ${hadithName} No. ${parsedNumber} not available.`);

    return {
      name: `HR. ${hadithName}`,
      id: name,
      available: hadith.length,
      contents
    };
  },
  getByNumberRange: (name, from, to) => {
    const hadithName = Hadith.beautyName(name);
    const hadith = Hadith.getByName(name);
    if (!hadith) throw new Error(`${hadithName} not available.`);
      
    const data = Hadith.getByNumberRange(hadith, from, to);
    const total = hadith.length;
    const totalRequested = data.length;
    if (to > total) throw new Error(`Out of range hadith on ${hadithName}`);

    return {
      name: `HR. ${hadithName}`,
      id: name,
      available: total,
      requested: totalRequested,
      hadiths: data
    };
  }
};

module.exports = HadithLibrary;