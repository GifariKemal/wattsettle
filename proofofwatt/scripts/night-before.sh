#!/usr/bin/env bash
# Pengunci state WattSettle sebelum demo.
#
# Script ini TIDAK mencetak checklist untuk dibaca manusia lalu berharap manusianya teliti.
# Ia benar-benar membaca chain dan keluar dengan status bukan nol bila ada satu assert gagal,
# sehingga tidak mungkin memulai demo di atas state yang salah.
#
# Pakai: bash scripts/night-before.sh
set -uo pipefail

ENV_FILE="${ENV_FILE:-../.secrets/wattsettle-roles.env}"
# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

R=(--rpc-url "$BSC_TESTNET_RPC")
FAIL=0

# Ambang minimal. Reward pool harus sanggup membayar beberapa kali payout demo,
# dan agent harus punya gas jauh lebih dari sepuluh kali satu transaksi.
MIN_POOL_WEI=${MIN_POOL_WEI:-1000000000000000000000}   # 1000 suriota
MIN_GAS_WEI=${MIN_GAS_WEI:-500000000000000}            # 0.0005 tBNB

ok()   { printf "  OK    %s\n" "$1"; }
bad()  { printf "  GAGAL %s\n" "$1"; FAIL=1; }
num()  { awk '{print $1}'; }

echo "== Night-before checklist WattSettle =="
echo "kontrak : $WATTSETTLE_CONTRACT"
echo

# 1. Kontrak benar-benar ada kodenya di chain.
CODE=$(cast code "$WATTSETTLE_CONTRACT" "${R[@]}" 2>/dev/null)
if [ "${#CODE}" -gt 2 ]; then ok "kontrak punya bytecode di chain 97"; else bad "kontrak tidak punya kode, alamat salah atau chain salah"; fi

# 2. Reward pool cukup. Payout memakai saldo kontrak, bukan mint, jadi pool kosong
#    berarti attestAndSettle revert di panggung.
POOL=$(cast call "$SURIOTA_TOKEN" "balanceOf(address)(uint256)" "$WATTSETTLE_CONTRACT" "${R[@]}" 2>/dev/null | num)
if [ -n "$POOL" ] && [ "$(echo "$POOL >= $MIN_POOL_WEI" | bc)" = "1" ]; then
  ok "reward pool $(cast from-wei "$POOL") suriota"
else
  bad "reward pool kurang, isi ulang sebelum demo (sekarang: ${POOL:-tidak terbaca})"
fi

# 3. Agent punya gas.
GAS=$(cast balance "$VERIFIER_ADDR" "${R[@]}" 2>/dev/null | num)
if [ -n "$GAS" ] && [ "$(echo "$GAS >= $MIN_GAS_WEI" | bc)" = "1" ]; then
  ok "gas agent $(cast from-wei "$GAS") tBNB"
else
  bad "gas agent kurang, isi dari faucet (sekarang: ${GAS:-tidak terbaca})"
fi

# 4. Role benar. Hanya agent yang boleh settle, deployer harus sudah lepas.
ROLE=$(cast call "$WATTSETTLE_CONTRACT" "VERIFIER_ROLE()(bytes32)" "${R[@]}" 2>/dev/null | num)
AGENT_HAS=$(cast call "$WATTSETTLE_CONTRACT" "hasRole(bytes32,address)(bool)" "$ROLE" "$VERIFIER_ADDR" "${R[@]}" 2>/dev/null | num)
DEPLOYER_HAS=$(cast call "$WATTSETTLE_CONTRACT" "hasRole(bytes32,address)(bool)" "$ROLE" "$DEPLOYER_ADDR" "${R[@]}" 2>/dev/null | num)
[ "$AGENT_HAS" = "true" ] && ok "agent memegang VERIFIER_ROLE" || bad "agent TIDAK memegang VERIFIER_ROLE"
[ "$DEPLOYER_HAS" = "false" ] && ok "deployer sudah lepas VERIFIER_ROLE, otonomi terbukti" || bad "deployer masih memegang VERIFIER_ROLE, klaim otonomi jadi lemah"

# 5. Titik awal timestamp untuk bacaan berikutnya.
#
#    Ini SENGAJA bukan assert yang bisa gagal. Kontrak hanya menuntut timestamp menaik,
#    bukan mendekati waktu sekarang, jadi `lastTs` yang berada di masa depan (bekas
#    rehearsal) sama sekali bukan masalah selama pengirim menyemai dari nilai itu.
#    Versi pertama pemeriksaan ini menuntut `sekarang > lastTs` dan menjatuhkan seluruh
#    checklist tanpa alasan yang sah.
LAST_TS=$(cast call "$WATTSETTLE_CONTRACT" "devices(bytes32)(address,address,uint64,uint96)" "$DEVICE_ID" "${R[@]}" 2>/dev/null | sed -n 3p | num)
BASELINE=$(cast call "$WATTSETTLE_CONTRACT" "devices(bytes32)(address,address,uint64,uint96)" "$DEVICE_ID" "${R[@]}" 2>/dev/null | sed -n 4p | num)
NOW=$(date +%s)
if [ -n "$LAST_TS" ]; then
  SEED=$(( LAST_TS > NOW ? LAST_TS : NOW ))
  ok "lastTs device $LAST_TS, bacaan berikutnya harus memakai timestamp di atas $SEED"
else
  bad "lastTs device tidak terbaca, periksa deviceId dan alamat kontrak"
fi

# 6. Device harus sudah dikalibrasi. Baseline nol berarti kontrak akan menolak semua
#    bacaannya, dan itu akan terlihat seperti demo yang rusak padahal kontraknya benar.
if [ -n "$BASELINE" ] && [ "$BASELINE" != "0" ]; then
  ok "baseline device $BASELINE kWh, device sudah dikalibrasi"
else
  bad "baseline device nol, semua bacaan akan ditolak. Panggil setDeviceBaseline dulu"
fi

# 7. Berapa bacaan yang masih menggantung, supaya tidak ada kejutan saat agent jalan.
PENDING=$(cast call "$WATTSETTLE_CONTRACT" "submissionCount()(uint256)" "${R[@]}" 2>/dev/null | num)
ok "total bacaan on-chain: ${PENDING:-?}"

echo
if [ "$FAIL" -eq 0 ]; then
  echo "== Semua assert lolos. Aman untuk demo. =="
else
  echo "== ADA ASSERT GAGAL. JANGAN mulai demo sebelum diperbaiki. =="
fi
exit "$FAIL"
