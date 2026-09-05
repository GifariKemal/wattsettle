#!/usr/bin/env bash
# Rehearsal end to end melawan RPC BSC testnet yang sungguhan.
#
# Unit test membuktikan logika, tetapi demo dimenangkan oleh determinisme. Script ini
# menjalankan rantai penuh berulang kali: device menandatangani, relayer mengirim,
# agent bangun dan menghitung ulang, kontrak memutus, transaksi terkonfirmasi.
#
# Tiap putaran memakai timestamp dan nonce yang segar, sebab guard monotonic dan
# anti-replay akan menolak pengulangan. Tiap putaran kelima sengaja mengirim bacaan
# anomali, supaya jalur penolakan ikut terlatih sebanyak jalur persetujuan.
#
# Pakai: bash scripts/rehearse-loop.sh [jumlah_putaran]
set -uo pipefail

RUNS=${1:-20}
cd "$(dirname "$0")/.."
set -a; source "../.secrets/wattsettle-roles.env"; set +a
export DEPLOYER_PK=$(grep -m1 "^-Private Key:" "../.secrets/Wallet Testnet.txt" | sed "s/.*: *//" | tr -d "\r")

# Cari penerjemah Python yang benar-benar punya web3. Di mesin ini Foundry hidup di WSL
# sementara web3 terpasang di Python Windows, jadi menebak "python3" saja tidak cukup.
# Bisa ditimpa dengan PYTHON=/jalur/ke/python.
find_python() {
  for cand in "${PYTHON:-}" python python3 /mnt/c/Python313/python.exe; do
    [ -n "$cand" ] || continue
    if command -v "$cand" >/dev/null 2>&1 && "$cand" -c "import web3" >/dev/null 2>&1; then
      echo "$cand"; return 0
    fi
  done
  return 1
}
PY=$(find_python) || { echo "Tidak menemukan Python yang punya web3. Set PYTHON=..."; exit 1; }

LOG="scripts/rehearsal-$(date +%Y%m%d-%H%M%S).log"
OK=0
FAIL=0

# Titik awal timestamp TIDAK boleh diambil dari jam dinding saja. Putaran rehearsal
# menuliskan timestamp yang sengaja dimajukan, jadi menjalankan script ini dua kali
# berturut-turut akan membuat putaran pertama run kedua tertahan StaleTimestamp,
# karena `lastTs` device sudah berada di masa depan. Semai dari state on-chain,
# lalu ambil yang lebih besar antara itu dan waktu sekarang.
LAST_TS=$(cast call "$WATTSETTLE_CONTRACT" "devices(bytes32)(address,address,uint64,uint96)" "$DEVICE_ID" \
  --rpc-url "$BSC_TESTNET_RPC" | sed -n 3p | awk '{print $1}')
NOW_TS=$(date +%s)
BASE_TS=$(( LAST_TS > NOW_TS ? LAST_TS : NOW_TS ))

echo "Rehearsal $RUNS putaran, kontrak $WATTSETTLE_CONTRACT" | tee "$LOG"

for i in $(seq 1 "$RUNS"); do
  # Putaran kelipatan lima mengirim bacaan anomali, sisanya bacaan wajar di sekitar baseline.
  if [ $((i % 5)) -eq 0 ]; then
    KWH=$((900 + i)); HARAP="REJECT"
  else
    KWH=$((95 + i % 10)); HARAP="APPROVE"
  fi

  # Timestamp dijamin maju dan tidak pernah bentrok dengan putaran lain.
  TS=$((BASE_TS + i * 120))

  echo "== putaran $i/$RUNS, ${KWH} kWh, harap $HARAP ==" | tee -a "$LOG"

  if ! KWH=$KWH READING_TS=$TS READING_NONCE=$((BASE_TS + i)) \
      forge script script/SubmitReading.s.sol:SubmitReading \
      --rpc-url "$BSC_TESTNET_RPC" --broadcast >>"$LOG" 2>&1; then
    echo "   GAGAL di submitReading" | tee -a "$LOG"
    FAIL=$((FAIL + 1)); continue
  fi

  if ! "$PY" agent/verifier.py >>"$LOG" 2>&1; then
    echo "   GAGAL di agent" | tee -a "$LOG"
    FAIL=$((FAIL + 1)); continue
  fi

  # Verifikasi dari rantai, bukan dari keluaran script. Bacaan terakhir harus sudah
  # berstatus Approved (2) atau Rejected (3), tidak boleh masih Pending (1).
  LAST=$(( $(cast call "$WATTSETTLE_CONTRACT" "submissionCount()(uint256)" --rpc-url "$BSC_TESTNET_RPC" | awk '{print $1}') - 1 ))
  STATUS=$(cast call "$WATTSETTLE_CONTRACT" "submissions(uint256)(bytes32,uint256,uint64,uint256,uint8)" "$LAST" --rpc-url "$BSC_TESTNET_RPC" | tail -1 | awk '{print $1}')

  case "$STATUS:$HARAP" in
    2:APPROVE|3:REJECT) echo "   OK, status $STATUS sesuai harapan" | tee -a "$LOG"; OK=$((OK + 1)) ;;
    *) echo "   GAGAL, status $STATUS tidak sesuai harapan $HARAP" | tee -a "$LOG"; FAIL=$((FAIL + 1)) ;;
  esac
done

echo | tee -a "$LOG"
echo "Selesai: $OK berhasil, $FAIL gagal dari $RUNS putaran. Log: $LOG" | tee -a "$LOG"
[ "$FAIL" -eq 0 ]
