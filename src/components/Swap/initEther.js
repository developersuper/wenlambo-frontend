import { ethers } from "ethers";
import Web3 from "web3";
import WalletConnect from "walletconnect";

const weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const eth = "0xef12be74eeadda185fb08814c7d32e7934b0a5ca";

const initEther = async ({
  buyCurrency,
  sellCurrency,
  sellAmount,
  buyAmount,
  sellDecimals,
  buyDecimals,
  slippage = 16,
  to,
}) => {
  const addresses = {
    BUY: buyCurrency,
    SELL: sellCurrency,
    UNISWAP_ROUTER: "0xe592427a0aece92de3edee1f18e0157c05861564",
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
  // create transaction parameters
  const minBuy = ((buyAmount * (100 - slippage)) / 100).toFixed(buyDecimals);
  const amountOutMin = ethers.utils.parseUnits(`${minBuy}`, buyDecimals);

  const path = [addresses.SELL, addresses.BUY];

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  // Create signer
  const signer = provider.getSigner();
  // contractMethod = "swapExactTokensForTokens";

  // Create Uniswap ethers Contract
  const uniswap = new ethers.Contract(
    addresses.UNISWAP_ROUTER,
    [
      `function exactInput(ExactInputParams memory params)
        external payable`,
    ],
    signer
  );

  // Allow Uniswap

  // Execute transaction
  let abi = [
    "function approve(address _spender, uint256 _value) public returns (bool success)",
  ];
  console.log(1);
  let contract = new ethers.Contract(
    addresses.SELL.toLowerCase() === weth.toLowerCase() ? eth : addresses.SELL,
    abi,
    signer
  );

  try {
    if (localStorage.getItem("loggedin") === "desktop") {
      let approveResponse = await contract.approve(
        addresses.UNISWAP_ROUTER,
        ethers.utils.parseUnits(`${sellAmount}`, sellDecimals),
        { gasPrice: 5e5 }
      );
      if (!approveResponse) return;
    }
  } catch (e) {
    console.log(e);
    return;
  }
  console.log(`Allow Uniswap <<<<<------- END-------->>>>>`);
  try {
    let tx;
    if (sellCurrency === weth) {
      tx = await uniswap.exactInput({
        path,
        recipient: to,
        deadline,
        amountIn: ethers.utils.parseUnits(`${sellAmount}`, sellDecimals),
        amountOutMinimum: ethers.utils.parseUnits(amountOutMin, buyDecimals),
      });
    } else {
      /* tx = await uniswap.swapExactTokensForETHSupportingFeeOnTransferTokens(
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
          gasLimit: ethers.utils.hexlify(300000),
          gasPrice: ethers.utils.parseUnits("10", "gwei"),
        }
      ); */
    }

    console.log(`Tx-hash: ${tx.hash}`);

    const receipt = await tx.wait();

    console.log(`Tx was mined in block: ${receipt.blockNumber}`);
  } catch (e) {
    console.log(e);
  }
};

export default initEther;
