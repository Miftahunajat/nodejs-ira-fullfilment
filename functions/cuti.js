async function konfirmasiPengajuanCutiTahunanIntent(agent) {
  try {
    const {
      date,
      number
    } = result.parameters;
    agent.add(
      "Pengajuan cuti anda pada  " +
      formatDate(date) +
      " selama " +
      number +
      " telah ditambahkan ke aktifitas cuti anda"
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports.konfirmasiPengajuanCutiTahunanIntent = konfirmasiPengajuanCutiTahunanIntent