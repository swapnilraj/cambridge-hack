const provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/7f164a74553a4095a08f84347e0c9b97");
const vault = new ethers.Contract("0x5777a73e3fb77997774a7A5BfA1664BBcD9C54A7", vaultABI, provider)

console.log(vault);

const main = async () => {
  const zero = ethers.BigNumber.from(0);
  const winnerIndex = await vault.winnersIndex();

  const winnerEl = document.querySelector("#winners");

  if (winnerIndex.gt(zero)) {
    for (let index = zero; index.lt(winnerIndex); index = index.add(1)) {
      const winnerAddress = await vault.winners(index);
      const name = await vault.kycNames(winnerAddress);

      const winner = li(`${name} - ${winnerAddress}`);
      winnerEl.appendChild(winner)
    }
  }
}

main().then(x => console.log(x)).catch(e => { throw e });
