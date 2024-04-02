const juzData = require('./juz.js');

class JuzHandler {
  static getJuz(juzIndex) {
    const data = juzData(parseInt(juzIndex));

    if (!data) {
      throw new Error(`Juz "${juzIndex}" is not found.`);
    }

    return data;
  }
}

module.exports = JuzHandler;