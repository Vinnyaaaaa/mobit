import {UserContext} from '@/providers/UserProvider/UserProvider'
import {useContext, useEffect, useMemo, useState} from "react"
import Background from "@/components/Background/Background"
import Avatar from "@/components/Avatar/Avatar"
import {CKBContext} from "@/providers/CKBProvider/CKBProvider"
import * as Tabs from '@radix-ui/react-tabs'
import ListToken, {TokenBalance} from "@/components/ListToken/ListToken"
import useAllXudtBalance from "@/serves/useAllXudtBalance"
import useCkbBalance from "@/serves/useCkbBalance"
import {ToastContext, ToastType} from "@/providers/ToastProvider/ToastProvider"
import useTransactions from "@/serves/useTransactionsHistory"
import ListHistory from "@/components/ListHistory/ListHistory"
import useSpores from "@/serves/useSpores"
import ListDOBs from "@/components/ListDOBs/ListDOBs"
import {LangContext} from "@/providers/LangProvider/LangProvider"
import useLayer1Assets from "@/serves/useLayer1Assets"
import ProfileAddresses from "@/components/ProfileAddresses/ProfileAddresses"

export default function Profile() {
    const {address, isOwner, theme} = useContext(UserContext)
    const {internalAddress, address: loginAddress, addresses} = useContext(CKBContext)
    const {showToast} = useContext(ToastContext)
    const {lang} = useContext(LangContext)

    const [selectedAddress, setSelectedAddress] = useState<string | undefined>(address)
    const [tokens, setTokens] = useState<TokenBalance[]>([])
    const [tokensStatus, setTokensStatus] = useState<string>('loading')


    const queryAddress = useMemo(() => {
        return !!addresses && addresses.includes(address!) ? addresses : [address!]
    }, [addresses, address])

    const {data: xudtData, status: xudtDataStatus, error: xudtDataErr} = useAllXudtBalance(queryAddress)
    const {data: ckbData, status: ckbDataStatus, error: ckbDataErr} = useCkbBalance(queryAddress)
    const {data: historyData, status: historyDataStatus} = useTransactions(selectedAddress!)
    const {
        data: sporesData,
        status: sporesDataStatus,
        loaded: sporesDataLoaded,
        setPage: setSporesDataPage
    } = useSpores(queryAddress)
    const {
        xudts: layer1Xudt,
        dobs: layer1Dobs,
        btc: layer1Btc,
        status: layer1DataStatus,
        error: layer1DataErr} = useLayer1Assets(
        internalAddress && internalAddress.startsWith('bc1') && loginAddress === address ? internalAddress : undefined)

    useEffect(() => {
        if (xudtDataStatus === 'loading' || ckbDataStatus === 'loading' || layer1DataStatus === 'loading') {
            setTokens([])
            setTokensStatus('loading')
        } else if (xudtDataStatus === 'error' || ckbDataStatus === 'error' || layer1DataStatus === 'error') {
            setTokensStatus('error')
            setTokens([])
        } else if (xudtDataStatus === 'complete' && ckbDataStatus === 'complete' && ckbData) {
            setTokens(layer1Btc
                ? [ckbData, layer1Btc, ...xudtData, ...layer1Xudt]
                : [ckbData, ...xudtData, ...layer1Xudt])
            setTokensStatus('complete')
        }
    }, [xudtData, xudtDataStatus, ckbData, ckbDataStatus, layer1Xudt, layer1DataStatus, layer1Btc])

    useEffect(() => {
        if (xudtDataErr) {
            console.error(xudtDataErr)
            showToast(xudtDataErr.message, ToastType.error)
        }

        if (ckbDataErr) {
            console.error(ckbDataErr)
            showToast(ckbDataErr.message, ToastType.error)
        }

        if (layer1DataErr) {
            console.error('layer1DataErr', layer1DataErr)
            showToast(layer1DataErr.message, ToastType.error)
        }
    }, [xudtDataErr, ckbDataErr])


    const tabs = [{
        value: 'All',
        label: lang['All']
    }, {
        value: 'Tokens',
        label: lang['Tokens']
    }, {
        value: 'DOBs',
        label: lang['DOBs']
    }]

    return <div>
        <Background gradient={theme.bg}/>
        <div className="max-w-[1044px] mx-auto px-3 pb-10">
            <div
                className="w-[200px] h-[200px] rounded-full overflow-hidden mt-[-100px] border-4 border-white hidden md:block">
                <Avatar size={200} name={address || 'default'} colors={theme.colors}/>
            </div>
            <div
                className="w-[128px] h-[128px] rounded-full overflow-hidden mt-[-64px] mx-auto border-4 border-white md:hidden">
                <Avatar size={128} name={address || 'default'} colors={theme.colors}/>
            </div>
            <div className="mt-4 flex flex-col items-center md:flex-row">
                {
                    isOwner && internalAddress && internalAddress !== address && addresses ?
                        <>
                            <div className="mb-4 md:mr-6">
                                <ProfileAddresses addresses={[internalAddress!]} defaultAddress={internalAddress!}/>
                            </div>
                            <div className="mb-4">
                                <ProfileAddresses
                                    onChoose={(e) => {
                                        setSelectedAddress(e)
                                    }}
                                    addresses={addresses}
                                    defaultAddress={address!}/>
                            </div>
                        </> :
                        <div className="mb-4">
                            <ProfileAddresses addresses={[address!]} defaultAddress={address!}/>
                        </div>
                }
            </div>

            <div className="flex mt-3 lg:mt-9 justify-between flex-col lg:flex-row">
                <div className="flex-1 overflow-auto lg:max-w-[624px]">
                    <Tabs.Root
                        className="flex flex-col overflow-auto"
                        defaultValue="All">
                        <Tabs.List className="shrink-0 flex flex-row overflow-auto" aria-label="Assets">
                            {
                                tabs.map((tab) => <Tabs.Trigger key={tab.value}
                                                                className="h-10 mr-4 font-bold outline-none cursor-pointer py-2 px-4 rounded-lg data-[state=active]:text-white data-[state=active]:bg-black"
                                                                value={tab.value}>{tab.label}</Tabs.Trigger>)
                            }
                        </Tabs.List>


                        <Tabs.Content
                            className="py-4 px-1 grow bg-white rounded-b-md outline-none"
                            value="All">
                            <ListToken
                                data={tokens}
                                status={tokensStatus}
                                addresses={queryAddress}/>
                            <div className="mt-6">
                                <ListDOBs
                                    data={[...layer1Dobs, ...sporesData]}
                                    status={sporesDataStatus}
                                    loaded={sporesDataLoaded}
                                    onChangePage={(page) => {
                                        setSporesDataPage(page)
                                    }}/>
                            </div>
                        </Tabs.Content>
                        <Tabs.Content
                            className="py-4 px-1 grow bg-white rounded-b-md outline-none"
                            value="Tokens"
                        >
                            <ListToken
                                data={tokens}
                                status={tokensStatus}
                                addresses={queryAddress}/>
                        </Tabs.Content>
                        <Tabs.Content
                            className="py-4 px-1 grow bg-white rounded-b-md outline-none"
                            value="DOBs"
                        >
                            <ListDOBs
                                data={[...layer1Dobs, ...sporesData]}
                                status={sporesDataStatus}
                                loaded={sporesDataLoaded}
                                onChangePage={(page) => {
                                    setSporesDataPage(page)
                                }}/>
                        </Tabs.Content>

                    </Tabs.Root>
                </div>

                <div className="lg:max-w-[380px] flex-1 lg:ml-4 lg:pt-[56px]">
                    <ListHistory address={selectedAddress!} data={historyData} status={historyDataStatus}/>
                </div>
            </div>
        </div>
    </div>
}
