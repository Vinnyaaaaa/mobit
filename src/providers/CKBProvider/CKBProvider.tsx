import {ccc} from "@ckb-ccc/connector-react";
import {createContext, useEffect, useState} from "react";
import {Signer} from "@ckb-ccc/core/dist/signer/signer";
import {NetworkConfig} from "@/providers/CKBProvider/network_config"
import network_config from "@/providers/CKBProvider/network_config"
import {SignerBtc} from '@ckb-ccc/core'

const cccLib: any = ccc

export type Network = 'mainnet' | 'testnet'

export interface CKBContextType {
    open: () => any;
    network: Network
    disconnect: () => any
    wallet?: any
    internalAddress?: string
    address?: string
    addresses?: string[]
    signer?: Signer | undefined
    setNetwork: (network: Network) => any
    config: NetworkConfig
}

export const CKBContext = createContext<CKBContextType>({
    open: () => {
    },
    disconnect: () => {
    },
    setNetwork: (_network: Network) => {
    },
    config: network_config['mainnet'],
    network: 'mainnet'
})

export default function CKBProvider({children}: { children: any }) {
    const {open, disconnect, wallet, setClient} = cccLib.useCcc()
    const signer = ccc.useSigner();

    const [internalAddress, setInternalAddress] = useState<undefined | string>(undefined)
    const [address, setAddress] = useState<undefined | string>(undefined)
    const [addresses, setAddresses] = useState<undefined | string[]>(undefined)
    const [network, _setNetwork] = useState<Network>(localStorage.getItem('ckb_network') as Network || 'mainnet')

    const switchNetwork = (network: Network) => {
        // 需要重新连接
        disconnect()
        _setNetwork(network)
        open()
    }

    useEffect(() => {
        if (!signer) {
            setInternalAddress(undefined)
            setAddress(undefined)
            setAddress(undefined)
            return
        }

        (async () => {
            const internalAddress = await signer.getInternalAddress()
            const address = await signer.getRecommendedAddress()
            const addresses = await signer.getAddresses()
            setInternalAddress(internalAddress)
            setAddress(address)
            setAddresses(addresses)
        })();
    }, [signer])

    useEffect(() => {
        setClient(network === 'testnet' ? new cccLib.ClientPublicTestnet():new cccLib.ClientPublicMainnet())
        localStorage.setItem('ckb_network', network)
    }, [network, setClient])

    return (
        <CKBContext.Provider value={{
            config: network_config[network],
            network,
            setNetwork: switchNetwork,
            open: () => {
                if (!(window as any).ethereum && !(window as any).unisat) {
                    alert('Please install wallet to explorer or open in wallet app')
                    return
                }

                open()
            }, disconnect, wallet, signer, internalAddress, address, addresses
        }}>
            {children}
        </CKBContext.Provider>
    )
}
