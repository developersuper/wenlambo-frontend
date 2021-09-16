import { ethers } from "ethers";
import { ChainId, Token } from "@pancakeswap-libs/sdk";
import Web3 from "web3";
import WalletConnect from "walletconnect";

const wbnb = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
const bnb = "0xb8c77482e45f1f44de1745f52c74426c631bdd52";

const init = async ({
  buyCurrency,
  sellCurrency,
  sellAmount,
  buyAmount,
  sellDecimals,
  buyDecimals,
  slippage = 16,
  to,
}) => {
  const web3 = new Web3(
    "wss://apis.ankr.com/wss/c40792ffe3514537be9fb4109b32d257/946dd909d324e5a6caa2b72ba75c5799/binance/full/main"
  );
  const addresses = {
    BUY: buyCurrency,
    SELL: sellCurrency,
    PANCAKE_ROUTER: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  };

  // const provider = new JsonRpcProvider("https://bsc-dataseed1.binance.org/");
  let provider = null;
  if (localStorage.getItem("loggedin") === "phone") {
    const wc = new WalletConnect();
    await wc.connect();
    provider = new ethers.providers.Web3Provider(
      await wc.getWeb3Provider({
        infuraId: "cc7954f8cc4143b8afc02b20e143499b",
      })
    );
  } else if (localStorage.getItem("loggedin") === "desktop") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    return;
  }

  const [SELL, BUY] = await Promise.all(
    [addresses.SELL, addresses.BUY].map(
      (tokenAddress, index) =>
        new Token(
          ChainId.MAINNET,
          tokenAddress,
          [sellDecimals, buyDecimals][index]
        )
    )
  );

  // create transaction parameters
  const minBuy = ((buyAmount * (100 - slippage)) / 100).toFixed(buyDecimals);
  const amountOutMin = ethers.utils.parseUnits(`${minBuy}`, buyDecimals);

  const path = [SELL.address, BUY.address];

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  // Create signer
  const signer = provider.getSigner();
  // contractMethod = "swapExactTokensForTokens";

  // Create Pancakeswap ethers Contract
  const pancakeswap = new ethers.Contract(
    addresses.PANCAKE_ROUTER,
    [
      `function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
      ) external payable`,
      `function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
      ) external`,
    ],
    signer
  );

  // Allow Pancakeswap
  // let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
  // let contract = new ethers.Contract(WBNB.address, abi, signer)
  // await contract.approve(addresses.PANCAKE_ROUTER, ethers.utils.parseUnits('1000.0', 18), {gasLimit: 100000, gasPrice: 5e9})

  // Execute transaction
  let abi = [
    "function approve(address _spender, uint256 _value) public returns (bool success)",
  ];
  let contract = new ethers.Contract(
    SELL.address.toLowerCase() === wbnb.toLowerCase() ? bnb : SELL.address,
    abi,
    signer
  );
  console.log(amountOutMin.toString(), "amountOutMin");
  console.log(contract.approve);
  try {
    if (localStorage.getItem("loggedin") === "desktop") {
      let approveResponse = await contract.approve(
        addresses.PANCAKE_ROUTER,
        ethers.utils.parseUnits(`${sellAmount}`, sellDecimals),
        { gasLimit: 100000, gasPrice: 5e9 }
      );
      if (!approveResponse) return;
    }
  } catch (e) {
    console.log(e);
    return;
  }
  console.log(`Allow Pancakeswap <<<<<------- END-------->>>>>`);
  try {
    let tx;
    if (sellCurrency === wbnb) {
      tx = await pancakeswap.swapExactETHForTokensSupportingFeeOnTransferTokens(
        // ethers.utils.parseUnits(`${sellAmount}`, sellDecimals),
        ethers.utils.parseUnits(
          parseFloat(web3.utils.fromWei(amountOutMin.toString())).toFixed(
            buyDecimals
          ),
          buyDecimals
        ),
        path,
        to,
        deadline,
        {
          gasLimit: ethers.utils.hexlify(400000),
          gasPrice: ethers.utils.parseUnits("5", "gwei"),
          value: ethers.utils.parseUnits(`${sellAmount}`, sellDecimals),
        }
      );
    } else {
      tx = await pancakeswap.swapExactTokensForETHSupportingFeeOnTransferTokens(
        ethers.utils.parseUnits(`${sellAmount}`, sellDecimals),
        ethers.utils.parseUnits(
          parseFloat(web3.utils.fromWei(amountOutMin.toString())).toFixed(
            buyDecimals
          ),
          buyDecimals
        ),
        path,
        to,
        deadline,
        {
          gasLimit: ethers.utils.hexlify(400000),
          gasPrice: ethers.utils.parseUnits("5", "gwei"),
        }
      );
    }

    console.log(`Tx-hash: ${tx.hash}`);

    const receipt = await tx.wait();

    console.log(`Tx was mined in block: ${receipt.blockNumber}`);
  } catch (e) {
    console.log(e);
  }
};

export default init;
