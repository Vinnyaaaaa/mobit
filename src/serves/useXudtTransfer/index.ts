import {useContext} from "react"
import {CKBContext} from "@/providers/CKBProvider/CKBProvider"
import {ccc} from "@ckb-ccc/connector-react"
import {TokenInfoWithAddress} from "@/utils/graphql/types"
import {CkbHelper, convertToTxSkeleton, createTransferXudtTransaction} from "mobit-sdk"
import { helpers } from "@ckb-lumos/lumos"

export default function useXudtTransfer() {
    const {signer, network, wallet} = useContext(CKBContext)

    const build = async ({
        froms,
        to,
        amount,
        feeRate,
        tokenInfo
    }: {
        froms: string[]
        to: string
        amount: string
        tokenInfo: TokenInfoWithAddress
        feeRate: number
    }): Promise<helpers.TransactionSkeletonType> => {
        const ckbHelper = new CkbHelper(network === "mainnet")
        const witnessLockPlaceholderSize = wallet?.name.includes('JoyID')? 1052 : undefined
        const tx = await createTransferXudtTransaction(
            {
                xudtArgs: tokenInfo.address.script_args.replace('\\', '0'),
                receivers: [{toAddress: to, transferAmount: BigInt(amount)}],
                ckbAddresses: froms,
                collector: ckbHelper.collector,
                isMainnet: network === "mainnet"
            },
            froms[0],
            BigInt(feeRate),
            undefined,
            witnessLockPlaceholderSize,
        )

        console.log(tx);
        const skeleton = await convertToTxSkeleton(tx, ckbHelper.collector)
        console.log(skeleton);
        return skeleton;
    }

    const signAndSend = async ({
        froms,
        to,
        amount,
        feeRate,
        tokenInfo
    }: {
        froms: string[]
        to: string
        amount: string
        tokenInfo: TokenInfoWithAddress
        feeRate: number
    }) => {
        if (!signer) {
            throw new Error("Please connect wallet first")
        }

        const tx = await build({
            froms,
            to,
            amount,
            feeRate,
            tokenInfo
        })

        return await signer.sendTransaction(ccc.Transaction.fromLumosSkeleton(tx))
    }

    return {
        build,
        signAndSend
    }
}
