const MENUNGGU_PEMBAYARAN = 1;
const PROSES = 2;
const BERHASIL = 3;
const GAGAL = 4;
const DIBATALKAN = 5;

const salesStatus = {
    MENUNGGU_PEMBAYARAN,
    PROSES,
    BERHASIL,
    GAGAL,
    DIBATALKAN,
};

module.exports = {
    salesStatus,
};
