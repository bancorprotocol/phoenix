import { Modal } from 'components/modal/Modal';
import { SwapSwitch } from 'elements/swapSwitch/SwapSwitch';
import { useMemo, useState } from 'react';
import { Token } from 'services/observables/tokens';
import { TokenInputField } from 'components/tokenInputField/TokenInputField';
import { classNameGenerator, wait } from 'utils/pureFunctions';
import {
  stakeAmount,
  unstakeAmount,
} from 'services/web3/governance/governance';
import { useWeb3React } from '@web3-react/core';
import {
  addNotification,
  NotificationType,
} from 'redux/notification/notification';
import { getNetworkContractApproval } from 'services/web3/approval';
import { ModalApprove } from 'elements/modalApprove/modalApprove';
import { useDispatch } from 'react-redux';
import { BigNumber } from '@0x/utils/lib/src/configured_bignumber';
import { useEffect } from 'react';
import { getNetworkVariables } from 'services/web3/config';
import { fetchTokenBalances } from 'services/observables/balances';
import { updateTokens } from 'redux/bancor/bancor';
import { EthNetworks } from 'services/web3/types';

interface ModalVbntProps {
  setIsOpen: Function;
  isOpen: boolean;
  token?: Token;
  stake: boolean;
  stakeBalance?: string;
  onCompleted?: Function;
}

export const ModalVbnt = ({
  setIsOpen,
  isOpen,
  token,
  stake,
  stakeBalance,
  onCompleted,
}: ModalVbntProps) => {
  const { account, chainId } = useWeb3React();
  const [amount, setAmount] = useState('');
  const [amountUSD, setAmountUSD] = useState('');
  const percentages = useMemo(() => [25, 50, 75, 100], []);
  const [selPercentage, setSelPercentage] = useState<number>(-1);
  const [showApprove, setShowApprove] = useState(false);
  const dispatch = useDispatch();

  const fieldBlance = stake
    ? token && token.balance
      ? token.balance
      : undefined
    : stakeBalance;

  useEffect(() => {
    if (amount && fieldBlance) {
      const percentage = (Number(amount) / Number(fieldBlance)) * 100;
      setSelPercentage(
        percentages.findIndex((x) => percentage.toFixed(10) === x.toFixed(10))
      );
    }
  }, [amount, token, percentages, fieldBlance]);

  //Check if approval is required
  const checkApproval = async () => {
    if (!token) return;

    try {
      const isApprovalReq = await getNetworkContractApproval(
        token,
        amount,
        getNetworkVariables(chainId ? chainId : 0).governanceContractAddress
      );
      if (isApprovalReq) setShowApprove(true);
      else await handleStake(true);
    } catch (e) {
      dispatch(
        addNotification({
          type: NotificationType.error,
          title: 'Transaction Failed',
          msg: `${token.symbol} approval had failed. Please try again or contact support.`,
        })
      );
    }
  };

  const handleStake = async (approved: boolean = false) => {
    if (!account || !token || !chainId || !amount || Number(amount) === 0)
      return;
    if (!approved) return checkApproval();

    setAmount('');
    setIsOpen(false);
    if (stake)
      dispatch(
        addNotification(
          await stakeAmount(amount, account, token, (_) =>
            refreshBalances(token, account, chainId)
          )
        )
      );
    else
      dispatch(
        addNotification(
          await unstakeAmount(amount, account, token, (_) =>
            refreshBalances(token, account, chainId)
          )
        )
      );
  };

  const refreshBalances = async (
    token: Token,
    account: string,
    chainId: EthNetworks
  ) => {
    await wait(8000);
    const balances = await fetchTokenBalances([token], account, chainId);
    dispatch(updateTokens(balances));
    if (onCompleted) onCompleted();
  };

  const isStakeDisabled = () => !token || !amount || Number(amount) === 0;

  return (
    <>
      <Modal
        title={`${stake ? 'Stake' : 'Unstake'} vBNT`}
        titleElement={<SwapSwitch />}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        separator
        large
      >
        <div className="p-10">
          <div className="flex flex-col items-center text-12 mx-20">
            <div className="text-20 font-semibold mb-10"></div>
            {false && (
              <div className="text-blue-4 text-12 mx-10 text-center">
                Chose the amount you want to stake. you can decide if you want
                the amount in Dollars or Token input
              </div>
            )}
            {token && (
              <TokenInputField
                border
                token={token}
                input={amount}
                label={`${stake ? 'Stake' : 'Unstake'} amount`}
                setInput={setAmount}
                selectable={false}
                amountUsd={amountUSD}
                setAmountUsd={setAmountUSD}
                fieldBalance={fieldBlance}
              />
            )}
            <div className="flex justify-between space-x-8 mt-15">
              <div className="md:w-[125px]" />
              {percentages.map((slip, index) => (
                <button
                  key={'slippage' + slip}
                  className={`btn-sm rounded-10 h-[34px] w-[66px] text-14 ${classNameGenerator(
                    {
                      'btn-outline-secondary': selPercentage !== index,
                      'btn-primary': selPercentage === index,
                    }
                  )} bg-opacity-0`}
                  onClick={() => {
                    setSelPercentage(index);
                    if (token && fieldBlance) {
                      const amount = new BigNumber(fieldBlance).times(
                        new BigNumber(slip / 100)
                      );
                      setAmount(amount.toString());
                      setAmountUSD(
                        (amount.toNumber() * Number(token.usdPrice)).toString()
                      );
                    }
                  }}
                >
                  +{slip}%
                </button>
              ))}
            </div>
            <button
              onClick={() => handleStake()}
              disabled={isStakeDisabled()}
              className={`btn-primary rounded w-full mt-30 mb-10`}
            >
              {`${stake ? 'Stake' : 'Unstake'} vBNT`}
            </button>
          </div>
        </div>
      </Modal>
      <ModalApprove
        isOpen={showApprove}
        setIsOpen={setShowApprove}
        amount={amount}
        fromToken={token}
        handleApproved={() => handleStake(true)}
        waitForApproval={true}
        contract={
          chainId
            ? getNetworkVariables(chainId).governanceContractAddress
            : undefined
        }
      />
    </>
  );
};
