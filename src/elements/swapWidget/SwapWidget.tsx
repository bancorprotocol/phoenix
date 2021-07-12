import { createContext, useEffect, useState } from 'react';
import { SwapHeader } from 'elements/swapHeader/SwapHeader';
import { SwapMarket } from 'elements/swapMarket/SwapMarket';
import { SwapLimit } from 'elements/swapLimit/SwapLimit';
import { loadSwapData } from 'services/observables/triggers';
import { useDispatch } from 'react-redux';
import { TokenListItem } from 'services/observables/tokens';
import { useAppSelector } from 'redux/index';
import { ethToken, wethToken } from 'services/web3/config';
import { ReactComponent as IconLight } from 'assets/icons/light.svg';
import { IntoTheBlock } from 'elements/intoTheBlock/intoTheBlock';

export const Toggle = createContext(false);
interface SwapWidgetProps {
  isLimit: boolean;
  setIsLimit: Function;
}

export const SwapWidget = ({ isLimit, setIsLimit }: SwapWidgetProps) => {
  const tokens = useAppSelector<TokenListItem[]>(
    (state) => state.bancor.tokens
  );

  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState<TokenListItem | null>(null);
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    loadSwapData(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const findSetToken = (token: TokenListItem) => {
      if (token) {
        const found = tokens.find((x) => x.address === token.address);
        if (found) return found;
      }

      return null;
    };
    const foundFrom = findSetToken(fromToken);
    foundFrom ? setFromToken(foundFrom) : setFromToken(tokens[0]);

    if (
      toToken &&
      fromToken &&
      fromToken.address !== wethToken &&
      toToken.address !== ethToken
    ) {
      const foundTo = findSetToken(toToken);
      foundTo ? setToToken(foundTo) : setToToken(tokens[1]);
    }
  }, [tokens, fromToken, toToken]);

  const switchTokens = () => {
    if (toToken) {
      setFromToken(toToken);
      setToToken(fromToken);
    }
  };

  return (
    <Toggle.Provider value={toggle}>
      <div className="widget mx-auto">
        <SwapHeader
          isLimit={isLimit}
          setIsLimit={setIsLimit}
          setToggle={setToggle}
        />
        <hr className="widget-separator" />
        {isLimit ? (
          <SwapLimit
            fromToken={fromToken}
            setFromToken={setFromToken}
            toToken={toToken}
            setToToken={setToToken}
            switchTokens={switchTokens}
          />
        ) : (
          <SwapMarket
            fromToken={fromToken}
            setFromToken={setFromToken}
            toToken={toToken}
            setToToken={setToToken}
            switchTokens={switchTokens}
          />
        )}
        <button>
          <IconLight />
        </button>
      </div>
      <div className="flex justify-center">
        <IntoTheBlock />
      </div>
      {isLimit ? (
        <div className="text-center text-10 text-grey-4 mt-18">
          Limit orders are powered by KeeperDAO
        </div>
      ) : (
        ''
      )}
    </Toggle.Provider>
  );
};
