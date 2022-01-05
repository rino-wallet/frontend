export function getWalletColor(id: string): string {
  const colors = [
    ["from-red-400", "to-red-300"],
    ["from-blue-400", "to-blue-300"],
    ["from-orange-400", "to-orange-300"],
    ["from-violet-400", "to-violet-300"],
    ["from-pink-400", "to-pink-300"],
    ["from-green-400", "to-green-300"],
    ["from-yellow-400", "to-yellow-300"],
    ["from-cyan-400", "to-cyan-300"],
    ["from-purple-400", "to-purple-300"],
    ["from-teal-400", "to-teal-300"]
  ];
  const walletIntId = id.replace(/\D/g, "");
  const colorIndex = parseInt(walletIntId[0]);
  const gradient = `bg-gradient-to-r ${colors[colorIndex][0]} ${colors[colorIndex][1]}`;
  return gradient;
}
