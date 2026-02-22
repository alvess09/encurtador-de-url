const { loadDB, saveDB } = require('./db');
const crypto = require('crypto');

/**
 * Gera um código curto único de 6 caracteres
 */
function generateShortCode() {
  return crypto.randomBytes(4).toString('base64url').slice(0, 6);
}

/**
 * Encurta uma URL e persiste no banco de dados
 * @param {string} originalUrl - A URL original a ser encurtada
 * @returns {object} - O registro da URL encurtada
 */
function shortenUrl(originalUrl) {
  if (!originalUrl || typeof originalUrl !== 'string') {
    throw new Error('URL inválida');
  }

  const db = loadDB();

  // Verifica se a URL já foi encurtada anteriormente
  const existing = db.urls.find((u) => u.originalUrl === originalUrl);
  if (existing) {
    return existing;
  }

  const shortCode = generateShortCode();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const record = {
    id: db.urls.length + 1,
    originalUrl,
    shortCode,
    shortUrl: `http://localhost:3000/${shortCode}`,
    createdAt: today,
  };

  db.urls.push(record);
  saveDB(db);

  return record;
}

/**
 * Retorna uma URL encurtada conforme o ID
 * @param {number} id - ID do registro
 * @returns {object|null} - O registro encontrado ou null
 */
function getUrlById(id) {
  const db = loadDB();
  return db.urls.find((u) => u.id === Number(id)) || null;
}

/**
 * Retorna todas as URLs encurtadas em uma data específica (YYYY-MM-DD)
 * @param {string} date - Data no formato YYYY-MM-DD
 * @returns {Array} - Lista de registros criados na data informada
 */
function getUrlsByDate(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Formato de data inválido. Use YYYY-MM-DD');
  }
  const db = loadDB();
  return db.urls.filter((u) => u.createdAt === date);
}

/**
 * Retorna uma URL encurtada conforme o shortCode (código do encurtamento)
 * @param {string} shortCode - O código curto gerado
 * @returns {object|null} - O registro encontrado ou null
 */
function getUrlByShortCode(shortCode) {
  const db = loadDB();
  return db.urls.find((u) => u.shortCode === shortCode) || null;
}

module.exports = {
  shortenUrl,
  getUrlById,
  getUrlsByDate,
  getUrlByShortCode,
};
