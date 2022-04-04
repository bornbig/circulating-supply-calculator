import Web3 from "web3";
import bigInt from "big-integer";
import ERC20ABI from "../../data/abi/ERC20.json"
import AddressList from "../../data/AddressList.json";

export default async function handler(req, res) {

    const web3 = new Web3('https://bsc-dataseed.binance.org/');

    if (req.method === 'GET'){

        try{
            const contract = new web3.eth.Contract(ERC20ABI, "0x67c6E77E2C783a818Bbea7733585779b38B00ef2");

            let amount = bigInt(0);

            for(let i = 0; i < AddressList.length; i++){
                let amounti = await contract.methods.balanceOf(AddressList[i]).call();
                amount = amount.add(bigInt(amounti));
            }

            const totalSupply = bigInt(100000000).multiply(bigInt(10).pow(18));

            const circulating = totalSupply.minus(amount) / 10 ** 18;

            res.status(200).send(circulating);
        }catch(e){
            res.status(200).json({status: "error", error: e});
        }
    }else{
        res.status(200).json({error: "Method not allowed"});
    }
}