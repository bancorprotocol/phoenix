import { UseWalletConnect } from './useWalletConnect';
import { shortenString } from 'utils/pureFunctions';
import { Image } from 'components/image/Image';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';

export const WalletConnectButton = ({
  handleWalletButtonClick,
  account,
  ensName,
  ensAvatarURL,
  selectedWallet,
}: UseWalletConnect) => {
  const accountOrName = ensName ?? account;
  const buttonText = accountOrName
    ? shortenString(accountOrName)
    : 'Connect Wallet';

  return (
    <button
      className="flex items-center md:btn-outline-secondary md:btn-sm md:mr-40"
      onClick={() => handleWalletButtonClick()}
    >
      {selectedWallet && account ? (
        <Image
          src={ensAvatarURL || selectedWallet.icon}
          alt="Wallet Logo"
          className="w-[22px]"
        />
      ) : (
        <IconWallet className="text-primary dark:text-primary-light w-[22px]" />
      )}
      <span className="hidden md:block md:mx-10">{buttonText}</span>
    </button>
  );
};
